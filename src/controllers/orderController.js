import AdminUser from "../models/user/UserSchema.js";
import { sendOrderStatusEmail } from "../helpers/emailHelper.js";
import Order from "../models/order/OrderSchema.js";

/**
 * GET /api/admin/v1/orders
 * List all orders, populated with user & product info.
 */
export const listOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "email fName lName")
    .populate("products.productId", "name price");
  return res.json({ status: "success", orders });
};

/**
 * PUT /api/admin/v1/orders/:id/status
 * Update an order’s status and notify the customer via email.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "email fName lName");

    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    // send status update email
    await sendOrderStatusEmail({
      to: order.userId.email,
      name: order.userId.fName,
      orderId: order._id,
      status: order.status,
    });

    return res.json({ status: "success", order });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};
