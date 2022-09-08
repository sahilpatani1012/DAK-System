//Imports --------------------------------------------------------
import 'dotenv/config'
import express, { response } from "express";
const app = express();
import { application, database } from "./firebaseConfig.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import ejs from "ejs";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { fileURLToPath } from "url";
import { dirname } from "path";
import flash from "connect-flash";
import session from "express-session";
import { async } from "@firebase/util";

//Necessary inclusions ---------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//For ejs rendering, static files and body parsing -----------------------
app.use("/assets", express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

//Firebase auth function ----------------------------------------------
const auth = getAuth();
//Month Array
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

//Section names array --------------------------------------------------
const sections = [
  "Establishment",
  "Justice",
  "Revenue",
  "Relief",
  "Panchayat",
  "Development",
  "Accounts",
  "Land Records",
  "Single Window",
  "Stores",
  "Court",
  "PDR",
  "IRA",
  "Vigilance",
  "General Administration",
  "Law",
  "Records",
  "Estates",
  "DRA",
  "Elections",
  "Letter Dispatch",
  "CB Section",
  "Public Grievances",
  "Loans",
];

//Database collection functions -----------------------------------------

const Establishment = collection(database, "Establishment");
const Justice = collection(database, "Justice");
const Revenue = collection(database, "Revenue");
const Relief = collection(database, "Relief");
const Panchayat = collection(database, "Panchayat");
const Development = collection(database, "Development");
const Accounts = collection(database, "Accounts");
const Land_Records = collection(database, "Land Records");
const Single_Window = collection(database, "Single Window");
const Stores = collection(database, "Stores");
const Court = collection(database, "Court");
const PDR = collection(database, "PDR");
const IRA = collection(database, "IRA");
const Vigilance = collection(database, "Vigilance");
const General_Administration = collection(database, "General Administration");
const Law = collection(database, "Law");
const Records = collection(database, "Records");
const Estates = collection(database, "Estates");
const DRA = collection(database, "DRA");
const Elections = collection(database, "Elections");
const Letter_Dispatch = collection(database, "Letter Dispatch");
const CB_Section = collection(database, "CB Section");
const Public_Grievances = collection(database, "Public Grievances");
const Loans = collection(database, "Loans");

//Section Database reference array ------------------------------------------
const sectionDatabases = [
  Establishment,
  Justice,
  Revenue,
  Relief,
  Panchayat,
  Development,
  Accounts,
  Land_Records,
  Single_Window,
  Stores,
  Court,
  PDR,
  IRA,
  Vigilance,
  General_Administration,
  Law,
  Records,
  Estates,
  DRA,
  Elections,
  Letter_Dispatch,
  CB_Section,
  Public_Grievances,
  Loans,
];

//Routes --------------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/login");
  return;
});

//LOGIN SECTION

app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
  return;
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.email.includes("collector")) {
        res.redirect("/report");
      } else if (user.email.includes("received")) {
        res.redirect("/received-section");
      } else {
        res.redirect("/section-head");
      }
    })
    .catch((error) => {
      req.flash("message", "Invalid login credentials!");
      res.redirect("/login");
    });
});

//RECEIVED SECTION

app.get("/received-section", (req, res) => {
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let displayDate = date + " " + month + " " + year;
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    res.redirect("/login");
    return;
  }
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("received")) {
      res.render("receivedSection", {
        date: displayDate,
        message: req.flash("message"),
      });
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/received-section", async (req, res) => {
  let date = new Date();

  let q = query(
    collection(database, "Establishment"),
    where("DateStamp.date", "==", date.getDate()),
    where("DateStamp.month", "==", months[date.getMonth()]),
    where("DateStamp.year", "==", date.getFullYear())
  );

  let temp = [];
  let querySnap = await getDocs(q);
  querySnap.forEach((docSnap) => {
    temp.push(docSnap);
  });
  if (temp.length !== 0) {
    req.flash("message", "Today's DAK count already submitted!");
    res.redirect("/received-section");
    return;
  }

  const DAKsReceived = [
    parseInt(req.body.section1DakCount),
    parseInt(req.body.section2DakCount),
    parseInt(req.body.section3DakCount),
    parseInt(req.body.section4DakCount),
    parseInt(req.body.section5DakCount),
    parseInt(req.body.section6DakCount),
    parseInt(req.body.section7DakCount),
    parseInt(req.body.section8DakCount),
    parseInt(req.body.section9DakCount),
    parseInt(req.body.section10DakCount),
    parseInt(req.body.section11DakCount),
    parseInt(req.body.section12DakCount),
    parseInt(req.body.section13DakCount),
    parseInt(req.body.section14DakCount),
    parseInt(req.body.section15DakCount),
    parseInt(req.body.section16DakCount),
    parseInt(req.body.section17DakCount),
    parseInt(req.body.section18DakCount),
    parseInt(req.body.section19DakCount),
    parseInt(req.body.section20DakCount),
    parseInt(req.body.section21DakCount),
    parseInt(req.body.section22DakCount),
    parseInt(req.body.section23DakCount),
    parseInt(req.body.section24DakCount),
  ];
  for (let i = 0; i < sectionDatabases.length; i++) {
    addDoc(sectionDatabases[i], {
      DateStamp: {
        month: months[date.getMonth()],
        date: date.getDate(),
        year: date.getFullYear(),
      },
      Received: DAKsReceived[i],
      disposed: 0,
      pendency: DAKsReceived[i],
    })
  }
  res.redirect("/received-section");
});

//SECTION HEAD SECTION

app.get("/section-head", async (req, res) => {
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let dateString = date + "/" + month + "/" + year;
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    res.redirect("/login");
    return;
  }
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      let q, querySnap, sectionInfo, prevSectionInfo;
      switch (email) {
        case "establishment.sectionhead@gmail.com":
          q = query(
            sectionDatabases[0],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[0],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[0],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[0],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "justice.sectionhead@gmail.com":
          q = query(
            sectionDatabases[1],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[1],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[1],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[1],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "revenue.sectionhead@gmail.com":
          q = query(
            sectionDatabases[2],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[2],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[2],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[2],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "relief.sectionhead@gmail.com":
          q = query(
            sectionDatabases[3],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[3],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[3],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[3],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "panchayat.sectionhead@gmail.com":
          q = query(
            sectionDatabases[4],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[4],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[4],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[4],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "development.sectionhead@gmail.com":
          q = query(
            sectionDatabases[5],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[5],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[5],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[5],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "accounts.sectionhead@gmail.com":
          q = query(
            sectionDatabases[6],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[6],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[6],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[6],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "landrecords.sectionhead@gmail.com":
          q = query(
            sectionDatabases[7],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[7],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[7],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[7],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "singlewindow.sectionhead@gmail.com":
          q = query(
            sectionDatabases[8],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[8],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[8],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[8],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "stores.sectionhead@gmail.com":
          q = query(
            sectionDatabases[9],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[9],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[9],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[9],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "court.sectionhead@gmail.com":
          q = query(
            sectionDatabases[10],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[10],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[10],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[10],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "pdr.sectionhead@gmail.com":
          q = query(
            sectionDatabases[11],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[11],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[11],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[11],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "ira.sectionhead@gmail.com":
          q = query(
            sectionDatabases[12],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[12],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[12],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[12],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "vigilance.sectionhead@gmail.com":
          q = query(
            sectionDatabases[13],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[13],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[13],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[13],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "generaladministration.sectionhead@gmail.com":
          q = query(
            sectionDatabases[14],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[14],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[14],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[14],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "law.sectionhead@gmail.com":
          q = query(
            sectionDatabases[15],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[15],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[15],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[15],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "records.sectionhead@gmail.com":
          q = query(
            sectionDatabases[16],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[16],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[16],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[16],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "estates.sectionhead@gmail.com":
          q = query(
            sectionDatabases[17],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[17],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[17],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[17],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "dra.sectionhead@gmail.com":
          q = query(
            sectionDatabases[18],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[18],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[18],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[18],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "elections.sectionhead@gmail.com":
          q = query(
            sectionDatabases[19],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[19],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[19],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[19],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "letterdispatch.sectionhead@gmail.com":
          q = query(
            sectionDatabases[20],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[20],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[20],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[20],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "cbsection.sectionhead@gmail.com":
          q = query(
            sectionDatabases[21],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[21],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[21],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[21],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "publicgrievances.sectionhead@gmail.com":
          q = query(
            sectionDatabases[22],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[22],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[22],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[22],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "loans.sectionhead@gmail.com":
          q = query(
            sectionDatabases[23],
            where("DateStamp.date", "==", date),
            where("DateStamp.month", "==", month),
            where("DateStamp.year", "==", year)
          );
          querySnap = getDocs(q);
          querySnap
            .then((response) => {
              sectionInfo = response.docs.map((item) => {
                return { ...item.data(), id: item.id };
              });
              let received;
              let disposed;
              let id;
              if (sectionInfo[0] === undefined) {
                received = 0;
                disposed = 0;
                id = "null";
              } else {
                received = sectionInfo[0].Received;
                disposed = sectionInfo[0].disposed;
                id = sectionInfo[0].id;
              }
              q = query(
                sectionDatabases[23],
                where("DateStamp.date", "==", date - 1),
                where("DateStamp.month", "==", month),
                where("DateStamp.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                prevSectionInfo = response.docs.map((item) => {
                  return { ...item.data(), id: item.id };
                });
                if (prevSectionInfo.length === 0) {
                  res.render("sectionHead", {
                    section: sections[23],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: 0,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[23],
                    date: dateString,
                    received: received,
                    disposed: disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: id,
                    message: req.flash("message"),
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        default:
          break;
      }
    } else {
      res.render("login");
    }
  });
});

app.post("/section-head", async (req, res) => {
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  const disposed = {
    sessionID: req.body.sessionID,
    section: req.body.section,
    disposed: parseInt(req.body.disposed),
  };
  let docSnap;
  let prevDocSnap;
  let q = query(
    collection(database, disposed.section),
    where("DateStamp.date", "==", date - 1),
    where("DateStamp.month", "==", month),
    where("DateStamp.year", "==", year)
  );
  let querySnap = await getDocs(q);
  querySnap.forEach((prevDoc) => {
    prevDocSnap = prevDoc.data();
  });
  let oldPendency;
  if (prevDocSnap === undefined) oldPendency = 0;
  else oldPendency = prevDocSnap.pendency;
  let docRef = doc(database, disposed.section, disposed.sessionID);
  getDoc(docRef).then((response) => {
    docSnap = response.data();
    if (docSnap.Received + oldPendency < disposed.disposed) {
      req.flash(
        "message",
        "Disposed count is invalid. Please enter a valid disposed count!"
      );
      res.redirect("/section-head");
      return;
    }
    if (docSnap.disposed === 0) {
      updateDoc(docRef, {
        disposed: disposed.disposed,
        pendency: oldPendency + docSnap.Received - disposed.disposed,
      });
      req.flash("message", "Disposed count submitted");
      res.redirect("/section-head");
      return;
    } else {
      req.flash(
        "message",
        "Today's disposed count already submitted! Try again tomorrow."
      );
      res.redirect("/section-head");
      return;
    }
  });
});

//COLLECTOR SECTION

app.get("/report", (req, res) => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  date = day + "/" + month + "/" + year;
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    res.redirect("/login");
    return;
  }
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email === "collector.jaipur@gmail.com") {
      res.render("collectorAdmin", { date: date });
    } else {
      res.redirect("/login");
    }
  });
  return;
});

app.post("/daily-report", async (req, res) => {
  const section = req.body.section;
  let dateObj = new Date(req.body.datepicker);
  let day = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let dateString = day + "/" + month + "/" + year;

  let allSection = [];

  if (section === "All") {
    for (let i = 0; i < sections.length; i++) {
      let queryAll = query(
        collection(database, sections[i]),
        where("DateStamp.date", "==", day),
        where("DateStamp.month", "==", month),
        where("DateStamp.year", "==", year)
      );
      let querySnap = await getDocs(queryAll);
      querySnap.forEach((docFile) => {
        allSection.push(docFile.data());
      });
    }
    let tempall = [];
    for (let i = 0; i < sections.length; i++) {
      let efficiency = Math.round(
        (allSection[i].disposed / allSection[i].Received) * 100
      );
      allSection[i] = {
        ...allSection[i],
        efficiency: efficiency,
        section: sections[i],
      };
      tempall.push(allSection[i]);
    }
    tempall.sort((a, b) => parseInt(b.efficiency) - parseInt(a.efficiency));
    res.render("DailyReportAll", { allSection: tempall, date: dateString });
  } else {
    let q = query(
      collection(database, section),
      where("DateStamp.date", "==", day),
      where("DateStamp.month", "==", month),
      where("DateStamp.year", "==", year)
    );
    let querySnap = getDocs(q);
    let docSnap;
    querySnap
      .then((response) => {
        docSnap = response.docs.map((item) => {
          return item.data();
        });
        let efficiency = Math.round(
          (docSnap[0].disposed / docSnap[0].Received) * 100
        );
        res.render("DailyReport", {
          date: dateString,
          section: section,
          received: docSnap[0].Received,
          disposed: docSnap[0].disposed,
          efficiency: efficiency,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

app.post("/monthly-report", async (req, res) => {
  const monthFetched = req.body.month;
  const yearFetched = parseInt(req.body.year);
  const section = req.body.section;

  let allSection = [];

  if (section === "All") {
    for (let i = 0; i < sections.length; i++) {
      let queryAll = query(
        collection(database, sections[i]),
        where("DateStamp.month", "==", monthFetched),
        where("DateStamp.year", "==", yearFetched)
      );
      let querySnap = await getDocs(queryAll);
      let tempObj = {};
      let received = 0;
      let disposed = 0;
      let month, year;
      querySnap.forEach((docFile) => {
        let data = docFile.data();
        received += data.Received;
        disposed += data.disposed;
        month = data.DateStamp.month;
        year = data.DateStamp.year;
      });
      let efficiency = Math.round((disposed / received) * 100);
      tempObj = {
        section: sections[i],
        disposed: disposed,
        DateStamp: { month: month, year: year },
        received: received,
        efficiency: efficiency,
      };
      allSection.push(tempObj);
    }
    allSection.sort((a, b) => parseInt(b.efficiency) - parseInt(a.efficiency));
    res.render("MonthlyReportAll", { allSection: allSection });
  } else {
    let q = query(
      collection(database, section),
      where("DateStamp.month", "==", monthFetched),
      where("DateStamp.year", "==", yearFetched)
    );
    let querySnap = getDocs(q);
    let docSnap;
    querySnap
      .then((response) => {
        docSnap = response.docs.map((item) => {
          return item.data();
        });
        let received = 0;
        let disposed = 0;
        for (let i = 0; i < docSnap.length; i++) {
          received += docSnap[i].Received;
          disposed += docSnap[i].disposed;
        }
        let efficiency = Math.round((disposed / received) * 100);
        res.render("MonthlyReport", {
          month: monthFetched,
          year: yearFetched,
          section: section,
          received: received,
          disposed: disposed,
          efficiency: efficiency,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

//LOGOUT SECTION

app.get("/logout", (req, res) => {
  signOut(auth)
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      res.send(error.message);
    });
  return;
});
let port = 80;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
