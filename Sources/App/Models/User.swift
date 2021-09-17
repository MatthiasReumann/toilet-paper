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

final class User : Model, Content {
    static let schema = "users"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "color")
    var color: String
    
    @Field(key: "purchases")
    var purchases: [Item]
    
    init() { }
    
    init(id: UUID? = nil, name: String, color: String, purchases: [Item]){
        self.id = id;
        self.name = name
        self.color = color
        self.purchases = purchases
    }
}
