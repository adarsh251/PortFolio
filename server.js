require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3600;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  post: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/verify-recaptcha", async (req, res) => {
  console.log("called");
  const params= new URLSearchParams({
    secret : process.env.SECRET_KEY,
    response : req.body['g-recaptcha-response']
  })
  
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params
  });

  const data = await response.json();
  console.log(data);
  if (!data.success) {
    return res.status(400).json({ success: false, message: "reCAPTCHA failed" });
  }

  res.json({ success: true });
});

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptionsToAdmin = {
    from: process.env.EMAIL,
    to: "mishraadarsh25104@gmail.com",
    subject: `You've a connection request from ${name} via portfolio`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  const mailOptionsToUser = {
    from: process.env.EMAIL,
    to: email,
    subject: `Thank you for connecting!`,
    html: `<div><div style="font-family: Arial, Helvetica, sans-serif;"><span style="color: rgb(34, 34, 34); font-size: small;"><font face="verdana, sans-serif">Dear ${name},</font></span></div><div style="font-family: Arial, Helvetica, sans-serif;"><span style="color: rgb(34, 34, 34); font-size: small;"><font face="verdana, sans-serif">
 </font></span></div><div style="font-family: Arial, Helvetica, sans-serif;"><span style="color: rgb(34, 34, 34); font-size: small;"><font face="verdana, sans-serif">Thank you for connecting with me. I'll reach out to you soon.</font></span></div></div>
 <span style="color: rgb(34, 34, 34); font-family: verdana, sans-serif; font-size: small; background-color: rgb(255, 255, 255);">Warm regards</span><span style="color: rgb(34, 34, 34); background-color: rgb(255, 255, 255); font-family: Arial, Helvetica, sans-serif; font-size: small;">,</span><div><font color="#222222" face="Arial, Helvetica, sans-serif" size="2">--
</font><div><div><font style="font-family: Arial, Helvetica, sans-serif; font-size: small; background-color: rgb(255, 255, 255);"><div style="color: rgb(136, 136, 136);"><div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature"><div dir="ltr"><div style="color: rgb(34, 34, 34);"><div><span style="color: rgb(11, 83, 148);"><font face="verdana, sans-serif">Adarsh Mishra</font></span></div><div><span style="color: rgb(11, 83, 148); font-family: verdana, sans-serif;">+91-7426046332</span></div><div style="color: rgb(32, 33, 36);"><a href="https://www.linkedin.com/in/adarsh-mishra-aba82522a"><font color="#3d85c6" face="verdana, sans-serif">Linkedin</font></a></div></div><div style="color: rgb(34, 34, 34);"><div style="color: rgb(32, 33, 36);"><div>
 </div></div></div></div></div></div></font></div></div></div>`,
  };

  try {
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);
    res.status(200).json({ message: "Thank you for connecting!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "There was an error sending the emails." });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
