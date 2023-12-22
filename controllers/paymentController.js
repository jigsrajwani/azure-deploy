const Razorpay = require('razorpay');
const crypto = require("crypto");

const instance = new Razorpay({
    key_id: 'rzp_test_RYkL6ztNu2mGqo',
    key_secret: 'UrUu5X3O6cOEjNOL07Yxdrt5',
});

const checkout = async (req, res) => {
    // console.log("running");
    const options = {
        amount: Number(req.body.totalPrice * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
};

const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", "UrUu5X3O6cOEjNOL07Yxdrt5")
        .update(body.toString())
        .digest("hex");
    console.log(expectedSignature);
    console.log(razorpay_signature);
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
        // Database comes here

        //   await Payment.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        //   });

        res.redirect(
            `https://celeninnbookingsite.uc.r.appspot.com/paymentsuccess?reference=${razorpay_payment_id}`
        );
        
    } else {
        res.status(400).json({
            success: false,
        });
    }
};


module.exports = {
    checkout,
    paymentVerification,
};