const cors = require("cors");
const allowedOrigins = ["http://localhost:3001"]; // Replace with your frontend URL

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE"],
};

module.exports = cors(corsOptions);