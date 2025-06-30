import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: false
    },
    documents: {
      type: [String], 
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('OrderForm', orderSchema);

export default Order;
