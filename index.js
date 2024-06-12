import express from 'express';
import nodemailer from 'nodemailer';
// import { connectToDb, getDb } from './db.js';
import bodyParser from "body-parser";
// import env from 'dotenv';
const port = 3000;
const app = express()
app.use(express.json());
// let db
const PASSWORD = "pzmyktvgocakvtsb"
const EMAIL = "abhaydixitfake@gmail.com"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// env.config()
app.get("/", (req, res) =>{
  res.render("index.ejs");
});

// 


// Connect to the database before setting up the routes
// connectToDb((err) => {
//   if (!err) {
//       console.log("db connection established");
//       db = getDb();
      
//       // Set up your Express routes inside this callback
//       app.get("/documents", async (req, res) => {
//           try {
//               const filenames = await db.collection('filenames').find({}).sort({ _id: -1 }).toArray();
//               console.log(filenames);
//               res.render("documents.ejs", { filenames:filenames });
//           } catch (error) {
//               console.error("Error fetching filenames:", error);
//               res.status(500).send("Internal Server Error");
//           }
//       });

//       // Add more routes as needed...
//   } else {
//       console.error("Failed to connect to the database:", err);
//   }
// });

const sendMail = async (message, form) => {
  // Configure the transporter
  let transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
          user: EMAIL, // Your email
          pass: PASSWORD // Your email password
      }
  });

  // Define email options
  let mailOptions = {
      from: EMAIL, // Sender address
      to: EMAIL, // List of receivers
      subject: `New Message from ${form}`, // Subject line
      text: message, // Plain text body
  };

  try {
      // Send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);
      console.log('Message sent: ' + info.response);
      return true;
  } catch (error) {
      console.error('Error sending email: ', error);
      return false;
  }
};

// Route to handle contact form submission
app.post('/send-contact-form', async (req, res) => {
  try {
      const form = 'Contact Form';
      const { name, email, tel, subject, message } = req.body;
      const fullMessage = `Name: ${name}\nEmail: ${email}\nPhone: ${tel}\nSubject: ${subject}\nMessage: ${message}`;
      
      // Call sendMail function with formatted message
      const result = await sendMail(fullMessage, form);
      if (!result) {
          // Pass an object with success: false and a message text
          res.render("contact.ejs", { message: { success: false, text: "An error occurred while sending the message." } });
          return; // Ensure the function stops executing here
      }
      // Pass an object with success: true and a message text
      res.render("contact.ejs", { message: { success: true, text: "Message sent successfully." } });
  } catch (error) {
      console.error('Error handling contact form submission: ', error);
      // It's a good idea to also follow the expected message structure in case of server errors
      res.status(500).render("contact.ejs", { message: { success: false, text: "An error occurred while processing your request." } });
  }
});


app.get("/about", (req, res) =>{
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/gallery", (req, res) => {
  res.render("gallery.ejs");
});
app.get("/404", (req, res) =>{
    res.render("404.ejs");
  });
app.get("/admissions", (req, res) =>{
    res.render("admissions.ejs");
});
app.get("/facility", (req, res) =>{
    res.render("facility.ejs");
});
app.get("/team", (req, res) =>{
    res.render("team.ejs");
});
app.get("/testimonial", (req, res) =>{
    res.render("testimonial.ejs");
});
app.get("/call-to-action", (req, res) =>{
    res.render("call-to-action.ejs");
});
app.get("/classes", (req, res) =>{
    res.render("classes.ejs");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

