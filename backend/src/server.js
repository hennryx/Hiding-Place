const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const routes = require("./routes");
const { startCronJobs, stopCronJobs } = require("./config/cron");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const http = require("http"); // Add for Socket.io
const { Server } = require("socket.io"); // Add Socket.io

const { connectDB, mongoose } = require("./config/db");
const ProductSchema = require("./models/Products/ProductSchema");

connectDB()
  .then(() => {
    startCronJobs();

    const server = http.createServer(app); // Wrap app for Socket.io
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Socket.io connection handling
    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId; // Passed from frontend
      if (userId) {
        socket.join(userId); // Join user-specific room
        console.log(`User ${userId} connected`);
      }

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
      });
    });

    // Make io available globally or via req (for controllers/schemas)
    app.set("io", io); // Access via req.app.get('io')

    const corsConfig = {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: [
        "Origin",
        "Content-Type",
        "X-Requested-With",
        "Accept",
        "Authorization",
      ],
    };

    app.use(cors(corsConfig));

    app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      })
    );

    app.use(
      express.urlencoded({
        extended: true,
        limit: "50mb",
      })
    );

    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use("/assets", express.static(path.join(__dirname, "assets")));

    app.get("/api/health", (req, res) => {
      res.status(200).json({ success: true });
    });

    app.use("/", routes);

    const port = process.env.PORT;
    server.listen(port, () => {
      // Use server instead of app
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const gracefulShutdown = async () => {
  console.log("🛑 Server shutting down...");

  // Stop scheduled tasks
  stopCronJobs();

  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");

  // Exit the process
  process.exit();
};

/* when server shuts down or restarts to prevent multiple instances or lingering timers from running */
process.on("SIGINT", gracefulShutdown); // local dev: Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Render platform
