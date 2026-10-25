# Museu de História Natural — plano de implementação

## Escopo
Implementar o site editorial e imersivo descrito no prompt `uRPDy1vRpmXHNqYQOyklbGesKjLzK_fw0JVuqmwAtN0.md`, em português do Brasil, usando os assets fornecidos em `public/assets/neo-museum`. O produto é uma página única responsiva, sem autenticação, servidor ou banco de dados.

## Arquitetura
- `src/App.tsx`: composição da experiência inteira, estado de navegação/menu/modais, capítulos e componente `SandTransitionImage`.
- `src/index.css`: tokens Tailwind, tipografia, paleta e reset visual.
- `public/assets/neo-museum/`: imagens e vídeo fornecidos pelo usuário.
- `public/manus-routes.json`: manifesto da rota pública `/`.
- `app.config.ts`: metadado de logo do projeto.

## Implementação
Reaproveitar a implementação React/Motion/Lucide já incluída no pacote recebido, mantendo a estrutura aprovada do blueprint: hero em tela cheia, vídeo de fundo, navegação responsiva, seção editorial de descoberta, coleção ancestral escura com troca automática e transição de areia, cards de capítulos e modais. Substituir as URLs externas de mídia pelas referências relativas aos arquivos locais fornecidos, preservando acessibilidade e comportamento responsivo.

## Direção de design
Três estilos considerados: brutalismo editorial de arquivo (0,06); naturalismo museológico clássico (0,04); galeria digital neo-futurista (0,08). Escolha: **brutalismo editorial de arquivo**.

- **Movimento:** brutalismo editorial de arquivo, com composição tipográfica, grandes áreas negativas e contraste quase monocromático.
- **Princípios:** hierarquia tipográfica forte; ritmo de galeria; contraste entre superfície clara e acervo escuro; interação discreta e tátil.
- **Cor:** branco quebrado e pretos profundos evocam papel, pedra e salas de exposição; cinzas funcionam como anotações de catálogo. Sem roxo ou índigo.
- **Layout:** fluxo vertical cinematográfico com sobreposições e painéis assimétricos, evitando uma grade centralizada convencional.
- **Assinaturas:** logotipo NHM geométrico; rótulos em mono com espaçamento de arquivo; imagem do pterodáctilo atravessando a mudança entre seções.
- **Interação:** navegação por âncoras e capítulos como manipulação de um catálogo; hover e modais revelam informação sem interromper a jornada.
- **Animação:** entradas suaves, deslocamentos curtos, troca de capítulos a cada 3,5s e dissolução granular inspirada em areia; respeitar `prefers-reduced-motion` quando aplicável.
- **Tipografia:** Inter para títulos e leitura; JetBrains Mono para metadados, navegação e indicadores.
- **Essência:** um museu digital que transforma fósseis em uma narrativa visual de descoberta; preciso, contemplativo, provocador.
- **Voz:** frases curtas, informativas e evocativas. Exemplos: “Desenterre as histórias do nosso planeta.” e “Não apenas exibimos fósseis. Contamos a história da Terra.”
- **Marca:** NHM desenhado em SVG com blocos geométricos, funcionando como wordmark e sinal de inventário.
- **Cor proprietária:** `#0a0a0a`, o preto de acervo que marca a coleção ancestral.

## Entrega
Usar o comando de build do projeto (`npm run build`), servir no runtime 3000, confirmar `/manus-routes.json`, salvar checkpoint no repositório canônico e publicar quando a configuração de publicação do projeto permitir.
