const db=require('./db')
// import jsonwebtoken
const jwt = require('jsonwebtoken')

const register=(acno,uname,pswd)=>{
    console.log("inside register function")

    return db.User.findOne({
        acno
    }).then((result)=>{
        console.log(result)
        if(result){

            return{
                statusCode:401,
                message:'Acount Already exist'
            }
        }
        else{
            // to add new user
            const newUser=new db.User({
                username:uname,
                acno,
                password:pswd,
                balance:0,
                transaction:[]
            })

            // to save new user in mongodb use save()
            newUser.save()
            return{
                statusCode:200,
                message:'registration successfully'
            }

        }
    })

}

// login
const login=(acno,pswd)=>{
    console.log('inside login function body')
    // check acno,pswd in mongodb
    return db.User.findOne({
        acno,
        password:pswd
    }).then((result)=>{
        console.log(result)
        if(result){
            // generate token
            const token = jwt.sign({
                currentAcno:acno
            },'supersecretkey123')
        
            return{
                statusCode:200,
                message:'login successful',
                username:result.username,
                currentAcno:acno,
                token
            }
        }
        else{
            return{
                statusCode:404,
                message:'inavalid account number or password',
               
            }

        }
    })
}

// getBalance
const getBalance =(acno)=>{
    return db.User.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                return {
                    statusCode:200,
                    balance:result.balance,
                    

                }
            }
            else{
                return {
                    statusCode:404,
                    message:'inavalid account'
                }
            }
        }
    )
}

const deposit =(acno,amt)=>{
    let amount=Number(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            //acno is present in db
            result.balance +=amount
            result.transaction.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            //to update in mongo db
            result.save()
            return{
                statusCode:200,
                message:`${amount} Successfully deposited`
            }
        }
        else{
            return{
                statusCode:404,
                message:'inavalid account'
            }
        }
    })
}


//////////////////

const fundTransfer=(req,toAcno,pswd,amt)=>{
    let amount= Number(amt)
    let fromAcno = req.fromAcno
    return db.User.findOne({

        acno:fromAcno,
        password:pswd
    }).then(result=>{
        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:"Message Denied"
            }
        }
      
        if(result){
            //debit account details
            let fromAcnoBalance= result.balance
            if(fromAcnoBalance>=amount){
                result.balance=fromAcnoBalance-amount
                //credit account details
                return db.User.findOne({
                    acno:toAcno
                }).then(creditdata=>{
                    if(creditdata){
                        creditdata.balance += amount
                        creditdata.transaction.push({
                            type:"CREDIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        creditdata.save()
                        console.log(creditdata)
                        result.transaction.push({
                            type:"DEBIT",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save()
                        console.log(result)
                        return{
                            statusCode:200,
                            message:"Amount Transfer Successfully"
                        }

                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Invalid credit Account number"
                        }
                    }
                })
            }
            else{
                return{
                    statusCode:403,
                    message:"Insufficient Balance"
                }
            }

        }
        else{
            return{
                statusCode:401,
                message:"Invalid Debit Account number / Password"
            }
        }
    })
}
//getALLTransactions
const getALLTransactions=(req)=>{
    let acno=req.fromAcno
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:"invalid Account number"
            }
        }
    })
}
// deleteMyAccount

const deleteMyAccount=(acno)=>{
    return db.User.deleteOne({
        acno
    })
    .then((result)=>{
        if(result){
            return{
                statusCode:200,
                message:"Account deleted successfully"
            }
        }
        else{
            return{
                statusCode:401,
                message:"Invalid Account"
            }
        }
    })
}


module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getALLTransactions,
    deleteMyAccount
}