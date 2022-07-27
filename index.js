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
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
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

const sections = [
  "Establishment",
  "Justice",
  "Revenue",
  "Assistance",
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
const Assistance = collection(database, "Assistance");
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

const sectionDatabases = [
  Establishment,
  Justice,
  Revenue,
  Assistance,
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
  res.render("index");
  return;
});

//LOGIN SECTION

app.get("/login", (req, res) => {
  res.render("login");
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
      } else if (user.email.includes("sectionhead")) {
        res.redirect("/section-head");
      } else {
        res.redirect("/received-section");
      }
    })
    .catch((error) => {
      res.send("Please check your login credentials!");
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
  if (currentUser === null) res.redirect("/login");
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user && email.includes("employee")) {
      res.render("receivedSection", { date: displayDate });
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/received-section", (req, res) => {
  let date = new Date();
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
      pendency: 0,
    })
      .then(() => {
        res.send(
          "DAK counts submitted successfully! <a href='/received-section'>Go Back</a>"
        );
      })
      .catch((err) => {
        res.send(err.message);
      });
  }
});

//SECTION HEAD SECTION

app.get("/section-head", (req, res) => {
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let dateString = date + "/" + month + "/" + year;
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
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
                    received: sectionInfo[0].Received,
                    disposed: sectionInfo[0].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[0].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[0],
                    date: dateString,
                    received: sectionInfo[0].Received,
                    disposed: sectionInfo[0].disposed,
                    oldPendency: prevSectionInfo[0].pendency,
                    sessionID: sectionInfo[0].id3
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
                    received: sectionInfo[1].Received,
                    disposed: sectionInfo[1].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[1].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[1],
                    date: dateString,
                    received: sectionInfo[1].Received,
                    disposed: sectionInfo[1].disposed,
                    oldPendency: prevSectionInfo[2].pendency,
                    sessionID: sectionInfo[1].id,
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
                    received: sectionInfo[2].Received,
                    disposed: sectionInfo[2].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[2].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[2],
                    date: dateString,
                    received: sectionInfo[2].Received,
                    disposed: sectionInfo[2].disposed,
                    oldPendency: prevSectionInfo[2].pendency,
                    sessionID: sectionInfo[2].id,
                  });
                }
              });
            })
            .catch((err) => {
              res.send(err.message);
            });
          break;
        case "assistance.sectionhead@gmail.com":
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
                    received: sectionInfo[3].Received,
                    disposed: sectionInfo[3].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[3].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[3],
                    date: dateString,
                    received: sectionInfo[3].Received,
                    disposed: sectionInfo[3].disposed,
                    oldPendency: prevSectionInfo[3].pendency,
                    sessionID: sectionInfo[3].id4
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
                    received: sectionInfo[4].Received,
                    disposed: sectionInfo[4].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[4].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[4],
                    date: dateString,
                    received: sectionInfo[4].Received,
                    disposed: sectionInfo[4].disposed,
                    oldPendency: prevSectionInfo[4].pendency,
                    sessionID: sectionInfo[4].id,
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
                    received: sectionInfo[5].Received,
                    disposed: sectionInfo[5].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[5].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[5],
                    date: dateString,
                    received: sectionInfo[5].Received,
                    disposed: sectionInfo[5].disposed,
                    oldPendency: prevSectionInfo[5].pendency,
                    sessionID: sectionInfo[5].id6
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
                    received: sectionInfo[6].Received,
                    disposed: sectionInfo[6].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[6].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[6],
                    date: dateString,
                    received: sectionInfo[6].Received,
                    disposed: sectionInfo[6].disposed,
                    oldPendency: prevSectionInfo[6].pendency,
                    sessionID: sectionInfo[6].id7
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
                    received: sectionInfo[7].Received,
                    disposed: sectionInfo[7].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[7].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[7],
                    date: dateString,
                    received: sectionInfo[7].Received,
                    disposed: sectionInfo[7].disposed,
                    oldPendency: prevSectionInfo[7].pendency,
                    sessionID: sectionInfo[7].id8
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
                    received: sectionInfo[8].Received,
                    disposed: sectionInfo[8].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[8].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[8],
                    date: dateString,
                    received: sectionInfo[8].Received,
                    disposed: sectionInfo[8].disposed,
                    oldPendency: prevSectionInfo[8].pendency,
                    sessionID: sectionInfo[8].id,
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
                    received: sectionInfo[9].Received,
                    disposed: sectionInfo[9].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[9].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[9],
                    date: dateString,
                    received: sectionInfo[9].Received,
                    disposed: sectionInfo[9].disposed,
                    oldPendency: prevSectionInfo[9].pendency,
                    sessionID: sectionInfo[9].id,
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
                    received: sectionInfo[10].Received,
                    disposed: sectionInfo[10].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[10].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[10],
                    date: dateString,
                    received: sectionInfo[10].Received,
                    disposed: sectionInfo[10].disposed,
                    oldPendency: prevSectionInfo[10].pendency,
                    sessionID: sectionInfo[10].id11
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
                    received: sectionInfo[11].Received,
                    disposed: sectionInfo[11].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[11].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[11],
                    date: dateString,
                    received: sectionInfo[11].Received,
                    disposed: sectionInfo[11].disposed,
                    oldPendency: prevSectionInfo[11].pendency,
                    sessionID: sectionInfo[11].id12
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
                    received: sectionInfo[12].Received,
                    disposed: sectionInfo[12].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[12].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[12],
                    date: dateString,
                    received: sectionInfo[12].Received,
                    disposed: sectionInfo[12].disposed,
                    oldPendency: prevSectionInfo[12].pendency,
                    sessionID: sectionInfo[12].id13
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
                    received: sectionInfo[13].Received,
                    disposed: sectionInfo[13].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[13].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[13],
                    date: dateString,
                    received: sectionInfo[13].Received,
                    disposed: sectionInfo[13].disposed,
                    oldPendency: prevSectionInfo[13].pendency,
                    sessionID: sectionInfo[13].id14
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
                    received: sectionInfo[14].Received,
                    disposed: sectionInfo[14].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[14].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[14],
                    date: dateString,
                    received: sectionInfo[14].Received,
                    disposed: sectionInfo[14].disposed,
                    oldPendency: prevSectionInfo[14].pendency,
                    sessionID: sectionInfo[14].id15
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
                    received: sectionInfo[15].Received,
                    disposed: sectionInfo[15].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[15].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[15],
                    date: dateString,
                    received: sectionInfo[15].Received,
                    disposed: sectionInfo[15].disposed,
                    oldPendency: prevSectionInfo[15].pendency,
                    sessionID: sectionInfo[15].id16
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
                    received: sectionInfo[16].Received,
                    disposed: sectionInfo[16].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[16].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[16],
                    date: dateString,
                    received: sectionInfo[16].Received,
                    disposed: sectionInfo[16].disposed,
                    oldPendency: prevSectionInfo[16].pendency,
                    sessionID: sectionInfo[16].id,
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
                    received: sectionInfo[17].Received,
                    disposed: sectionInfo[17].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[17].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[17],
                    date: dateString,
                    received: sectionInfo[17].Received,
                    disposed: sectionInfo[17].disposed,
                    oldPendency: prevSectionInfo[17].pendency,
                    sessionID: sectionInfo[17].id18
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
                    received: sectionInfo[18].Received,
                    disposed: sectionInfo[18].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[18].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[18],
                    date: dateString,
                    received: sectionInfo[18].Received,
                    disposed: sectionInfo[18].disposed,
                    oldPendency: prevSectionInfo[18].pendency,
                    sessionID: sectionInfo[18].id19
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
                    received: sectionInfo[19].Received,
                    disposed: sectionInfo[19].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[19].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[19],
                    date: dateString,
                    received: sectionInfo[19].Received,
                    disposed: sectionInfo[19].disposed,
                    oldPendency: prevSectionInfo[19].pendency,
                    sessionID: sectionInfo[19].id,
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
                    received: sectionInfo[20].Received,
                    disposed: sectionInfo[20].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[20].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[20],
                    date: dateString,
                    received: sectionInfo[20].Received,
                    disposed: sectionInfo[20].disposed,
                    oldPendency: prevSectionInfo[20].pendency,
                    sessionID: sectionInfo[20].id222
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
              q = query(
                sectionDatabases[222],
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
                    section: sections[222],
                    date: dateString,
                    received: sectionInfo[222].Received,
                    disposed: sectionInfo[222].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[222].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[222],
                    date: dateString,
                    received: sectionInfo[222].Received,
                    disposed: sectionInfo[222].disposed,
                    oldPendency: prevSectionInfo[222].pendency,
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
                    received: sectionInfo[22].Received,
                    disposed: sectionInfo[22].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[22].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[22],
                    date: dateString,
                    received: sectionInfo[22].Received,
                    disposed: sectionInfo[22].disposed,
                    oldPendency: prevSectionInfo[22].pendency,
                    sessionID: sectionInfo[22].id23
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
                    received: sectionInfo[23].Received,
                    disposed: sectionInfo[23].disposed,
                    oldPendency: 0,
                    sessionID: sectionInfo[23].id,
                  });
                } else {
                  res.render("sectionHead", {
                    section: sections[23],
                    date: dateString,
                    received: sectionInfo[23].Received,
                    disposed: sectionInfo[23].disposed,
                    oldPendency: prevSectionInfo[23].pendency,
                    sessionID: sectionInfo[23].id,
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

app.post("/section-head", (req, res) => {
  const disposed = {
    sessionID: req.body.sessionID,
    section: req.body.section,
    disposed: parseInt(req.body.disposed),
  };
  let docSnap;
  let docRef = doc(database,disposed.section,disposed.sessionID);
  getDoc(docRef)
  .then((response)=>{
    docSnap = response.data();
    if(docSnap.disposed === 0){
      updateDoc(docRef,{
        disposed: disposed.disposed,
        pendency: docSnap.Received - disposed.disposed
      })
      res.send("Disposed count updated! <a href='/section-head'>Go Back</a>")
    }
    else{
      res.send("Sorry today's disposed is already recorded! Try again tomorrow. <a href='/section-head'>Go Back</a>")
    }
  })
});

//COLLECTOR SECTION

app.get("/report", (req, res) => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  date = day + "/" + month + "/" + year;
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
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

app.post("/daily-report", (req, res) => {
  const section = req.body.section;
  let dateObj = new Date(req.body.datepicker);
  let day = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let date = day + "/" + month + "/" + year;
  let q = query(
    collection(database, "section" + section),
    where("Date.date", "==", day),
    where("Date.month", "==", month),
    where("Date.year", "==", year)
  );
  let querySnap = getDocs(q);
  let temp = [];
  querySnap
    .then((response) => {
      temp = response.docs.map((item) => {
        return item.data();
      });
      console.log(temp);
      let received;
      let temp2;
      q = query(
        collection(database, "DAK counts"),
        where("Date.date", "==", day),
        where("Date.month", "==", month),
        where("Date.year", "==", year)
      );
      querySnap = getDocs(q);
      querySnap
        .then((response) => {
          temp2 = response.docs.map((item) => {
            return item.data();
          });
          received = temp2[0].DakCount[section - 1];
          res.render("DailyReport", {
            date: date,
            disposed: temp[0].disposed,
            received: received,
            section: section,
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/monthly-report", (req, res) => {
  const month = req.body.month;
  const year = parseInt(req.body.year);
  const section = req.body.section;
  let q = query(
    collection(database, "DAK counts"),
    where("Date.month", "==", month),
    where("Date.year", "==", year)
  );
  let querySnap = getDocs(q);
  let temp = [];
  querySnap
    .then((response) => {
      temp = response.docs.map((item) => {
        return item.data();
      });
      let received = 0;
      for (let i = 0; i < temp.length; i++) {
        received += temp[i].DakCount[section - 1];
      }
      console.log(received);
      q = query(
        collection(database, "section" + section),
        where("Date.month", "==", month),
        where("Date.year", "==", year)
      );
      querySnap = getDocs(q);
      let temp2;
      querySnap
        .then((response) => {
          temp2 = response.docs.map((item) => {
            return item.data();
          });
          let disposed = 0;
          for (let i = 0; i < temp2.length; i++) {
            disposed += temp2[i].disposed;
          }
          res.render("MonthlyReport", {
            month: month,
            year: year,
            section: section,
            received: received,
            disposed: disposed,
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch((err) => {
      console.log(err.message);
    });
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
