import Vapor
import Fluent
import FluentMongoDriver

extension Application {
    static let databaseUrl = Environment.get("MONGODB_URL")!
}

// configures your application
public func configure(_ app: Application) throws {
    try app.databases.use(.mongo(connectionString: Application.databaseUrl), as: .mongo)
    
    // uncomment to serve files from /Public folder
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    
    app.routes.defaultMaxBodySize = "3mb"
    
    // register routes
    try routes(app)
}
