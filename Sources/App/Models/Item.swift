//
//  File.swift
//  
//
//  Created by Matthias on 17.09.21.
//

import Foundation
import Vapor

final class Item : Codable{
    var name: String
    var priceInCent: Int
    
    init(name: String, priceInCent: Int){
        self.name = name
        self.priceInCent = priceInCent
    }
}
