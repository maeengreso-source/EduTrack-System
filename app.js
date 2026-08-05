require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");

// ===============================
// DATABASE
// ===============================

const pool = require("./config/db"); 

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err.message);
  }
})();


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();
app.use(expressLayouts);

app.set("layout", "layouts/layout");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      secure: false, // true kapag HTTPS na sa production
      sameSite: "lax",
    },
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes)
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
