const express =require('express')
const cors=require('cors')
const mysql=require('mysql2')
const app=express();
app.use(cors());
app.use(express.json());

 const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Likhi@222',
    database:'todo'
 })

 db.connect((err)=>{
    if(err){
console.log("err connecting to database");
    return;
    }
    console.log("Connected with database");
   
 })

 
 
 app.get('/',(req,res)=>{
    console.log('Default Route');
    db.query('select * from todoItems',(err,result)=>{
        if(err){
        console.log("error occured",err);
    return;
    }
    console.log("Data:", result);
    res.send(result);
    })
})
app.post('/add-item',(req,res)=>{
    console.log(req.body);
    
    db.query(`INSERT INTO todoItems (itemDescription) VALUES ('${req.body.text}')`,(err,result)=>{
if(err){
        console.log("error occured",err);
    return;
    }
    console.log("Created Successfully");


    })
    
res.send("Added Successfully");
})


app.put('/edit-item',(req,res)=>{
    console.log('Line 54:',req.body);
     db.query(`update todoitems set itemDescription="${req.body.itemDescription}" where ID=${req.body.ID};`,(err,result)=>{
if(err){
        console.log("error occured",err);
    return;
    }
    console.log("Created Successfully");
     })
     res.send("Updated Successfully");
})



app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})


