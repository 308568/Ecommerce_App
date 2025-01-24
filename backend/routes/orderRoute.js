import express from "express";
import {
  placeOrder,
  placeOrderStripe ,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe
} from "../controllers/orderControllers.js";

import adminAuth from '../middleware/adminAuth.js'
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// payment feature

orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrder)

// user Features

orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter