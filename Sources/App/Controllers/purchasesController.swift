import Foundation
import Vapor
import Fluent

func purchasesRoutes(_ app: Application) throws {
    app.group("purchases") { purchases in
        purchases.get { req -> EventLoopFuture<[Purchase]> in
            return User.query(on: req.db).field(\.$purchases).all().map { users -> [Purchase] in
                var purchases: [Purchase] = []
                for u in users {
                    purchases.append(contentsOf: u.purchases)
                }
                return purchases
            }
        }
    }
}

func purchasesByIdRoutes(_ app: Application) throws {
    app.group("purchases") { purchases in
        purchases.delete(":id") { req -> EventLoopFuture<Response> in
            if let purchaseid = UUID(req.parameters.get("id")!) {
                return User.query(on: req.db).field(\.$purchases).all().flatMapThrowing { users -> Response in
                    for u in users {
                        if let index = u.purchases.firstIndex(where: { $0.id == purchaseid }) {
                            u.purchases.remove(at: index)
                            _ = u.update(on: req.db)
                            return Response(status: .ok)
                        }
                    }
                    
                    throw Abort(.notFound)
                }
            } else {
                throw Abort(.badRequest)
            }
        }
    }
}
