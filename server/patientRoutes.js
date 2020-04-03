const router = require('express').Router()
const { patientLogin, patientSignup } = require('./controllers/patientAuth/patientAuthController')

router.post('/authenticate', patientLogin)
router.post('/register', patientSignup)

module.exports = router
