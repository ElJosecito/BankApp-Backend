const express = require("express");

const router = express.Router();

const account = require("../schema/accountSchema");

const card = require("../schema/cardSchema");

//get all cards

router.get("/cards", async (req, res) => {
  try {
    const allCards = await card.find();
    res.json(allCards);
    console.log("All cards get successfully");
  } catch (err) {
    res.json({ message: err });
  }
});

//get card by id

router.get("/card/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cardId = await card.findById(id);

    res.json(cardId);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//Retirar dinero de la cuenta

router.put("/card/retiro", async (req, res) => {
    try {
        const {number, cvv, amount} = req.body;

        const cardId = await card.findOne({number, cvv});

        if(!cardId) {
            return res.status(400).json({message: 'Tarjeta no encontrada'});
        }
        //find account by card number and update balance

        const accountId = await account.findOneAndUpdate({card: cardId._id}, {$inc: {balance: -amount}});

        if(!accountId) {
            return res.status(400).json({message: 'Cuenta no encontrada'});
        }

        res.json({message: 'Retiro realizado con éxito'});
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
//delete card by id
router.delete("/card/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await card.findByIdAndDelete(id);

    res.json({ message: "Card deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
