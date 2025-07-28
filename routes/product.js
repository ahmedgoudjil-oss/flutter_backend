const express = require('express');
const Product = require('../models/product');
const Vendor = require('../models/vendor');
const productRouter = express.Router();
const { auth, vendorAuth } = require('../middleware/auth');
const e = require('express');

productRouter.post('/api/add-product', async(req,res)=>{
try {
    const {productName,productPrice, quantity,description,category,vendorId,fullName,subCategory,images}= req.body;
     const product= new Product( {productName,productPrice, quantity,description,category,vendorId,fullName,subCategory,images});
     await product.save();
     return res.status(201).send(product);

} catch (e) {
    res.status(500).json({error:e.message});
}
});

productRouter.get('/api/popular-product',async(req,res)=>{
try {
    
     const product= await Product.find( { popular: true});
     
     if(!product|| product.length==0){
        return res.status(200).json({msg:"products not found"});
     }else{
        return res.status(200).json(product);
     }
     

} catch (e) {
    res.status(500).json({error:e.message});
}
});

productRouter.get('/api/recommended-product',async(req,res)=>{
try {
    
     const product= await Product.find( { recommend: true});
     
     if(!product|| product.length==0){
        return res.status(200).json({msg:"recommended products are  not found"});
     }else{
        return res.status(200).json({product});
     }
     

} catch (e) {
    res.status(500).json({error:e.message});
}
});   
productRouter.get('/api/products-by-categroy/:category', async (req, res) => {
  try {
      // الحصول على اسم الفئة من المعلمات
    const { category } = req.params;

      // البحث عن المنتجات في قاعدة البيانات حسب الفئة
    const products = await Product.find({ category });

    
    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "Products not found" });
    }

    // إرجاع النتائج
    return res.status(200).json(products);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

);

//new route to retrive related products by subCategory
productRouter.get('/api/related-products-by-subcategory/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    // first , find the product to get its subCategory
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }else{
      // then, find related products by subCategory
      const relatedProducts = await Product.find({
         subCategory: product.subCategory,
          _id: { $ne: productId } });
      if (!relatedProducts  ||relatedProducts.length === 0) {
        return res.status(404).json({ msg: "No related products found" });
      }
      return res.status(200).json(relatedProducts);
    } 
    
  } catch (e) {
   return res.status(500).json({ error: e.message });
  }
});

//route for retrieving top 10 highest rated products
productRouter.get('/api/top-rated-products', async (req, res) => {
  try {
    const products = await Product.find().sort({ averageRating: -1 }).limit(10);
    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "No top-rated products found" });
    }
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Route to get products by subCategory
productRouter.get('/api/product-by-subcategory/:subCategory', async (req, res) => {
  try {
    // Extract subCategory from URL params
    const { subCategory } = req.params;
    // Find products by subCategory
    const products = await Product.find({ subCategory });
    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "No products found in this subcategory" });
    }
    // Return found products
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Route for searching products by name or description
productRouter.get('/api/search-product', async (req, res) => {
  try {
    // Extract the query parameter from the request query string
    const { query } = req.query;
    
    // Validate that a query parameter is provided
    if (!query) {
      return res.status(400).json({ msg: "Query parameter required" });
    }
    
    // Search for the product collection for documents where either product name or description contains the specified query string
    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } }, // Case insensitive search for product name
        { description: { $regex: query, $options: 'i' } }  // Case insensitive search for description
      ]
    });
    
    // Check if any products match the query
    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "No products found matching the query" });
    }
    
    // Return found products
    return res.status(200).json(products);
    
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Route to edit/update an existing product
productRouter.put('/api/edit-product/:productId', async (req, res) => {
  try {
    // Extract product ID from the request parameters
    const { productId } = req.params;
    
    // Check if the product exists and if the vendor is authorized
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    
    // Check if the vendor is the owner of the product
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to edit this product" });
    }
    
    // Destructure the request body to exclude vendorId
    const { vendorId, ...updateData } = req.body;
    
    // Update the product with the fields provided in updateData
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData }, // Update all the fields in updateData
      { new: true } // Return the updated product document in the response
    );
    
    return res.status(200).json(updatedProduct);
    
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Fetch products by vendor ID

productRouter.get('/api/product/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("Fetching products for vendor:", vendorId);

    const vendorExist = await Vendor.findById(vendorId);
    if (!vendorExist) {
      console.log("Vendor not found!");
      return res.status(404).json({ msg: "Vendor not found" });
    }

    const products = await Product.find({ vendorId });
    console.log("Found products:", products.length);
    return res.status(200).json(products);

  } catch (e) {
    console.error("Error in /api/product/vendor/:vendorId:", e);
    return res.status(500).json({ error: e.message });
  }
});



module.exports=productRouter;