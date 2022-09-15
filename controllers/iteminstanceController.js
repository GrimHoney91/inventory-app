const Item = require('../models/item');
const ItemInstance = require('../models/iteminstance');
const Brand = require('../models/brand');
const Category = require('../models/category');

const async = require('async');
const {body, validationResult} = require('express-validator');


exports.iteminstance_create_get = (req, res, next) => {
    Item.find({}, (err, items) => {
        if (err) return next(err);

        res.render('item_instance_form', {
            title: 'Create Item Instance',
            items
        });
    });
};

exports.iteminstance_create_post = [
    body('item').trim().isLength({min: 1}).escape(),
    body('size').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const iteminstance = new ItemInstance({
            item: req.body.item,
            size: req.body.size
        });

        if (!errors.isEmpty()) {
            Item.find({}, (err, items) => {
                if (err) return next(err);

                res.render('item_instance_form', {
                    title: 'Create Instance',
                    iteminstance,
                    items,
                    errors: errors.array()
                });
            });
            return;
        }

        iteminstance.save((err) => {
            if (err) return next(err);

            res.redirect('/inventory/item/' + iteminstance.item);
        });
    }
];

exports.iteminstance_delete_post = (req, res, next) => {
    ItemInstance.findByIdAndRemove(req.body.instanceid, (err) => {
        if (err) return next(err);
        res.redirect(req.body.itemurl);
    });
};

exports.iteminstance_update_get = (req, res, next) => {
    async.parallel({
        iteminstance(callback) {
            ItemInstance.findById(req.params.id).populate('item').exec(callback);
        },
        items(callback) {
            Item.find({}, callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        if (results.iteminstance == null) {
            const err = new Error('Item instance not found.');
            err.status = 404;
            return next(err);
        }

        res.render('item_instance_form', {
            title: 'Update ' + results.iteminstance.item.name + ' #: ' + results.iteminstance._id,
            iteminstance: results.iteminstance,
            items: results.items
        });
    });
};

exports.iteminstance_update_post = [
    body('item').trim().isLength({min: 1}).escape(),
    body('size').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const iteminstance = new ItemInstance({
            item: req.body.item,
            size: req.body.size,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            async.parallel({
                iteminstance(callback) {
                    ItemInstance.findById(req.params.id).populate('item').exec(callback);
                },
                items(callback) {
                    Item.find({}, callback);
                },
            }, (err, results) => {
                if (err) return next(err);

                res.render('item_instance_form', {
                    title: 'Update ' + results.iteminstance.item.name + ' #: ' + results.iteminstance._id,
                    iteminstance,
                    items: results.items,
                    errors: errors.array()
                });
            });
            return;
        }

        ItemInstance.findByIdAndUpdate(req.params.id, iteminstance, {}, (err, theiteminstance) => {
            if (err) return next(err);

            res.redirect('/inventory/item/' + iteminstance.item);
        });
    }
];