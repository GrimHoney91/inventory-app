const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {type: String, required: true, maxLength: 30},
    description: {type: String, maxLength: 300}
});

BrandSchema
.virtual('url')
.get(function() {
    return `/inventory/brand/${this._id}`;
});

module.exports = mongoose.model('Brand', BrandSchema);