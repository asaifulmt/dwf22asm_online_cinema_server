const joi = require('joi')
const moment = require('moment')
const { Op } = require('sequelize')
const models = require('../models')

exports.buyFilm = async (req, res) => {
  try {
    const { userId, files, body, params } = req

    const filmId = Number(params.id)

    if (!files.transferProof) {
      return res.status(400).send({
        status: 'failed',
        message: 'transferProof image field is required'
      })
    }

    const user = await models.userFilm.findOne({
      where: { userId, filmId }
    })

    console.log(user)

    if (user && (user.status === 'pending' || user.status === 'approved')) {
      return res.status(400).send({
        status: 'failed',
        message: `You already purchased this film.${user.status === 'pending' ? ' Please wait 1x24 hours because your transaction still in process.' : ''}`
      })
    }

    const transferProof = files.transferProof[0].filename

    const schema = joi.object({
      accountNumber: joi.number().required()
    })

    const { error } = schema.validate({ ...body })

    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message
      })
    }

    const userFilm = await models.userFilm.create({
      ...body,
      status: 'pending',
      transferProof,
      userId,
      filmId,
      orderDate: moment().format('dddd, DD MMMM yyyy')
    })

    res.status(200).send({ userFilm })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}


exports.getTransactions = async (req, res) => {
  try {
    const transactions = await models.userFilm.findAll({
      attributes: ['id', 'status', 'accountNumber', 'transferProof', 'orderDate'],
      include: [
        {
          model: models.user,
          attributes: {
            exclude: ['password', 'role', 'createdAt', 'updatedAt']
          }
        },
        models.film
      ]
    })

    res.status(200).send({ transactions })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.updateStatusTransaction = async (req, res) => {
  try {
    await models.userFilm.update({
      status: req.body.status
    }, {
      where: { id: req.params.id }
    })

    res.status(200).send({ status: 'success' })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.filmRate = async (req, res) => {
  try {
    const { userId, params } = req

    const filmId = Number(params.id) // param itu by default string, jadi kita rubah dulu jadi number

    // get rating dari user
    const user = await models.userFilm.findOne({
      where: {
        userId,
        filmId
      }
    })

    // kalo user tidak ditemukan kasih value 0, kalo ada valuenya dari user.rate
    const userRate = user ? user.rate : 0

    // end of get rating dari user


    // get rating film dari semua user tapi filter ratenya yang tidak NULL
    // agar perhitungannya average rate yang hanya benar2 sudah vote saja
    const films = await models.userFilm.findAll({
      where: {
        filmId,
        rate: {
          [Op.not]: null
        }
      }
    })

    // map array biar valuenya cuman rating aja
    const filmRates = films.map(film => film.rate)

    // dapetin total rate
    const totalRate = filmRates.length

    // dapeting rata2 rating
    const averageRate = filmRates.reduce((acc, curr) => acc + curr, 0) / totalRate

    res.status(200).send({
      status: 'success',
      data: {
        userRate,
        totalRate,
        averageRate
      }
    })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.userRate = async (req, res) => {
  try {
    const { userId, params } = req

    const filmId = Number(params.id)

    // get user rating untuk check
    const userFilm = await models.userFilm.findOne({
      where: {
        userId,
        filmId
      }
    })

    // check kondisinya jika dia belum membeli film tersbut atau statusnya masih blm approved
    // jika true, return status failed
    if (!userFilm || (userFilm && userFilm.status !== 'approved')) {
      return res.status(400).send({
        status: 'failed',
        message: 'You haven\'t purchase this film or status still pending'
      })
    }

    // update rate film
    userFilm.rate = Number(params.rate)

    await userFilm.save()

    res.status(200).send({
      status: 'success',
      message: 'rate update succesfully'
    })

  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
