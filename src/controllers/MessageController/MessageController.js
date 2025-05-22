const ChatSchema = require("../../models/adminModel/ChatSchema");
const ConversationSchema = require("../../models/adminModel/ConversationSchema");

const getAllConversations = async (req, res) => {
  try {
    const conversations = await ConversationSchema.find({
      participants: req.params.userId,
    });
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createConversation = async (req, res) => {
  try {
    const { participants } = req.body;
    const newConversation = new ConversationSchema({ participants });
    await newConversation.save();
    res.status(201).json({ success: true, data: newConversation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await ChatSchema.find({
      conversationId: req.params.conversationId,
    });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = new ChatSchema({ conversationId, senderId, message });
    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllConversations,
  createConversation,
  getAllMessages,
  sendMessages,
};
