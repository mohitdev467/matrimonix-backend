const dotenv = require("./config/dotenv");
const connectDB = require("./config/database");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const ChatSchema = require("./models/adminModel/ChatSchema");

dotenv();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (For testing)
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5001;

io.on("connection", (socket) => {
  socket.on("send_message", async (data) => {
    try {
      const newMessage = new ChatSchema({
        conversationId: data.conversationId,
        senderId: data.senderId,
        message: data.message,
        status: "sending",
      });

      const savedMessage = await newMessage.save();

      // Emit the "sending" status back to sender
      socket.emit("message_status", {
        _id: savedMessage._id,
        status: "sending",
      });

      // Step 2: After 1 second, update to "sent"
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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
