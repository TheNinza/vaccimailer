const got = require("got");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const http = require("http");

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
const pincode = "845401";
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
    })
    .catch((error) => {
      console.log(error);
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

http
  .createServer(function (req, res) {
    res.write(JSON.stringify(dataArray)); //write a response to the client
    res.end(); //end the response
  })
  .listen(process.env.PORT || 8000);
