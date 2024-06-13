const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")

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

app.listen(8080,()=>{
    console.log("Server started")
})