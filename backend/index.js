import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import planRouter from "./router/plan.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());


const PORT = process.env.PORT;

const dbURI = process.env.MONGODB_URL; 
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.log("MongoDB connection error:", err));


app.use("/plan", planRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
