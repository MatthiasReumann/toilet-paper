import Foundation
import Vapor
import Fluent

struct UserRequest: Content{
    var name: String
    var color: String
    var image: Data?
}

func saveImage(filename: String, image: Data) throws {
    let url = URL(fileURLWithPath: Application.imgUrl + filename + ".jpg").absoluteURL
    try image.write(to: url)
}

func deleteImage(filename: String) throws {
    let url = URL(fileURLWithPath: Application.imgUrl + filename + ".jpg").absoluteURL
    try FileManager.default.removeItem(at: url)
}

func usersRoutes(_ app: Application) throws {
    app.group("users") { users in
        users.get { req -> EventLoopFuture<[User]> in
            User.query(on: req.db).all()
        }
        
        users.post { req -> EventLoopFuture<User> in
            let request = try req.content.decode(UserRequest.self)
            
            let user = User(name: request.name.lowercased(), color: request.color)
        
            return user.create(on: req.db).flatMapThrowing{ _ in
                if let image = request.image {
                    if !image.isEmpty{
                        try saveImage(filename: user.id!.uuidString, image: image)
                    }
                }
                return user
            }
        }
        
        users.put(":id") {req -> Response in
            let request = try req.content.decode(UserRequest.self)
            if let userid = UUID(req.parameters.get("id")!){
                _ = User.query(on: req.db)
                    .set(\.$name, to: request.name)
                    .set(\.$color, to: request.color)
                    .filter(\.$id == userid)
                    .update()
                    .flatMapThrowing{
                        if let image = request.image {
                            if !image.isEmpty {
                                try saveImage(filename: userid.uuidString, image: image)
                            }
                        }
                    }
                
                return Response(status: .ok, body: "")
            }else{
                throw Abort(.badRequest)
            }
                    
        }
        
        users.delete(":id") { req -> EventLoopFuture<User> in
            if let userid = UUID(req.parameters.get("id")!) {
                return User.query(on: req.db)
                    .filter(\.$id == userid)
                    .first()
                    .unwrap(or: Abort(.notFound, reason: "User doesn't exist."))
                    .map{ user in
                        _ = user.delete(on: req.db).flatMapThrowing {
                            try deleteImage(filename: user.id!.uuidString)
                        }
                        return user
                    }
            }else{
                throw Abort(.badRequest)
            }
        }
    }
}


