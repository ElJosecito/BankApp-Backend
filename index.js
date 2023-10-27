//Load express
const express = require('express');
//Initialize express
const app = express();
//load config
const config = require('./config');

//Load mongoose
const mongoose = require('mongoose');
//Connect to mongoose
mongoose.connect(`mongodb://${config.dbConfig.host}:${config.dbConfig.port}/${config.dbConfig.name}`);
const db = mongoose.connection;

//db error handling
db.once('open', () => {
    console.log('Database succesfully connected!');
});
db.on('error', (err) => {
    console.log('Database connection error: ', err);
});

//midelewares
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//body parser
app.use(express.json());

//routes

//user routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/', userRoutes);

//data routes
const dataRoutes = require('./src/routes/dataRoute');
app.use('/api/', dataRoutes);

//card routes
const cardRoutes = require('./src/routes/cardRoutes');
app.use('/api/', cardRoutes);

//account routes
const accountRoutes = require('./src/routes/accountRoutes');
app.use('/api/', accountRoutes);


//port and connection
const port = config.appConfig.port;
app.listen(port, () => console.log(`Server running on port ${port}`));