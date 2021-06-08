const joi = require("joi")
const models = require('../models')

exports.createFilm = async (req, res) => {
  try {
    const { files, body } = req

    if (!files.thumbnail) {
      return res.status(400).send({
        status: 'failed',
        message: 'thumbnail image field is required'
      })
    }

    const thumbnail = files.thumbnail[0].filename

    const schema = joi.object({
      title: joi.string().required(),
      price: joi.number().required(),
      description: joi.string().required(),
      filmUrl: joi.string().required(),
      categoryId: joi.number().required()
    })

    const { error } = schema.validate({ ...body })

    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message
      })
    }

    const newFilm = await models.film.create({
      ...body,
      price: Number(body.price),
      thumbnail,
      categoryId: Number(body.categoryId)
    })

    const film = await models.film.findOne({
      where: { id: newFilm.id },
      attributes: {
        exclude: ['categoryId']
      },
      include: {
        model: models.category,
        attributes: ['id', 'name']
      }
    })

    res.status(200).send({ film })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.getAllFilms = async (req, res) => {
  try {
    const films = await models.film.findAll({
      attributes: ['id', 'title', 'thumbnail', 'description', 'price'],
      include: {
        model: models.category,
        attributes: ['name']
      }
    })
    res.status(200).send({ films })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.getFilmById = async (req, res) => {
  try {
    const { id } = req.params

    const film = await models.film.findOne({ where: { id }, include: [{
      model: models.category,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }, {
      model: models.user,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'role']
      },
      through: {
        model: models.userFilm
      }
    }] })

    const user = film.users.find(user => user.id === req.userId)

    const userFilm = JSON.parse(JSON.stringify(film))
    delete userFilm.users

    userFilm.userFilm = user && user.userFilm || {}

    res.status(200).send({ film: userFilm })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.editFilm = async (req, res) => {
  try {
    const { id } = req.params

    const updateFilm = await models.film.findOne({
      where: {
        id
      }
    })

    if(!updateFilm) {
      return res.status(404).send({
        status: 'failed',
        message: 'update film not found'
      })
    }

    const data = req.body

    if (req.files.thumbnail) {
      data.thumbnail = req.files.thumbnail[0].filename
    }

    await models.film.update(data, {
      where: {
        id: updateFilm.id
      }
    })

    res.status(200).send({
      status: 'Update Success',
      film: {
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

exports.deleteFilm = async (req, res) => {
  try {
    const { id } = req.params

    const filmSelected = await models.film.findOne({
      where: {
        id
      }
    })

    if(!filmSelected) {
      return res.status(404).send({
        status: "failed",
        message: "film doesn't exist"
      })
    }

    await models.film.destroy({
      where: {
        id
      }
    })

    res.status(200).send({
      status: 'success',
      film: {
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
