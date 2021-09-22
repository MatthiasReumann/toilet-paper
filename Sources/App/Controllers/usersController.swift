import Foundation
import Vapor
import Fluent

func usersRoutes(_ app: Application) throws {
    app.group("users") { users in
        users.get { req -> EventLoopFuture<[User]> in
            User.query(on: req.db).all()
        }
        
        users.post { req -> EventLoopFuture<Response> in
            let request = try req.content.decode(UserRequest.self)
            
            let user = request.toUser()
            
            return user.create(on: req.db).flatMapThrowing{ _ in
                if let image = request.image {
                    if !image.isEmpty{
                        try saveImage(filename: user.id!.uuidString, image: image)
                    }
                }
                
                let response = Response(status: .created)
                response.headers.add(name: .location, value: "/users/\(user.id!.uuidString)")
                
                return response
            }
        }
    }
}

func usersIdRoutes(_ app: Application) throws {
    app.group("users") { users in
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
                
                return Response(status: .ok)
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

func usersIdPurchasesRoutes(_ app:Application) throws {
    app.group("users") { users in
        users.get(":id", "purchases") { req -> EventLoopFuture<[Purchase]> in
            if let userid = UUID(req.parameters.get("id")!){
                return User.query(on: req.db)
                    .filter(\.$id == userid)
                    .field(\.$purchases).first()
                    .unwrap(or: Abort(.notFound, reason: "User not found"))
                    .map{ $0.purchases }
            }else{
                throw Abort(.badRequest)
            }
        }
        
        users.post(":id", "purchases") { req -> EventLoopFuture<Response> in
            let purchase = try req.content.decode(PurchaseRequest.self).toPurchase()
                    
            if let userid = UUID(req.parameters.get("id")!){
                return User.query(on: req.db)
                    .filter(\.$id == userid)
                    .first()
                    .unwrap(or: Abort(.notFound, reason: "User not found"))
                    .map { user -> Response in
                        user.purchases.append(purchase)
                        _ = user.update(on: req.db)
                        let response = Response(status: .created)
                        response.headers.add(name: .location, value: purchase.id!.uuidString)
                        
                        return response
                    }
            }else{
                throw Abort(.badRequest)
            }
        }
    }
}

func saveImage(filename: String, image: Data) throws {
    let url = URL(fileURLWithPath: Application.imgUrl + filename + ".jpg").absoluteURL
    try image.write(to: url)
}

func deleteImage(filename: String) throws {
    let url = URL(fileURLWithPath: Application.imgUrl + filename + ".jpg").absoluteURL
    try FileManager.default.removeItem(at: url)
}


