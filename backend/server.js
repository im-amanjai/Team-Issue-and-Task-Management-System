require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

connectDB();

const PORT = process.env.PORT || 5000;

// create HTTP server from express
const server = http.createServer(app);

// initialize socket.io
initSocket(server);

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
