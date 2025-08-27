import { sendOrderStatusEmail } from "../helpers/emailHelper.js";
import Order from "../models/order/OrderSchema.js";

//helper//
const normalizeAddress = (a = {}) => ({
  name: a.name || "",
  phone: a.phone || "",
  line1: a.line1 || "",
  line2: a.line2 || "",
  city: a.city || "",
  state: a.state || "",
  postalCode: a.postalCode || "",
  country: a.country || "",
  email: a.email || "",
});

const allowed = new Set([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
const nextMap = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

/**
 * GET /api/admin/v1/orders
 * List all orders, populated with user & product info.
 */
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email fName lName")
      .populate("products.productId", "name price images")
      .lean();

    // ensure stable address shape for FE
    orders.forEach((o) => (o.address = normalizeAddress(o.address)));
    return res.json({ status: "success", orders });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * GET /api/admin/v1/orders/:id
 * Full order detail (user + products + address snapshot).
 */
export const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "email fName lName name")
      .populate("products.productId", "name price images")
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    order.address = normalizeAddress(order.address);
    return res.json({ status: "success", order });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};

/**
 * PUT /api/admin/v1/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, notify = false, note = "" } = req.body || {};
    if (!allowed.has(status)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid status" });
    }

    // Load then save so we can validate transitions and log timeline
    const orderDoc = await Order.findById(req.params.id)
      .populate("userId", "email fName lName")
      .populate("products.productId", "name price images");

    if (!orderDoc) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    const current = String(orderDoc.status || "pending");
    if (
      current !== status &&
      nextMap[current] &&
      !nextMap[current].includes(status)
    ) {
      return res.status(400).json({
        status: "error",
        message: `Cannot change status from "${current}" to "${status}"`,
      });
    }

    orderDoc.status = status;

    if (Array.isArray(orderDoc.timeline)) {
      orderDoc.timeline.push({
        at: new Date(),
        status,
        note,
        by: req.user?.email || "admin",
      });
    }

    await orderDoc.save();

    // choose best email: account email, else address email
    const to = orderDoc.userId?.email || orderDoc?.address?.email || null;

    if (notify && to) {
      // fire & forget — do not block status update on mail failure
      sendOrderStatusEmail({
        to,
        status,
        order: orderDoc.toObject ? orderDoc.toObject() : orderDoc,
        note,
      }).catch((e) => console.error("Status email failed:", e?.message || e));
    }

    const out = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
    out.address = normalizeAddress(out.address);

    return res.json({ status: "success", order: out });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};
