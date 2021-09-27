# Vaccimailer

![GitHub last commit](https://img.shields.io/github/last-commit/theninza/vaccimailer?style=for-the-badge) ![GitHub issues](https://img.shields.io/github/issues/theninza/vaccimailer?style=for-the-badge) ![GitHub repo size](https://img.shields.io/github/repo-size/theninza/vaccimailer?style=for-the-badge)
## _Never miss covid vaccination opportunity_

Vaccimailer emails you when vaccination is available at a given pincode.

## Tech

- Javascript
- NodeJS


## Installation

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/TheNinza/vaccimailer.git
cd vaccinator
npm install
```

For running the application

In index.js, find and modify pin code at line 39.

```js
const pincode = "YOUR_PIN_CODE";
```

Also you can look for a particular date by modifying vaccinationDate string at line 43 in DD-MM-YYYY format.
By default, it checks for the next day availabilities.

```js
const vaccinationDate = "DD-MM-YYYY";
```

Make sure to set your emails and passwords.

For gmail, you have to create an <strong>App-Password</strong> to allow sending email on your behalf. You can crete an app password by visiting this <a href="https://myaccount.google.com/apppasswords">link.</a>

```js
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
```

From your shell, run

```sh
npm start
```
It also sends the json for available slots on

```sh
127.0.0.1:8000
```

## Development

Want to contribute? Great!
Do check issues section.

## License

MIT

**Stay Safe**
