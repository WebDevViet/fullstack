import cookieParser from 'cookie-parser'
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import path from 'path'

import indexRouter from './routes/index'
import fileUpload from 'express-fileupload'

const app = express()

// config file upload
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 5 }, // giới hạn kích thước file là 5MB
    abortOnLimit: true,
    limitHandler: (req, res) => {
      res.status(400).json({ message: 'File size too large' })
    },
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
