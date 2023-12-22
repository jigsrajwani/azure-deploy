const express = require("express");
const router = express.Router();
const Addon = require("../models/Addon");

// POST Create a new addon = (api/addon/createAddon)
router.post('/createAddon', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        // Create a new addon document
        const addon = new Addon({
            name,
            description,
            price
        });

        // Save the addon to the database
        await addon.save();

        res.json(addon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all addons
router.get('/addons', async (req, res) => {
    try {
      const addons = await Addon.find();
      res.json(addons);
    } catch (error) {
      console.error('Error fetching addons:', error);
      res.status(500).send('Error fetching addons');
    }
  });
  

module.exports = router;