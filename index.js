const axios = require("axios");
const got = require("got");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const express = require("express")
const moment = require('moment');
const app = express()

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = (text,send_to) => { // Sends mail to specified address
  transporter.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: send_to,
    subject: "Cowin available",
    text,
  },
  (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  }
  );
};

// sendEmail("first email from server");

let listeners = {}; // Stores all active listeners and their associated email addresses
let dataArray = [];

// add pincode and date of vaccination
const pincode = "731101";

// vaccination date is the next day in following format
const vaccinationDate = moment().add(1, 'd').format('DD-MM-YYYY');

const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`;

const getData = async() => {

  try {
    Object.entries(listeners).map(async(listener) => { // Iterate over all active listeners and get availability for each requested pincode
      req_pincode = listener[0];
      const curUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${req_pincode}&date=${vaccinationDate}`;
      const result = await axios.get(curUrl);
      const response = result.data
      dataArray = response.sessions;
      // console.log(dataArray);
      let availableSlots = dataArray.filter((obj) => obj.min_age_limit < 45);

      // Play some sound if slots are available and get notified
      
      if (availableSlots.length > 0) {
        console.log(availableSlots);
        listener[1].emails.forEach(req_email => { // Iterate over all email addresses associated with pincode
          sendEmail(JSON.stringify(availableSlots, null, 2),req_email); // Send email
        })
        clearInterval(listener[1].interval);
        delete listeners[listener[0]]; // Remove the listener if a mail has been sent
      } else {
        const date = new Date();
        console.log(
        date.toTimeString(),
        "no available slots available for",
        vaccinationDate
        );
      }
    })
  } catch (error) {
    console.log(error);
  }
}

console.log("API URL:", apiUrl);
console.log(vaccinationDate);

getData();

// console.log(
//   `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`
// );

// running function every 30 seconds
// const myInt = setInterval(() => {
//   getData();
// }, 100000);



//created a server using express 
app.get("/", (req, res) => {
  res.write(JSON.stringify(dataArray, null, 2)); //write a response to the client
  res.end(); //end the response
})

// Created an endpoint to take in pincode and email and assign listener
// http://localhost:PORT/subscribe?pincode=PINCODE&email=EMAIL
app.get("/subscribe",(req,res) => {
  let req_pincode = req.query.pincode; // Getting pincode and email from url query
  let req_email = req.query.email;
  if (req_pincode in listeners) { // Checking if listener already exists
    if (!listeners[req_pincode].emails.includes(req_email)) {
      listeners[req_pincode].emails = [...listeners[req_pincode].emails,req_email]; // Adding email to listener if exists and does not contain email
    }
  }else {
    listeners[req_pincode] = { // Creating a new listener and adding email to it
      emails : [req_email],
      interval : setInterval(() => {
        getData();
      },100000)
    }
  }
  res.end(); // Ending the response
})

// Created an endpoint to take in email and remove listener
// http://localhost:PORT/unsubscribe?email=EMAIL
app.get("/unsubscribe",(req,res) => {
  let req_email = req.query.email; // Getting email from url query
  Object.entries(listeners).map(listener => { // Mapping over the active listeners
    if (listener[1].emails.includes(req_email)) {
      listener[1].emails.splice(listener[1].emails.indexOf(req_email),1); // Removing the email if it exists in current listener
    }
    if (listener[1].emails.length === 0) {
      delete listeners[listener[0]]; // Removing the listener if no emails associated with it
    }
  })
  res.end(); // Ending the response
})

// Created an endpoint to show all active listeners
// http://localhost:PORT/all
app.get("/all",(req,res) => {
  let all_listeners = {};
  Object.entries(listeners).map(listener => {
    all_listeners[listener[0]] = listener[1].emails; // Selecting only pincode and emails to return, excluding interval
  })
  res.write(JSON.stringify(all_listeners,null,2)); // Returning all active listeners and associated emails
  res.end(); // Ending the response
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})