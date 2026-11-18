# PRD — Gestão de Projetos CET 2026 · Rautaki

**Versão do PRD:** 0.1
**Data:** 17 de novembro de 2026
**Versão do app de referência:** v0.0.15
**Cliente:** CET – Companhia de Engenharia de Tráfego de São Paulo
**Fornecedor:** Rautaki Tecnologia

---

## Sumário

1. [Visão do produto](#1-visão-do-produto)
2. [Público e personas](#2-público-e-personas)
3. [Escopo — funcionalidades entregues](#3-escopo--funcionalidades-entregues)
4. [Modelo de dados](#4-modelo-de-dados)
5. [Regras de acesso e segurança](#5-regras-de-acesso-e-segurança)
6. [Fontes de dados](#6-fontes-de-dados)
7. [Métricas e dashboards](#7-métricas-e-dashboards)
8. [Backlog / pendências](#8-backlog--pendências)
9. [Histórico de versões do app](#9-histórico-de-versões-do-app)

---

## 1. Visão do produto

O **Gestão de Projetos CET 2026 · Rautaki** é um painel web (pt-BR) para gestão do portfólio de projetos e ordens de serviço (OSs) do contrato CET 2026, que prevê **4.800 USTs/mês de abril a outubro de 2026**.

O produto substitui planilhas dispersas por uma única fonte de verdade: o usuário importa a base oficial (aba "Detalhe das OSs" da planilha), os lançamentos linha a linha são gravados no banco de dados e o painel passa a responder, em segundos, quanto foi planejado, quanto foi faturado, por produto, por projeto, por OS e por mês — com autenticação real, perfis de acesso e trilha de auditoria.

O app é servido como um **HTML autocontido** (um único arquivo, sem dependências de build no cliente) e se comunica com um backend PocketBase para autenticação, dados e arquivos.

---

## 2. Público e personas

### Superusuário

Responsável pela administração da plataforma. Cria, edita e exclui usuários; redefine senhas; ativa e desativa contas; acompanha a auditoria de acesso e sessão; gerencia as importações da base.

### Gestor

Responsável pelo portfólio. Acompanha o faturamento planejado × realizado, o desempenho por produto e por projeto, e usa os dashboards gerenciais e a impressão/PDF para apresentações executivas. Pode importar bases e exportar CSVs.

### Operacional

Equipe que registra e consulta o dia a dia das OSs: consulta o quadro por produto, abre o detalhe de cada OS com suas atividades, e acompanha o detalhamento por código de atividade e complexidade.

> **Nota:** perfis derivados do campo `role` do usuário (Superusuário, Gestor, Operacional). Itens exclusivos do Superusuário (ex.: tela Usuários) ficam ocultos para os demais perfis.

---

## 3. Escopo — funcionalidades entregues

### 3.1 Autenticação e sessão (v0.0.12–v0.0.15)

- Login real contra a coleção `users` do backend (sem credenciais fixas).
- Sessão persistente com token; renovação automática (auth-refresh) ao carregar o app; chave de sessão local `cet_sessao`.
- Usuário **Inativo = e-mail não verificado** (`verified = false`) — bloqueio de login com a mensagem "Usuário inativo. Contate o administrador."
- Validação de senha mínima de **8 caracteres** (criação, edição e redefinição).
- Alternador mostrar/ocultar senha na tela de login (ícone de olho, acessível via teclado).
- Logout encerra a sessão no backend e limpa o estado local.

### 3.2 Tela Usuários (exclusiva do Superusuário)

- Listagem de usuários com nome, e-mail, perfil e situação (Ativo/Inativo).
- Criar usuário (nome, e-mail, senha, perfil, verificação/e-mail enviado conforme situação).
- Editar usuário (nome, e-mail, perfil, situação Ativo/Inativo — a gravação envia o estado de verificação corretamente).
- Redefinir senha de qualquer usuário **sem exigir a senha antiga** (via permissão de gestão — manageRule).
- Excluir usuário (com confirmação).
- Alternar Ativo/Inativo com um clique.

### 3.3 Seções do painel (sidebar)

| Seção                      | O que entrega                                                                                                                                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visão Geral**            | KPIs executivos, evolução mensal do faturamento (R$), Top 8 projetos por faturamento, status do portfólio.                                                                                                                                                                             |
| **Planejado vs Realizado** | Comparativo por mês entre USTs planejadas e realizadas, em USTs e R$.                                                                                                                                                                                                                  |
| **Projetos**               | Cadastro e acompanhamento dos projetos (nome, escopo, status, andamento, próximos passos, responsável, datas, progresso %, motivo de pausa, classificação).                                                                                                                            |
| **Produtos**               | Visão do faturamento e das OSs agrupadas por produto.                                                                                                                                                                                                                                  |
| **Ordens de Serviço**      | Quadro por Produto (agrupamento das OSs com totais de quantidade, UST e R$); modal de detalhe da OS com as atividades lançadas (Código, Tipo da Atividade, Complexidade, Qtde de Linhas, UST Estimada, UST Calculada, Valor R$) e KPIs (nº de lançamentos, complexidade predominante). |
| **Atividades**             | Catálogo de atividades e seus códigos, extraídos da base importada.                                                                                                                                                                                                                    |
| **Complexidade**           | Níveis de complexidade (nível, descrição, fator multiplicador).                                                                                                                                                                                                                        |
| **Evolução Mensal**        | Série mensal de USTs e R$ no período do contrato.                                                                                                                                                                                                                                      |
| **Detalhamento por OS**    | Quadro consolidado (Código, Tipo Atividade, Qtde UST, Valor R$) e quadro unitário (Item, Atividade, Complexidade, UST, Valor), alimentado pela planilha importada. OSs sem lançamento linha a linha exibem aviso — nunca dados inventados.                                             |
| **Dashboards Gerenciais**  | Ver seção 7.                                                                                                                                                                                                                                                                           |
| **Usuários**               | Gestão de usuários (exclusiva do Superusuário).                                                                                                                                                                                                                                        |
| **Importar Base**          | Importação da planilha, histórico de versões, exportar CSV, limpar histórico, reverter versão.                                                                                                                                                                                         |
| **Auditoria**              | Trilha de eventos de acesso e sessão, com exportação em CSV.                                                                                                                                                                                                                           |

### 3.4 Importar Base

- Aceita arquivos **.xlsx / .csv**, processando a aba **"Detalhe das OSs"**.
- Decodifica os rótulos longos de atividade/complexidade lançados linha a linha (ex.: `F1 - ... - 21`, `C3 - ... - 2`) para código, tipo de atividade, complexidade e fator.
- Gravação em lote no banco (coleções `detalhes_os` e `resumo_os_usts`), mantendo fallback local.
- **Histórico de importações** ("Versões da Base") com gráfico de altura automática; Exportar CSV; Limpar histórico; Reverter versão.

---

## 4. Modelo de dados

Backend PocketBase. Todas as coleções exigem **usuário autenticado** e possuem índices de apoio.

### 4.1 `catalogo_servicos`

| Campo           | Descrição            |
| --------------- | -------------------- |
| item            | Item do catálogo     |
| codigo          | Código do serviço    |
| area            | Área responsável     |
| descricao       | Descrição do serviço |
| estimativa_usts | Estimativa de USTs   |
| quantidade      | Quantidade           |
| unidade         | Unidade de medida    |

### 4.2 `niveis_complexidade`

| Campo     | Descrição                            |
| --------- | ------------------------------------ |
| nivel     | Nível (ex.: C1, C2, C3)              |
| descricao | Descrição do nível                   |
| fator     | Fator multiplicador aplicado às USTs |

### 4.3 `projetos_cet`

| Campo                                                                                  | Descrição                                      |
| -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| nome                                                                                   | Nome do projeto                                |
| escopo                                                                                 | Escopo                                         |
| status                                                                                 | Status (ex.: Em andamento, Concluído, Pausado) |
| andamento_atual                                                                        | Situação atual                                 |
| proximos_passos                                                                        | Próximos passos                                |
| responsavel                                                                            | Responsável                                    |
| data_demanda / data_inicio / data_desenvolvimento / data_prazo_alvo / data_finalizacao | Datas do ciclo do projeto                      |
| status_pausa / motivo_pausa                                                            | Situação e motivo de pausa                     |
| classificacao                                                                          | Classificação do projeto                       |
| progresso                                                                              | Progresso em %                                 |

### 4.4 `ordens_servico`

| Campo                           | Descrição                      |
| ------------------------------- | ------------------------------ |
| numero_os                       | Número da OS                   |
| projeto                         | Projeto vinculado              |
| produto                         | Produto/linha de serviço       |
| data_abertura / data_fechamento | Datas de abertura e fechamento |
| qtde_usts                       | Quantidade de USTs             |
| valor_ust                       | Valor da UST                   |
| total_rs                        | Total em R$                    |
| observacao                      | Observação                     |

### 4.5 `detalhes_os`

| Campo               | Descrição                      |
| ------------------- | ------------------------------ |
| codigo              | Código da atividade            |
| descricao           | Descrição (história/atividade) |
| nivel_complexidade  | Nível de complexidade          |
| estimativa_ust      | Estimativa de UST              |
| fator_multiplicador | Fator multiplicador            |
| total_ust           | Total de USTs da linha         |

### 4.6 `resumo_os_usts`

| Campo      | Descrição                 |
| ---------- | ------------------------- |
| numero_os  | Número da OS              |
| codigo     | Código da atividade       |
| descricao  | Descrição                 |
| total_usts | Total de USTs consolidado |

---

## 5. Regras de acesso e segurança

- **Autenticação real** (usuário/senha) contra a coleção `users`; nenhuma credencial fixa no app.
- **Sessão persistente** com token de renovação automática; logout efetivo no backend.
- **Inativo = e-mail não verificado** (`verified = false`): o login é bloqueado com a mensagem "Usuário inativo. Contate o administrador."
- **Perfis** (`role`): `superusuario`, `gestor`, `operacional`. A tela Usuários é exclusiva do `superusuario`; itens restritos ficam ocultos no menu dos demais perfis.
- **manageRule** (permissão de gestão na coleção `users`, concedida apenas ao `superusuario`): é o que permite ao Superusuário **redefinir senhas sem a senha antiga** e **alterar o estado de verificação/atividade** de outro usuário — operações que o PocketBase bloquearia para gestão de terceiros.
- **Senha mínima de 8 caracteres**, validada no front e reforçada pelo backend.
- **Acesso às coleções de dados** apenas para usuários autenticados.
- **Auditoria**: eventos de acesso e sessão registrados, com exportação em CSV.
- Nenhum segredo, token ou credencial é embutido no app cliente.

---

## 6. Fontes de dados

1. **Planilha oficial (fonte primária de carga)** — aba **"Detalhe das OSs"** de arquivo .xlsx/.csv, importada na seção Importar Base; os lançamentos linha a linha são gravados no PocketBase (`detalhes_os`, `resumo_os_usts`).
2. **Banco PocketBase** — prioridade em todas as telas: os dados exibidos vêm das coleções quando disponíveis.
3. **Base embutida (fallback)** — se o banco estiver vazio ou indisponível, as telas caem silenciosamente na base de referência embutida no app, indicando a origem dos dados ("Banco de dados" × "Base embutida") nos dashboards. O app **nunca inventa** dados: onde não há lançamento, exibe aviso.

---

## 7. Métricas e dashboards

**Dashboards Gerenciais** (seção dedicada):

- **Planejado × Faturado por mês**, em USTs e em R$ — meta contratual de **4.800 USTs/mês**, período **abril–outubro 2026**, agrupando as OSs por data de fechamento.
- **Faturamento por produto** com % da meta.
- **Top 8 maiores faturamentos** com % do total e botão **Imprimir/PDF** para apresentações.
- **Indicador de origem dos dados** (Banco de dados × Base embutida).
- **Valor da UST derivado da própria base** (total R$ ÷ total USTs).

**KPIs atuais da base:** 18.595,5 USTs · R$ 6.378.256,50 · 35 OSs.

---

## 8. Backlog / pendências

| #   | Item                                 | Descrição                                                                                                                                                                                                     |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Importação das demais abas           | Estender a importação para as abas **Catálogo de Serviços**, **Níveis de Complexidade**, **Projetos** e **Ordens de Serviço**, gravando nas coleções correspondentes (hoje só "Detalhe das OSs" é importada). |
| 2   | Detalhe consolidado com filtros      | Dashboard de detalhe consolidado com filtros por OS, Produto e mês.                                                                                                                                           |
| 3   | Análise detalhada por OS com filtros | Tela de análise por OS com filtros combináveis.                                                                                                                                                               |
| 4   | Status dos Projetos                  | Dashboard listando os projetos de `projetos_cet` com seus status e progresso.                                                                                                                                 |

---

## 9. Histórico de versões do app

| Versão | Resumo                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.0.5  | Primeiras iterações do painel autocontido com as seções do portfólio.                                                                                                                                  |
| 0.0.9  | Importação de base e seções de detalhamento por OS.                                                                                                                                                    |
| 0.0.10 | Dashboards Gerenciais: leitura de `ordens_servico` do banco (paginado) com fallback na base embutida; valor da UST derivado da própria base.                                                           |
| 0.0.11 | Versão de estabilização das seções e indicadores.                                                                                                                                                      |
| 0.0.12 | **Login real** contra o PocketBase (sem credenciais fixas); sessão com token revalidada no boot; logout efetivo; gestão de usuários via API autenticada; Inativo = `verified=false`.                   |
| 0.0.13 | Correções de login (awaits em handlers) e estabilização da sessão.                                                                                                                                     |
| 0.0.14 | Gestão de usuários: criação/edição gravando corretamente o estado Ativo/Inativo (`verified`); alternância de situação.                                                                                 |
| 0.0.15 | Redefinição de senha pelo Superusuário sem exigir senha antiga (manageRule); mensagens de erro reais do backend; validação de 8 caracteres nos dois modais; alternador mostrar/ocultar senha no login. |

---

_Documento gerado a partir do app em produção (v0.0.15) e das decisões registradas nas conversas do projeto. Não contém URLs internas, segredos nem dados pessoais de usuários._
