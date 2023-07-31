const User = require ('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req,res,next)=>{
    try {
        const {username,email,password} = req.body
        console.log(username,email,password)
        const userExists = await User.findOne({email,username});
        if(userExists){
            return res.status(400).json({
                message: 'Email or Phone already exists'
            })
        }
        //hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        //new user
        const user = new User({username,email,password:hashedPassword,avatar:"avatar.jpg",description:"hello everyone"})
        const userSaved = await user.save();

        // token 
        const token = jwt.sign({userID : userSaved._id},process.env.JWT_SECRET,{
            expiresIn:'1h',
        })
        const userData = {name: user.name}
        res.status(200).render('home',{userData, token})
    } catch (error) {
        res.status(500).redirect('/')
    }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    const userData = {username: user.username, avatar: user.avatar}
    // res.status(200).json(token)
    res.status(200).render('home',{userData, token})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
};
 const logout = async(req,res,next)=>{
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);

    // Remove token from blacklist or database if necessary

    // Respond with success message
    res.json({ msg: 'User logged out successfully' });
  } catch (err) {
    // Respond with error message
    res.status(500).json({ msg: 'Server error' });
  }
 }
module.exports ={
    register,login,logout
}