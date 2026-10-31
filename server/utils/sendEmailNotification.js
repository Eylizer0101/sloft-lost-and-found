// server/utils/sendEmailNotification.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter - ✅ FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'eylizermarcosdeafria@gmail.com',
    pass: process.env.EMAIL_PASS || 'hmelgtxahjraoybs',
  },
});

const sendEmailNotification = async ({ to, subject, item, user }) => {
  try {
    // Email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #0B996E, #13B58D); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .item-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0B996E; }
          .user-details { background: #E6F4F1; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 New Item Posted</h1>
            <p>SLoft Lost & Found System</p>
          </div>
          
          <div class="content">
            <h2>A new ${item.type} item has been posted!</h2>
            
            <div class="item-details">
              <h3>📦 Item Details:</h3>
              <p><strong>Item Name:</strong> ${item.name}</p>
              <p><strong>Type:</strong> ${item.type}</p>
              <p><strong>Category:</strong> ${item.category}</p>
              <p><strong>Location:</strong> ${item.room}</p>
              <p><strong>Description:</strong> ${item.description}</p>
              <p><strong>Contact Number:</strong> ${item.number}</p>
              <p><strong>Date Reported:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            </div>
            
            <div class="user-details">
              <h3>👤 Posted By:</h3>
              <p><strong>Name:</strong> ${user.fullname}</p>
              <p><strong>Student ID:</strong> ${user.studentId}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Course:</strong> ${user.course}</p>
              <p><strong>Year Level:</strong> ${user.yearLevel}</p>
            </div>
            
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from SLoft Lost & Found System</p>
            <p>PHINMA AU South Campus</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      NEW ITEM POSTED - SLoft Lost & Found System
      
      Item Details:
      - Name: ${item.name}
      - Type: ${item.type}
      - Category: ${item.category}
      - Location: ${item.room}
      - Description: ${item.description}
      - Contact: ${item.number}
      - Date: ${new Date(item.date).toLocaleDateString()}
      
      Posted By:
      - Name: ${user.fullname}
      - Student ID: ${user.studentId}
      - Email: ${user.email}
      - Course: ${user.course}
      - Year Level: ${user.yearLevel}
      
      Timestamp: ${new Date().toLocaleString()}
    `;

    // Send email
    const mailOptions = {
      from: `"SLoft Lost & Found" <${process.env.EMAIL_USER || 'eylizermarcosdeafria@gmail.com'}>`,
      to: to,
      subject: subject,
      text: textContent,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// ✅ FIXED: Export as default
export default sendEmailNotification;