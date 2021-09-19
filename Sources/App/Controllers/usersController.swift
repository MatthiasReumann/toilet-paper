import Foundation
import Vapor
import Fluent

struct AddUser: Content{
    var name: String
    var color: String
    var image: Data
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
            let user = try req.content.decode(AddUser.self)
            
            let newUser = User(name: user.name.lowercased(), color: user.color)
        
            return newUser.create(on: req.db).flatMapThrowing{ newUser
                try saveImage(filename: newUser.id!.uuidString, image: user.image)
                return newUser
            }
        }
        
        users.delete(":id") { req -> EventLoopFuture<User> in
            if let userid = UUID(req.parameters.get("id")!) {
                return User.query(on: req.db)
                    .filter(\.$id == userid)
                    .first()
                    .unwrap(or: Abort(.notFound, reason: "User doesn't exist."))
                    .map{ user in
                        user.delete(on: req.db).flatMapThrowing {
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


