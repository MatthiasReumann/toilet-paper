import Foundation
import Fluent
import Vapor

final class User : Model, Content {
    static let schema = "users"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "color")
    var color: String
    
    @Field(key: "purchases")
    var purchases: [Purchase]
    
    @Timestamp(key: "created_at", on: .create)
    var createdAt: Date?

    // When this Planet was last updated.
    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?
    
    init() { }
    
    init(id: UUID? = nil, name: String, color: String, createdAt: Date? = nil, updatedAt: Date? = nil){
        self.id = id;
        self.name = name
        self.color = color
        self.purchases = []
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
