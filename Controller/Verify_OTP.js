import twilio from "twilio";
import {configDotenv} from "dotenv"
configDotenv()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {   
  const { phone } = req.body; 

  try {
    await client.verify.v2.services(serviceId).verifications.create({
      to: "+91" + phone,
      channel: "sms",
    });

    console.log("OTP sent to your registered number");
    res.json({ success: true, message: "OTP request sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2.services(serviceId).verificationChecks.create({
      to: "+91" + phone,
      code: otp,
    }); 

    // console.log(verificationCheck);  

    if (verificationCheck.status === "approved") {
      console.log("OTP verified successfully");
      res.json({ success: true, message: "OTP verified successfully" });
    } 
    else {
      console.log("Invalid OTP");
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP", 
      error: error.message,
    });
  }
};
 