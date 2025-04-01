const dotenv = require("./config/dotenv");
const connectDB = require("./config/database");
const app = require("./app");

dotenv();
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
