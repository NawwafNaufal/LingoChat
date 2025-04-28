import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session"
import passport from "passport";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import passwordReplace from "./routes/password.route.js"
import messageRoutes from "./routes/message.route.js";
import googleRoute from "./routes/google.route.js"
import facebokkRoute from "./routes/facebook.route.js"
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
      secure : false,
      httpOnly : true,
      maxAge : 1000 * 60
  }
}))

const PORT = process.env.PORT;
const __dirname = path.resolve();



app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/passwordAuth", passwordReplace);
app.use("/api/messages", messageRoutes);
app.use("/",googleRoute)
app.use("/",facebokkRoute)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
