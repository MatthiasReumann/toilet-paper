import Foundation
import Vapor

struct UserRequest: Content{
    var name: String
    var color: String
    var image: Data?
    
    func toUser() -> User {
        return User(name: name, color: color)
    }
}
