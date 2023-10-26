const express = require('express');

const router = express.Router();

const config = require('../../config');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Data = require('../schema/dataSchema');


