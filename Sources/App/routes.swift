import Vapor

func routes(_ app: Application) throws {
    try usersRoutes(app)
    try usersIdRoutes(app)
    try usersIdPurchasesRoutes(app)
    try purchasesRoutes(app)
    try purchasesByIdRoutes(app)
    //try searchRoutes(app)
}
