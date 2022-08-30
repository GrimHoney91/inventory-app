const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, minLength: 2, maxLength: 20, required: true},
    description: {type: String, maxLegnth: 30, required: true}
});

CategorySchema
.virtual('url')
.get(function() {
    return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);