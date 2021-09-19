import Vapor
import Fluent
import FluentMongoDriver

extension Application {
    static let databaseUrl = Environment.get("MONGODB_URL")!
    static let imgUrl = "Public/img/"
}

// configures your application
public func configure(_ app: Application) throws {
    try app.databases.use(.mongo(connectionString: Application.databaseUrl), as: .mongo)
    
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    
    app.routes.defaultMaxBodySize = "3mb"
    
    try routes(app)
}
