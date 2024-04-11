const express = require("express")
const cors = require('cors');
const app = express()
app.use(cors({origin:"*"}))
app.use(express.json())

require("dotenv").config()

const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY)

app.use(express.json())

app.post("/api/create-checkout-session",async(req,res)=>{
   try{
    const {CartItem,totalAmount} = req.body;


    const lineItems= CartItem.map(item=>({
        price_data:{
            currency:'usd',
            product_data:{
                name:item.title,
                images:[item.img],

            },
            unit_amount:parseFloat(item.price)*100

        },
        quantity:item.amount,
    }));

    //create checkout sessions
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineItems,
        mode:'payment',
        success_url:'http://localhost:3000/success',
        cancel_url:'http://localhost:3000/cancel',

    });
    
    res.status(200).json({sessionId:session.id})
 

   }catch(error){
    console.error('Error creating checkout session',error);
    res.status(500).json({error:'Failed to create checkout session'});
   }
});

app.listen(5000,()=>{
    console.log('Database is connected')
})