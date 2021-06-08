const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { user } = require('../models')

const secretKey = 'inikuncirahasia'

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body
    const checkEmail = await user.findOne({
      where: {
        email
      }
    })

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
      fullName: joi.string().min(3).required()
    })

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message
      })
    }

    if (checkEmail) {
      return res.status(400).send({
        status: "Failed",
        message: "Email Already Registered",
      })
    }

    const hashStrength = 10
    const hashedPassword = await bcrypt.hash(password, hashStrength)

    const dataUser = await user.create({
      fullName,  
      email,
      password: hashedPassword
    })

    const token = jwt.sign({
      id: dataUser.id,
      fullName: dataUser.fullName,
      phone: dataUser.phone,
      avatar: dataUser.avatar,
      email: dataUser.email,
      role: dataUser.role
    }, secretKey)

    res.status(200).send({
      status: "Success",
      data: {
        user: {
            fullName: dataUser.fullName,
            token
        }
      }
    })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: "failed",
      message: "server error"
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: "Validation Failed",
        message: error.details[0].message
      })
    }

    const checkEmail = await user.findOne({ where: { email } })

    if (!checkEmail) {
      return res.status(400).send({
        status: "Login Failed",
        message: "Email and Password don't match",
      })
    }

    const isValidPassword = await bcrypt.compare(password, checkEmail.password);

    if (!isValidPassword) {
      return res.status(400).send({
        status: "Login Failed",
        message: "Email and Password don't match",
      })
    }

    const token = jwt.sign({
      id: checkEmail.id,
      fullName: checkEmail.fullName,
      email: checkEmail.email,
      phone: checkEmail.phone,
      avatar: checkEmail.avatar,
      role: checkEmail.role
    }, secretKey)

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: checkEmail.id,
          fullName: checkEmail.fullName,
          email: checkEmail.email,
          token
        }
      },
    })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: "failed",
      message: "server error"
    })
  }
}
