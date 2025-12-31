import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: "aba18382-9c68-43b0-ba81-226010a47ff2", 
  token: "a18c6eba872cd62f550234b1bc159fda8b4a1209", 

  build: {
    outputFolder: "admin",
    // IMPORTANTE: Como o config.ts está dentro de 'template-mestre/tina', 
    // usamos "../" para que a pasta 'admin' seja criada dentro de 'template-mestre'
    publicFolder: "../", 
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Página Inicial",
        // O caminho deve ser relativo ao arquivo config.ts.
        // Como o JSON está em 'template-mestre/content/index.json' 
        // e o config está em 'template-mestre/tina/config.ts', usamos apenas "content"
        path: "content", 
        format: "json",
              ui: {
          // Isso diz ao Tina: "Quando eu clicar no index.json, me mostre o site real"
          router: ({ document }) => {
            return `/?edit`;
          },
        },
        fields: [
          {
            type: "string",
            name: "titulo_principal",
            label: "Título Principal do Site",
          },
          {
            type: "object",
            list: true,
            name: "titulos_servicos",
            label: "Lista de 13 Títulos",
            ui: {
              itemProps: (item) => ({ label: item?.texto || "Novo Título" }),
            },
            fields: [
              { type: "string", name: "texto", label: "Texto do Título" },
            ],
          },
        ],
      },
    ],
  },
});