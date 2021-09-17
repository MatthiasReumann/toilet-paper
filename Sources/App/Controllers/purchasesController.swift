import Foundation
import Vapor

// Dictionary mapping user-names to Item list
var userPurchases: [String:[Item]] = [:]

// Request of POST /purchases/:name
struct AddPurchase: Content {
    var name: String
    var priceInCent: Int
}

// Response of GET /purchases
struct ListPurchases: Content {
    var purchases: [Item]
}

// Response of GET /purchases/stats
struct PurchasesStatsIndividual: Content {
    var member: String
    var amount: Int = 0
}
struct PurchasesStats: Content {
    var total: Int
    var individuals: [PurchasesStatsIndividual]
}



func purchasesRoutes(_ app: Application) throws {
    app.group("purchases") { purchases in
        
        purchases.get { req -> ListPurchases in
            var purchases: [Item] = []
            userList.forEach{
                purchases.append(contentsOf: $0.purchases)
            }
            return ListPurchases(purchases: purchases)
        }
        
        purchases.get("stats") { req -> PurchasesStats in
            var total = 0
            var individuals: [PurchasesStatsIndividual] = []
            userList.forEach{ user in
                var individual = PurchasesStatsIndividual(member: user.name)
                user.purchases.forEach{ purchase in
                    total += purchase.priceInCent
                    individual.amount += purchase.priceInCent
                }
                individuals.append(individual)
            }
            
            return PurchasesStats(total: total, individuals: individuals)
        }
        
        purchases.post(":name") { req -> String in
            let purchase = try req.content.decode(AddPurchase.self)
            guard let name =  req.parameters.get("name", as: String.self) else {
                throw Abort(.badRequest)
            }
            let item = Item(name: purchase.name, priceInCent: purchase.priceInCent)
            
            if let index = userList.firstIndex(where: { $0.name == name }) {
                userList[index].purchases.append(item)
            }
            
            return "added purchase to user \(name)"
        }
    }
}
