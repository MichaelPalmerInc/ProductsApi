const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

mongoose.connect('mongodb://localhost/SDC',{
  useNewUrlParser:true,
  useUnifiedTopology:true
});


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
      type:Number
    }],
    features: [{
      type:Object
    }],
    styles:[{
      type:Object
    }]
  });

let Products = mongoose.model('Products', productsSchema);
module.exports = Products;

let count = 0;
(async () => {let stream = fs.createReadStream('../SDCData/transformedPhotos.csv')
  .pipe(csv());
  for await (let data of stream) {
    let id = data['id'];
    let style_id = Number(data[' styleId']);
    let url = data[' url'];
    let thumbnail_url = data[' thumbnail_url'];

      let filter = {"styles.style_id":style_id };
      let update = {$push: { "styles.$.photos": {
        id:id,
        url:url,
        thumbnail_url:thumbnail_url
      } } };
      // const products = await Products.findOne(filter);
      // console.log(products);
      // console.log(style_id);
       await Products.updateOne(filter, update);
       count++;
     if(count % 10000 ===0) {
       console.log(count);
     }
   }
   console.log('Finished');
})();







// let Products = mongoose.model('Products', productsSchema);
// module.exports = Products;

// const relatedSchema = new mongoose.Schema({
//     product_id:[
//       {type: Schema.Type.ObjectId,
//       ref: 'Products'
//     }],
//     related_id: Number
// });

// let Related = mongoose.model('Related', relatedSchema);
// module.exports = Related;

// const featureSchema = new mongoose.Schema({
//   product_id:[
//     {type: Schema.Type.ObjectId,
//     ref: 'Products'
//   }],
//   feature: String,
//     value: String
// });

// let Features = mongoose.model('Features', featureSchema);
// module.exports = Features;

// const stylesSchema = new mongoose.Schema({
//   style_id: {
//     type:Number,
//     unique:true
//   },
//   product_id:[
//     {type: Schema.Type.ObjectId,
//     ref: 'Products'
//   }],
//   name: String,
//   original_price: Number,
//   sale_price:Number,
//   default: Boolean
// });

// let Styles = mongoose.model('Styles', stylesSchema);
// module.exports = Styles;

// const photosSchema = new mongoose.Schema({
//   style_id: [{
//     type: Schema.Type.ObjectId,
//     ref:'Styles'
//   }],
//   thumbnail_url: String,
//   url: String
// });

// let Photos = mongoose.model('Photos', photosSchema);
// module.exports = Photos;

// const skuSchema = new mongoose.Schema({
//   size: String,
//   quantity: Number

// });

// let Skus = mongoose.model('Skus', skuSchema);
// module.exports = Skus;
