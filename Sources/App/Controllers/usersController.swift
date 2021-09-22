import Foundation
import Vapor
import Fluent

func usersRoutes(_ users: Vapor.RoutesBuilder) throws {
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

func usersIdRoutes(_ users: Vapor.RoutesBuilder) throws {
    users.put(":id") {req -> EventLoopFuture<Response> in
        let request = try req.content.decode(UserRequest.self)
        
        guard let uid = UUID(req.parameters.get("id")!) else {
            throw Abort(.badRequest)
        }
        
        return User.query(on: req.db)
            .set(\.$name, to: request.name)
            .set(\.$color, to: request.color)
            .filter(\.$id == uid)
            .update()
            .flatMapThrowing{ _ -> Response in
                if let image = request.image {
                    if !image.isEmpty {
                        try saveImage(filename: uid.uuidString, image: image)
                    }
                }
                
                return Response(status: .ok)
            }
        
    }
    
    users.delete(":id") { req -> EventLoopFuture<User> in
        
        guard let uid = UUID(req.parameters.get("id")!) else {
            throw Abort(.badRequest)
        }
        
        return User.query(on: req.db)
            .filter(\.$id == uid)
            .first()
            .unwrap(or: Abort(.notFound, reason: "User doesn't exist."))
            .map{ user in
                _ = user.delete(on: req.db).flatMapThrowing {
                    try deleteImage(filename: uid.uuidString)
                }
                return user
            }
    }
}

func usersIdPurchasesRoutes(_ users: Vapor.RoutesBuilder) throws {
    users.get(":id", "purchases") { req -> EventLoopFuture<[Purchase]> in
        guard let uid = UUID(req.parameters.get("id")!) else {
            throw Abort(.badRequest)
        }
        
        return User.query(on: req.db)
            .filter(\.$id == uid)
            .field(\.$purchases).first()
            .unwrap(or: Abort(.notFound, reason: "User not found"))
            .map{ $0.purchases }
    }
    
    users.post(":id", "purchases") { req -> EventLoopFuture<Response> in
        let purchase = try req.content.decode(PurchaseRequest.self).toPurchase()
        
        guard let uid = UUID(req.parameters.get("id")!) else {
            throw Abort(.badRequest)
        }
                
        return User.query(on: req.db)
            .filter(\.$id == uid)
            .first()
            .unwrap(or: Abort(.notFound, reason: "User not found"))
            .map { user -> Response in
                user.purchases.append(purchase)
                _ = user.update(on: req.db)
                let response = Response(status: .created)
                response.headers.add(name: .location, value: purchase.id!.uuidString)
                
                return response
            }
    }
}

func usersIdPurchasesIdRoutes(_ users: Vapor.RoutesBuilder) throws {
    users.delete(":id", "purchases", ":pid") { req -> EventLoopFuture<Response> in
        guard let uid = UUID(req.parameters.get("id")!) else {
            throw Abort(.badRequest)
        }
        
        guard let pid = UUID(req.parameters.get("pid")!) else {
            throw Abort(.badRequest)
        }
        
        return User.find(uid, on: req.db)
            .unwrap(or: Abort(.notFound, reason: "User not found"))
            .flatMapThrowing { user in
                if let index = user.purchases.firstIndex(where: { $0.id == pid }) {
                    user.purchases.remove(at: index)
                    _ = user.update(on: req.db)
                    return Response(status: .ok)
                }
                
                throw Abort(.notFound, reason: "Purchase not found")
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


