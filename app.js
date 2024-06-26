const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const {blogmodel}=require("./models/blog")
const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://sandravijumon:sandra2001@cluster0.g6coklg.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")
// for hashing password,is an asynchronous function
const generateHashedPassword =async(password)=>{
const salt=await bcrypt.genSalt(10)
return bcrypt.hash(password,salt)
}
// to call an asychronous function we have to change the synchronous to asychronous function
app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
// password is upadted with hashed password
    input.password=hashedPassword
    let blog=new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})

app.post("/signin",(req,res)=>{
    let input=req.body
    blogmodel.find({"email":req.body.email}).then((response)=>{
      if (response.length>0) {
        let dbPassword = response[0].password
        console.log(dbPassword)
        bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
            if (isMatch) {
                jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({status:"unable to create tocken"})
                        } else {
                            res.json({status:"Success","userid":response[0]._id,"token":token})
                        }
                
                })
                
                                    } else {
                                        res.json({status:"incorect"})
                                    }
                                })
                            } else {
                                res.json({status:"not exist"})
                            }
                        }
                    ).catch() .catch()
})

app.post("/viewers",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"blog-app",(error,decoded)=>{
        if(decoded)
            {
                blogmodel.find().then(
                    (response)=>{
                        res.json(res)
                    }
                )
            }
    })
})

app.listen(8081,()=>{
    console.log("Server started")
})