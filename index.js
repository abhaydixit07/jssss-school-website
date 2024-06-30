import express from 'express';
import nodemailer from 'nodemailer';
import { connectToDb, getDb } from './db.js';
import bodyParser from "body-parser";
import env from 'dotenv';
const port = process.env.PORT;
const app = express()
app.use(express.json());
let db;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
env.config()


const PASSWORD = process.env.PASSWORD
const EMAIL = process.env.EMAIL


// Connect to the database before setting up the routes
connectToDb((err) => {
  if (!err) {
      console.log("db connection established");
      db = getDb();
      
      // Set up your Express routes inside this callback
      app.get("/documents", async (req, res) => {
          try {
              const filenames = await db.collection('test').find({}).sort({ _id: -1 }).toArray();
              console.log(filenames);
              res.render("documents.ejs", { filenames:filenames });
          } catch (error) {
              console.error("Error fetching filenames:", error);
              res.status(500).send("Internal Server Error");
          }
      });

  } else {
      console.error("Failed to connect to the database:", err);
  }
});

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

app.get("/", (req, res) =>{
  res.render("index.ejs");
});

app.post('/send-contact-form', async (req, res) => {
  try {
      const form = 'Contact Form';
      const { name, email, tel, subject, message } = req.body;
      const fullMessage = `Name: ${name}\nEmail: ${email}\nPhone: ${tel}\nSubject: ${subject}\nMessage: ${message}`;
      
      
      const result = await sendMail(fullMessage, form);
      if (!result) {
          
          res.render("contact.ejs", { message: { success: false, text: "An error occurred while sending the message." } });
          return; 
      }
      
      res.render("contact.ejs", { message: { success: true, text: "Message sent successfully." } });
  } catch (error) {
      console.error('Error handling contact form submission: ', error);
      
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





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

