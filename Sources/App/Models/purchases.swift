//
//  File.swift
//  
//
//  Created by Matthias on 14.09.21.
//

import Foundation
import Vapor

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
