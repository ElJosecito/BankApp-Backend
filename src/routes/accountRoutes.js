const express = require('express');

const router = express.Router();

const account = require('../schema/accountSchema');

//get all accounts

router.get('/accounts', async (req, res) => {
    try {
        const allAccounts = await account.find();
        res.json(allAccounts);
        console.log('All accounts get successfully');
    } catch (err) {
        res.json({ message: err });
    }
});


//get account by id

router.get('/account/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const accountId = await account.findById(id);

        res.json(accountId);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

//create account

router.post('/generate/account', async (req, res) => {
    try {

        const { name } = req.body;

        let randomNumber, number, existingAccount;

        do {
            // Generar un número aleatorio de 14 dígitos para el número de cuenta
            randomNumber = Math.floor(10000000000000 + Math.random() * 90000000000000);
            number = randomNumber.toString();

            // Verificar si el número de cuenta ya existe en la base de datos
            existingAccount = await account.findOne({ number });

        } while (existingAccount);

        if (existingAccount) {
            return res.status(400).json({ message: 'La cuenta ya existe' });
        }

        const newAccount = new account({ name, number });

        const savedAccount = await newAccount.save();

        res.json(savedAccount);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


module.exports = router;