const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const https = require("https");
const express = require("express");

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

// sendEmail("first email from dummy server");

let dataArray = [];

// add pincode and date of vaccination
const pincode = "845401";
const d = new Date();

// vaccination date is the next day in following format
const vaccinationDate = `${d.getDate() + 1}-0${
  d.getMonth() + 1
}-${d.getFullYear()}`;

const apiUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`;

function getData() {
  https
    .get(apiUrl, (resp) => {
      let data = "";

      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        dataArray = JSON.parse(data).sessions;
        // console.log(dataArray);
        let availableSlots = dataArray.filter((obj) => obj.min_age_limit < 45);

        // Play some sound if slots are available and get notified

        if (availableSlots.length > 0) {
          console.log(availableSlots);
          sendEmail("Vaccination available in your city");
          clearInterval(myInt);
        } else {
          const date = new Date();
          console.log(
            date.toTimeString(),
            "no available slots available for",
            vaccinationDate
          );
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
}

getData();

// console.log(
//   `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${vaccinationDate}`
// );

// running function every 30 seconds
const myInt = setInterval(() => {
  getData();
}, 30000);

// creating a local server for fetching data-array
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(dataArray);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Started server");
});
