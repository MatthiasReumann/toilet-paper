import Foundation
import Vapor

// List containing all users
var userList: [User] = [];

// User Model
final class User : Codable {
    var name: String
    var purchases: [Item]
    
    init(name: String, purchases: [Item]){
        self.name = name
        self.purchases = purchases
    }
}

func saveImage(filename: String, image: Data) throws {
    let url = URL(fileURLWithPath: "Public/img/" + filename).absoluteURL
    try image.write(to: url)
}

func usersRoutes(_ app: Application) throws {
    app.group("users") { users in
        users.get { req in
            return ListUsers(users: userList)
        }

        users.post { req -> String in
            let user = try req.content.decode(AddUser.self)
            
            try? saveImage(filename: user.name + ".jpg", image: user.image)
            
            let newUser = User(
                name: user.name.lowercased(),
                purchases: []
            )
            userList.append(newUser)
            return "created user with name \(user.name)"
        }
    }
}

