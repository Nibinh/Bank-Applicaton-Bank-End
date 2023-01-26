// import mongoose db.js file
const mongoose= require('mongoose')
mongoose.set('strictQuery', false);

// using mongoose define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log("mongo db connected successfully")
})

// create model for the prject
// Collection-users

const User=mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

// export model
module.exports={
    User
}