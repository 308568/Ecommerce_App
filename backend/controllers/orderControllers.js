// import { currency } from '../../admin/src/App.jsx';
import orderModel from '../models/orderModels.js'
import userModel from '../models/userModel.js';
import Stripe from 'stripe'

// global variables

const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using COD Method

const placeOrder = async (req,res) => {
    
    try {
        
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"cod",
            payment:false,
            date: Date.now()
        }

       const newOrder = new orderModel(orderData)
       await newOrder.save()

       await userModel.findByIdAndUpdate(userId,{cartData:{}})

       res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        console.log('Received order data:', { userId, items, amount, address });

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100) // Ensure the unit amount is an integer
            },
            quantity: item.quantity
        }));

        // Add delivery charge as a separate line item
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        console.log('Line items for Stripe session:', line_items);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        console.log('Stripe session response:', session);

        if (session.url) {
            res.json({ success: true, session_url: session.url });
        } else {
            throw new Error('Stripe session URL is missing.');
        }

    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe

const verifyStripe = async (req,res) =>{
    const {orderId, success, userId} = req.body

    try {

        if (success === "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData: {} })
            res.json({success: true});
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
        
    }
}




// Placing orders using Razorpay Method

const placeOrderRazorpay = async (req,res) => {
    
}

// All Orders
const allOrders = async (req,res) => {
    
    try {

        const orders = await orderModel.find({})
        res.json({success:true,orders})
        
    } catch (error) {

        
        console.log(error);
        res.json({success:false,message:error.message})

        
    }

}

// user order Data For frontend

const userOrders = async (req,res) => {

    try {

        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success:true,orders})
        
    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message})
        
    }
    
}

// update order status from admin panel

const updateStatus = async (req,res) => {

    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true,message:'status Updated'})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
    
}



export {verifyStripe,placeOrder,placeOrderStripe ,placeOrderRazorpay,allOrders,userOrders,updateStatus}