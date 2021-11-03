import Users from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const user = await Users.findOne({ email })
      if (user)
        return res.status(400).json({ msg: 'The email already exists.' })
      if (password < 6)
        return res
          .status(400)
          .json({ msg: 'Password is at least 6 characters long.' })

      //Encrypt the follow password;)
      const passwordHash = await bcrypt.hash(password, 10)
      //Create new user
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      })
      //Save user
      await newUser.save()
      //Create webtoken
      const accesstoken = createAccessToken({ id: newUser._id })
      const refreshtoken = createRefreshToken({ id: newUser._id })

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      })
      res.json({ accesstoken })
    } catch (err) {
      res.status(500).json({ msg: err.message })
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await Users.findOne({ email })
      if (!user) return res.status(400).json({ msg: 'User does not exist.' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  logout: async (req,res) => {
    try {
        res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
        return res.json({msg : 'Logged out'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken
      if (!rf_token)
        return res.status(400).json({ msg: 'Please Login or Register.' })
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: 'Please Login or Register.' })
        const accesstoken = createAccessToken({ id: user.id })
        res.json({ user, accesstoken })
      })
    } catch (err) {
      res.status(500).json({ msg: err.message })
    }
  },
  getUser: async (req,res) =>  {
    try {
        const user = await Users.findById(req.user.id).select('-password')
        if(!user) return res.status(400).json({msg: 'User does not exist'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  },
}
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
export default userCtrl
