# Easy Recibos

Uma ferramenta moderna, de alto desempenho e visualmente sofisticada para geração e exportação de recibos e documentos corporativos, construída sob os princípios do design Neo-Brutalista.

## Funcionalidades Principais

*   **Identidade Neo-Brutalista Premium:** Interface atraente focada na alta conversão, usando tipografia forte (Cabinet Grotesk / Satoshi), bordas delineadas, sombras duras e cores vibrantes, entregando uma experiência "SaaS Premium" aos usuários.
*   **Múltiplos Modelos Dinâmicos de Documento:** Geração de Layouts PDF inteligentes adaptados ao tipo de documento escolhido pelo usuário:
    *   **Recibos & Notas de Serviço:** Layout direto ao ponto.
    *   **Faturas & Ordens de Serviço:** Layout corporativo de dupla coluna, destacando dados financeiros e prazos.
    *   **Propostas Comerciais, Orçamentos & Contratos:** Layout focado na leitura, com forte presença de blocos textuais e rodapés adaptativos com assinaturas duplas (Contratante e Contratada).
*   **Exportação PDF Nativa:** Tecnologia de conversão HTML-para-PDF no frontend utilizando `html2canvas` e `jsPDF`, garantindo que o documento visualizado na tela seja o documento salvo localmente de maneira fidedigna.
*   **Integração Iconify:** Repositório vasto de ícones em vetor de alta qualidade (`fluent-emoji-flat`, `ph`), adicionando expressividade para áreas chaves do formulário (Moeda, Condição de Pagamento, etc).
*   **Preview em Tempo Real:** Edite no formulário, veja no Preview. Qualquer campo alterado atualiza imediatamente a representação gráfica do documento PDF a ser gerado.
*   **Responsividade "Mobile-First":** Uma Home-Page incrivelmente adaptada a todos os dispositivos, garantindo que o botão principal de conversão esteja sempre à mão, independentemente do acesso (Desktop, Tablet, Celular).

## Como Executar o Projeto

Certifique-se de ter o Node.js instalado.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# 3. Abra no navegador usando o localhost gerado (ex: http://localhost:5173/)
```

## Stack Tecnológica

*   **Framework:** React (Vite)
*   **Estilização:** Tailwind CSS (Customizado com CSS puro para micro-interações)
*   **Ícones:** @iconify/react
*   **Geração de PDF:** jsPDF + html2canvas
