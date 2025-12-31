const fs = require('fs');
const path = require('path');

const JSON_DATA = path.join(__dirname, 'template-mestre', 'content', 'index.json');
const DIST_DIR = path.join(__dirname);

try {
    const data = JSON.parse(fs.readFileSync(JSON_DATA, 'utf8'));
    const files = fs.readdirSync(DIST_DIR).filter(file => file.endsWith('.html'));

    console.log('--- DIAGNÓSTICO DE INJEÇÃO ---');
    console.log('Dados carregados:', data.titulo_principal);

    files.forEach(file => {
        const filePath = path.join(DIST_DIR, file);
        let html = fs.readFileSync(filePath, 'utf8');
        // Adicione isso para debugar:
if (file === 'index.html') {
    console.log('--- CONTEÚDO DO INDEX ---');
    console.log(html.substring(0, 500)); // Mostra os primeiros 500 caracteres
}
        let contador = 0;

        // 1. Substitui Título Principal (Regex aceita espaços internos)
        // Busca [[ titulo_principal ]] ou [[titulo_principal]]
        const regexPrincipal = /\[\[\s*titulo_principal\s*\]\]/g;
        if (regexPrincipal.test(html)) {
            html = html.replace(regexPrincipal, data.titulo_principal);
            contador++;
        }

        // 2. Substitui os Títulos de Serviços
        if (data.titulos_servicos) {
            data.titulos_servicos.forEach((item, index) => {
                const num = index + 1;
                // Busca [[ titulo_1 ]], [[titulo_1]], etc.
                const regexServico = new RegExp(`\\[\\[\\s*titulo_${num}\\s*\\]\\]`, 'g');
                
                if (regexServico.test(html)) {
                    html = html.replace(regexServico, item.texto);
                    contador++;
                }
            });
        }

        if (contador > 0) {
            fs.writeFileSync(filePath, html);
            console.log(`✅ [${file}]: ${contador} substituições feitas.`);
        } else {
            console.log(`⚠️ [${file}]: Nenhum placeholder [[titulo_x]] encontrado.`);
        }
    });

} catch (err) {
    console.error('❌ Erro crítico:', err.message);
}