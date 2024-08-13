const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000; // You can use any port

app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const recaptchaSecret = '6LfPJCYqAAAAANPQ9Iz_64lgwmdakbM63rdCPECZ';
    const recaptchaResponse = req.body['g-recaptcha-response'];
    
    // Verify reCAPTCHA
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: recaptchaSecret,
                response: recaptchaResponse
            }
        });

        const responseData = response.data;
        if (!responseData.success) {
            return res.send('reCAPTCHA verification failed, please try again.');
        }

        // Process the form data
        const name = req.body.name;
        const email = req.body.email;

        res.send(`Thank you, ${name}. Your form has been submitted successfully!`);
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
