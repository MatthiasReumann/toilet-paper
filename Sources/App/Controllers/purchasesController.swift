import Foundation
import Fluent
import Vapor

struct PurchaseQuery: Content{
    var limit: Int?
}

func purchasesRoutes(_ app: Application) throws {
    app.group("purchases") { purchases in
        
        purchases.get { req -> EventLoopFuture<[Item]> in
            let query = try req.query.decode(PurchaseQuery.self)
            if let limit = query.limit {
                return Item.query(on: req.db).limit(limit).all()
            }else{
                return Item.query(on: req.db).all()
            }
        }
        
        purchases.post { req -> EventLoopFuture<Item> in
            let item = try req.content.decode(Item.self)
            return item.create(on: req.db).map{item}
        }
        
        purchases.delete(":id") {req -> EventLoopFuture<Item> in
            if let purchaseid = UUID(req.parameters.get("id")!) {
                return Item.query(on: req.db)
                    .filter(\.$id == purchaseid)
                    .first()
                    .unwrap(or: Abort(.notFound, reason: "Purchase doesn't exist."))
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
