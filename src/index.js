const express = require('express');
const app = express();   //express framework


const env = require('dotenv');
env.config();//constants or environmental variables


// app.use(express.json()); //parsing jsonfile  //we use body  parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


const mongoose = require('mongoose'); //connect to mongoose
mongoose.connect(process.env.URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err) {
        console.log("================>>");
        if (!err) {
            console.log("Database connected !!!!!!!!!!")
        }
        console.log(err);
    });

const cors = require('cors');
app.use(cors({ origin: '*' }));

//routing
let routes = require("./router");
app.use('/iapi', routes);

//rest api calling 
app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
})