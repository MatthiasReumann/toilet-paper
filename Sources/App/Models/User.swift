//
//  File.swift
//  
//
//  Created by Matthias on 17.09.21.
//

import Foundation
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
    
    init() { }
    
    init(id: UUID? = nil, name: String, color: String){
        self.id = id;
        self.name = name
        self.color = color
    }
}
