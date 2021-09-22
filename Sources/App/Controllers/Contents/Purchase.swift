import Foundation
import Fluent
import Vapor

final class Purchase: Content {
    var id: UUID?
    var name: String
    var priceInCent: Int
    var amount: Int
    var createdAt: Date
    
    init(name: String, priceInCent: Int, amount: Int){
        self.id = UUID.generateRandom()
        self.name = name
        self.priceInCent = priceInCent
        self.amount = amount
        self.createdAt = Date.init()
    }
}
