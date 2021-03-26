//This file is not actually used.
//Adding it just to display how I handled importing the csv files.

const fs = require('fs');
const csv = require('csv-parser')
const mongoose = require('mongoose');
const Photos = require('Photos');

mongoose.connect('mongodb://localhost/SDC',{
  useNewUrlParser:true,
  useUnifiedTopology:true
});

// products
(async () => {let stream = fs.createReadStream('../SDCData/product.csv')
  .pipe(csv());
  for await (let data of stream) {
    console.log(data);
    let id = data['id'];
    let name = data[' name'];
    let slogan = data[' slogan'];
    let description = data[' description'];
    let category = data[' category'];
    let default_price = data[' default_price'];

    await Products.create({
    product_id: data['id'],
    name: data[' name'],
    slogan: data[' slogan'],
    description: data[' description'],
    category: data[' category'],
    default_price: data[' default_price']
    });
   };
})();

//features
(async () => {let stream = fs.createReadStream('../SDCData/features.csv')
  .pipe(csv());
  for await (let data of stream) {
    let productID = data['product_id'];
    let feature = data['feature'];
    let value = data['value'];
     let filter = { product_id: Number(productID) };
     let update = {$push: { features: { feature:value } } };
     await Products.updateOne(filter, update);
  }
})();

//related
(async () => {let stream = fs.createReadStream('../SDCData/related.csv')
  .pipe(csv());
  for await (let data of stream) {
    console.log(data);
    let productID = data['current_product_id'];
    let relatedID = data['related_product_id'];
     let filter = { product_id: Number(productID) };
     let update = {$push: { related: relatedID } };
     await Products.updateOne(filter, update);
  }
  console.log('finished');
})();


//styles

(async () => {let stream = fs.createReadStream('../SDCData/styles.csv')
  .pipe(csv());
  for await (let data of stream) {
    let product_id = data['productId'];
    let id = Number(data['id']);
    let name = data['name'];
    let sale_price = data['sale_price'];
    let original_price = data['original_price'];
    let default_style = data['default_style'];
    let photos = [];
    let skus = [];

     let filter = { product_id: Number(product_id) };
     let update = {$push: { styles: {
       style_id:id,
       name:name,
       sale_price:sale_price,
       original_price:original_price,
       default_style:default_style,
       photos:photos,
       skus:skus
     } } };
     await Products.updateOne(filter, update);
     count++;
     if(count % 10000 ===0) {
       console.log(count);
     }
   };
   console.log('Finished');
})();


// skus
(async () => {let stream = fs.createReadStream('../SDCData/skus.csv')
  .pipe(csv());
  for await (let data of stream) {
    // console.log(data);
    let id = data['id'];
    let style_id = Number(data[' styleId']);
    let size = data[' size'];
    let quantity = data[' quantity'];

      let filter = {"styles.style_id":style_id };
      let update = {$push: { "styles.$.skus": {
        id:id,
        size:size,
        quantity:quantity,
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