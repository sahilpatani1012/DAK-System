import express from "express";
const app = express();
import { firebaseAuth } from "./firebaseConfig.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/report", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      switch (user.email) {
        case "collector.jaipur@gmail.com":
          res.send("Hello Collector!");
        default:
          res.send("Hello random employee");
      }
    })
    .catch((error) => {
      res.send("Please check your login credentials!");
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

app.listen(3000, () => {
  console.log("Server is started at port 3000");
});
