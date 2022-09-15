const Item = require('../models/item');
const ItemInstance = require('../models/iteminstance');
const Brand = require('../models/brand');
const Category = require('../models/category');

const async = require('async');
const {body, validationResult} = require('express-validator');

exports.index = (req, res, next) => {
    async.parallel({
        item_count(callback) {
            Item.countDocuments({}, callback);
        },
        brand_count(callback) {
            Brand.countDocuments({}, callback);
        },
        category_count(callback) {
            Category.countDocuments({}, callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        res.render('index', {title: 'Home', data: results});
    });
};

exports.item_list = (req, res, next) => {
    Item.find()
    .populate('brand')
    .populate('category')
    .exec(function(err, item_list) {
        if (err) return next(err);
        res.render('item_list', {title: 'All Items', item_list});
    });
};

exports.item_detail = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id)
            .populate('brand')
            .populate('category')
            .exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.params.id}).sort({size: 1}).exec(callback);
        },
        item_instance_count(callback) {
            ItemInstance.countDocuments({item: req.params.id}, callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.item == null) {
            const err = new Error('Item not found.');
            err.status = 404;
            return next(err);
        }

        res.render('item_detail', {
            title: results.item.name,
            item: results.item,
            item_instances: results.item_instances,
            instance_count: results.item_instance_count
        });
    });
};

exports.item_create_get = (req, res, next) => {
    async.parallel({
        brands(callback) {
            Brand.find({}, callback);
        },
        categories(callback) {
            Category.find({}, callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        
        res.render('item_form', {
            title: 'Create Item',
            brands: results.brands,
            categories: results.categories
        });
    });
};

exports.item_create_post = [

    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('brand', 'Brand must not be empty.').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
    body('gender', 'Gender must not be empty.').trim().isLength({min: 1}).escape(),
    body('category', 'Category must not be empty.').trim().isLength({min: 1}).escape(),
    body('price').isFloat({min: 0}),

    (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            gender: req.body.gender,
            category: req.body.category,
            price: req.body.price
        });

        if (!errors.isEmpty()) {
            async.parallel({
               brands(callback) {
                Brand.find({}, callback);
               },
               categories(callback) {
                Category.find({}, callback);
               }
            }, (err, results) => {
                if (err) return next(err);

                res.render('item_form', {
                   title: 'Create Item',
                   brands: results.brands,
                   categories: results.categories,
                   item,
                   errors: errors.array()
                });
            });
            return;
        }
        item.save((err) => {
            if (err) return next(err);

            res.redirect(item.url);
        });
    }
];

exports.item_delete_get = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id).populate('brand').populate('category').exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.params.id}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.item == null) {
            res.redirect('/inventory/items');
        }

        res.render('item_delete', {
            title: 'Delete: ' + results.item.name,
            item: results.item,
            item_instances: results.item_instances,
            instance_count: results.instance_count
        });
    });
};

exports.item_delete_post = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.body.itemid).populate('brand').populate('category').exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.body.itemid}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.item_instances.length > 0) {
            res.render('item_delete', {
               title: 'Delete: ' + results.item.name,
               item: results.item,
               item_instances: results.item_instances
            });
            return;
        }
        Item.findByIdAndRemove(req.body.itemid, (err) => {
            if (err) return next(err);
            res.redirect('/inventory/items');
        });
    });
};

exports.item_update_get = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id).populate('brand').populate('category').exec(callback);
        },
        brands(callback) {
            Brand.find({}, callback);
        },
        categories(callback) {
            Category.find({}, callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.item == null) {
            const err = new Error('Item not found.');
            err.status = 404;
            return next(err);
        }

        res.render('item_form', {
            title: 'Update Item: ' + results.item.name,
            item: results.item,
            brands: results.brands,
            categories: results.categories
        });
    });
};

exports.item_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('brand', 'Brand must not be empty.').trim().isLength({min: 1}).escape(),
    body('description').trim().isLength({min: 1}).escape(),
    body('gender').trim().isLength({min: 1}).escape(),
    body('category').trim().isLength({min: 1}).escape(),
    body('price').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            gender: req.body.gender,
            category: req.body.category,
            price: req.body.price,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            async.parallel({
                brands(callback) {
                    Brand.find({}, callback);
                },
                categories(callback) {
                    Category.find({}, callback);
                }
            }, (err, results) => {
                if (err) return next(err);
                
                res.render('item_form', {
                    title: 'Update Item',
                    item,
                    brands: results.brands,
                    categories: results.categories,
                    errors: errors.array()
                });
            });
            return;
        }

        Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
            if (err) return next(err);

            res.redirect(theitem.url);
        });
    }
];