const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ProductsApi');

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });

const productsSchema = new mongoose.Schema({
  product_id: {
    type:Number,
    unique: true},
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  related: [{
    related_id: Number
  }],
  features: [{feature: String,
    value: String
  }],
  styles: [{
      style_id: {
        type:Number,
        unique:true
      },
      name: String,
      original_price: Number,
      sale_price:Number,
      default: Boolean,
      photos: [{
        thumbnail_url: String,
        url: String
      }],
    skus: [{
      size: String,
      quantity: Number
    }]
  }]
});

let Products = mongoose.model('Products', productsSchema);