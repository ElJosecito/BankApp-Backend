const express = require('express');

const router = express.Router();

const account = require('../schema/accountSchema');

const card = require('../schema/cardSchema');

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

        const accountId = await account.findById(id).populate('card');

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


//add card to account
router.put('/account/:id/card', async (req, res) => {
    try {
        const { id } = req.params;

        const accountId = await account.findById(id);

        accountId.card = await createCard(accountId.number, res, accountId.name);

        const savedAccount = await accountId.save();

        res.json(savedAccount);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


//create card function

const createCard = async (number, res, name) => {
    try {
        let cvv, existingCard;

        do {
            // Generar un CVV aleatorio de 3 dígitos
            cvv = Math.floor(100 + Math.random() * 900).toString();

            // Verificar si el número de tarjeta y CVV ya existen en la base de datos
            existingCard = await card.findOne({ number, cvv });

        } while (existingCard);

        // Generar una fecha de vencimiento aleatoria (MM/YY)
        const expirationMonth = Math.floor(1 + Math.random() * 12);
        const expirationYear = new Date().getFullYear() + Math.floor(Math.random() * 10);

        const expiration = `${expirationMonth.toString().padStart(2, '0')}/${expirationYear.toString().slice(-2)}`;

        const newCard = new card({number, expiration, cvv, name });

        await newCard.save();

        res.json({ message: 'Card created successfully' });

        return newCard._id;
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


module.exports = router;