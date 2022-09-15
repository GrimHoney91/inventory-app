const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    size: {type: String, required: true}
});

ItemInstanceSchema
.virtual('url')
.get(function() {
    return `/inventory/iteminstance/${this._id}`;
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);