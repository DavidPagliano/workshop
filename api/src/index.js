const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');
const cycle = require('./routes/preCycle.route');
const event = require('./routes/event.route');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/workshop/cycle', cycle);
app.use('/workshop/event', event);
connectDB();

app.get('/', (req, res) => res.send('Welcome to the API'));

// Start server
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));