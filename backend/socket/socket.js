import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const UsersMap = {};

export const getSocketId = (id) => {
  return UsersMap[id];
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  const userId = socket.handshake.query.userId;
  UsersMap[userId] = socket.id;

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete UsersMap[userId];
  });
});

export { io, server, app };
