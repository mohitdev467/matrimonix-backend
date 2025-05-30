const ChatSchema = require("../../models/adminModel/ChatSchema");
const UserSchema = require("../../models/adminModel/UserSchema");

const joinInAppChat = async ({ id, userId, receiverId, chat_type }) => {
  try {
    let chat = await ChatSchema.findOne({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });

    if (!chat) {
      chat = await ChatSchema.create({
        senderId: userId,
        receiverId,
        senderSocketId: id,
        chat_type: chat_type,
        messages: [],
      });
    }

    chat.senderSocketId =
      chat.senderId.toString() === userId ? chat.senderSocketId : id;
    chat.receiverSocketId =
      chat.senderId.toString() !== userId ? chat.receiverSocketId : id;

    await chat.save();

    return chat;
  } catch (error) {
    console.error("Error joining in-app chat:", error);
    return false;
  }
};

const saveInAppMessage = async (id, userId, receiverId, message) => {
  try {
    let chat = await ChatSchema.findOne({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });

    if (!chat) {
      chat = await ChatSchema.create({
        senderId: userId,
        receiverId,
        senderSocketId: id,
        messages: [],
      });
    }

    chat.senderSocketId =
      chat.senderId.toString() === userId ? chat.senderSocketId : id;
    chat.receiverSocketId =
      chat.senderId.toString() !== userId ? chat.receiverSocketId : id;

    chat.messages.push({
      message,
      dateTime: new Date(),
      socketId: id,
      userId,
    });

    await chat.save();

    // Fetch sender and receiver details
    const sender = await UserSchema.findById(userId);
    const receiver = await UserSchema.findById(receiverId);

    // Construct push notification message
    const pushMessage = `${sender.username} sent you a message`;
    console.log("pushMessage", pushMessage);
    // Send push notification
    if (receiver && receiver.notificaionExpoToken) {
      let ttk = [];
      const tok = receiver.notificaionExpoToken;
      ttk.push(tok);
      // await expoSendPushNotification(ttk, pushMessage);
    }

    return chat;
  } catch (error) {
    console.error("Error saving in-app message:", error);
    return false;
  }
};

const fetchInAppMessages = async (userId) => {
  try {
    console.log("inside fetchInAppMessages");
    var chat = await ChatSchema.find(
      {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
      {},
      { sort: { updatedAt: -1 } }
    )
      .populate("senderId")
      .populate("receiverId")
      .exec();

    return chat;
  } catch (error) {
    console.error("Error fetching in-app messages:", error);
    return false;
  }
};

const disconnectUser = async (id) => {
  try {
    let user = await ChatSchema.findOne({ socketId: id });

    if (user) {
      user.status = "offline";
      await user.save();

      return { user: user.toJSON() };
    }

    return false;
  } catch (error) {
    console.error("Error disconnecting user:", error);
    return false;
  }
};

module.exports = {
  joinInAppChat,
  saveInAppMessage,
  fetchInAppMessages,
  disconnectUser,
};