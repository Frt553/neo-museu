# Entregas

## [x] Site imersivo do Museu de História Natural
- [x] O site está em português do Brasil em todo o texto visível.
- [x] O site segue o prompt de build fornecido em `uRPDy1vRpmXHNqYQOyklbGesKjLzK_fw0JVuqmwAtN0.md`.
- [x] O site usa as imagens e o vídeo fornecidos na pasta `Assets Neo Museum`, enviados ao armazenamento do projeto e referenciados por `/manus-storage/`.
- [x] A página inicial tem hero em tela cheia com logotipo NHM, conteúdo editorial, chamadas para explorar e vídeo de fundo.
- [x] A navegação é responsiva para desktop e dispositivos móveis, incluindo menu móvel.
- [x] A seção “Explore o Nosso Mundo” apresenta conteúdo visual e editorial baseado nos materiais fornecidos.
- [x] O bloco 2 recebe a imagem do pterossauro por sobreposição cinematográfica a partir da coleção ancestral, conforme o prompt original.
- [x] A seção escura da coleção ancestral contrasta visualmente com a área clara, apresenta cards de capítulos e troca capítulos automaticamente.
- [x] A troca de capítulos é acompanhada por uma transição visual de areia, e cada capítulo pode ser selecionado manualmente.
- [x] A interface contém ações interativas, animações e transições com Motion e ícones Lucide React.
- [x] Os detalhes de espécime e informações editoriais abrem em modais responsivos sem retirar o visitante da experiência principal.
- [x] O layout é responsivo e mantém a paleta monocromática, a hierarquia tipográfica e o espaçamento descritos no prompt.

## [x] Verificação técnica
- [x] O runtime serve a rota `/` e o manifesto estático `/manus-routes.json`.
- [x] O proxy Vite de armazenamento redireciona corretamente os assets em `/manus-storage/*` no Preview.
- [x] `npm run lint` conclui sem erros TypeScript.
- [x] `npm run build` conclui sem erros e gera `dist/index.html`.
- [ ] Publicação pública: aguardando a etapa de publicação do checkpoint.

## [x] Primeira etapa audiovisual para gravação
- [x] A composição foi calibrada para palco desktop de gravação em 1920×1080.
- [x] Foi adicionado um indicador de progresso do modo filme fixo no topo, sincronizado com as cenas automáticas.
- [x] Foi adicionado cursor cinematográfico customizado com estados `EXPLORE`, `VIEW` e `OPEN`.
- [x] Foram adicionadas partículas ambientais e uma camada sutil de ruído/scanline.
- [x] O pterossauro agora voa continuamente em loop, com escala, rotação e deslocamento suaves na transição entre as seções, sem depender de scroll.
- [x] A experiência foi revisada em viewport 1920×1080 e em página completa.

## [x] Segunda etapa audiovisual sem dependência de scroll
- [x] O modo filme alterna automaticamente entre cinco cenas visuais a cada 5,2 segundos.
- [x] A seção “Analise o espécime” foi adicionada com scanner, hotspots, ficha técnica animada e controles manuais opcionais.
- [x] A linha do tempo geológica anima seus pontos continuamente dentro da mesma landing page.
- [x] O pterossauro e as principais leituras visuais continuam funcionando mesmo quando a página permanece parada.

## [x] Terceira etapa audiovisual com 3D
- [x] Three.js foi integrado ao projeto para renderizar uma placa tridimensional do fóssil real do acervo em tempo real.
- [x] O observatório 3D combina imagem do pterossauro, profundidade de placa, moldura, wireframe de leitura, marcadores e iluminação mineral.
- [x] Foram adicionados hotspots interativos com leituras científicas dentro da mesma landing page.
- [x] A seção 3D funciona automaticamente, sem depender da rolagem, e foi validada em 1920×1080.
- [x] A tipografia foi atualizada para Space Grotesk + DM Mono e o cursor foi reduzido a um marcador técnico minimalista, sem rótulos flutuantes.

## [x] Quarta etapa: tempo profundo e edição de conteúdo
- [x] A timeline simples foi substituída por uma composição de camadas sedimentares com seis eras geológicas, datas, títulos e textos curtos.
- [x] A timeline alterna automaticamente entre os períodos e também permite seleção manual sem sair da landing page.
- [x] O período Cretáceo revela o pterossauro do acervo como conexão visual com a seção anterior.
- [x] A linha de leitura, as texturas de sedimento e o código de catálogo reforçam a linguagem de escavação científica.
- [x] O parágrafo explicativo do observatório foi removido e substituído por identificação objetiva de catálogo.

## [x] Quinta etapa: peça de acervo e encerramento
- [x] O observatório recebeu três modos manuais de leitura: FÓSSIL, ESTRUTURA e ANÁLISE.
- [x] Foi adicionada uma etiqueta física com código NHM, nome do espécime, datação e escala 1:12.
- [x] Foi adicionada uma régua métrica de 1 metro sobre a placa tridimensional.
- [x] O final da landing page agora possui uma cena de encerramento com a frase “A história da Terra ainda está sendo descoberta.” e assinatura NHM.
- [x] A etapa foi validada em página completa 1920×1080, com lint e build concluídos.
