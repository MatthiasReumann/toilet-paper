import Foundation
import Vapor

// List containing all users
var userList: [User] = [];

// User Model
final class User : Codable {
    var name: String
    var imageBase64: String
    var purchases: [Item]
    
    init(name: String, imageBase64: String, purchases: [Item]){
        self.name = name
        self.imageBase64 = imageBase64
        self.purchases = purchases
    }
}

func usersRoutes(_ app: Application) throws {
    app.group("users") { users in
        users.get { req in
            return ListUsers(users: userList)
        }

        users.post { req -> String in
            let user = try req.content.decode(AddUser.self)
            let newUser = User(
                name: user.name.lowercased(),
                imageBase64: user.image.base64EncodedString(),
                purchases: []
            )
            userList.append(newUser)
            return "created user with name \(user.name)"
        }
    }
}

