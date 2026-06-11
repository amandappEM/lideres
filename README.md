# Trilha de Líderes · Estante Mágica

Plataforma interativa de **treinamento contínuo para líderes**. Mesma identidade visual
dos demais treinamentos da Estante Mágica, **100% client-side** (HTML/CSS/JS puro, sem
build e sem servidor). As respostas do diagnóstico ficam apenas no navegador do participante.

## Etapas

| Arquivo | O que é |
|---|---|
| `index.html` | Hub — navegação pelas 3 etapas da trilha. |
| `pipeline.html` | **Etapa 1 · Pipeline da Liderança** — as 6 passagens de liderança (Charan, Drotter & Noel) e as 3 dimensões que mudam em cada uma: habilidades, gestão do tempo e valores profissionais. Acordeões com transição, competências e armadilhas. |
| `principios.html` | **Etapa 2 · Princípios de Ram Charan** — a disciplina da Execução (Pessoas, Estratégia, Operações) e os 8 Know-How do líder. |
| `diagnostico.html` | **Etapa 3 · Diagnóstico de Liderança** — autoavaliação (Likert 1–5) em 6 competências. Gera o **nível atual por dimensão** (Inicial → Em desenvolvimento → Consolidado → Referência), pontos fortes e plano de foco, exportável em PDF (botão Imprimir). |

## Estrutura

```
lideres/
├─ index.html · pipeline.html · principios.html · diagnostico.html
├─ logo_EM.png
├─ css/
│   ├─ base.css       (identidade visual base)
│   └─ lideres.css    (estilos da plataforma + pipeline/diagnóstico)
└─ js/
    ├─ diagnostico-data.js  (passagens, 6 dimensões, itens Likert e faixas de nível)
    └─ diagnostico.js       (fluxo, cálculo e relatório)
```

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
