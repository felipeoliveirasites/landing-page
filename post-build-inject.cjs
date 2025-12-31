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
        let contador = 0;

       // 1. Substitui Título Principal
        const regexPrincipal = /\[\[\s*titulo_principal\s*\]\]/gi;
        if (regexPrincipal.test(html)) {
            html = html.replace(regexPrincipal, data.titulo_principal);
            contador++;
        }

        // 2. Substitui Títulos e Descrições de Serviços
        if (data.titulos_servicos) {
            data.titulos_servicos.forEach((item, index) => {
                const num = index + 1;
                
                // Busca [[titulo_1]], [[titulo_2]]...
                const regexTitulo = new RegExp(`\\[\\[\\s*titulo_${num}\\s*\\]\\]`, 'gi');
                if (regexTitulo.test(html)) {
                    html = html.replace(regexTitulo, item.texto || "");
                    contador++;
                }

                // BUSCA NOVA: [[descricao_1]], [[descricao_2]]...
                const regexDesc = new RegExp(`\\[\\[\\s*descricao_${num}\\s*\\]\\]`, 'gi');
                if (regexDesc.test(html)) {
                    html = html.replace(regexDesc, item.descricao || ""); // Pega do JSON e coloca no HTML
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