// Javascript/demo.js
function criarUsuariosDemonstracao() {
    const usuarios = getUsuarios();
    
    if (usuarios.length === 0) {
        console.log("📦 Criando usuários de demonstração...");
        
        const usuariosDemo = [
            { nome: "Luiza Lima", matricula: "1111", senha: "123", papel: "aluno", idade: 17, bio: "Dificuldade em exatas", materias: ["Química", "Matemática"], escola: "Escola Exemplo" },
            { nome: "Maria Oliveira", matricula: "2222", senha: "123456", papel: "aluno", idade: 16, bio: "Dedicada", materias: ["Matemática", "Física"], escola: "Escola Exemplo" },
            { nome: "Pedro Gomes", matricula: "3333", senha: "123", papel: "aluno", idade: 15, bio: "Gosta de basquete", materias: ["Física", "Química"], escola: "Escola Exemplo" },
            { nome: "Ana Costa", matricula: "7777", senha: "123", papel: "tutor", idade: 18, bio: "Olimpíadas científicas", materias: ["Física"], escola: "Escola Exemplo" },
            { nome: "Carlos Andrade", matricula: "8888", senha: "123", papel: "tutor", idade: 19, bio: "Universitário", materias: ["Química", "Matemática"], escola: "Escola Exemplo" },
            { nome: "João Silva", matricula: "9999", senha: "123", papel: "tutor", idade: 17, bio: "Apaixonado por exatas", materias: ["Matemática", "Física"], escola: "Escola Exemplo" }
        ];
        
        usuariosDemo.forEach(usuario => salvarUsuario(usuario));
        console.log("🎉 6 usuários de demonstração criados!");
    }
}

// Executar automaticamente
setTimeout(() => criarUsuariosDemonstracao(), 100);