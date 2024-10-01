const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('City', citySchema);
