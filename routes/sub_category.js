const express = require('express');
const SubCategory = require('../models/sub_category');
const SubcategoryRouter= express.Router();


SubcategoryRouter.post('/api/subcategories',async(req,res)=>{
try {
    const { categoryId,categoryName,image,subCategoryName}= req.body;
     const subcategory= new SubCategory( {categoryId,categoryName,image,subCategoryName});
     await subcategory.save();
     return res.status(201).send(subcategory);

} catch (e) {
    res.status(500).json({error:e.message});
}
});
SubcategoryRouter.get('/api/subcategories',async(req,res)=>{
try {
   const subcategories= await SubCategory.find();
   return res.status(200).send(subcategories);


} catch (e) {
    res.status(500).json({error : e.message});
}
});

SubcategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
  try {
    // استخراج categoryName من الرابط
    const { categoryName } = req.params;

    // جلب كل subcategories التي تنتمي إلى هذا categoryName
    const subcategories = await SubCategory.find({ categoryName: categoryName });

    // إذا لم يتم العثور على أي نتيجة
    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ msg: "subcategories not found" });
    }

    // إرجاع النتائج
    return res.status(200).json(subcategories);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports= SubcategoryRouter;