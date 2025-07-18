const axios = require("axios");
const PaymentHistory = require("../../models/adminModel/PaymentHistory.js");
const UserSchema = require("../../models/adminModel/UserSchema.js");
const PackageSchema = require("../../models/adminModel/PackageSchema.js");
const dotenv = require("../../config/dotenv.js");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
dotenv();


const baseUrl = process.env.CASHFREE_BASE_URL;
const app_id = process.env.CASHFREE_API_KEY
const secrect_key = process.env.CASHFREE_SECRET_KEY

const cashfree = new Cashfree(CFEnvironment.SANDBOX, app_id, secrect_key);

 exports.createNewOrder = async(req,res) =>  {
  const { customer_name, customer_email, customer_phone, amount, customer_id } = req.body;
  const request = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer_id,
      customer_name:customer_name,
      customer_email:customer_email,
      customer_phone: customer_phone
    },
    order_meta: {
      return_url: "https://rishtaa.online?order_id={order_id}",
    },
  };
  try {
    const response = await cashfree.PGCreateOrder(request);
    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Order creation failed:", error.response.data);
    throw error;
  }
}
exports.checkPaymentStatus = async (req, res) => {
  const orderid = req.params.orderid;
  try {
    const response = await axios.get(`${baseUrl}/${orderid}`, {
      headers: {
        Accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": app_id,
        "x-client-secret": secrect_key,
      },
    });
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
}