const express = require('express');

const router = express.Router();

const config = require('../../config');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const data = require('../schema/dataSchema');


//get all data

router.get('/data', async (req, res) => {
    try {
        const allData = await data.find();
        res.json(allData);
        console.log('All data get successfully');
    } catch (err) {
        res.json({ message: err });
    }
});



module.exports = router;

