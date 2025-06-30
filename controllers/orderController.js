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
