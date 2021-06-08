const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const header = req.header('Authorization') || ''

  const token = header.replace('Bearer ', '')

  const secretKey = 'inikuncirahasia'

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: 'failed',
        message: 'unauthorized'
      })
    }

    req.userId = decoded.id

    next()
  })
}

module.exports = auth
