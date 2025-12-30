import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: "aba18382-9c68-43b0-ba81-226010a47ff2", 
  token: "a18c6eba872cd62f550234b1bc159fda8b4a1209", 

  build: {
    outputFolder: "admin",
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
        path: "content", // Onde os arquivos JSON serão salvos
        format: "json",
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