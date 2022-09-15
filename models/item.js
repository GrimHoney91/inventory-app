const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, minLength: 2, maxLength: 20},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    description: {type: String, required: true},
    gender: {type: String, enum: ['men', 'women'], required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    price: {type: Number, min: 0, required: true},
});

ItemSchema
.virtual('url')
.get(function() {
    return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);