import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { server, app } from "./socket/socket.js";

import UserRoute from "./routes/UserRoute.js";
import MessageRoute from "./routes/MessageRoute.js";

const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/users", UserRoute);
app.use("/api/messages", MessageRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log("connected to db and listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
