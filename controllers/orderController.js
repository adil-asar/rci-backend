import Order from "../models/orderModel.js";
import { orderConfirmation } from "../config/mailer.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.warn("Unauthorized request: No user ID found");
      return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }

    if (!req.files || req.files.length === 0) {
      console.warn("No documents uploaded");
    }

    const uploadedDocs = req.files.map((file) => {
      console.log("Processed file:", file.originalname, "->", file.path);
      return file.path;
    });

    const orderData = {
      addedBy: userId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      deliveryAddress: req.body.deliveryAddress,
      deliveryCity: req.body.deliveryCity,
      deliveryState: req.body.deliveryState,
      service: req.body.service,
      message: req.body.message || "",
      documents: uploadedDocs,
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    // Send confirmation email
    try {
     await orderConfirmation({
  email: savedOrder.email,
  username: savedOrder.name,
  service: savedOrder.service,
  phone: savedOrder.phone,
  address: savedOrder.address,
  city: savedOrder.city,
  state: savedOrder.state,
  deliveryAddress: savedOrder.deliveryAddress,
  deliveryCity: savedOrder.deliveryCity,
  deliveryState: savedOrder.deliveryState,
  documents: savedOrder.documents,
});

      console.log("✅ Order confirmation email sent");
    } catch (emailError) {
      console.error("❌ Failed to send order confirmation email:", emailError);
      // optionally continue or return a warning
    }

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });

  } catch (error) {
    console.error("❌ Error in createOrder:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};





export const GetAllOrders = async (req, res) => {
  try {
    const pipeline = [
      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "userInfo",
        },
      },

      {
        $unwind: {
          path: "$userInfo",
          // preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          service: 1,
          city: 1,
          state: 1,
          address: 1,
          message: 1,
          documents: 1,
          createdAt: 1,
          userInfo: {
            _id: 1,
            username: 1,
            email: 1,
          },
        },
      },
    ];

    const orders = await Order.aggregate(pipeline);

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};