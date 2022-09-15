#! /usr/bin/env node

console.log('This script populates some test items, brands, categories and item instances to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/inventory?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Brand = require('./models/brand');
var Category = require('./models/category');
var ItemInstance = require('./models/iteminstance');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var brands = [];
var categories = [];
var itemInstances = [];

function itemCreate(name, brand, description, gender, category, price, cb) {
    const item = new Item({
        name,
        brand,
        description,
        gender,
        category,
        price
    });
       
    item.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Item: ' + item);
        items.push(item);
        cb(null, item);
    });
}

function brandCreate(name, description, cb) {

    let brandDetails = {
        name
    };

    if (description != false) {brandDetails.description = description;}

    const brand = new Brand(brandDetails);
     
    brand.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Brand: ' + brand);
        brands.push(brand)
        cb(null, brand);
    });
}

function categoryCreate(name, cb) {
  
    const category = new Category({name});    

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category);
    });
}


function itemInstanceCreate(item, size, cb) {

    const itemInstance = new ItemInstance({
        item,
        size
    });    

    itemInstance.save(function (err) {
        if (err) {
            console.log('ERROR CREATING Item Instance: ' + itemInstance);
            cb(err, null);
            return;
        }
        console.log('New Item Instance: ' + itemInstance);
        itemInstances.push(itemInstance);
        cb(null, itemInstance);
    });
}


function createBrandCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Tops', callback);
        },
        function(callback) {
          categoryCreate('Bottoms', callback);
        },
        function(callback) {
          categoryCreate('Swim', callback);
        },
        function(callback) {
          categoryCreate('Shoes', callback);
        },
        function(callback) {
          categoryCreate('Accessories', callback);
        },
        function(callback) {
          brandCreate('Nike', `The world's largest athletic apparel company, Nike is best known for its footwear, apparel, and equipment. 
          Founded in 1964 as Blue Ribbon Sports, the company became Nike in 1971 after the Greek goddess of victory. 
          One of the most valuable brands among sport businesses, Nike employs over 76,000 people worldwide.`, 
          callback);
        },
        function(callback) {
          brandCreate('Adidas', `adidas AG (adidas) designs, manufactures and markets athletic and sports lifestyle products. 
          The company's product portfolio includes footwear, apparel and accessories such as bags, sun glasses, fitness equipment, and balls.`, 
          callback);
        },
        function(callback) {
          brandCreate('Vans', false, callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Hoodie', brands[0], 'A plain black hoodie with the iconic Nike Swoosh.', 'men', categories[0], 20, callback);
        },
        function(callback) {
          itemCreate('Graphic T-Shirt', brands[2], 'Maroon graphic t-shirt with white Vans logo.', 'men', categories[0], 17, callback);
        },
        function(callback) {
          itemCreate('3-Striped Pants', brands[1], 'Adidas famous three-striped track pants in black.', 'women', categories[1], 30, callback);
        },
        function(callback) {
          itemCreate('Chukka Lows', brands[2], 'Grey Chuckka Low skateboarding shoes by Vans featuring a gum colored waffle cup sole.', 'men', categories[3], 50, callback);
        },
        function(callback) {
          itemCreate('Swimming Trunks', brands[0], 'Powder blue swimming trunks with the Nike name and Swoosh logo on one side.', 'men', categories[2], 25, callback);
        },
        function(callback) {
          itemCreate('Bucket Hat', brands[1], 'Pink bucket hat with white Adidas name embroidered in the middle.', 'women', categories[4], 22, callback);
        },
        function(callback) {
          itemCreate('Superstar Shoes', brands[1], 'The Adidas Superstar shoes feature a smooth leather upper with sporty 3-Stripes and a heel tab. They finish off with the world-famous rubber shell toe.', 'women', categories[3], 95, callback);
        }
        ],
        // optional callback
        cb);
}


function createItemInstances(cb) {
    async.parallel([
        function(callback) {
          itemInstanceCreate(items[0], 'large', callback);
        },
        function(callback) {
          itemInstanceCreate(items[0], 'medium', callback);
        },
        function(callback) {
          itemInstanceCreate(items[0], 'small', callback);
        },
        function(callback) {
          itemInstanceCreate(items[1], 'large', callback);
        },
        function(callback) {
          itemInstanceCreate(items[1], 'small', callback);
        },
        function(callback) {
          itemInstanceCreate(items[2], 'large', callback);
        },
        function(callback) {
          itemInstanceCreate(items[2], 'medium', callback);
        },
        function(callback) {
          itemInstanceCreate(items[3], '9.5', callback);
        },
        function(callback) {
          itemInstanceCreate(items[4], 'medium', callback);
        },
        function(callback) {
          itemInstanceCreate(items[5], 'osfa', callback);
        },
        function(callback) {
          itemInstanceCreate(items[6], '7', callback);
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createBrandCategories,
    createItems,
    createItemInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ITEM Instances: '+itemInstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


