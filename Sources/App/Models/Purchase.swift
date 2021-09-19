import Foundation
import Fluent
import Vapor

final class Purchase: Model, Content {
    static let schema = "purchases"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "priceInCent")
    var priceInCent: Int
    
    @Field(key: "amount")
    var amount: Int
    
    @Parent(key: "userid")
    var user: User
    
    init(){}
    
    init(id: UUID? = nil, name: String, priceIntCent: Int, amount: Int, userid: UUID){
        self.id = id
        self.name = name
        self.priceInCent = priceInCent
        self.amount = amount
        self.$user.id = userid
    }
}
