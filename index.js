import express from "express";
const app = express();
import { application } from "./firebaseConfig.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/assets", express.static(__dirname + "/assets"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = getAuth();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/",(req,res)=>{

})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/report", (req, res) => {
  const currentUser = auth.currentUser;
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email === "collector.jaipur@gmail.com") {
      res.sendFile(__dirname + "/views/collectorAdmin.html");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/received-section", (req, res) => {
  const currentUser = auth.currentUser;
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("employee")) {
      res.sendFile(__dirname + "/views/receivedSection.html");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/section-head", (req, res) => {
  const currentUser = auth.currentUser;
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("sectionhead@gmail.com")) {
      res.sendFile(__dirname + "/views/sectionHead.html");
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      switch (user.email) {
        case "collector.jaipur@gmail.com":
          res.redirect("/report");
        case "election.sectionhead@gmail.com":
          res.redirect("/section-head");
        default:
          res.redirect("/received-section");
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
