import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./routes/auth";
import validateToken from "./routes/validate-token";
import admin from "./routes/admin";

dotenv.config();

const app = express();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.cf9qw.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const configDb = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(uri, configDb)
  .then(() => console.log("Connected database"))
  .catch((e) => console.log("error db", e));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/user", auth);
app.use("/api/admin", validateToken, admin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server listen", PORT);
});
