let express = require('express')
let app = express()
let server = require('http').createServer(app)
let bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const socketHandler = require('./socketHandler/socket')
require('dotenv').config()
var cors = require('cors');
//My own Modules
let constants = require('./constants')
const patientRoutes = require('./patientRoutes')
//path is used to go back a directory neatly by __dirname , '../public'
const path = require('path')
const publicPath = path.join(__dirname, '../public')
console.log(process.env,"printing out env variables")
const mongo_uri = process.env.MONGO_URL
mongoose.connect(mongo_uri, function(err) {
  if (err) {
    throw err
  } else {
    console.log(`Successfully connected to ${mongo_uri}`)
  }
})

const port = process.env.PORT || 4000
const whitelist = ['https://covidfreeindia.herokuapp.com', 'http://localhost:3001', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(whitelist));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// parse application/json
app.use(bodyParser.json())
//setup the server to serve static files from the public folder
app.use(express.static(publicPath))

// app.get('/api/home', function(req, res) {
//   res.send('Welcome!');
// });

// app.get('/api/secret', function(req, res) {
//   res.send('The password is potato');
// });

//redirect routes modules
app.use('/api/patient', patientRoutes)

server.listen(port, err => {
  if (err) return console.log(err)

  console.log(`server started at port ${port}`)
})

module.exports = server
