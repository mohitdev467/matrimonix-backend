const axios = require("axios");
const PaymentHistory = require("../../models/adminModel/PaymentHistory.js");
const { generateRandomId } = require("../../utils/commonUtils.js");
const UserSchema = require("../../models/adminModel/UserSchema.js");
const PackageSchema = require("../../models/adminModel/PackageSchema.js");
const dotenv = require("../../config/dotenv.js");


dotenv();


const baseUrl = process.env.CASHFREE_BASE_URL;
const app_id =process.env.CASHFREE_API_KEY
const secrect_key = process.env.CASHFREE_SECRET_KEY


// Create new payment order
exports.createNewOrder = async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    bookingObjectId,
    bookingId,
    customer_uid,
    amount,
    customer_id,
  } = req.body;

  
  try {
    const customerDetails = {
      customer_id:
        customer_id || bookingObjectId || (await generateRandomId()).toString(),
      customer_email: customer_email,
      customer_phone: customer_phone,
      customer_name: customer_name,
    };


    const orderId =
      (customer_id || bookingId || "ORID665456") +
      (await generateRandomId()).toString();

    const response = await axios.post(
      baseUrl,
      {
        customer_details: customerDetails,
        order_meta: {
          // notify_url: "https://webhook.site/ec276d81-5a64-4639-9dd6-2bfc777ea19b",
          notify_url: "https://rishtaa.online/api/v1/payment/verify-payment",
          payment_methods: "cc,dc,upi", 
        },
        order_amount: parseInt(amount) || 1,
        // order_amount:1,
        order_id: orderId,
        order_currency: "INR",
        order_note: "This is my first Order",
      },
      {
        headers: {
          Accept: "application/json",
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
          "x-client-id": app_id,
          "x-client-secret": secrect_key,
        },
      }
    );


    await PaymentHistory.create({
      userId: customer_id || null,
      orderId: response.data.order_id,
      sessionId: response.data.payment_session_id,
      paymentStatus: response?.data?.order_status,
      amount: parseFloat(amount),
    });
    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Error in creating order:",error.response?.data || error.message);
    return res.status(error.response?.status || 500).send({
      message: error.response?.data?.message || error.message,
      success: false,
    });
  }
};


exports.checkPaymentStatus = async (req, res) => {
  const orderid = req.params.orderid;
  console.log("Checking payment status for order ID:", orderid);

  try {
    const response = await axios.get(`${baseUrl}/${orderid}`, {
      headers: {
        Accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": app_id,
        "x-client-secret": secrect_key,
      },
    });

    console.log("Payment status response:", response.data);

    const data = response.data;
    const orderAmount = parseFloat(data.order_amount);
    const customerId = data?.customer_details?.customer_id;

    const user = await UserSchema.findById(customerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pkg = await PackageSchema.findOne({ price: orderAmount });
    if (!pkg) {
      return res.status(404).json({ message: "Package not found for the given amount" });
    }

    let internalStatus;
    let userMessage;

    switch (data.order_status) {
      case "PAID":
        internalStatus = "SUCCESS";
        userMessage = "Payment completed successfully.";
        break;
      case "ACTIVE":
        internalStatus = "PENDING";
        userMessage = "Payment is initiated but not yet completed.";
        break;
      case "EXPIRED":
        internalStatus = "FAILED";
        userMessage = "Order has expired. Please try again.";
        break;
      default:
        internalStatus = "UNKNOWN";
        userMessage = "Unknown payment status received.";
    }

    // Save or update payment record
    const paymentRecord = await PaymentHistory.findOneAndUpdate(
      { orderId: data.order_id },
      {
        customer: user?._id || null,
        orderId: data.order_id,
        sessionId: data.payment_session_id || null,
        paymentStatus: internalStatus,
        amount: orderAmount || null,
        timestamp: new Date(),
      },
      { new: true, upsert: true }
    ).populate("customer").populate("packages");


    if (internalStatus === "SUCCESS") {
      const membershipDuration = pkg?.durationInDays || 30; 
      user.membershipStatus = "active";
      user.membershipDays = membershipDuration;
      await user.save();

      const successUrl = `https://rishtaa.online/api/v1/success?order_status=${data.order_status}&order_id=${data.order_id}`;
      return res.status(200).json({ data: paymentRecord, message: userMessage, successUrl });
    } else {
      return res.status(400).json({ data: paymentRecord, message: userMessage });
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
      success: false,
    });
  }
};


exports.getAllPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      const isAmount = !isNaN(search);

      query.$or = [
        { status: { $regex: searchRegex } },
        ...(isAmount ? [{ amount: parseFloat(search) }] : []),
      ];
    }

    const payments = await PaymentHistory.find(query)
      .populate("customer")
      .populate("packages")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await PaymentHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
};



exports.deletePaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;


    const deletedHistory = await PaymentHistory.findByIdAndDelete(id);

    if (!deletedHistory) {
      return res.status(404).json({
        success: false,
        message: "Payment history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment history deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payment history",
    });
  }
};



exports.deleteUserPaymentHistory = async (req, res) => {
  try {
    const { userId, paymentId } = req.params;

    const paymentHistory = await PaymentHistory.findOne({
      _id: paymentId,
      customer: userId, 
    });

    if (!paymentHistory) {
      return res.status(404).json({
        success: false,
        message: "Payment history not found for this user",
      });
    }

    await PaymentHistory.findByIdAndDelete(paymentId);

    res.status(200).json({
      success: true,
      message: "Payment history deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payment history",
    });
  }
};

