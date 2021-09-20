import Foundation
import Vapor

struct PurchaseRequest: Content{
    var name: String
    var priceInCent: Int
    var amount: Int
    
    func toPurchase() -> Purchase{
        return Purchase(name: name, priceInCent: priceInCent, amount: amount)
    }
}
