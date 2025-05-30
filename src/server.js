const dotenv = require("./config/dotenv");
const connectDB = require("./config/database");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const {
  joinInAppChat,
  saveInAppMessage,
  fetchInAppMessages,
  disconnectUser,
} = require("./controllers/ChatController/userChatController");

dotenv();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;
const users = {}; 

io.on("connection", (socket) => {
  socket.on(
    "join-in-app-chat",
    async ({ receiverId, userId, chat_type }, callback) => {
      console.log("User connected to in app chat id : ", socket.id);
      const chat = await joinInAppChat({
        id: socket.id,
        userId,
        chat_type,
        receiverId,
      });
      // console.log(chat, chat?._id, ' <=== I am chat in response of join...')
      socket.join(chat?._id?.toString());
      callback(chat);
    }
  );

  socket.on(
    "sendMessage-in-app-chat",
    async ({ message, senderId, receiverId }, callback) => {
      console.log(
        message,
        senderId,
        receiverId,
        " <=== sender and receiver iddd....."
      );
      const chat = await saveInAppMessage(
        socket.id,
        senderId,
        receiverId,
        message
      );
      if (!chat) {
        callback();
        return;
      }
      io.to(chat?._id?.toString()).emit(
        "allMessages-in-app",
        await fetchInAppMessages(senderId)
      );

      callback();
    }
  );

  socket.on("fetch-all-in-app-messages", async ({ userId }, callback) => {
    console.log("heelo there");
    callback(await fetchInAppMessages(userId));
  });

  socket.on("join", async ({ alarmId, memberId }, callback) => {
    console.log("User connected to group : ", socket.id);
    const { error, user, chat, members } = await addUser({
      id: socket.id,
      alarmId,
      memberId,
    });

    if (error) return callback({ error: error });

    socket.join(user.alarmId);
    // io.to(user.alarmId).emit('loadChat', chat)
    io.to(user.alarmId).emit("message", {
      name: "admin",
      message: `${user.name} has joined the group.`,
    });

    io.to(user.alarmId).emit("memberUpdated", members);

    callback(chat);
  });

  socket.on("disconnect", async () => {
    console.log(
      "disconnected user with id ",
      socket.id,
      " <==== user disconnected..."
    );
    const disconnectedUser = await disconnectUser(socket.id);
    if (disconnectedUser) {
      io.emit("userDisconnected", disconnectedUser);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
