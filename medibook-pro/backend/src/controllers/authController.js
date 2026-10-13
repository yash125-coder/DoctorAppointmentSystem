import User from "../models/User.js";
import jwt from jsonwebtoken";
import bcrypt from
 "bcryptjs";

const generateToken =
 (id) => {
 return jwt.sign({
 id },
 process.env.JWT_SECRET,
 {
 expiresIn:
 process.env.JWT_EXPIRES_IN,
 });
};

export
 const
 register
 = async
 (req,
 res) => {
 try {
 const {
 name,
 email,
 password
 } =
 req.body;
 const
 userExist
 = await
 User.findOne({
 email });
 if
 (userExist)
 return
 res.status(400).json({
 message:
 "User already exists" });

 const
 user
 =
 new
 User({
 name,
 email,
 password
 });
 await
 user.save();
 res.status(201).json({
 message:
 "User registered successfully" });
 } catch
 (error) {
 res.status(500).json({
 error:
 error.message
 });
 }
};

export
 const
 login
 = async
 (req,
 res) => {
 try {
 const {
 email,
 password
 } =
 req.body;
 const
 user
 = await
 User.findOne({
 email });
 if
 (!user || !(await
 bcrypt.compare(password,
 user.password))) {
 return
 res.status(401).json({
 message:
 "Invalid credentials" });
 }
 const
 token
 =
 generateToken(user._id);

 res.status(200).json({
 _id:
 user._id,
 name:
 user.name,
 email:
 user.email,
 role:
 user.role,
 token,
 });
 } catch
 (error) {
 res.status(500).json({
 error:
 error.message
 });
 }
};

export
 const
 me
 = async
 (req,
 res) => {
 try {
 const
 user
 = await
 User.findById(req.user.id);
 res.status(200).json(user);
 } catch
 (error) {
 res.status(500).json({
 error:
 error.message
 });
 }
};
