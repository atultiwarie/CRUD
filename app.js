require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000
const User = require('./models/users')
const path = require('path')
connectDB()

app.set('view engine',"ejs")
app.set('views',path.join(__dirname,'views'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/',async (req,res)=>{
    const users= await User.find()
    res.render('index' ,{users})
})

app.post('/create',async (req,res)=>{
    const {name , username,email}= req.body
    await User.create({name,username,email})
    res.redirect('/')
})



app.get('/update/:id', async (req,res)=>{
    const user = await User.findById(req.params.id);
    res.render('edit',{user})  
})

app.post('/update/:id', async(req,res)=>{
    const {name,username,email} = req.body
    await User.findByIdAndUpdate(req.params.id,{name,username,email})
    res.redirect('/')
})

app.get('/delete/:id',async(req,res)=>{
    const users = await User.findOneAndDelete({_id:req.params.id})
    res.redirect('/')
})



app.listen(PORT ,()=>{
     console.log(`Server is running on port : http://localhost:${PORT}`)
})