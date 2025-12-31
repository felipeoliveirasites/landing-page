const fs = require('fs');
const path = require('path');

// 1. Caminho exato que você indicou: template-mestre -> content -> index.json
const JSON_DATA = path.join(__dirname, 'template-mestre', 'content', 'index.json');

// 2. Onde estão os seus arquivos .html (estou assumindo que estão na mesma pasta do script)
const DIST_DIR = __dirname;

try {
    // Diagnóstico inicial: o arquivo existe?
    if (!fs.existsSync(JSON_DATA)) {
        console.error(`❌ ERRO: Arquivo não encontrado em: ${JSON_DATA}`);
        console.log('Pastas encontradas aqui:', fs.readdirSync(__dirname));
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(JSON_DATA, 'utf8'));
    const files = fs.readdirSync(DIST_DIR).filter(file => file.endsWith('.html'));

    console.log('--- INICIANDO INJEÇÃO NOS IDs ---');

    files.forEach(file => {
        const filePath = path.join(DIST_DIR, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let mudou = false;

        // O Tina costuma envelopar os dados em um objeto com o nome da coleção
        // Vamos tentar acessar data.home ou o objeto direto
        const content = data.home || data;

        // 1. Injetar Título Principal
        if (content.titulo_principal) {
            const regexPrincipal = /(id="tina-principal"[^>]*>)(.*?)(<\/)/s;
            if (regexPrincipal.test(html)) {
                html = html.replace(regexPrincipal, `$1${content.titulo_principal}$3`);
                mudou = true;
            }
        }

        // 2. Injetar Serviços e Descrições (Loop de 1 a 13)
        if (content.titulos_servicos) {
            content.titulos_servicos.forEach((item, index) => {
                const num = index + 1;
                
                // Regex para o Título (id="tina-servico-X")
                const regTit = new RegExp(`(id="tina-servico-${num}"[^>]*>)(.*?)(<\\/)`, 's');
                if (regTit.test(html)) {
                    html = html.replace(regTit, `$1${item.texto}$3`);
                    mudou = true;
                }

                // Regex para a Descrição (id="tina-desc-X")
                const regDesc = new RegExp(`(id="tina-desc-${num}"[^>]*>)(.*?)(<\\/)`, 's');
                if (regDesc.test(html)) {
                    html = html.replace(regDesc, `$1${item.descricao || ""}$3`);
                    mudou = true;
                }
            });
        }

        if (mudou) {
            fs.writeFileSync(filePath, html);
            console.log(`✅ [${file}]: Conteúdo atualizado.`);
        } else {
            console.log(`⚠️ [${file}]: Nenhuma alteração feita (verifique os IDs no HTML).`);
        }
    });

} catch (err) {
    console.error('❌ Erro crítico:', err.message);
}