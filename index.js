// import express inside index.js
const express =require('express')



// import cors in index.js
const cors = require('cors')

// import JsonWebToken
const jwt=require('jsonwebtoken')

// import dataservice
const dataService=require('./services/dataService')
const { application } = require('express')
const { JsonWebTokenError } = require('jsonwebtoken')

// create server app using express
const server=express()

// use cors to define origin
server.use(cors({
    origin:'http://localhost:4200'
}))

// to parse json data
server.use(express.json())


// setup port for server app
server.listen(3000,()=>{
    console.log("Server started at 3000")
})

// application specific middleware
// const appMiddleware = (req,res,next)=>{
//     console.log('inside application specific middleware')
//     next()
// }
// server.use(appMiddleware)


// token verify middleware
const jwtMiddleware=(req,res,next)=>{
    console.log("inside router specific middleware")
    // get token from req headers
    const token = req.headers['access-token']
    try{
        // verify token
        const data=jwt.verify(token,'supersecretkey123')
        req.fromAcno = data.currentAcno
        console.log('valid token')
       
        next()
    }
    catch{
        console.log('invalid token')
        res.status(401).json({
            message:'Please Login!!'
        })
    }
  
}

// register api call resolving
server.post('/register',(req,res)=>{
    console.log("inside register funtion")
    console.log(req.body)
    dataService.register(req.body.acno,req.body.uname,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// login api call resolving
server.post('/login',(req,res)=>{
    console.log("inside login funtion")
    console.log(req.body)
    // asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//getBalance
server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log("inside getBalance api")
    console.log(req.params.acno)
    // asynchronus
    dataService.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//deposit
server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log("inside depsoit api")
    console.log(req.body)
    // asynchronus
    dataService.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//fundTransfer
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log("inside fundTransfer api")
    console.log(req.body)
    // asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
        // res.send('msg received')
        res.status(result.statusCode).json(result)
    })
})

//getALLTransactions
server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('inside getAllTransactions Api')
    dataService.getALLTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//delete-Account api
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log("inside delete-account api")
    console.log(req.params.acno)
    // asynchronus
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
