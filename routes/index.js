var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var mysql = require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});


let transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "16mscit042@gmail.com",
    pass: "kwoiewnmotathqsx"
  }
});

var storeOTP;

router.post('/registration', async (req, res, next) => {
  try {
    const { firstName, lastName, email, contactNumber } = req.body

    let responseData

    var sql1 = `SELECT * FROM users WHERE email='${email}'`
    con.query(sql1, function (err, result) {
      if (result.length === 0) {
        var sql = `INSERT INTO users(firstName,lastName,email,contactNumber)VALUES('${firstName}','${lastName}','${email}','${contactNumber}')`

        con.query(sql, function (err, result) {

          res.status(200).json({
            error: false,
            message: "Insert Successfully"
          })
        })
      } else {
        res.status(200).json({
          error: true,
          message: "Email Already Exists"
        })
      }
    })
  } catch (error) {
    console.log(error.message)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body

    var sql = `SELECT * FROM users WHERE email='${email}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result)
      const OTP = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
      storeOTP = OTP;
      transport.sendMail(
        {
          from: "16mscit042@gmail.com",
          to: email,
          subject: "Sending mail using nodejs",
          text: `${OTP}`
        }
      )

      res.status(200).json({
        error: false,
        message: 'Sending OTP on mail'
      })
    })


  } catch (error) {

  }
})

router.post('/verifyOTP', async (req, res, next) => {
  try {
    const { otp } = req.body

    if (parseInt(otp) === storeOTP) {
      res.status(200).json({
        error: false,
        message: 'Login successfully'
      })
    } else {
      res.status(500).json({
        error: false,
        message: 'Invalid OTP'
      })
    }

  } catch (error) {

  }
})

router.get('/viewUsers', async (req, res, next) => {
  try {
    var sql = "SELECT * FROM users"

    con.query(sql, function (err, result) {
      res.json({
        error: false,
        message: result
      })
    })
  } catch (error) {

  }
})

module.exports = router;
