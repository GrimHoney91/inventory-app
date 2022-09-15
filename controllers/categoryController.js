const Item = require('../models/item');
const ItemInstance = require('../models/iteminstance');
const Brand = require('../models/brand');
const Category = require('../models/category');

const async = require('async');
const {body, validationResult} = require('express-validator');

exports.category_list = (req, res, next) => {
    Category.find({}, (err, category_list) => {
        if (err) return next(err);
        res.render('category_list', {title: 'Category List', category_list});
    });
};

exports.category_detail = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        category_items(callback) {
            Item.find({category: req.params.id}).populate('brand').populate('category').sort({name: 1}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.category == null) {
            const err = new Error('Category not found.');
            err.status = 404;
            return next(err);
        }

        res.render('category_detail', {
            title: results.category.name,
            category: results.category,
            category_items: results.category_items
        });
    });
};

exports.category_create_get = (req, res, next) => {
    res.render('category_form', {title: 'Create Category'});
};

exports.category_create_post = [
    body('name').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({name: req.body.name});

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category,
                errors: errors.array()
            });
            return;
        } else {
            Category.findOne({name: req.body.name}).exec((err, found_category) => {
                if (err) return next(err);

                if (found_category) {
                    res.redirect(found_category.url);
                } else {
                    category.save((err) => {
                        if (err) return next(err);
                        res.redirect(category.url);
                    });
                }
            }); 
        }
    }
];

exports.category_delete_get = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        category_items(callback) {
            Item.find({category: req.params.id}).sort({name: 1}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.category == null) {
            res.redirect('/inventory/categories');
        }

        res.render('category_delete', {
            title: 'Delete Category: ' + results.category.name,
            category: results.category,
            category_items: results.category_items
        });
    });
};

exports.category_delete_post = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.body.categoryid).exec(callback); 
        },
        category_items(callback) {
            Item.find({category: req.body.categoryid}).sort({name: 1}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.category_items.length > 0) {
            res.render('category_delete', {
                title: 'Delete Category: ' + results.category.name,
                category: results.category,
                category_items: results.category_items
            });
            return;
        }

        Category.findByIdAndRemove(req.body.categoryid, (err) => {
            if (err) return next(err);

            res.redirect('/inventory/categories');
        });
    });
};

exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) return next(err);
        
        if (category == null) {
            const err = new Error('Category not found.')
            err.status = 404;
            return next(err);
        }

        res.render('category_form', {
            title: 'Update Category: ' + category.name,
            category
        });
    });
};

exports.category_update_post = [
    body('name').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Update Category: ' + category.name,
                category,
                errors: errors.array()
            });
            return;
        }
        
        Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
            if (err) return next(err);

            res.redirect(thecategory.url);
        });
    }
];