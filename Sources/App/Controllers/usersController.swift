import Foundation
import Vapor
import Fluent

struct AddUser: Content{
    var name: String
    var color: String
    var image: Data
}

func saveImage(filename: String, image: Data) throws {
    let url = URL(fileURLWithPath: "Public/img/" + filename).absoluteURL
    try image.write(to: url)
}

func usersRoutes(_ app: Application) throws {
    app.group("users") { users in
        users.get { req -> EventLoopFuture<[User]> in
            User.query(on: req.db).all()
        }
        
        users.post { req -> EventLoopFuture<User> in
            let user = try req.content.decode(AddUser.self)
            
            try? saveImage(filename: user.name + ".jpg", image: user.image)
            
            let newUser = User(name: user.name.lowercased(), color: user.color)
            
            return newUser.create(on: req.db)
                    .map { newUser }
        }
        
        users.delete(":id") { req -> Response in
            User.find(req.parameters.get("id"), on: req.db).map{user in
                user?.delete(on: req.db)
            }
            
            return Response(status: .ok, body: "")
        }
    }
}


