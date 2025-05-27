const dotenv = require("./config/dotenv");
const connectDB = require("./config/database");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const ChatSchema = require("./models/adminModel/ChatSchema");

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
  console.log("Socket connected:", socket.id);

  // 🔐 Register user
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new ChatSchema({
        conversationId: data.conversationId,
        senderId: data.senderId,
        message: data.message,
        status: "sending",
      });

      const savedMessage = await newMessage.save();

      socket.emit("message_status", {
        _id: savedMessage._id,
        status: "sending",
      });

      setTimeout(async () => {
        const updatedMessage = await ChatSchema.findByIdAndUpdate(
          savedMessage._id,
          { status: "sent" },
          { new: true }
        );

        if (updatedMessage) {
          io.to(data.receiverSocketId).emit("new_message", updatedMessage);
          socket.emit("message_status", {
            _id: updatedMessage._id,
            status: "sent",
          });
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("call_user", async ({ from, to }) => {
    try {
      const roomRes = await axios.post(
        "https://api.videosdk.live/v2/rooms",
        {},
        {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhYzlmNDkxYS1mYzUzLTRhOTEtYTJjYy04MGM5NjRkNTQxMmEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NzM3NjQ2MywiZXhwIjoxOTA1MTY0NDYzfQ.UN2Vw4v3PEhMCXIkgrVsJMi8HB5au9MbyUdyMLpCncI",
            "Content-Type": "application/json",
          },
        }
      );

      const roomId = roomRes.data.roomId;
      const targetSocket = users[to];

      if (targetSocket) {
        io.to(targetSocket).emit("incoming_call", {
          from,
          roomId,
        });
      } else {
        console.log("User to call not connected");
      }
    } catch (err) {
      console.error("Error creating room:", err.message);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
