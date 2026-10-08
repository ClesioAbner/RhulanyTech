# RhulanyTech

Loja online de tecnologia e gaming em Moçambique, feita com React 18, TypeScript, Vite, Tailwind CSS e Framer Motion.

## Comandos

```bash
npm install           # instalar dependências
npm run dev           # servidor de desenvolvimento (http://localhost:5173)
npm run build         # verificação de tipos + build de produção (pasta dist/)
npm run preview       # pré-visualizar o build
npm run lint          # ESLint, sem avisos permitidos
npm run format        # formatar todo o projeto com Prettier
npm run format:check  # confirmar que está tudo formatado
```

Antes de cada commit: `npm run format`, `npm run lint` e `npm run build`.

## Variáveis de ambiente

Copia `.env.example` para `.env`. As chaves do EmailJS são opcionais: sem elas, o formulário de contacto abre a
aplicação de email do visitante com a mensagem já escrita. O `.env` nunca vai para o Git.

## Estrutura

```
src/
  App.tsx                 rotas e layout geral
  pages/                  uma página por rota (Home, Shop, ProductPage, Checkout, Blog, ...)
  components/
    layout/               cabeçalho e rodapé
    ui/                   peças genéricas (campos, ícones, títulos de secção, redes sociais)
    home/                 secções da página inicial
    shop/                 montra 3D, prateleiras e cartões de produto
      catalogue/          catálogo com filtros, pesquisa e ordenação
    product/              galeria e telefone 3D em CSS (PhoneBody)
      webgl/              telefone em WebGL da página de produto, carregado só quando o browser suporta
    payments/             animação dos pagamentos da página inicial
      screens/            ecrãs desenhados em canvas (bloqueio, checkout, carteiras, cartão, PayPal)
    checkout/             passos, formulários, confirmação e recibo da encomenda
    assistant/            chat do assistente (o cérebro fica no backend)
    cart/                 gaveta, linhas e quantidades do carrinho
    account/              formulário de entrada e registo
    content/              blog, sobre e contacto
      article/            leitura de um artigo (índice, blocos, partilha)
      chat/               telefones com conversas do blog
  data/                   catálogo, artigos do blog e dados da loja
  lib/                    lógica sem interface (preços, checkout, recibo em PDF, animações, cores)
    assistant/            contrato e cliente do backend do assistente
  stores/                 estado global com zustand (carrinho, encomendas, utilizador)
dev/                      só para `npm run dev` (respostas de demonstração do chat)
public/
  images/produtos/        fotografias de estúdio em WebP (600 e 1200 px)
  images/blog/            imagens dos artigos
  videos/                 vídeo do banner da página inicial
```

## Assistente (chat)

O chat no canto do ecrã é só a interface: quem responde é um backend, que recebe um `POST` por mensagem e
responde em streaming (`application/x-ndjson`) ou de uma vez (`application/json`). O contrato está em
`src/lib/assistant/types.ts`.

- Em `npm run dev`, `dev/assistantMock.ts` responde com exemplos para se poder testar o visual (escreva "erro"
  para ver uma falha).
- No site publicado, o chat só aparece quando `VITE_ASSISTANT_URL` aponta para o backend.

## Estado atual

- Os pagamentos (M-Pesa, e-Mola, mKesh, cartão e PayPal) são simulados: `PAYMENTS_LIVE` em `src/lib/checkout.ts`
  está a `false` e `processPayment` é o ponto onde entra a integração real.
- Encomendas, carrinho e conta ficam no `localStorage` do browser até existir backend.
