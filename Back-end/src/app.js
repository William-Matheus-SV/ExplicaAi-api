const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
const userRoutes = require ('./routes/userRoutes');

app.use(express.json());
app.use(userRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;
