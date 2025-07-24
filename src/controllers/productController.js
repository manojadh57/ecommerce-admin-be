import Product from "../models/product/ProductSchema.js";
import { Types } from "mongoose"; ///for object id//

export const createProduct = async (req, res) => {
  try {
    // req.file
    // req.body.image = [req.file]
    console.log(req.file);
    req.body.images = [req.file.path];
    const prod = await Product.create(req.body);
    return res.status(201).json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const filter = {};

    /// products?category=<id>
    if (req.query.category) {
      // Cast to ObjectId if your schema uses ObjectId
      filter.category = new Types.ObjectId(req.query.category);
      // If your Product schema stores the ID as a string, use:
      // filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate("category", "name");
    return res.json(products); // plain array
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  const prod = await Product.findById(req.params.id).populate("category");
  if (!prod) return res.status(404).json({ message: "Product not found" });
  return res.json(prod);
};

export const updateProduct = async (req, res) => {
  try {
    if (req.file) {
      req.body.images = [req.file.path];
    }
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
