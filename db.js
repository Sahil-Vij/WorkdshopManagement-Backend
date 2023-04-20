const mongoose=require('mongoose');

var mongoURL='mongodb+srv://CIY-USER1:3uFFeyeZD9Xdp3D@cluster0.pynyfqo.mongodb.net/CIY-Events';

mongoose.connect(mongoURL,{useUnifiedTopology:true , useNewUrlParser:true})

var connection = mongoose.connection;

connection.on('error',()=>{
    console.log('Mongodb connection failed');
})

connection.on('connected',()=>{
    console.log('Mongodb connected succesfully')
})

module.exports=mongoose;