//use components
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//use express
const app = express();
app.use(express.json());
app.use(cors());

//port assign
const port = 3000;

//connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/usercrud')
    .then(() => console.log('Connected!'));

//create schema
const crudSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email:String,
    phone:String
});

//create model
const crudmodel = mongoose.model('crud', crudSchema);

//post method
app.post('/crud', async (req, res) => {
    const { fname,lname,email,phone } = req.body;
    try {
        const newcrud = new crudmodel({ fname,lname,email,phone });
        await newcrud.save();
        res.status(201).json(newcrud);
    } catch (error) {
        console.log(error);
      res.status(501).json({ error: 'Internal Server Error' });
    }

});

//get method
app.get('/crud', async (req, res) => {
    try {
        const details = await crudmodel.find();
        res.json(details);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: 'Not Found' });
    }
});
//update
app.put('/crud/:id', async (req, res) => {
    try {
        const { fname,lname,email,phone } = req.body;
        const id = req.params.id;
        const updatedcrud = await crudmodel.findByIdAndUpdate(
            id,
            { fname,lname,email,phone },
            { new: true }
        )
        if (!updatedcrud) {
            return res.status(404).json({ error: 'Not Found' });
        }
        res.json(updatedcrud)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete
app.delete('/crud/:id', async (req,res)=>{
    try {
            const id = req.params.id;
    await crudmodel.findByIdAndDelete(id)
    res.status(204).end();
    
    } catch (error) {
        console.log(error);
    }


});

//connect to port
app.listen(port, () => {
    console.log('listening')
});