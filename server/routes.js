const router = require('express').Router()
const { login, register } = require('./controllers/patientAuth/authController')

router.post('/authenticate', login)
router.post('/register', register)

module.exports = router
