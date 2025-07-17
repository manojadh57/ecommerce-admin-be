import Product from "../models/product/ProductSchema.js";

export const createProduct = async (req, res) => {
  try {
    const prod = await Product.create(req.body);
    return res.status(201).json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  return res.json(products);
};

export const getProductById = async (req, res) => {
  const prod = await Product.findById(req.params.id).populate("category");
  if (!prod) return res.status(404).json({ message: "Product not found" });
  return res.json(prod);
};

export const updateProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!prod) return res.status(404).json({ message: "Product not found" });
    return res.json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const prod = await Product.findByIdAndDelete(req.params.id);
  if (!prod) return res.status(404).json({ message: "Product not found" });
  return res.status(204).end();
};
