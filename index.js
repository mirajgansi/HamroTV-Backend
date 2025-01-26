const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const sequelize=require('./database/db');
const testRoute =require('./route/testRoute')

const app=express();

const PORT=process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("WELCOME TO THE PAGE")
})

app.get('/notice',(req,res)=>{
    res.send("Thi is notice")
})

app.get('./test',testRoute);

//running on PORT
app.listen(PORT,()=>{
    console.log(`server Running on ...................PORT ${PORT}`)
})