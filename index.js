const express = require('express');
const PORT = process.env.PORT || 5050;
const app = express();
const product = require('./api/product');
app.use('/api/product', product);
app.listen(PORT);