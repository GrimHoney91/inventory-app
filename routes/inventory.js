const express = require('express');

const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');
const brand_controller = require('../controllers/brandController');
const item_instance_controller = require('../controllers/iteminstanceController');

// ITEM ROUTES //

//HOME PAGE
router.get('/', item_controller.index);

//CREATE ITEM FORM ON GET
router.get('/item/create', item_controller.item_create_get);

// // //CREATE ITEM FORM ON POST
router.post('/item/create', item_controller.item_create_post);

// //DELETE ITEM ON GET
router.get('/item/:id/delete', item_controller.item_delete_get);

//DELETE ITEM ON POST
router.post('/item/:id/delete', item_controller.item_delete_post);

//UPDATE ITEM ON GET
router.get('/item/:id/update', item_controller.item_update_get);

//UPDATE ITEM ON POST
router.post('/item/:id/update', item_controller.item_update_post);

//ITEM DETAIL
router.get('/item/:id', item_controller.item_detail);

//ITEM LIST
router.get('/items', item_controller.item_list);


// /// CATEGORY ROUTES ///

// //CREATE CATEGORY FORM ON GET
router.get('/category/create', category_controller.category_create_get);

//CREATE CATEGORY FORM ON POST
router.post('/category/create', category_controller.category_create_post);

//DELETE CATEGORY ON GET
router.get('/category/:id/delete', category_controller.category_delete_get);

//DELETE CATEGORY ON POST
router.post('/category/:id/delete', category_controller.category_delete_post);

//UPDATE CATEGORY ON GET
router.get('/category/:id/update', category_controller.category_update_get);

//UPDATE CATEGORY ON POST
router.post('/category/:id/update', category_controller.category_update_post);

//Category detail
router.get('/category/:id', category_controller.category_detail);

// //Category list
router.get('/categories', category_controller.category_list);


// /// BRAND ROUTES ///

//CREATE brand on GET
router.get('/brand/create', brand_controller.brand_create_get);

//CREATE brand on POST
router.post('/brand/create', brand_controller.brand_create_post);

//DELETE brand on GET
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

//DELETE brand on POST
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

//UPDATE brand on GET
router.get('/brand/:id/update', brand_controller.brand_update_get);

//UPDATE brand on POST
router.post('/brand/:id/update', brand_controller.brand_update_post);

//brand DETAIL
router.get('/brand/:id', brand_controller.brand_detail);

//brand LIST
router.get('/brands', brand_controller.brand_list);


// /// ITEM INSTANCE ROUTES ///

//CREATE item instance on GET
router.get('/iteminstance/create', item_instance_controller.iteminstance_create_get);

//CREATE item instance on POST
router.post('/iteminstance/create', item_instance_controller.iteminstance_create_post);

// //DELETE item instance on GET
// router.get('/iteminstance/:id/delete', item_instance_controller.iteminstance_delete_get);

//DELETE item instance on POST *
router.post('/item/:id', item_instance_controller.iteminstance_delete_post);

//UPDATE item instance on GET
router.get('/iteminstance/:id/update', item_instance_controller.iteminstance_update_get);

//UPDATE item instance on POST
router.post('/iteminstance/:id/update', item_instance_controller.iteminstance_update_post);

// //Item DETAIL
// router.get('/iteminstance/:id', item_instance_controller.iteminstance_detail);

// //Item LIST
// router.get('/iteminstances', item_instance_controller.iteminstance_list);


module.exports = router;