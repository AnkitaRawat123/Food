import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './PlaceOrder.css';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (req, res) => {
    try {
      const newOrder = new orderModel({
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address
      });
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
  
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name
          },
          unit_amount: item.price * 100 * 80
        },
        quantity: item.quantity
      }));
  
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charges"
          },
          unit_amount: 2 * 100 * 80
        },
        quantity: 1
      });
  
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
      });
  
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  
  
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-fields'>
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>Rs {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs {getTotalCartAmount() === 0 ? 0 : 10}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b> Rs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 10}</b>
            </div>
          </div>
          <button type='submit'>Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
