    require ('dotenv').config();
    const express = require('express');
    const paypal = require('./paypal');
    const cors = require('cors');



    const app = express();
    app.use(cors());

    app.set('view engine', 'ejs');

    app.get('/', (req, res) => {
        res.render('index');
    });

    // payment route
    app.post ('/pay', async (req, res) => {
        try {
            const link = await paypal.createOrder();
            const approvalUrl = link;
            res.redirect(link);
        } catch (error) {
            console.log(error);
            res.redirect('/error');
        }
    });

    // success route
    app.get('/success', async (req, res) => {
        try {
            await paypal.capturePayment(req.query.token);
            // message to the buyer that the payment was successful
            res.send('Payment was successful');
        }
        catch (error) {
            console.log(error);
            res.redirect('/error');
        }
    });

    // cancel route
    app.get('/cancel', (req, res) => {
        res.redirect('/');
    });


    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });