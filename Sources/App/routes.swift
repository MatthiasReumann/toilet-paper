import Vapor

func routes(_ app: Application) throws {
    try app.group("users") { users in
        try usersRoutes(users)
        try usersIdRoutes(users)
        try usersIdPurchasesRoutes(users)
        try usersIdPurchasesIdRoutes(users)
    }
}
