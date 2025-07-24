import Product from "../models/product/ProductSchema.js";
import Category from "../models/category/CategorySchema.js";
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

    if (req.query.category) {
      const parentId = req.query.category;
      const children = await Category.find({ parent: parentId }).select("_id");
      const ids = [parentId, ...children.map((c) => c._id.toString())];
      filter.category = { $in: ids };
    }

    const products = await Product.find(filter).populate("category", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
