import Category from "../models/category/CategorySchema.js";

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
