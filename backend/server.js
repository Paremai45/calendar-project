import express from "express";
import bodyParser from 'body-parser';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
import nodemailer from 'nodemailer';
import admin from 'firebase-admin'
import { createRequire } from "module"
import { Base64 } from "js-base64";

// InitialApp
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initial Firebase
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://calendar-88c48-default-rtdb.asia-southeast1.firebasedatabase.app",
};
admin.initializeApp(firebaseConfig)
// const firebase = initializeApp(firebaseConfig);
const database = admin.database()

// Endpoints
app.post("/login", (req, res) => {
  (async () => {
    let request = req.body
    let reqEmail = request.email
    let reqPassword = request.password
    console.log("request", request)
    try {
      const convertEmail = reqEmail.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          let value = snapshot.val()
          let hashPassword = value.password
          if (hashPassword == reqPassword) {
            console.log("login success")
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
            console.log("password incorrect")
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
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
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
      const convertEmail = data.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      console.log(convertEmail)
      child.get().then((snapshot) => {
        console.log(snapshot.exists())
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())
          console.log("register existing")
          return res.status(200).json({
            code: 200,
            message: 'existing',
            result: null
          })
        } else {
          child.set({
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            password: data.password,
            mobileNo: data.mobileNo
          })
          console.log("register success")
          return res.status(200).json({
            code: 200,
            message: "success",
            result: null
          })
        }
      }, (error) => {
        console.log(error)
        return res.status(500).json({
          code: 500,
          message: error.message,
          result: null
        })
      })
    } catch (error) {
      console.log(error)
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
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("users")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())
          let data = snapshot.val()
          let password = data.password
          if (request.mobileNo == data.mobileNo) {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'calendarserviceapp@gmail.com',
                pass: 'hbsfnyactjjeonri'
              }
            });
            var mailOptions = {
              from: 'calendarserviceapp@gmail.com',
              to: request.email,
              subject: 'กู้รหัสผ่านของ Calendar แอพลิเคชั่น',
              text: 'รหัสผ่านของคุณคือ: ' + Base64.decode(password)
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
          } else {
            console.log("data not match")
            return res.status(200).json({
              code: 200,
              message: "data not match",
              result: null
            })
          }
        } else {
          console.log("data not found")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (error) => {
        console.log("data not found")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/events", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())

        } else {
          console.log("data not found")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (error) => {
        console.log("data not found")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

app.post("/addevent", (req, res) => {
  (async () => {
    let request = req.body
    console.log("request", request)
    try {
      const convertEmail = request.email.replaceAll('.', 'DOT')
      const ref = database.ref("events")
      const child = ref.child(convertEmail)
      child.get().then((snapshot) => {
        if (snapshot.exists()) {
          console.log("response from Firebase" + snapshot.val())

        } else {
          console.log("data not found")
          return res.status(200).json({
            code: 200,
            message: "not found",
            result: null
          })
        }
      }, (error) => {
        console.log("data not found")
        return res.status(200).json({
          code: 200,
          message: "not found",
          result: null
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        code: 500,
        message: error.message,
        result: null
      })
    }
  })()
})

// Initialzed port
app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  console.log(`server running on port ${process.env.PORT}`)
})