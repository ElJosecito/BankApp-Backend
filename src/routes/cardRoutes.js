const express = require('express');

const router = express.Router();

const card = require('../schema/cardSchema');




//get all cards

router.get('/cards', async (req, res) => {
    try {
        const allCards = await card.find();
        res.json(allCards);
        console.log('All cards get successfully');
    } catch (err) {
        res.json({ message: err });
    }
});

//get card by id

router.get('/card/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const cardId = await card.findById(id);

        res.json(cardId);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

//create card
router.post('/generate/card', async (req, res) => {
    try {
        let randomNumber, number, cvv, existingCard;

        do {
            // Generar un número aleatorio de 14 dígitos para el número de tarjeta
            randomNumber = Math.floor(10000000000000 + Math.random() * 90000000000000);
            number = randomNumber.toString();

            // Generar un CVV aleatorio de 3 dígitos
            cvv = Math.floor(100 + Math.random() * 900).toString();

            // Verificar si el número de tarjeta y CVV ya existen en la base de datos
            existingCard = await card.findOne({ number, cvv });

        } while (existingCard);

        // Generar una fecha de vencimiento aleatoria (MM/YY)
        const expirationMonth = Math.floor(1 + Math.random() * 12);
        const expirationYear = new Date().getFullYear() + Math.floor(Math.random() * 10);

        const expiration = `${expirationMonth.toString().padStart(2, '0')}/${expirationYear.toString().slice(-2)}`;

        const newCard = new card({number, expiration, cvv });

        await newCard.save();

        res.json({ message: 'Card created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

//delete card by id

router.delete('/card/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await card.findByIdAndDelete(id);

        res.json({ message: 'Card deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


// Hacer cuentas para asociar el balance de la tarjeta con el balance de la cuenta



module.exports = router;