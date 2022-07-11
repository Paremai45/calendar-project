import express from "express";
import bodyParser from 'body-parser';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
import nodemailer from 'nodemailer';

// InitialApp
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initial Firebase
const firebaseConfig = {
  databaseURL: "https://calendar-88c48-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// Endpoints
app.post("/login", (req, res) => {
  (async () => {
    let request = req.body
    let reqUsername = request.username
    let reqPassword = request.password
    console.log("request", request)
    try {
      get(ref(database, 'users/' + reqUsername))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let value = snapshot.val()
            let hashPassword = value.password
            if (hashPassword == reqPassword) {
              return res.status(200).json({
                code: 200,
                message: 'success',
                result: {
                  email: value.email,
                  firstname: value.firstname,
                  lastname: value.lastname,
                  mobileNo: value.mobileNo
                }
              })
            } else {
              return res.status(200).json({
                code: 200,
                message: 'passwordIncorrect',
                result: null
              })
            }
          } else {
            return res.status(200).json({
              code: 200,
              message: 'notexisting',
              result: null
            })
          }
        }).catch((error) => {
          return res.status(500).json({
            code: 500,
            message: error.message,
            result: null
          })
        })
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
});

app.post("/register", (req, res) => {
  (async () => {
    let request = req.body
    let data = request.data
    console.log("request", request)
    try {
      get(ref(database, 'users/' + request.username))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return res.status(200).json({
              code: 200,
              message: 'existing',
              result: null
            })
          } else {
            set(ref(database, 'users/' + request.username), {
              email: data.email,
              firstname: data.firstname,
              lastname: data.lastname,
              password: data.password,
              mobileNo: data.mobileNo
            })
            return res.status(200).json({
              code: 200,
              message: "success",
              result: null
            })
          }
        }).catch((error) => {
          return res.status(500).json({
            code: 500,
            message: error.message,
            result: null
          })
        })
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
});

app.post("/forgetPassword", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'calendarserviceapp@gmail.com',
          pass: 'hbsfnyactjjeonri'
        }
      });

      var mailOptions = {
        from: 'calendarserviceapp@gmail.com',
        to: 'phitchaporn.saw@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(200).json({
            code: 200,
            message: error.message,
            result: null
          })
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        }
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

// Initialzed port
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`server running on port ${process.env.PORT}`)
})