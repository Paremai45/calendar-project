import express from "express";
import bodyParser from 'body-parser';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

// InitialApp
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initial Firebase
const firebaseConfig = {
  databaseURL: "https://calendar-88c48-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// Endpoints
app.get("/login", (req, res) => {
  (async () => {
    try {
      get(ref(database, 'members'))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return res.status(200).json({
              code: 200,
              message: 'Success',
              result: snapshot.val()
            })
          } else {
            return res.status(200).json({
              code: 200,
              message: 'Success',
              result: null
            })
          }
        }).catch((error) => {
          return res.status(500).json({
            code: 500,
            message: error.message
          })
        })
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error.message
      })
    }
  })()
});

app.post("/register", (req, res) => {
  res.send("สมัครสมาชิกสำเร็จ")
});

// Initialzed port
app.listen(port, () => {
  console.log("Starting Member micro service " + port);
});