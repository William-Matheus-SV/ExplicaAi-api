const express = require('express');
const router = express.Router();
const User = require('../models/User');

// criar usuário
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  const novoUsuario = {
    id: id++,
    nome,
    tipo,
    materias,
    disponibilidade,
    email,
    senha
  };

  users.push(novoUsuario);

  res.json(novoUsuario);

// listar usuários
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// listar tutores
router.get('/tutors', async (req, res) => {
  const tutors = await User.find({tipo: 'tutor'});
  res.json(tutors);
});

// criar match (aluno escolhe tutor)
router.post('/match', (req, res) => {
  const { alunoId, tutorId, materia } = req.body;

  // validação básica
  const aluno = users.find(u => u.id === alunoId && u.tipo === 'aluno');
  const tutor = users.find(u => u.id === tutorId && u.tipo === 'tutor');

  if (!aluno || !tutor) {
    return res.status(400).json({ erro: 'Aluno ou tutor inválido' });
  }

  const novoMatch = {
    id: matchId++,
    alunoId,
    tutorId,
    materia,
    status: 'pendente',
    data: new Date()
  };

  matches.push(novoMatch);

  res.json(novoMatch);
});

//listar matches
router.get('/match', (req, res) => {
  res.json(matches);
});

//aceitar ou recusar os matches
router.put('/match/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const match = matches.find(m => m.id == id);

  if (!match) {
    return res.status(404).json({ erro: 'Match não encontrado' });
  }

  if (!['aceito', 'recusado'].includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  match.status = status;

  res.json(match);
});

module.exports = router;