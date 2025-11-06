// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const transporter = require('../api/emailTransporter'); 
const { Doctor } = require('../models'); 
const {appointmntvalidation} = require("../Validation/user.validation");


router.post('/send-appointment-email', appointmntvalidation , async (req, res) => {

  const { doctorId, userEmail,availability } = req.body;

  try {
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const mailOptions = { 
      from: userEmail,
      to: doctor.doctor_email,
      subject: 'Appointment Request',
      text: `Hello Dr. ${doctor.doctor_name},\n\n${userEmail} has requested an appointment with you.\n\n Preferred Slot:in between slot\nDay: ${availability.day}\nTime: ${availability.startTime} AM - ${availability.endTime} PM\n\nPlease respond at your earliest convenience.\n\nRegards,\nYour ${userEmail}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
