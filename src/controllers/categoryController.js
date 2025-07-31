import Category from "../models/category/CategorySchema.js";
import Product from "../models/product/ProductSchema.js";

export const createCategory = async (req, res) => {
  try {
    const cat = await Category.create({
      name: req.body.name,
      parent: req.body.parent || null,
    });
    return res.status(201).json(cat);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listCategories = async (req, res) => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    { $addFields: { productCount: { $size: "$products" } } },
    { $project: { products: 0 } },
    { $sort: { name: 1 } },
  ]);

  res.json(categories);
};

export const getCategoryById = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: "Category not found" });
  return res.json(cat);
};

export const updateCategory = async (req, res) => {
  try {
    const { name, parents = null } = req.body;
    const cat = Category.findByIdAndUpdate(
      req.params.id,
      { name, parent },
      { new: true }
    );

    if (!cat) return res.status(404).json({ message: "Category not found" });
    return res.json(cat);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) return res.status(404).json({ message: "Category not found" });
  return res.status(204).end();
};

export const listSubCategories = async (req, res) => {
  try {
    const subs = await Category.find({ parent: req.params.parentId });
    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listProductsByCategory = async (req, res) => {
  try {
    let id = req.params.id;

    let products = await Product.find({ category: id });

    let subCategories = await Category.find({ parent: id });

    for (let i = 0; i < subCategories.length; i++) {
      let subProducts = await Product.find({ category: subCategories[i]._id });
      products = [...products, ...subProducts];
    }

    return res.json({
      products,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
