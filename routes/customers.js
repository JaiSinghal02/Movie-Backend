const express = require('express');
const { Customers, validateBody, validateUpdateBody } = require('../models/customer');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    const customer = await Customers.find();
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customers.findById(req.params.id);
        //if (!customer) res.send('Movie not found');
        if (!customer) res.send('Movie not found');
        else res.send(customer);
    }
    catch (err) {
        //console.log('Error here');
        res.status(404).send(err.message);
    }

});

router.post('/', async (req, res) => {
    const { error } = validateBody(req.body);
    if (error) {
        res.send(error.details[0].message);
        //console.log(check,"       ",req.body);
        return;
    }

    let customer = new Customers({
        isGold: req.body.isGold ? req.body : false,
        name: req.body.name,
        phone: req.body.phone ? req.body.phone : null
    });
    customer = await customer.save();
    res.send(customer);

});

router.put('/:id', async (req, res) => {
    const { error } = validateUpdateBody(req.body)
    if (error) {
        res.send(error.details[0].message);
        return;
    }
    try {
        const ogcustomer = await Customers.findById(req.params.id);
        const customer = await Customers.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name ? req.body.name : ogcustomer.name,
                phone: req.body.phone ? req.body.phone : ogcustomer.phone,
                isGold: req.body.isGold ? req.body.isGold : ogcustomer.isGold
            }
        }, { new: true });
        res.send(customer)
    }
    catch (err) {
        res.send(err.message);
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customers.findByIdAndDelete(req.params.id);
        res.send(customer);
        console.log("Deletion successful...");
    }
    catch (err) {
        res.send(err.message);
        console.log('Deletion unsuccessful...');
    }
});


module.exports = router;