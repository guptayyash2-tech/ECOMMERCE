const Order = require("../../mongo/Order");
const Cart = require("../../mongo/Addcart");

// 🧾 Create Order (Checkout)
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ user comes from JWT middleware
    const { shippingAddress, paymentMethod } = req.body;

    // 🛒 Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // 🧮 Prepare products for order
    const products = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.discountPrice || item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    // 🧾 Create new order
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    const savedOrder = await newOrder.save();

    // 🧹 Clear the cart after checkout
    await Cart.findOneAndDelete({ userId });

    res
      .status(201)
      .json({ message: "✅ Order placed successfully!", order: savedOrder });
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ message: "❌ Failed to create order" });
  }
};

module.exports = { createOrder };
