import mongoose from 'mongoose';


// Create a new Mongoose schema for the orders
const orderSchema = new mongoose.Schema({
  tableNumber : String,
  items : [
    {
      itemName: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  status: String,
},{timestamps: true});

// Create a new Mongoose model from the schema and export it
const Order = mongoose.model('Order', orderSchema);

export default Order;
