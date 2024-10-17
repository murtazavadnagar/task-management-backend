// Import required modules
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan"); // HTTP request logger
const cors = require("cors"); // Cross-Origin Resource Sharing
const rateLimit = require("express-rate-limit"); // For rate limiting
// const session = require("express-session");
// const RedisStore = require("connect-redis").default;

const errorHandler = require("./middlewares/errorHandler"); // Global error handler
const { redisClient } = require("./services/cache");

// Initialize express app
const app = express();

// Middleware for security headers
app.use(helmet());

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS
const whitelist = ["http://localhost:3000", "http://localhost:3001"]; // add domains in the list to allow cors
const corsOptions = {
  origin: function (origin, callback) {
    // !origin for rest tools like postman, hoppscotch and etc
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback();
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

// Request logger
app.use(morgan("dev"));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3, // Limit each IP to 3 requests per windowMs'
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "You have exceeded the 3 requests limit in 1 minute!",
  statusCode: 429, // 429 status code is by default

  // windowMs: 15 * 60 * 1000, // 15 minutes
  // max: 100, // Limit each IP to 100 requests per windowMs
  // // Use skip method to skip apis if required
  // skip: (req, res) => {
  //   console.log("req", req.path);
  //   if (req.path.includes("api/v1/tasks")) {
  //     return true;
  //   }
  // },
  // // handler function is triggered after limit is reached
  // handler: (req, res, next) => {
  //   // console.log("use this function to run custom logic once limit is reached");
  //   res.status(500).send("Too many requests, please try again later."); // this will overwrite statusCode and message
  // },
});
app.use(limiter);

// Routes
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Global error handling middleware
app.use(errorHandler);

// Redis Client
const client = redisClient();
global.redisClient = client;
// app.use(
//   session({
//     store: new RedisStore({ client: client }),
//     secret: process.env.SESSION_SECRET || "supersecretkey",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // only set cookies over https
//       httpOnly: true,
//       maxAge: 1000 * 60 * 2, // Session expires after 30 minutes
//     },
//   })
// );

// Export app to be used in entry point file
module.exports = app;
