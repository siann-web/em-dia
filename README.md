# Em dia — seu espaço de estudos

Uma aplicação SPA para estudantes organizarem suas tarefas e acompanharem o progresso, sem recarregar a página. O tema é o planejamento de estudos com uma interface leve e adaptável a computadores e celulares.

## Framework

O projeto usa **React** com **Vite**. React foi escolhido por sua componentização e gerenciamento de estado, que permitem atualizar tarefas e indicadores de forma dinâmica; o Vite oferece um ambiente simples de desenvolvimento e geração da versão de produção.

## Como executar

É necessário Node.js 20 ou superior e npm. No terminal, a partir desta pasta:

```powershell
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite (normalmente `http://127.0.0.1:5173`). Para verificar o projeto, execute `npm test` e `npm run build`. A versão gerada fica em `dist`; para visualizá-la, execute `npm run preview`.

## Funcionalidades

- Navegação entre visão geral, tarefas e informações do projeto sem recarregar a página; o endereço acompanha a seção e suporta voltar e avançar.
- Cadastro de tarefas com nome, disciplina e prazo opcional.
- Marcação como concluída ou pendente, exclusão e filtros.
- Contadores e percentual de progresso atualizados imediatamente.
- Dados armazenados no `localStorage` do navegador. Eles permanecem após recarregar, mas são locais ao navegador/dispositivo e podem ser apagados ao limpar seus dados. Não há conta nem sincronização.

## Roteiro de apresentação

1. Abra a aplicação e mostre a navegação entre as seções.
2. Cadastre duas tarefas, preenchendo disciplina e prazo em uma delas.
3. Conclua uma tarefa e mostre a atualização dos indicadores e do progresso.
4. Alterne os filtros, exclua uma tarefa e recarregue a página para demonstrar a persistência local.
5. Redimensione a janela para mostrar a adaptação da interface.

O código da interface está em `src/main.jsx`, os estilos em `src/style.css` e as operações de dados em `src/tasks.js`.
