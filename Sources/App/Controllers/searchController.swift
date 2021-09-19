import Foundation
import Vapor
import Fluent

struct SearchQuery: Content{
    var q: String
}

func searchRoutes(_ app: Application) throws {
    app.group("search") { searches in
        searches.get { req -> EventLoopFuture<[Purchase]> in
            let searchQuery = try req.query.decode(SearchQuery.self)
            return Purchase.query(on:req.db).group(.and) { group in
                group
                    .filter(\.$name ~~ searchQuery.q)
                    .filter(\.$name =~ searchQuery.q)
                    .filter(\.$name ~= searchQuery.q)
            }.all()
        }
    
    }
}
