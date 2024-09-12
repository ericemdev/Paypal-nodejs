const axios = require('axios');

async function generateAccessToken () {
    const response = await axios({
        url: process .env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'POST',
        data: 'grant_type=client_credentials',
        auth : {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        },
    });
    console .log(response.data);
    return response.data.access_token;
}


exports.createOrder = async () => {
    const accessToken = await generateAccessToken();
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: '25.00',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '25.00',
                            },
                        },
                    },
                    description: 'Membership Fee',
                },
            ],
            application_context: {
                return_url: process.env.BASE_URL + '/success',
                cancel_url: process.env.BASE_URL + '/cancel',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'visit Mara',
            },
        }),
    });

    console.log(response.data);
    return response.data.links.find(link => link.rel === 'approve').href;
};

exports.capturePayment = async (orderID) => {
    const accessToken = await generateAccessToken();
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders/' + orderID + '/capture',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    console.log(response.data);
    return response.data;
};