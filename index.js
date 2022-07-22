//Imports --------------------------------------------------------
import express from "express";
const app = express();
import { application, database } from "./firebaseConfig.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import ejs from "ejs";
import { collection, addDoc, getDoc, getDocs } from "firebase/firestore";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Necessary inclusions ---------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//For ejs rendering, static files and body parsing -----------------------
app.use("/assets", express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Firebase auth function ----------------------------------------------
const auth = getAuth();

//Database collection functions -----------------------------------------
const collectionRef = collection(database, "DAKs");
const dakCountRef = collection(database, "DAK counts");
let DAKs = [];

//Routes --------------------------------------------------------
app.get("/", (req, res) => {
  res.render("index");
  return;
});

app.post("/", (req, res) => {
  const subject = req.body.dakSubject;
  const body = req.body.dakBody;
  addDoc(collectionRef, {
    DAK_Subject: subject,
    DAK_Body: body,
  })
    .then(() => {
      res.send("Your document was submitted!");
    })
    .catch((err) => {
      console.log(err.message);
      res.send(
        "There was a problem submitting your document. Please try again!"
      );
    });
  return;
});

app.get("/login", (req, res) => {
  res.render("login");
  return;
});

app.get("/report", (req, res) => {
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email === "collector.jaipur@gmail.com") {
      res.render("collectorAdmin");
    } else {
      res.redirect("/login");
    }
  });
  return;
});

let DAKcount;
app.get("/received-section", (req, res) => {
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("employee")) {
      res.render("receivedSection");
    } else {
      res.redirect("/login");
    }
  });

  getDocs(collectionRef)
    .then((res) => {
      DAKcount = res.docs.length;
      DAKs = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
  return;
});

app.post("/received-section-dakcount", (req, res) => {
  let date = new Date();
  const DAKsReceived = [
    req.body.section1DakCount,
    req.body.section2DakCount,
    req.body.section3DakCount,
    req.body.section4DakCount,
    req.body.section5DakCount,
    req.body.section6DakCount,
    req.body.section7DakCount,
    req.body.section8DakCount,
    req.body.section9DakCount,
    req.body.section10DakCount,
    req.body.section11DakCount,
    req.body.section12DakCount,
    req.body.section13DakCount,
    req.body.section14DakCount,
    req.body.section15DakCount,
    req.body.section16DakCount,
    req.body.section17DakCount,
    req.body.section18DakCount,
    req.body.section19DakCount,
    req.body.section20DakCount,
    req.body.section21DakCount,
    req.body.section22DakCount,
    req.body.section23DakCount,
    req.body.section24DakCount,
  ];
  addDoc(dakCountRef, {
    Date: date,
    DakCount: DAKsReceived,
  })
    .then(() => {
      res.send("DAK counts Submitted!");
    })
    .catch((err) => {
      console.log(err.message);
      res.send(
        "There was problem submitting the counts. Please try again!"
      );
    });
});

app.get("/section-head", (req, res) => {
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("sectionhead@gmail.com")) {
      res.render("sectionHead");
    } else {
      res.redirect("/login");
    }
  });
  return;
});

app.post("/received-section", (req, res) => {
  res.render("dakView", { dakList: DAKs, count: DAKcount });
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
      return;
    })
    .catch((error) => {
      res.send("Please check your login credentials!");
      const errorCode = error.code;
      const errorMessage = error.message;
      return;
    });
  return;
});

app.get("/logout", (req, res) => {
  signOut(auth)
    .then(() => {
      res.send("You have been successfully signed out!");
    })
    .catch((error) => {
      res.send(error.message);
    });
  return;
});

app.listen(3000, () => {
  console.log("Server is started at port 3000");
});
