import Foundation
import Vapor

// Request of POST /users
struct AddUser: Content{
    var name: String
    var image: Data
}

// Response of GET /users
struct ListUsers: Content {
    var users: [User]
}

