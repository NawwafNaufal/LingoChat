import randomString from "randomstring"
import {emailSend} from "../config/sendEmail.js"
import User from "../models/user.model.js";
import { otpCodeUser,getOtp,patchPassword} from "../service/otp.service.js"; 

const data = []

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
  
    const result = await User.findOne({ email });
    if (!result) {
      return res.status(404).json({
        message: "Email tidak valid",
      });
    }
  
    const randomCode = randomString.generate({
      length: 5,
      charset: "numeric",
    });
  
    const otp_code = randomCode;
    const now = new Date();
    const expires_at = new Date(now.getTime() + 5 * 60 * 1000);
  
    const value = await otpCodeUser(email, otp_code, expires_at);
    data.push(value);
  
    await emailSend({
      to: email,
      subject: "Kode Otp",
      text: `Code otp ${otp_code} expired in ${expires_at}`,
    });
  
    res.status(200).json({
      success: true,
      message: "Silahkan check email",
    });
  };

  export const radomOtpNew = async (req, res) => {
    const { email } = req.body; 
    if (!email) return res.status(400).json({ message: "Email tidak boleh kosong" });

    const randomCode = randomString.generate({
        length: 5,
        charset: "numeric",
    });

    const otp_code = randomCode;
    const now = new Date();
    const expires_at = new Date(now.getTime() + 5 * 60 * 1000);

    try {
        await otpCodeUser(email, otp_code, expires_at);

        await emailSend({
            to: email,
            subject: "Kode Otp",
            text: `Code otp ${otp_code} expired in ${expires_at}`,
        });

        res.status(200).json({
            message: "Kode OTP baru telah dikirim",
        });

    } catch (error) {
        return res.status(500).send(error);
    }
};


export const validateCodeOtp =async (req,res) => {
    const {otp_code} = req.body
    console.log(data)
    try {
        const result = await getOtp(otp_code)
        if(!result) {
            return res.send("Kode Otp tidak valid atau sudah kadaluwarsa")
        }
        res.status(200).json({
            data:result.email,
            message:"Kode Otp Valid"
        })
        
    } catch (error) {
        res.send(error)
    }
    
}

export const changePassword = async (req, res) => {
    const { password } = req.body;
    const { email } = req.params;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email dan password wajib diisi"
        });
    }

    try {
        const result = await patchPassword(email, password);
        res.status(200).json({
            data: result,
            message: "Berhasil merubah kata sandi"
        });
    } catch (error) {
        console.error("Gagal mengubah password:", error);
        res.status(500).json({
            message: "Terjadi kesalahan saat merubah password"
        });
    }
};

