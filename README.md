# Vaccimailer

## _Never miss covid vaccination opportunity_

Vaccimailer emails you when vaccination is available at a given pincode.

![GitHub last commit](https://img.shields.io/github/last-commit/theninza/vaccimailer?style=for-the-badge) ![GitHub issues](https://img.shields.io/github/issues/theninza/vaccimailer?style=for-the-badge) ![GitHub repo size](https://img.shields.io/github/repo-size/theninza/vaccimailer?style=for-the-badge)

## Tech-Stack

![NodeJS](https://img.shields.io/badge/NodeJS-05122A?style=for-the-badge&logo=node.js)&nbsp;

## Installation

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/TheNinza/vaccimailer.git
cd vaccinator
npm install
```

## For running the application

You can look for a particular date by modifying vaccinationDate value at line 42 to DD-MM-YYYY format.
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

const sendEmail = (text, send_to) => {
  transporter.sendMail(
    {
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
```

From your shell, run

```sh
npm start
```

To input the email address (EMAIL) and pincode (PINCODE) to assign the listener, use the following endpoint:

`http://localhost:PORT/subscribe?pincode=PINCODE&email=EMAIL`

To get a list of all active listeners, use the following endpoint:

`http://localhost:PORT/all`

To unsubscribe and remove listener, use the following endpoint:

`http://localhost:PORT/unsubscribe?email=EMAIL`

The json for available slots is sent on:

```sh
127.0.0.1:8000
```

Alternatively you can use docker. To build and run the image run the following 2 commands:

```bash
docker build -t vaccimailer . --no-cache
docker run --rm -d -p 8000:8000 --name vaccimailer vaccimailer
```

Additionally, a user friendly front-end has been added which fetches data from the local server and displays the information as follows:

![Data](https://user-images.githubusercontent.com/78133928/138590566-eb05e993-4404-45a5-bbbe-cf635705fb39.png)

![Error](https://user-images.githubusercontent.com/78133928/138590592-13c38369-7d17-49df-aa71-1ea56d2cc88f.png)

## Development

Want to contribute? Great!
Do check issues section.

## License

MIT

**Stay Safe**
