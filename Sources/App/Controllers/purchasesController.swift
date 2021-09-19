import Foundation
import Fluent
import Vapor

struct PurchaseQuery: Content{
    var limit: Int?
}

struct PurchaseGetResponse: Content {
    var id: UUID
    var amount: Int
    var userid: UUID
    var name: String
    var priceIntCent: Int
}

func purchasesRoutes(_ app: Application) throws {
    app.group("purchases") { purchases in
        
        purchases.get { req -> EventLoopFuture<[Purchase]> in
            let query = try req.query.decode(PurchaseQuery.self)
            if let limit = query.limit {
                return Purchase.query(on: req.db).limit(limit).all()
            }else{
                return Purchase.query(on: req.db).all()
            }
        }
        
        purchases.post { req -> EventLoopFuture<Purchase> in
            let purchase = try req.content.decode(Purchase.self)
            return User.find(purchase.$user.id, on: req.db)
                .unwrap(or: Abort(.notFound, reason: "User not found"))
                .map{ user in
                    user.$purchases.create(purchase, on: req.db)
                    return purchase
                }
        }
        
        purchases.delete(":id") {req -> EventLoopFuture<Purchase> in
            if let purchaseid = UUID(req.parameters.get("id")!) {
                return Purchase.query(on: req.db)
                    .filter(\.$id == purchaseid)
                    .first()
                    .unwrap(or: Abort(.notFound, reason: "Purchase doesnt exist"))
                    .map{ purchase in
                        purchase.delete(on: req.db)
                        return purchase
                    }
            }else{
                throw Abort(.badRequest)
            }
        }
    }
}
