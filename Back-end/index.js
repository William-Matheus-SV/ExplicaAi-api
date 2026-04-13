/*
inicia o servidor
define a porta
liga tudo
*/
//require ('dotenv').config();
const app = require('./src/app');
//const connectDB = require('./src/config/database');

//connectDB();

//app.listen(process.env.PORT, () => {
  app.listen(3000, () => {
  console.log('Servidor rodando 🚀');
});

