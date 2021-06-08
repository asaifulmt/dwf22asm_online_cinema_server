const express = require('express')
const cors = require('cors')
const router = require('./routers')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => res.send('Server up!'))
app.use('/api/v1', router)
app.use('/uploads', express.static('uploads'))

app.listen(port, () => console.log(`Server listening to http://localhost:${port}`))
