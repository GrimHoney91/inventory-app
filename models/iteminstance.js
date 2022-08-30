const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    size: {type: String, required: true}
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);