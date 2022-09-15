const Item = require('../models/item');
const ItemInstance = require('../models/iteminstance');
const Brand = require('../models/brand');
const Category = require('../models/category');

const async = require('async');
const {body, validationResult} = require('express-validator');

exports.brand_list = (req, res, next) => {
    Brand.find().sort({name: 1}).exec((err, brand_list) => {
        if (err) return next(err);

        res.render('brand_list', {
            title: 'Brand List',
            brand_list
        });
    });
};

exports.brand_detail = (req, res, next) => {
    async.parallel({
        brand(callback) {
            Brand.findById(req.params.id).exec(callback);
        },
        brand_items(callback) {
            Item.find({brand: req.params.id}).sort({name: 1}).populate('brand').populate('category').exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.brand == null) {
            const err = new Error('Brand not found.');
            err.status = 404;
            return next(err);
        }

        res.render('brand_detail', {
            title: results.brand.name,
            description: results.brand.description,
            brand: results.brand,
            brand_items: results.brand_items
        });
    });
};

exports.brand_create_get = (req, res, next) => {
    res.render('brand_form', {title: 'Create Brand'});
};

exports.brand_create_post = [
    body('name').trim().isLength({min: 1, max: 30}).escape(),
    body('description').trim().isLength({max: 500}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            name: req.body.name,
            description: req.body.description
        });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Create Brand',
                brand,
                errors: errors.array()
            });
            return;
        } else {
            Brand.findOne({name: req.body.name}).exec((err, found_brand) => {
                if (err) return next(err);

                if (found_brand) {
                    res.redirect(found_brand.url);
                }

                brand.save((err) => {
                    if (err) return next(err);

                    res.redirect(brand.url);
                });
            });
        }
    }
];

exports.brand_delete_get = (req, res, next)  => {
    async.parallel({
        brand(callback) {
            Brand.findById(req.params.id).exec(callback);
        },
        brand_items(callback) {
            Item.find({brand: req.params.id}).populate('brand').populate('category').sort({name: 1}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.brand == null) {
            res.redirect('/inventory/brands');
        }

        res.render('brand_delete', {
            title: 'Delete Brand: ' + results.brand.name,
            brand: results.brand,
            brand_items: results.brand_items
        });
    });
};

exports.brand_delete_post = (req, res, next) => {
    async.parallel({
        brand(callback) {
            Brand.findById(req.body.brandid).exec(callback);
        },
        brand_items(callback) {
            Item.find({brand: req.body.brandid}).populate('brand').populate('category').sort({name: 1}).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.brand_items.length > 0) {
            res.render('brand_delete', {
                title: 'Delete Brand: ' + results.brand.name,
                brand: results.brand,
                brand_items: results.brand_items
            });
            return;
        }

        Brand.findByIdAndRemove(req.body.brandid, (err) => {
            if (err) return next(err);

            res.redirect('/inventory/brands');
        });
    });
};

exports.brand_update_get = (req, res, next) => {
    Brand.findById(req.params.id, (err, brand) => {
        if (err) return next(err);

        if (brand == null) {
            const err = new Error('Brand not found.');
            err.status = 404;
            return next(err);
        }

        res.render('brand_form', {
            title: 'Update Brand: ' + brand.name,
            brand
        });
    });
};

exports.brand_update_post = [
    body('name').trim().isLength({min: 1, max: 30}).escape(),
    body('description').trim().isLength({max: 500}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Update Brand: ' + brand.name,
                brand,
                errors: errors.array()
            });
            return;
        }

        Brand.findByIdAndUpdate(req.params.id, brand, {}, (err, thebrand) => {
            if (err) return next(err);

            res.redirect(thebrand.url);
        });
    }
];