const fs = require('fs');
const path = require('path');

const JSON_DATA = path.join(__dirname, 'template-mestre', 'content', 'index.json');
const DIST_DIR = __dirname; 

try {
    const data = JSON.parse(fs.readFileSync(JSON_DATA, 'utf8'));
    const files = fs.readdirSync(DIST_DIR).filter(file => file.endsWith('.html'));

    console.log('--- DIAGNÓSTICO DE INJEÇÃO POR ID ---');
    console.log('Injetando dados de:', data.titulo_principal);

    files.forEach(file => {
        const filePath = path.join(DIST_DIR, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let contador = 0;

        // 1. Injeta Título Principal via ID
        const regexPrincipal = /(id="tina-principal">)(.*?)(<\/h1>)/s;
        if (html.match(regexPrincipal)) {
            html = html.replace(regexPrincipal, `$1${data.titulo_principal}$3`);
            contador++;
        }

        // 2. Injeta Lista de Serviços via ID
        if (data.titulos_servicos) {
            data.titulos_servicos.forEach((item, index) => {
                const num = index + 1;

                // Títulos (h3)
                const regexTit = new RegExp(`(id="tina-servico-${num}">)(.*?)(<\\/h3>)`, 's');
                if (html.match(regexTit)) {
                    html = html.replace(regexTit, `$1${item.texto || ""}$3`);
                    contador++;
                }

                // Descrições (p)
                const regexDesc = new RegExp(`(id="tina-desc-${num}">)(.*?)(<\\/p>)`, 's');
                if (html.match(regexDesc)) {
                    html = html.replace(regexDesc, `$1${item.descricao || ""}$3`);
                    contador++;
                }
            });
        }

        if (contador > 0) {
            fs.writeFileSync(filePath, html);
            console.log(`✅ [${file}]: ${contador} campos atualizados com sucesso.`);
        }
    });

} catch (err) {
    console.error('❌ Erro:', err.message);
}