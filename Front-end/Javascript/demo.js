// Javascript/demo.js

function criarUsuariosDemonstracao() {
    console.log("🔍 Verificando usuários de demonstração...");
    
    // Perfis demo que queremos garantir que existam
    const demos = [
        { 
            nome: "🎓 Aluno Demo", 
            matricula: "aluno_demo", 
            senha: "123456", 
            papel: "aluno", 
            idade: 16, 
            bio: "Aluno de demonstração para testes no GitHub Pages. Precisa de ajuda em Matemática e Física.", 
            materias: ["Matemática", "Física"], 
            escola: "Escola Demo" 
        },
        { 
            nome: "👨‍🏫 Tutor Demo", 
            matricula: "tutor_demo", 
            senha: "123456", 
            papel: "tutor", 
            idade: 18, 
            bio: "Tutor de demonstração para testes. Posso ajudar com Matemática, Física e Química!", 
            materias: ["Matemática", "Física", "Química"], 
            escola: "Escola Demo" 
        }
    ];
    
    // Verificar e criar cada perfil demo se não existir
    demos.forEach(demo => {
        const existe = getUsuarioByMatricula(demo.matricula);
        if (!existe) {
            salvarUsuario(demo);
            console.log(`✅ Usuário demo criado: ${demo.nome} (${demo.matricula})`);
        } else {
            console.log(`ℹ️ Usuário demo já existe: ${demo.nome} (${demo.matricula})`);
        }
    });
    
    // Opcional: também manter os usuários antigos de exemplo (se quiser)
    const usuariosExistentes = getUsuarios();
    if (usuariosExistentes.length === 0) {
        // Só cria os exemplos numéricos se não houver NENHUM usuário
        const exemplosNumericos = [
            { nome: "Luiza Lima", matricula: "1111", senha: "123", papel: "aluno", idade: 17, bio: "Dificuldade em exatas", materias: ["Química", "Matemática"], escola: "Escola Exemplo" },
            { nome: "Maria Oliveira", matricula: "2222", senha: "123456", papel: "aluno", idade: 16, bio: "Dedicada", materias: ["Matemática", "Física"], escola: "Escola Exemplo" },
            { nome: "Pedro Gomes", matricula: "3333", senha: "123", papel: "aluno", idade: 15, bio: "Gosta de basquete", materias: ["Física", "Química"], escola: "Escola Exemplo" },
            { nome: "Ana Costa", matricula: "7777", senha: "123", papel: "tutor", idade: 18, bio: "Olimpíadas científicas", materias: ["Física"], escola: "Escola Exemplo" },
            { nome: "Carlos Andrade", matricula: "8888", senha: "123", papel: "tutor", idade: 19, bio: "Universitário", materias: ["Química", "Matemática"], escola: "Escola Exemplo" },
            { nome: "João Silva", matricula: "9999", senha: "123", papel: "tutor", idade: 17, bio: "Apaixonado por exatas", materias: ["Matemática", "Física"], escola: "Escola Exemplo" }
        ];
        
        exemplosNumericos.forEach(usuario => salvarUsuario(usuario));
        console.log("🎉 Usuários de exemplo (1111, 2222, etc) também foram criados!");
    }
}

// Executar automaticamente após o storage.js carregar
setTimeout(() => {
    if (typeof getUsuarios !== 'undefined') {
        criarUsuariosDemonstracao();
    }
}, 200);