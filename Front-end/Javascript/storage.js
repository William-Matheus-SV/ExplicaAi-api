// Sistema de armazenamento local
const STORAGE_KEYS = {
  USUARIOS: "explicaai_usuarios",
  MATCHES: "explicaai_matches",
  USUARIO_LOGADO: "explicaai_usuario_logado",
  AVALIACOES: "explicaai_avaliacoes",
};

// Login com matrícula e senha
function fazerLogin(matricula, senha) {
  const usuarios = getUsuarios();
  const usuario = usuarios.find(
    (u) => u.matricula === matricula && u.senha === senha,
  );
  if (usuario) {
    localStorage.setItem(STORAGE_KEYS.USUARIO_LOGADO, JSON.stringify(usuario));
    return usuario;
  }
  return null;
}

// Logout
function fazerLogout() {
  localStorage.removeItem(STORAGE_KEYS.USUARIO_LOGADO);
}

// Usuário logado
function getUsuarioLogado() {
  const usuario = localStorage.getItem(STORAGE_KEYS.USUARIO_LOGADO);
  return usuario ? JSON.parse(usuario) : null;
}

// Salvar usuário
function salvarUsuario(usuario) {
  const usuarios = getUsuarios();
  usuario.id = Date.now().toString();
  usuario.createdAt = new Date().toISOString();
  usuarios.push(usuario);
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  return usuario;
}

// Salvar lista completa de usuários
function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
}

// Buscar todos usuários
function getUsuarios() {
  const usuarios = localStorage.getItem(STORAGE_KEYS.USUARIOS);
  return usuarios ? JSON.parse(usuarios) : [];
}

// Buscar usuários por tipo (aluno/tutor)
function getUsuariosByTipo(tipo) {
  const usuarios = getUsuarios();
  return usuarios.filter((u) => u.papel === tipo);
}

// Buscar usuário por matrícula
function getUsuarioByMatricula(matricula) {
  const usuarios = getUsuarios();
  return usuarios.find((u) => u.matricula === matricula);
}

//=========================//
//Matches//
//=========================//

// Salvar match
function salvarMatch(match) {
  const matches = getMatches();
  match.id = Date.now().toString();
  match.data = new Date().toISOString();
  match.status = match.status || "pendente";
  matches.push(match);
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  return match;
}

// Buscar matches
function getMatches() {
  const matches = localStorage.getItem(STORAGE_KEYS.MATCHES);
  return matches ? JSON.parse(matches) : [];
}

// Buscar matches por usuário
function getMatchesByUsuario(matricula) {
  const matches = getMatches();
  return matches.filter(
    (m) => m.alunoMatricula === matricula || m.tutorMatricula === matricula,
  );
}
// Sugerir matches para um aluno
function sugerirMatchesParaAluno(matriculaAluno) {
  const aluno = getUsuarioByMatricula(matriculaAluno);
  if (!aluno || aluno.papel !== "aluno") return [];

  const tutores = getUsuariosByTipo("tutor");
  const matchesSugeridos = [];

  tutores.forEach((tutor) => {
    const materiasComuns = aluno.materias.filter((m) =>
      tutor.materias.includes(m),
    );
    if (materiasComuns.length > 0) {
      matchesSugeridos.push({
        tutor: tutor,
        materiasComuns: materiasComuns,
        pontuacao: materiasComuns.length,
      });
    }
  });

  return matchesSugeridos.sort((a, b) => b.pontuacao - a.pontuacao);
}
// Sugerir matches para um tutor
function sugerirMatchesParaTutor(matriculaTutor) {
  const tutor = getUsuarioByMatricula(matriculaTutor);
  if (!tutor || tutor.papel !== "tutor") return [];

  const alunos = getUsuariosByTipo("aluno");
  const matchesSugeridos = [];

  alunos.forEach((aluno) => {
    const materiasComuns = aluno.materias.filter((m) =>
      tutor.materias.includes(m),
    );
    if (materiasComuns.length > 0) {
      matchesSugeridos.push({
        aluno: aluno,
        materiasComuns: materiasComuns,
        pontuacao: materiasComuns.length,
      });
    }
  });

  return matchesSugeridos.sort((a, b) => b.pontuacao - a.pontuacao);
}

//=============================//
//Funções de Avaliação estrelas//
//=============================//

// Salvar avaliação
function salvarAvaliacao(avaliacao) {
  const avaliacoes = getAvaliacoes();
  avaliacao.id = Date.now().toString();
  avaliacao.data = new Date().toISOString();
  avaliacoes.push(avaliacao);
  localStorage.setItem(STORAGE_KEYS.AVALIACOES, JSON.stringify(avaliacoes));
  return avaliacao;
}
//Busca todas as avaliações que estão salvas no navegador
function getAvaliacoes() {
    const avaliacoes = localStorage.getItem(STORAGE_KEYS.AVALIACOES);
    return avaliacoes ? JSON.parse(avaliacoes) : [];
}
// Buscar todas avaliações
function getAvaliacoes() {
  const avaliacoes = localStorage.getItem(STORAGE_KEYS.AVALIACOES);
  return avaliacoes ? JSON.parse(avaliacoes) : [];
}

// Buscar avaliações de um tutor
function getAvaliacoesByTutor(tutorMatricula) {
  const avaliacoes = getAvaliacoes();
  return avaliacoes.filter((a) => a.tutorMatricula === tutorMatricula);
}

// Calcular média de um tutor
function getMediaTutor(tutorMatricula) {
  const avaliacoes = getAvaliacoesByTutor(tutorMatricula);
  if (avaliacoes.length === 0) return 0;
  const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
  return (soma / avaliacoes.length).toFixed(1);
}

// Verificar se aluno já avaliou aquele match
function jaAvaliou(matchId, alunoMatricula) {
  const avaliacoes = getAvaliacoes();
  return avaliacoes.some(
    (a) => a.matchId === matchId && a.alunoMatricula === alunoMatricula,
  );
}
