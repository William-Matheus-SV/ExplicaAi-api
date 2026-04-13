// ============================================
// 1. VARIÁVEIS GLOBAIS
// ============================================
const urlParams = new URLSearchParams(window.location.search);
const matricula = urlParams.get("matricula");
const usuario = getUsuarioByMatricula(matricula);
const usuarioLogado = getUsuarioLogado();

if (!usuario) window.location.href = "busca.html";

// ============================================
// 2. FUNÇÃO AUXILIAR
// ============================================
function getIniciais(nome) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// ============================================
// 3. HORÁRIOS DO TUTOR
// ============================================
let horariosDisponiveis = [];
if (usuario.papel === "tutor") {
  horariosDisponiveis = [
    { dia: "Segunda-feira", horario: "14:00 - 16:00", disponivel: true },
    { dia: "Terça-feira", horario: "10:00 - 12:00", disponivel: true },
    { dia: "Quarta-feira", horario: "14:00 - 16:00", disponivel: true },
    { dia: "Quinta-feira", horario: "16:00 - 18:00", disponivel: true },
  ];
  const salvos = localStorage.getItem(`horarios_${usuario.matricula}`);
  if (salvos) horariosDisponiveis = JSON.parse(salvos);
}

// ============================================
// 4. FUNÇÃO PARA GERAR ESTRELAS
// ============================================
function gerarEstrelas(nota) {
  const notaNum = parseFloat(nota);
  const estrelasCheias = Math.floor(notaNum);
  const temMeiaEstrela = notaNum - estrelasCheias >= 0.5;
  const estrelasVazias = 5 - Math.ceil(notaNum);

  let html = "";
  for (let i = 0; i < estrelasCheias; i++)
    html += '<i class="bi bi-star-fill estrela-cheia"></i>';
  if (temMeiaEstrela) html += '<i class="bi bi-star-half estrela-meia"></i>';
  for (let i = 0; i < estrelasVazias; i++)
    html += '<i class="bi bi-star estrela-vazia"></i>';
  return html;
}

// ============================================
// 5. FUNÇÃO PRINCIPAL RENDERIZAR
// ============================================
function renderizar() {
  const isAlunoLogado = usuarioLogado && usuarioLogado.papel === "aluno";
  const isTutorLogado = usuarioLogado && usuarioLogado.papel === "tutor";
  const podeFazerMatch =
    (isAlunoLogado && usuario.papel === "tutor") ||
    (isTutorLogado && usuario.papel === "aluno");

  // AVALIAÇÃO DO TUTOR
  let avaliacaoTopoHtml = "";
  if (usuario.papel === "tutor") {
    const media = getMediaTutor(usuario.matricula);
    const total = getAvaliacoesByTutor(usuario.matricula).length;
    if (total > 0) {
      avaliacaoTopoHtml = `
                <div class="avaliacao-topo">
                    <div class="estrelas-topo">${gerarEstrelas(media)}</div>
                    <div class="nota-topo">${media}</div>
                    <div class="total-topo">(${total} ${total === 1 ? "avaliação" : "avaliações"})</div>
                </div>
            `;
    } else {
      avaliacaoTopoHtml = `
                <div class="avaliacao-topo">
                    <div class="estrelas-topo">${gerarEstrelas(0)}</div>
                    <div class="nota-topo sem-avaliacao">Sem avaliações</div>
                </div>
            `;
    }
  }

  // CONTEÚDO PRINCIPAL
  let htmlContent = `
        <div style="position: relative;">
            ${avaliacaoTopoHtml}
            <div class="profile-img">${getIniciais(usuario.nome)}</div>
        </div>
        <h2 class="text-center">${usuario.nome}</h2>
        <p class="text-center text-muted">
            <i class="bi bi-person-badge"></i> Matrícula: ${usuario.matricula} • ${usuario.idade} anos • 
            ${usuario.papel === "tutor" ? "🎓 Tutor" : "📚 Aluno"}
        </p>
        <p class="text-center">
            <strong>${usuario.papel === "tutor" ? "Matérias que ensina:" : "Precisa de ajuda em:"}</strong><br>
            ${usuario.materias.map((m) => `<span class="badge-subject">${m}</span>`).join("")}
        </p>
        <p><i class="bi bi-chat-text"></i> <strong>Bio:</strong><br>${usuario.bio || "Sem descrição"}</p>
    `;

  // TUTOR SENDO VISTO POR ALUNO
  if (usuario.papel === "tutor" && isAlunoLogado) {
    const materiasEmComum = usuarioLogado.materias.filter((m) =>
      usuario.materias.includes(m),
    );

    if (materiasEmComum.length > 0) {
      htmlContent += `
                <div class="mb-3 mt-3">
                    <label class="form-label fw-bold">Selecione a matéria para a tutoria:</label>
                    <select id="selectMateria" class="form-select">
                        ${materiasEmComum.map((m) => `<option value="${m}">${m}</option>`).join("")}
                    </select>
                </div>
            `;
    }

    const horariosDisponiveisFiltrados = horariosDisponiveis.filter(
      (h) => h.disponivel,
    );
    htmlContent += `<h4 class="mt-4"><i class="bi bi-calendar-week"></i> Horários Disponíveis</h4>`;

    if (horariosDisponiveisFiltrados.length === 0) {
      htmlContent += `<div class="text-muted text-center py-3">📅 Nenhum horário disponível no momento</div>`;
    } else {
      htmlContent += `<div id="horariosList">`;
      horariosDisponiveisFiltrados.forEach((h) => {
        htmlContent += `
                    <div class="schedule-item">
                        <span><i class="bi bi-calendar"></i> ${h.dia}</span>
                        <span class="schedule-time">${h.horario}</span>
                        <button class="btn-selecionar" data-dia="${h.dia}" data-horario="${h.horario}">Selecionar</button>
                    </div>
                `;
      });
      htmlContent += `</div>`;
      htmlContent += `<button id="btnConfirmarMatch" class="btn-acao" style="display:none"><i class="bi bi-check-circle"></i> Confirmar Match</button>`;
    }
  }

  // MATCH DIRETO
  if (podeFazerMatch && !(usuario.papel === "tutor" && isAlunoLogado)) {
    const textoBotao = isAlunoLogado ? "Solicitar Tutoria" : "Oferecer Tutoria";
    htmlContent += `<button id="btnMatchDireto" class="btn-acao"><i class="bi bi-chat-dots"></i> ${textoBotao}</button>`;
  }

  htmlContent += `<button class="btn-voltar w-100 mt-3" onclick="window.location.href='busca.html'">Voltar para Busca</button>`;

  document.getElementById("perfil").innerHTML = htmlContent;

  // ============================================
  // EVENTO DOS BOTÕES DE HORÁRIO (CORRIGIDO)
  // ============================================
  if (
    usuario.papel === "tutor" &&
    isAlunoLogado &&
    horariosDisponiveis.filter((h) => h.disponivel).length > 0
  ) {
    let horarioSelecionado = null;
    let materiaSelecionadaGlobal = "";

    // PEGAR A MATÉRIA SELECIONADA ANTES
    const selectMateria = document.getElementById("selectMateria");
    if (selectMateria) {
      materiaSelecionadaGlobal = selectMateria.value;
      // Atualizar quando mudar
      selectMateria.addEventListener("change", (e) => {
        materiaSelecionadaGlobal = e.target.value;
        console.log("📚 Matéria alterada para:", materiaSelecionadaGlobal);
      });
    }

    document.querySelectorAll(".btn-selecionar").forEach((btn) => {
      btn.onclick = () => {
        document
          .querySelectorAll(".btn-selecionar")
          .forEach((b) => (b.style.display = "inline-block"));
        btn.style.display = "none";
        horarioSelecionado = {
          dia: btn.dataset.dia,
          horario: btn.dataset.horario,
        };
        const btnConfirmar = document.getElementById("btnConfirmarMatch");
        btnConfirmar.style.display = "block";

        btnConfirmar.onclick = () => {
          // PEGAR A MATÉRIA DO DROPDOWN
          const selectMateria = document.getElementById("selectMateria");
          let materiaSelecionada = selectMateria ? selectMateria.value : "";

          console.log("📚 Matéria escolhida:", materiaSelecionada); // Debug

          confirmarMatchComHorario(
            horarioSelecionado.dia,
            horarioSelecionado.horario,
            materiaSelecionada // ← ADICIONAR O TERCEIRO PARÂMETRO
          );
        };
      };
    });
  }

  // MATCH DIRETO
  const btnMatchDireto = document.getElementById("btnMatchDireto");
  if (btnMatchDireto) {
    btnMatchDireto.onclick = () => confirmarMatchDireto();
  }
}

// ============================================
// 6. FUNÇÃO CONFIRMAR MATCH COM HORÁRIO
// ============================================
function confirmarMatchComHorario(dia, horario, materiaSelecionada) {
  // Se a matéria não veio como parâmetro, tenta pegar do dropdown
  if (!materiaSelecionada) {
    const selectMateria = document.getElementById("selectMateria");
    if (selectMateria && selectMateria.value) {
      materiaSelecionada = selectMateria.value;
    } else {
      // Fallback: pegar matérias em comum
      const materiasEmComum = usuarioLogado.materias.filter((m) =>
        usuario.materias.includes(m),
      );
      materiaSelecionada =
        materiasEmComum[0] || usuario.materias[0] || "Matéria geral";
    }
  }

  console.log("✅ Matéria confirmada:", materiaSelecionada); // Debug

  // Resto do código...
  const index = horariosDisponiveis.findIndex(
    (h) => h.dia === dia && h.horario === horario,
  );
  if (index !== -1) {
    horariosDisponiveis[index].disponivel = false;
    localStorage.setItem(
      `horarios_${usuario.matricula}`,
      JSON.stringify(horariosDisponiveis),
    );
  }

  const match = {
    alunoMatricula:
      usuarioLogado.papel === "aluno"
        ? usuarioLogado.matricula
        : usuario.matricula,
    tutorMatricula:
      usuarioLogado.papel === "tutor"
        ? usuarioLogado.matricula
        : usuario.matricula,
    alunoNome: usuarioLogado.nome,
    tutorNome: usuario.nome,
    dia: dia,
    horario: horario,
    materia: materiaSelecionada,
    status: "confirmado",
    dataMatch: new Date().toISOString(),
  };

  const matchSalvo = salvarMatch(match);
  window.location.href = `tutoria_marcada.html?matchId=${matchSalvo.id}&aluno=${match.alunoMatricula}&tutor=${match.tutorMatricula}&dia=${encodeURIComponent(dia)}&horario=${encodeURIComponent(horario)}&materia=${encodeURIComponent(materiaSelecionada)}`;
}

// ============================================
// 7. FUNÇÃO CONFIRMAR MATCH DIRETO
// ============================================
function confirmarMatchDireto() {
  const match = {
    alunoMatricula:
      usuarioLogado.papel === "aluno"
        ? usuarioLogado.matricula
        : usuario.matricula,
    tutorMatricula:
      usuarioLogado.papel === "tutor"
        ? usuarioLogado.matricula
        : usuario.matricula,
    alunoNome: usuarioLogado.nome,
    tutorNome: usuario.nome,
    status: "confirmado",
    dataMatch: new Date().toISOString(),
  };
  salvarMatch(match);
  window.location.href = `tutoria_marcada.html?aluno=${match.alunoMatricula}&tutor=${match.tutorMatricula}`;
}

// ============================================
// 8. EXECUTAR RENDERIZAÇÃO
// ============================================
renderizar();
