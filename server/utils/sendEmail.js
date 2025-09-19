const nodeMailer = require("nodemailer");

const sendEmail = async (email, subject, message,sent_to, sent_from, reply_to) => {
    //email transporter setup
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized: false
        }
    })
    //options for sending email
    const options = {
        from: sent_from,
        to: sent_to,
        replyTo: reply_to,
        subject: subject,
        html: message, 
    }

    // Send email
    try {
        await transporter.sendMail(options, function (err, info) {
            if (err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;