import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "सर्व माहिती भरणे आवश्यक आहे." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "हा ईमेल आधीच नोंदणीकृत आहे." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient'
    });

    await user.save();

    res.status(201).json({ message: "नोंदणी यशस्वी झाली!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "सर्व्हर एरर: " + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा." });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: "हा ईमेल नोंदणीकृत नाही." });
    }

    if (!user.password) {
      return res.status(500).json({ error: "डेटाबेसमध्ये पासवर्ड सापडला नाही." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: "चुकीचा पासवर्ड." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: "लॉगिन यशस्वी झाले!",
      token: token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "सर्व्हर एरर: " + err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "युझर सापडला नाही." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "सर्व्हर एरर: " + err.message });
  }
};
