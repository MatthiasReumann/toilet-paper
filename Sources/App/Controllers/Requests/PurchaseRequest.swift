import Foundation
import Fluent
import Vapor

struct PurchaseRequest: Content{
    var name: String
    var amount: Int
    var priceInCent: Int
    
    func toPurchase() -> Purchase {
        return Purchase(name: name, priceInCent: priceInCent, amount: amount)
    }
}
