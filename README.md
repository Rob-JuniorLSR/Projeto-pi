# Chamados de Manutenção - Front-end

Front-end em React + Vite para o sistema de chamados de manutenção do IFRN
(Campus Pau dos Ferros), consumindo a API https://api-chamados.jefersonqueiroga.com.br.

## Print da tela inicial

![Tela inicial](./tela-inicial.png)

## O que o sistema faz

- Mostra o nome do dono da chave no topo
- Lista chamados com busca e filtros (status, tipo, local e prioridade)
- Detalhe do chamado em `/chamado/:id`
- Abre e edita chamados com o mesmo formulário (`/novo` e `/editar/:id`)
- Inicia o atendimento e resolve o chamado
- Exclui chamado com confirmação

## Tecnologias

React, Vite, React Router e Axios.

## Como rodar

```
npm install
npm run dev
```

Crie um arquivo `.env` na raiz com a sua chave:

```
VITE_API_KEY=sua-chave-aqui
```
