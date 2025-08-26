import path from "path";
import Product from "../models/product/ProductSchema.js";
import Category from "../models/category/CategorySchema.js";

const toWebAssetPath = (p) => {
  // Accept anything (full disk path, "assets/...", "/assets/..."), return "assets/<file>"
  if (!p) return "";
  // Try to find ".../assets/<file>"
  const idx = p.replace(/\\/g, "/").lastIndexOf("/assets/");
  if (idx >= 0) return p.replace(/\\/g, "/").slice(idx + 1); // drop leading slash -> "assets/..."
  // Fallback: just take the basename
  return `assets/${path.basename(p)}`;
};

// controllers
export const createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Normalize single uploaded image from multer
    if (req.file) {
      payload.images = [toWebAssetPath(req.file.path)];
    }

    // Ensure numeric fields are numbers (tolerates strings from forms)
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.stock !== undefined) payload.stock = Number(payload.stock);

    const prod = await Product.create(payload);
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
  try {
    const prod = await Product.findById(req.params.id).populate("category");
    if (!prod) return res.status(404).json({ message: "Product not found" });
    return res.json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.images = [toWebAssetPath(req.file.path)];
    }

    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.stock !== undefined) payload.stock = Number(payload.stock);

    const prod = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!prod) return res.status(404).json({ message: "Product not found" });
    return res.json(prod);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    return res.status(204).end();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
