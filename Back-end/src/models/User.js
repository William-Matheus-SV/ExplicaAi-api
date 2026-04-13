const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  tipo: String,
  email: String,
  senha: String,
  materias: [String],
  disponibilidade: [String]
});

module.exports = mongoose.model('User', userSchema);