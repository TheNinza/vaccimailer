const got = require("got");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const express = require("express")
const app = express()

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = (text) => {
  transporter.sendMail(
    {
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL_REC,
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

let dataArray = [];

// add pincode and date of vaccination
const pincode = "641021";
const d = new Date();

// vaccination date is the next day in following format
const vaccinationDate = `${d.getDate() + 1}-0${
  d.getMonth() + 1
}-${d.getFullYear()}`;



const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`;

function getData() {
  got(apiUrl)
    .then((response) => {
      dataArray = JSON.parse(response.body).sessions;
      // console.log(dataArray);

      let availableSlots = dataArray.filter((obj) => obj.min_age_limit < 45);

      // Play some sound if slots are available and get notified

      if (availableSlots.length > 0) {
        console.log(availableSlots);
        sendEmail(JSON.stringify(availableSlots, null, 2));
        clearInterval(myInt);
      } else {
        const date = new Date();
        console.log(
          date.toTimeString(),
          "no available slots available for",
          vaccinationDate
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

console.log(apiUrl);
console.log(vaccinationDate);

getData();

// console.log(
//   `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`
// );

// running function every 30 seconds
const myInt = setInterval(() => {
  getData();
}, 100000);



//created a server using express 
app.get("/",(req,res)=>{
  res.write(JSON.stringify(dataArray, null, 2)); //write a response to the client
  res.end(); //end the response
})

const port = process.env.PORT || 8000;

app.listen(port,()=>{
  console.log(`App is running on port ${port}`);
})
