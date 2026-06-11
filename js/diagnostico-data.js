/* ============================================================
   diagnostico-data.js — Diagnóstico de Liderança
   Trilha de Líderes · Estante Mágica
   Autoavaliação inspirada no Pipeline da Liderança (Charan,
   Drotter & Noel) e nos princípios de Ram Charan (Execução /
   Know-How). Adaptação interna de desenvolvimento.
   ============================================================ */

/* ---------- Passagem atual declarada (autodeclaração) ---------- */
const PASSAGENS_DIAG = [
  { id:"aspirante", emoji:"🌱", nome:"Aspirante a líder",
    desc:"Contribuidor individual que quer (ou está começando a) liderar." },
  { id:"equipe", emoji:"🤝", nome:"Líder de equipe",
    desc:"Gere pessoas que executam. Passagem 1 do pipeline." },
  { id:"lideres", emoji:"🪜", nome:"Líder de líderes",
    desc:"Gere outros gestores. Passagem 2 do pipeline." },
  { id:"funcional", emoji:"🏛️", nome:"Líder funcional",
    desc:"Responde por uma função/área inteira. Passagem 3." },
  { id:"negocio", emoji:"📈", nome:"Líder de negócio",
    desc:"Responde por resultado (P&L) de um negócio. Passagem 4+." }
];

/* ---------- Dimensões avaliadas (Likert 1-5; inv = item invertido) ---------- */
const DIMENSOES = [
  {
    id:"delegacao", emoji:"🤲", nome:"Delegação & Multiplicação",
    desc:"Fazer através de outros em vez de fazer você mesmo — a transição central do pipeline.",
    itens:[
      { t:"Delego tarefas relevantes mesmo sabendo que eu faria mais rápido sozinho(a)." },
      { t:"Quando o time atrasa, minha primeira reação é assumir a tarefa eu mesmo(a).", inv:true },
      { t:"Confio responsabilidades reais à equipe e resisto à tentação de microgerenciar." },
      { t:"Sou o(a) profissional que mais 'põe a mão na massa' técnica do time.", inv:true },
      { t:"Crio condições para que as pessoas resolvam sem depender de mim." }
    ],
    foco:{
      1:"Liste o que só você faz hoje e escolha 2 itens para delegar nesta semana, com um combinado claro de acompanhamento.",
      2:"Pratique delegar o 'como', não só o 'o quê'. Resista a reassumir tarefas quando o time titubear — apoie em vez de substituir.",
      3:"Você já delega bem o operacional. Suba o nível: delegue decisões e projetos, não apenas tarefas.",
      4:"Multiplicação é seu ponto forte. Use isso para formar quem também delega bem."
    }
  },
  {
    id:"tempo", emoji:"⏱️", nome:"Gestão do Tempo & Prioridades",
    desc:"Redistribuir a agenda para o trabalho do novo nível, em vez de viver no operacional.",
    itens:[
      { t:"Reservo tempo na agenda para pessoas e desenvolvimento, não só para entregas." },
      { t:"Minha semana é dominada por urgências e por apagar incêndios.", inv:true },
      { t:"Consigo dizer 'não' (ou 'agora não') a demandas que não são prioridade." },
      { t:"Termino a maioria das semanas sem ter avançado no que é estratégico.", inv:true },
      { t:"Planejo o trabalho do time com antecedência, não no improviso." }
    ],
    foco:{
      1:"Bloqueie na agenda 2 janelas semanais protegidas: uma para 1:1s com o time, outra para trabalho estratégico. Trate-as como inegociáveis.",
      2:"Mapeie onde seu tempo vai por uma semana. Corte ou delegue o que é do nível anterior para liberar espaço ao trabalho de gestão.",
      3:"Refine o uso do tempo: revise se as prioridades da sua agenda batem com as prioridades do negócio.",
      4:"Sua gestão de tempo é madura. Ajude o time a proteger o tempo deles também."
    }
  },
  {
    id:"valores", emoji:"💎", nome:"Valores de Liderança",
    desc:"Valorizar o trabalho de liderar — a mudança mais difícil de toda passagem.",
    itens:[
      { t:"Sinto orgulho genuíno quando alguém do time brilha, mesmo sem crédito para mim." },
      { t:"No fundo, valorizo mais minhas entregas técnicas do que o trabalho de gestão.", inv:true },
      { t:"Vejo desenvolver pessoas como parte central do meu trabalho — não um extra." },
      { t:"Para mim, sucesso é o resultado do time, não o meu desempenho individual." },
      { t:"Sinto que 'perdi' minha identidade profissional ao assumir a liderança.", inv:true }
    ],
    foco:{
      1:"Reflita: o que te dá orgulho hoje? Se ainda é a entrega técnica, comece a celebrar conscientemente as conquistas do time como seu resultado.",
      2:"Reserve um momento semanal para reconhecer publicamente alguém do time. Trabalhe a ideia de que liderar é a entrega, não um desvio dela.",
      3:"Você valoriza a liderança. Torne isso explícito: seja modelo de que desenvolver gente é o trabalho, não um extra.",
      4:"Seus valores de liderança estão maduros — você inspira pela postura. Ajude novos gestores a fazerem essa virada."
    }
  },
  {
    id:"execucao", emoji:"🏁", nome:"Execução & Responsabilização",
    desc:"Fazer acontecer: metas claras, realismo, follow-through e cobrança justa.",
    itens:[
      { t:"Defino metas claras e acompanho cada combinado até a conclusão." },
      { t:"Encaro os fatos como eles são, mesmo quando são desconfortáveis." },
      { t:"Tenho dificuldade de cobrar e dar feedback difícil quando alguém não entrega.", inv:true },
      { t:"Conecto reconhecimento a resultados de forma consistente." },
      { t:"Combinados no time costumam 'se perder' por falta de acompanhamento.", inv:true }
    ],
    foco:{
      1:"Adote um ritual simples de follow-through: ao fim de cada reunião, registre 'quem faz o quê até quando' e revise no próximo encontro.",
      2:"Pratique a conversa difícil que você vem adiando. Seja específico sobre o gap e combine um próximo passo claro.",
      3:"Sua execução é sólida. Foque em ligar reconhecimento a resultado de forma ainda mais visível.",
      4:"Você executa com disciplina. Ensine o time o hábito do realismo e do follow-through."
    }
  },
  {
    id:"pessoas", emoji:"🌱", nome:"Desenvolvimento de Pessoas",
    desc:"Avaliar talento com precisão e formar pessoas e sucessores — um dos Know-How de Charan.",
    itens:[
      { t:"Avalio o desempenho das pessoas com honestidade e precisão." },
      { t:"Dou feedback de desenvolvimento com frequência, não só na avaliação formal." },
      { t:"Conheço os pontos fortes e as ambições de cada pessoa do time." },
      { t:"Adio conversas sobre desempenho para evitar o desconforto.", inv:true },
      { t:"Invisto deliberadamente em formar sucessores e novos líderes." }
    ],
    foco:{
      1:"Comece 1:1s quinzenais com cada pessoa. Em cada um, ouça ambições e dê um feedback específico (um reforço, um ajuste).",
      2:"Crie uma visão simples de cada pessoa: força principal, ponto a desenvolver e próximo passo de carreira. Atualize a cada trimestre.",
      3:"Você desenvolve bem. Avance para a sucessão: identifique quem pode assumir partes do seu papel e comece a prepará-los.",
      4:"Formar gente é sua força. Documente como faz isso e dissemine a prática entre outros líderes."
    }
  },
  {
    id:"negocio", emoji:"🧭", nome:"Visão de Negócio & Estratégia",
    desc:"Conectar o time ao resultado, ler o contexto externo e pensar além do trimestre.",
    itens:[
      { t:"Entendo com clareza como meu time gera valor para o resultado do negócio." },
      { t:"Acompanho mudanças de mercado e de contexto que afetam a minha área." },
      { t:"Tomo decisões pensando no médio/longo prazo, não só no agora." },
      { t:"Foco quase só no operacional e raramente penso em estratégia.", inv:true },
      { t:"Consigo conectar as prioridades do time à estratégia da empresa." }
    ],
    foco:{
      1:"Escreva em uma frase como seu time contribui para o resultado da empresa. Compartilhe e use isso para priorizar.",
      2:"Reserve tempo mensal para olhar 'para fora': clientes, mercado e concorrência. Traga 1 insight para a pauta do time.",
      3:"Você já pensa estrategicamente. Conecte de forma mais explícita cada prioridade do time à estratégia maior.",
      4:"Sua visão de negócio é forte. Ajude o time a enxergar o mesmo horizonte que você."
    }
  }
];

/* ---------- Faixas de nível (média 1-5) ---------- */
const NIVEIS = [
  { n:1, max:2.49, nome:"Inicial",            classe:1, cor:"#EF4444",
    desc:"Base ainda em formação nesta competência. É um ótimo ponto de partida — e o que mais alavanca seu próximo degrau." },
  { n:2, max:3.39, nome:"Em desenvolvimento", classe:2, cor:"#F59E0B",
    desc:"Você já age aqui em vários momentos, mas de forma inconsistente. Com intenção, vira hábito." },
  { n:3, max:4.19, nome:"Consolidado",        classe:3, cor:"#0EA5E9",
    desc:"Competência sólida e presente no seu dia a dia. Pronto(a) para refinar e elevar o nível." },
  { n:4, max:5.01, nome:"Referência",         classe:4, cor:"#22C55E",
    desc:"Ponto forte de liderança. Use-o para multiplicar — formando outros líderes nessa frente." }
];

function nivelDe(media){
  return NIVEIS.find(f => media <= f.max) || NIVEIS[NIVEIS.length-1];
}
