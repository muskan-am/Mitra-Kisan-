const express = require("express");
require("dotenv").config();
// const db = require("./db/connection");
const cors = require('cors');
const multer = require("multer");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser")
const PORT = 5000;


app.use(express.json());
app.use(cors());


app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Chat endpoint - MUST be before other /api routes
app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing backend Google API key. Set GOOGLE_API_KEY in Backend/.env." });
    }

    const { contents } = req.body;
    if (!contents) {
      return res.status(400).json({ error: "Missing contents in request body." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(url, { contents }, { headers: { "Content-Type": "application/json" } });
    return res.json(response.data);
  } catch (error) {
    console.error("Chat proxy error:", error?.response?.data || error.message || error);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: error.message || "Chat request failed." });
  }
});

const diseaseRoutes = require("./routes/diseaseRoutes");
const cropRoutes = require("./routes/cropPredictionRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const pricePredictionRoutes = require("./routes/pricePrediction");
// const paymentRoute = require("./routes/paymentRoute")

app.use("/api", diseaseRoutes);
app.use("/api", cropRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/crops", pricePredictionRoutes);

// app.use("/api/payment", paymentRoute)

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
