const Cart = require('../mongo/Addcart');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // user ID from JWT token
    const { productId, quantity = 1 } = req.body; // product data from frontend

    // 1️⃣ Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // 2️⃣ If no cart exists yet → create one for this user
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // 3️⃣ If cart exists → check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // 4️⃣ If the product is already there, just increase its quantity
        existingItem.quantity += quantity;
      } else {
        // 5️⃣ Otherwise, add a new item entry to the cart
        cart.items.push({ productId, quantity });
      }
    }

    // 6️⃣ Save the updated (or new) cart to MongoDB
    await cart.save();

    // 7️⃣ Respond to frontend with success and updated cart data
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.user.id; // user ID from JWT token
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};