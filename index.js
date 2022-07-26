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
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
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

//Database collection functions -----------------------------------------
const collectionRef = collection(database, "DAKs");
const dakCountRef = collection(database, "DAK counts");
const section1 = collection(database, "section1");
const section2 = collection(database, "section2");
const section3 = collection(database, "section3");
const section4 = collection(database, "section4");
const section5 = collection(database, "section5");
const section6 = collection(database, "section6");
const section7 = collection(database, "section7");
const section8 = collection(database, "section8");
const section9 = collection(database, "section9");
const section10 = collection(database, "section10");
const section11 = collection(database, "section11");
const section12 = collection(database, "section12");
const section13 = collection(database, "section13");
const section14 = collection(database, "section14");
const section15 = collection(database, "section15");
const section16 = collection(database, "section16");
const section17 = collection(database, "section17");
const section18 = collection(database, "section18");
const section19 = collection(database, "section19");
const section20 = collection(database, "section20");
const section21 = collection(database, "section21");
const section22 = collection(database, "section22");
const section23 = collection(database, "section23");
const section24 = collection(database, "section24");
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
    section: 0,
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
          for(let i=0;i<temp2.length;i++){
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

let DAKcount;
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

app.post("/received-section-dakcount", (req, res) => {
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
  addDoc(dakCountRef, {
    Date: {
      month: months[date.getMonth()],
      date: date.getDate(),
      year: date.getFullYear(),
    },
    DakCount: DAKsReceived,
  })
    .then(() => {
      res.send("DAK counts Submitted!");
    })
    .catch((err) => {
      console.log(err.message);
      res.send("There was problem submitting the counts. Please try again!");
    });
});

let allDAKcount;
app.get("/section-head", (req, res) => {
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = months[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  let dateString = date+"/"+month+"/"+year;
  const currentUser = auth.currentUser;
  if (currentUser === null) res.redirect("/login");
  const email = currentUser.email;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(
        collection(database, "DAK counts"),
        where("Date.date", "==", date),
        where("Date.month", "==", month),
        where("Date.year", "==", year)
      );
      const querySnap = getDocs(q);
      querySnap
        .then((response) => {
          allDAKcount = response.docs.map((item) => {
            return item.data();
          });
          console.log(allDAKcount);
          let countArr = allDAKcount[0].DakCount;
          let q, querySnap;
          switch (email) {
            case "establishment.sectionhead@gmail.com":
              q = query(
                collection(database, "section1"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap
                .then((response) => {
                  let temp = response.docs.map((item) => {
                    return item.data();
                  });
                  let disposed;
                  if (temp.length === 0) disposed = 0;
                  else disposed = temp[0].disposed;
                  res.render("sectionHead", {
                    pendency: countArr[0],
                    date: dateString,
                    section: "section1",
                    disposed: disposed,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
              break;
            case "justice.sectionhead@gmail.com":
              q = query(
                collection(database, "section2"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap
                .then((response) => {
                  let temp = response.docs.map((item) => {
                    return item.data();
                  });
                  let disposedCount;
                  if (temp.length === 0) disposedCount = 0;
                  else {
                    disposedCount = temp[0].disposed;
                  }
                  res.render("sectionHead", {
                    pendency: countArr[1],
                    date: dateString,
                    section: "section2",
                    disposed: disposedCount,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
              break;
            case "revenue.sectionhead@gmail.com":
              q = query(
                collection(database, "section3"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap
                .then((response) => {
                  let temp = response.docs.map((item) => {
                    return item.data();
                  });
                  let disposed;
                  if (temp.length === 0) disposed = 0;
                  else disposed = temp[0].disposed;
                  res.render("sectionHead", {
                    pendency: countArr[2],
                    date: dateString,
                    section: "section3",
                    disposed: disposed,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
              break;
            case "assistance.sectionhead@gmail.com":
              q = query(
                collection(database, "section4"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap
                .then((response) => {
                  let temp = response.docs.map((item) => {
                    return item.data();
                  });
                  let disposed;
                  if (temp.length === 0) disposed = 0;
                  else disposed = temp[0].disposed;
                  res.render("sectionHead", {
                    pendency: countArr[3],
                    date: dateString,
                    section: "section4",
                    disposed: disposed,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
              break;
            case "panchayat.sectionhead@gmail.com":
              q = query(
                collection(database, "section5"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[4],
                  date: dateString,
                  section: "section5",
                  disposed: disposed,
                });
              });
              break;
            case "development.sectionhead@gmail.com":
              q = query(
                collection(database, "section6"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[5],
                  date: dateString,
                  section: "section6",
                  disposed: disposed,
                });
              });
              break;
            case "accounts.sectionhead@gmail.com":
              q = query(
                collection(database, "section7"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[6],
                  date: dateString,
                  section: "section7",
                  disposed: disposed,
                });
              });
              break;
            case "landrecords.sectionhead@gmail.com":
              q = query(
                collection(database, "section8"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[7],
                  date: dateString,
                  section: "section8",
                  disposed: disposed,
                });
              });
              break;
            case "singlewindow.sectionhead@gmail.com":
              q = query(
                collection(database, "section9"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[8],
                  date: dateString,
                  section: "section9",
                  disposed: disposed,
                });
              });
              break;
            case "stores.sectionhead@gmail.com":
              q = query(
                collection(database, "section10"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[9],
                  date: dateString,
                  section: "section10",
                  disposed: disposed,
                });
              });
              break;
            case "court.sectionhead@gmail.com":
              q = query(
                collection(database, "section11"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[10],
                  date: dateString,
                  section: "section11",
                  disposed: disposed,
                });
              });
              break;
            case "pdr.sectionhead@gmail.com":
              q = query(
                collection(database, "section12"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[11],
                  date: dateString,
                  section: "section12",
                  disposed: disposed,
                });
              });
              break;
            case "ira.sectionhead@gmail.com":
              q = query(
                collection(database, "section13"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[12],
                  date: dateString,
                  section: "section13",
                  disposed: disposed,
                });
              });
              break;
            case "vigilance.sectionhead@gmail.com":
              q = query(
                collection(database, "section14"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[13],
                  date: dateString,
                  section: "section14",
                  disposed: disposed,
                });
              });
              break;
            case "generaladministration.sectionhead@gmail.com":
              q = query(
                collection(database, "section15"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[14],
                  date: dateString,
                  section: "section15",
                  disposed: disposed,
                });
              });
              break;
            case "law.sectionhead@gmail.com":
              q = query(
                collection(database, "section16"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[15],
                  date: dateString,
                  section: "section16",
                  disposed: disposed,
                });
              });
              break;
            case "records.sectionhead@gmail.com":
              q = query(
                collection(database, "section17"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[16],
                  date: dateString,
                  section: "section17",
                  disposed: disposed,
                });
              });
              break;
            case "estates.sectionhead@gmail.com":
              q = query(
                collection(database, "section18"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[17],
                  date: dateString,
                  section: "section18",
                  disposed: disposed,
                });
              });
              break;
            case "dra.sectionhead@gmail.com":
              q = query(
                collection(database, "section19"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[18],
                  date: dateString,
                  section: "section19",
                  disposed: disposed,
                });
              });
              break;
            case "elections.sectionhead@gmail.com":
              q = query(
                collection(database, "section20"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[19],
                  date: dateString,
                  section: "section20",
                  disposed: disposed,
                });
              });
              break;
            case "letterdispatch.sectionhead@gmail.com":
              q = query(
                collection(database, "section21"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[20],
                  date: dateString,
                  section: "section21",
                  disposed: disposed,
                });
              });
              break;
            case "cbsection.sectionhead@gmail.com":
              q = query(
                collection(database, "section22"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[21],
                  date: dateString,
                  section: "section22",
                  disposed: disposed,
                });
              });
              break;
            case "publicgrievances.sectionhead@gmail.com":
              q = query(
                collection(database, "section23"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[22],
                  date: dateString,
                  section: "section23",
                  disposed: disposed,
                });
              });
              break;
            case "loans.sectionhead@gmail.com":
              q = query(
                collection(database, "section24"),
                where("Date.date", "==", date),
                where("Date.month", "==", month),
                where("Date.year", "==", year)
              );
              querySnap = getDocs(q);
              querySnap.then((response) => {
                let temp = response.docs.map((item) => {
                  return item.data();
                });
                let disposed;
                if (temp.length === 0) disposed = 0;
                else disposed = temp[0].disposed;
                res.render("sectionHead", {
                  pendency: countArr[23],
                  date: dateString,
                  section: "section24",
                  disposed: disposed,
                });
              });
              break;

            default:
              res.render("login");
              break;
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      res.render("login");
    }
  });
});

app.post("/section-head", (req, res) => {
  const disposed = {
    section: req.body.section,
    disposed: req.body.disposed,
  };
  let sectionCollection;
  switch (disposed.section) {
    case "section1":
      sectionCollection = section1;
      break;
    case "section2":
      sectionCollection = section2;
      break;
    case "section3":
      sectionCollection = section3;
      break;
    case "section4":
      sectionCollection = section4;
      break;
    case "section5":
      sectionCollection = section5;
      break;
    case "section6":
      sectionCollection = section6;
      break;
    case "section7":
      sectionCollection = section7;
      break;
    case "section8":
      sectionCollection = section8;
      break;
    case "section9":
      sectionCollection = section9;
      break;
    case "section10":
      sectionCollection = section10;
      break;
    case "section11":
      sectionCollection = section11;
      break;
    case "section12":
      sectionCollection = section12;
      break;
    case "section13":
      sectionCollection = section13;
      break;
    case "section14":
      sectionCollection = section14;
      break;
    case "section15":
      sectionCollection = section15;
      break;
    case "section16":
      sectionCollection = section16;
      break;
    case "section17":
      sectionCollection = section17;
      break;
    case "section18":
      sectionCollection = section18;
      break;
    case "section19":
      sectionCollection = section19;
      break;
    case "section20":
      sectionCollection = section20;
      break;
    case "section21":
      sectionCollection = section21;
      break;
    case "section22":
      sectionCollection = section22;
      break;
    case "section23":
      sectionCollection = section23;
      break;
    case "section24":
      sectionCollection = section24;
      break;

    default:
      break;
  }
  let date = new Date();
  addDoc(sectionCollection, {
    Date: {
      month: months[date.getMonth()],
      date: date.getDate(),
      year: date.getFullYear(),
    },
    disposed: parseInt(disposed.disposed),
  })
    .then(() => {
      res.send("Disposed count submitted successfully!");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

app.post("/received-section-daks", (req, res) => {
  const logs = { dakID: req.body.dakID, section: req.body.section };
  for (let i = 0; i < logs.dakID.length; i++) {
    const docToUpdate = doc(database, "DAKs", logs.dakID[i]);
    updateDoc(docToUpdate, {
      section: logs.section[i],
    })
      .then(() => {
        res.send("DAKs segregated!");
      })
      .catch((err) => {
        res.send(err.message);
      });
  }
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