const models = require('../models')

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req

    const profile = await models.user.findOne({
      where: {
        id: userId
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'role']
      },
      include: {
        model: models.film,
        attributes: ['id', 'title', 'price'],
        through: {
          model: models.userFilm,
          attributes: ['orderDate', 'status']
        }
      }
    })

    res.status(200).send({
      status: 'success',
      profile
    })

  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.getMyFilm = async (req, res) => {
  try {
    const { userId } = req

    const user = await models.user.findOne({
      where: {
        id: userId
      },
      attributes: [],
      include: {
        model: models.film,
        attributes: ['id', 'title', 'thumbnail'],
      }
    })

    res.status(200).send({
      status: 'success',
      myFilms: user.films
    })

  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}


exports.getUser = async (req, res) => {
  try {
    const users = await models.user.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'] 
      }
    })

    res.status(200).send({
      data: { users }
    })
  } catch (err) {
    console.log (err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })

  }
}

exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params

    const userSelected = await models.user.findOne({
      where: {
        id
      }
    })

    if (!userSelected) {
      return res.status(404).send({
        status: "failed",
        message: "user doesn't exist"
      })
    }

    await models.user.destroy({
      where: {
        id
      }
    })

    res.status(200).send({
      status: 'success',
      data: {
        id
      }
    })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.editProfile = async (req, res) => {
  try {
    const id = req.userId
    // const { title, description, goal } = req.body

    const editUser = await models.user.findOne({
      where: {
        id
      }
    })

    if(!editUser) {
      return res.status(404).send({
        status: 'failed',
        message: 'Your Profile not Found'
      })
    }

    const data = req.body

    if (req.files.avatar) {
      data.avatar = req.files.avatar[0].filename
    }

    await models.user.update(data, {
      where: {
        id: editUser.id
      }
    })
    
    res.status(200).send({
      status: 'update Success',
      id
    })
  
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
