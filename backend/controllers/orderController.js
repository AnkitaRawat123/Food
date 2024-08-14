

import userModel from "../models/userModel.js";
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing userorder from frontend
// Example Axios request
const placeOrder = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4000/api/order/place', // Check this URL
        orderData,
        { headers: { token } }
      );
      console.log('Response from server:', response.data);
      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Order placement failed. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };
  
  
export { placeOrder };
