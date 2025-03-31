const ConversationSchema = require("../../models/adminModel/ConversationSchema");
const MessageSchema = require("../../models/adminModel/MessageSchema");
const UserSchema = require("../../models/adminModel/UserSchema");

const sendMessage = async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const { id: receiverId } = req.params;

    let conversation = await ConversationSchema.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = ConversationSchema.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new MessageSchema({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server error", error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { senderId } = req.body;

    const conversation = await ConversationSchema.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: conversation?.messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server error", error });
  }
};

const getConversations = async (req, res) => {
  try {
    const { loggedInUserId } = req.params;

    const filteredUsers = await UserSchema.find({
      _id: { $ne: loggedInUserId },
    }).select("name email image createdAt updatedAt");

    res.status(200).json({ success: true, data: filteredUsers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};
module.exports = {
  sendMessage,
  getMessages,
  getConversations,
};
