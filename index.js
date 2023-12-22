const express = require('express');
const Razorpay = require('razorpay');
const connectToMongo = require('./db');
const cors = require('cors');
const app = express();
const path = require("path");
// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const updateRoomAvailabilityTask = require('./roomAvail');
const port = process.env.PORT || 5000;
connectToMongo();
updateRoomAvailabilityTask();
const instance = new Razorpay({
    key_id: 'rzp_test_RYkL6ztNu2mGqo',
    key_secret: 'UrUu5X3O6cOEjNOL07Yxdrt5',
  });


app.use("/api/auth", require("./routes/auth"));
app.use("/api/hotel", require("./routes/hotel"));
app.use("/api/room", require("./routes/room"));
app.use("/api/book", require("./routes/booking"));
app.use("/api/addon", require("./routes/addon"));

app.use("/api", require("./routes/paymentRoutes"));

app.use(express.static("./frontend/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
});

app.listen(port, () => {
    console.log(`App is listening at ${port}`);
})

module.exports = instance;