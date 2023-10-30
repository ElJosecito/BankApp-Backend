const express = require('express');

const router = express.Router();

const account = require('../schema/accountSchema');

const jwt = require('jsonwebtoken');

const card = require('../schema/cardSchema');


//validate token
const ValidateToken = (req, res, next) => {
    const token = req.header("auth-token");
  
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado" });
    }
  
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload.user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Handle token expiration
        return res.status(401).json({ message: "Token expirado" });
      } else {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
      }
    }
  };


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

        return newCard._id;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


//get all accounts
router.get('/accounts', ValidateToken, async (req, res) => {
    try {
        const allAccounts = await account.find();
        res.json(allAccounts);
        console.log('All accounts get successfully');
    } catch (err) {
        res.json({ message: err });
    }
});


//get account by id
router.get('/account/:id', ValidateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const accountId = await account.findById(id).populate('card');

        res.json(accountId);
    } catch (e) {
        console.error(e);
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


//add balance to account

router.put('/account/:id/balance', async (req, res) => {
    try {
        const { id } = req.params;
        const { balance } = req.body;

        // Find the account by ID
        const accountInstance = await account.findById(id);

        // Check if the account was found
        if (!accountInstance) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Update the balance property
        accountInstance.balance = balance;

        // Save the updated account
        const savedAccount = await accountInstance.save();

        res.json(savedAccount);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


//delete account by id

router.delete('/account/:id', ValidateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const accountId = await account.findById(id);

        const cardId = await card.findById(accountId.card);

        await accountId.remove();

        await cardId.remove();

        res.json({ message: 'Account deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});



module.exports = router;