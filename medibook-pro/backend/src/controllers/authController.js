const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
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
