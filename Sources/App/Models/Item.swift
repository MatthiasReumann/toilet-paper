//
//  File.swift
//  
//
//  Created by Matthias on 17.09.21.
//

import Foundation
import FluentMongoDriver
import Fluent
import Vapor

final class Item : Model, Content{
    static let schema = "items"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "priceInCent")
    var priceInCent: Int
    
    @Field(key: "amount")
    var amount: Int
    
    @Parent(key: "userid")
    var user: User

    init(){}
    
    init(id: UUID? = nil, name: String, priceInCent: Int, amount: Int, userid: UUID){
        self.id = id
        self.name = name
        self.priceInCent = priceInCent
        self.amount = amount;
        self.$user.id = userid
    }
}
