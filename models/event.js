const mongoose=require('mongoose')

const eventSchema=({
    name:{
        type: String,
        required: true
    },
    SeatAvailability:{
        type:Number,
        required: true
    },
    PhoneNumber:{
        type:Number,
        required:false
    },
    Charges:{
        type:Number,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    Timings:{
        type:String,
        required:true
    },
    imageurls:[],
    currentbookings:[],
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },   
}
)

const eventModel=mongoose.model('event',eventSchema);
module.exports=eventModel;