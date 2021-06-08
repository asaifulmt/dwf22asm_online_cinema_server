const models = require('../models')

exports.getCategories = async (req, res) => {
  try {
    const categories = await models.category.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })

    res.status(200).send({
      status: 'success',
      categories
    })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
