//import mongoose const mongoose = require('mongoose');// load env variablesconst dotenv = require('dotenv');dotenv.config() //db connectionmongoose.connect(  process.env.MONGO_URI,  {useNewUrlParser: true}).then(() => console.log('DB Connected')) mongoose.connection.on('error', err => {  console.log(`DB connection error: ${err.message}`)});
const express = require("express");
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require("dotenv").config(); // This will allow us to use env variables
//import routes
const userRoutes = require("./routes/user")

//app
const app = express();

//db connection
//mongoose.connect(  process.env.MONGO_URI,  {
mongoose.connect(  process.env.DATABASE,  {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {  console.log(`DB connection error: ${err.message}`)});

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//routes middleware
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//
// const morgan = require('morgan');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const expressValidator = require('express-validator');
//
// require("dotenv").config(); // This will allow us to use env variables
//
// //import routes
// const authRoutes = require('./routes/auth')
// const userRoutes = require('./routes/user')
// const categoryRoutes = require('./routes/category')
// const productRoutes = require('./routes/product')
//
// //app
// const app = express();
//
// //middlewares
// app.use(morgan('dev'));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(expressValidator());
// app.use(cors());
//
// //routes middleware
// app.use("/api", authRoutes);
// app.use("/api", userRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", productRoutes);
//
// const port = process.env.PORT || 8000;
//
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
