const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Event = require("../models/event");
const cors = require("cors");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const razorpay  = new Razorpay({
key_id:"rzp_live_UdoyiWq2qD8o7V",
key_secret:"ZFvYDFgobDC2bJ5KvYaBJg7x"
});
router.use(cors());

router.post("/razorpay", async (req, res) => {
  const {eventId} = req.body;//"643d86c88e98d85320fdc9f9";//
  const {persons}=req.body;
  const payment_capture = 1;
  const currency = "INR";
  console.log("eventid",eventId);

  //eventId="643d86c88e98d85320fdc9f9";
  try {
    // Fetch the amount from the database
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }
    const amount = event.Charges * persons;

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});




router.post("/bookevent", async (req, res) => {
  const { event, user, Date ,persons, TotalAmount ,transactionid} = req.body;

  try {
    const newbooking = new Booking({
      event: event.name,
      eventid: event._id,
      userid: user,
      Date: event.Date,
      persons,
      TotalAmount,
      transactionid: transactionid,
    });

    const savedBooking = await newbooking.save();

    console.log("starting");
    if (event && event._id) {
      const foundEvent = await Event.findOne({ _id: event._id });
      foundEvent.currentbookings.push({
        bookingid: savedBooking._id,
        Date,
        userid: user,
        status: savedBooking.status,
      });
      await foundEvent.save();
      res.send("Event Booked Successfully");
    } else {
      res.status(400).json({ message: "Event not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }

  
});

router.post('/getbookingsbyuserid',async(req,res)=>{
const userid=req.body.userid

try{
const bookings=await Booking.find({userid:userid})
res.send(bookings);
}catch(error){
  return res.status(400).json({error});
}
})


router.get('/getallbookings',async(req,res)=>{
  console.log('reached getallbookings')
  try{
    const bookings=await Booking.find();
    res.send(bookings)
  }
  catch(error){
    return res.status(400).json({error});
  }
})

router.post('/cancelbooking',async(req,res)=>{
  const{bookingid,eventid}=req.body
  try{
    const bookingitem=await Booking.findOne({_id:bookingid})
    bookingitem.status='cancelled'
    await bookingitem.save();

    const event=await Event.findOne({_id:eventid})
    const bookings=event.currentbookings;

    const temp=bookings.filter(booking=>booking.bookingid.toString()!=bookingid)
    event.currentbookings=temp;
    await event.save();
    res.send("Your booking cancelled sucessfully");

  }catch(error){
    return res.status(400).json({error});
  }
})


module.exports = router;
