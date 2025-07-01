import Order from "../models/orderModel.js";

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
      service: req.body.service,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      message: req.body.message || "",
      documents: uploadedDocs,
    };



    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error("❌ Error in createOrder:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
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