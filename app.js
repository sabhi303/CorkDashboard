// const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
// const fs = require('fs')
const logger = require('./utils/logger')
const console = require('console')
require('dotenv').config()

const cron = require('node-cron')
const morgan = require('morgan')
// const sm = require('sitemap');
const express = require('express')


// database connection
// Connect to the MongoDB database
const { connectToDatabase } = require('./database/db');

(async () => {
  try {
      await connectToDatabase();

  } catch (error) {
      console.error('Failed to connect to database:', error);
  }
})();

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())

/*
cent caching of data files can be tiered based on whether the data is staic or dynamic (changing often)
* can set cache for any files in public sub-dirs
* e.g. if frequently-changed files are placed in public/static and max-age applied, stale versions may be loaded from cache
*/

/* express.static config object
* note this doesn't capture all the deafults
*/
// const staticOptions = {
//   // dotfiles: 'ignore',
//   etag: true,
//   // extensions: ['htm', 'html'],
//   // index: false,
//   maxAge: 0,
//   // redirect: false,
//   setHeaders: function (res, path, stat) {
//     res.set('cache-control', 'public')
//   }
// }

// use cached version of files if age < 1 day when placed in public/data/static dir
app.use('/data/static/', express.static(path.join(__dirname, 'public', 'data', 'static'), { maxage: '1d' }))

// uses default cache-control settings for Express
app.use('/', express.static(path.join(__dirname, 'public')))

// logger.debug("Overriding 'Express' logger");

// output http logs on the sevrer
app.use(morgan('tiny', {
  stream: logger.stream,
  skip: function (req, res) { return res.statusCode < 400 }
}))

// get routes files
const home = require('./routes/home')
const themes = require('./routes/themes')
// const stories = require('./routes/stories')
const queries = require('./routes/queries')
const tools = require('./routes/tools')
const portal = require('./routes/portal')
const api = require('./routes/api')
const admin = require('./routes/admin')
const auth = require('./routes/auth')

// view engine setup
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/themes'),
// path.join(__dirname, 'views/stories'),
path.join(__dirname, 'views/queries'),
path.join(__dirname, 'views/tools'),
path.join(__dirname, 'views/portal'),
path.join(__dirname, 'views/api')])

app.set('view engine', 'pug')

app.use('/', home)
app.use('/themes', themes)
// app.use('/stories', stories)
app.use('/queries', queries)
app.use('/tools', tools)
app.use('/portal', portal)
app.use('/api', api)
app.use('/admin', admin)
app.use('/auth', auth)


// //additional functionality from node modules

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next((404))
})

// error handler
app.use(function (err, req, res, next) {
  // console.log('error handler')
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // adding winston logging for this error handler
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const hour = new Date().getHours()
const min = new Date().getMinutes().toString().padStart(2, '0')
console.log('\n\ Cork Dashboard App started at ' + hour + ':' + min + '\n\n')

if (app.get('env') === 'development') {
  console.log('\n\n***App is in dev***\n\n')
} else {
  console.log('\n\n***App is in production***\n\n')
}

/*******
 *
 * Crons
 *
 *******/

const http = require('http')
const fs = require('fs')

// // Water Levels
// cron.schedule('*/15 * * * *', function () {
//   getWaterLevels()
// })

// function getWaterLevels() {
//   const waterLevelFile = fs.createWriteStream('./public/data/environment/waterlevel.json')
//   http.get('http://waterlevel.ie/geojson/latest/', function (response) {
//     response.pipe(waterLevelFile)
//   })
// }

// getWaterLevels()

module.exports = app
