import Vapor


func routes(_ app: Application) throws {
    try purchasesRoutes(app)
    try usersRoutes(app)
}
