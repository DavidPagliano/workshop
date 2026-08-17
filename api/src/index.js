const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const config = require('./config/config');
const cycle = require('./routes/preCycle.route');
const event = require('./routes/event.route');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/workshop/cycle', cycle);
app.use('/workshop/event', event);

app.get('/', (req, res) => res.send('Welcome to the API'));

// Start server
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));