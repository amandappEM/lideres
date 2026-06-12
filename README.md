# Gestão & Liderança · Estante Mágica

Plataforma interativa de **desenvolvimento contínuo de gestores e líderes**. Mesma identidade
visual dos demais treinamentos da Estante Mágica, **100% client-side** (HTML/CSS/JS puro, sem
build e sem servidor). As respostas do diagnóstico ficam apenas no navegador do participante.

Duas frentes complementares, a partir de um hub único:
- **Jornada da Gestão** — repertório prático de quem assume a gestão, calibrado em 3 altitudes (operacional → tático → estratégico).
- **Trilha de Liderança** — pipeline, princípios de Ram Charan, mentalidade empreendedora e formação de novos líderes.

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Hub — ramifica nas duas frentes (Gestão e Liderança) e nas ferramentas. |
| **Jornada da Gestão** | |
| `gestao.html` | **Virei gestor, e agora?** — 10 módulos calibrados em 3 altitudes: autogestão, cadência & rituais, 1:1 (com GROW), liderança situacional & delegação, feedback (DESC/SBI/Radical Candor), metas (SMART/RACI), performance, segurança psicológica, upward management e IA como copiloto. |
| `templates.html` | **Kit de Templates** imprimível: roteiro de 1:1, plano 30-60-90, agenda de ritual, matriz RACI e canvas SMART. |
| `biblioteca.html` | **Biblioteca de Fontes** — sínteses de Maxwell, Bernardinho, Clóvis de Barros, Vânia Ferrari, Sinek, Wiseman, Edmondson, Kim Scott, Blanchard, Pink e Charan, ligadas aos módulos. |
| **Trilha de Liderança** | |
| `pipeline.html` | **Pipeline da Liderança** — as 6 passagens de liderança (Charan, Drotter & Noel) e as 3 dimensões que mudam em cada uma. |
| `principios.html` | **Princípios de Ram Charan** — a disciplina da Execução (Pessoas, Estratégia, Operações) e os 8 Know-How do líder. |
| `empreendedorismo.html` | **Líder que multiplica** — mentalidade intra/empreendedora, autonomia, cultura no-compete e como formar outros líderes. |
| `diagnostico.html` | **Etapa 3 · Diagnóstico de Liderança** — autoavaliação (Likert 1–5) em 6 competências. Gera o **nível atual por dimensão** (Inicial → Em desenvolvimento → Consolidado → Referência), pontos fortes e plano de foco, exportável em PDF (botão Imprimir). |
| `resultados.html` | **Meus resultados** — histórico e evolução dos diagnósticos da pessoa (com setas de variação vs. o anterior). Exporta CSV para enviar ao gestor. |
| `relatorios.html` | **Painel do gestor** — carrega os CSVs do time e consolida: média por competência, lacunas coletivas, distribuição por momento e quadro por líder (usando o diagnóstico mais recente de cada pessoa). 100% no navegador. |

## Estrutura

```
lideres/
├─ index.html  (hub)
├─ gestao.html · templates.html · biblioteca.html      (Jornada da Gestão)
├─ pipeline.html · principios.html · empreendedorismo.html · diagnostico.html   (Liderança)
├─ resultados.html · relatorios.html                    (acompanhamento)
├─ logo_EM.png
├─ css/
│   ├─ base.css       (identidade visual base)
│   └─ lideres.css    (estilos da plataforma + gestão/liderança/diagnóstico)
└─ js/
    ├─ diagnostico-data.js  (passagens, 6 dimensões, itens Likert e faixas de nível)
    ├─ diagnostico.js       (fluxo, cálculo e relatório)
    ├─ tracking.js          (identificação leve + registro de diagnósticos + CSV)
    ├─ resultados.js        (tela "Meus resultados" — evolução do participante)
    └─ relatorios.js        (painel do gestor — consolidação dos CSVs do time)
```

## Fluxo de acompanhamento (gestor)

1. Cada líder se identifica (nome + e-mail, só no navegador) e faz o diagnóstico — o resultado é salvo no histórico local.
2. Em **Meus resultados**, exporta o **CSV** e envia ao gestor.
3. O gestor abre **Painel do gestor**, carrega os CSVs e vê a consolidação do time — sem nada subir para a internet.

## O diagnóstico

O participante:
1. Informa o nome e **autodeclara em que momento da liderança está** (aspirante, líder de equipe, de líderes, funcional, de negócio).
2. Responde **6 blocos de 5 afirmações** (Likert 1–5), um por competência:
   **Delegação & Multiplicação · Gestão do Tempo & Prioridades · Valores de Liderança · Execução & Responsabilização · Desenvolvimento de Pessoas · Visão de Negócio & Estratégia.**
3. Recebe a média (1–5) e o **nível** em cada dimensão, os 2 pontos fortes e os 2 focos de desenvolvimento com próximos passos práticos.

Alguns itens são **invertidos** (controle de viés de aquiescência): a média já considera a inversão.

### Faixas de nível (média 1–5)

| Faixa | Nível |
|---|---|
| até 2,49 | **1 · Inicial** |
| 2,50 – 3,39 | **2 · Em desenvolvimento** |
| 3,40 – 4,19 | **3 · Consolidado** |
| 4,20 – 5,00 | **4 · Referência** |

## Como rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000/
```

## Sobre as metodologias

Conteúdos e instrumentos são **adaptações inspiradas** nas obras, para fins de
desenvolvimento interno — não substituem os materiais oficiais:

- **Pipeline da Liderança** — *The Leadership Pipeline*, Ram Charan, Stephen Drotter & James Noel.
- **Execução** — *Execução: A Disciplina para Atingir Resultados*, Larry Bossidy & Ram Charan.
- **Know-How** — *Know-How: As 8 Competências dos Líderes Bem-Sucedidos*, Ram Charan.
