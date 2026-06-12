/* ============================================================
   diagnostico-gestao-data.js — Diagnóstico de Gestão
   Autoavaliação calibrada no espectro operacional → tático →
   estratégico (supervisor / coordenador / gerente).
   Dimensões espelham os módulos da Jornada da Gestão.
   ============================================================ */

/* ---------- Cargo / altitude declarada ---------- */
const PASSAGENS_G = [
  { id:"novo",        emoji:"🌱", nome:"Recém-promovido(a)", alt:"op",
    desc:"Acabei de assumir minha primeira gestão." },
  { id:"supervisor",  emoji:"🧰", nome:"Supervisor(a)", alt:"op",
    desc:"Altitude operacional: faço acontecer no dia a dia com o time." },
  { id:"coordenador", emoji:"🗂️", nome:"Coordenador(a)", alt:"tat",
    desc:"Altitude tática: organizo o sistema e os processos que fazem acontecer." },
  { id:"gerente",     emoji:"📊", nome:"Gerente", alt:"est",
    desc:"Altitude estratégica: defino direção, prioridades e capacidade futura." }
];

const ALT_LABEL = { op:"Operacional", tat:"Tático", est:"Estratégico" };

/* Orientação por altitude (mostrada no relatório conforme o cargo) */
const ALT_GUIA = {
  op:"No operacional, consolide <strong>Autogestão</strong> e <strong>Cadência & Rituais</strong> — proteja tempo para gestão e crie ritmo. O próximo degrau (tático) vai pedir mais <strong>Delegação</strong> e <strong>Coaching</strong>.",
  tat:"No tático, o foco migra para <strong>Delegação & Autonomia</strong>, <strong>Coaching</strong> e <strong>Performance</strong> — você passa a fazer através do sistema e das pessoas. O próximo degrau (estratégico) pede visão de prioridades e capacidade futura.",
  est:"No estratégico, lidere pelo sistema: <strong>Performance</strong> ligada ao negócio, <strong>Delegação</strong> ampla e formação de gestores. Cuide para não recair no operacional — resolva-o através de quem você desenvolveu."
};

/* ---------- Dimensões (Likert 1-5; inv = item invertido) ----------
   modulo = âncora em gestao.html (#) para o link de aprofundamento  */
const DIMENSOES_G = [
  {
    id:"g_autogestao", emoji:"🧭", nome:"Autogestão & Prioridades",
    desc:"Proteger tempo para a gestão e focar no que importa — antes de gerir o time, gerir a si.",
    itens:[
      { t:"Protejo na agenda tempo para gestão (pessoas e planejamento), não só para entregas." },
      { t:"Minha semana é tomada por urgências; sobra pouco para o importante-não-urgente.", inv:true },
      { t:"Sei distinguir o que delegar, fazer agora, agendar ou eliminar." },
      { t:"Ainda sou eu quem executa as tarefas técnicas mais críticas do time.", inv:true },
      { t:"Tenho clareza das minhas 3 prioridades da semana." }
    ],
    foco:{
      1:"Bloqueie 2 janelas semanais inegociáveis (1:1 e trabalho importante-não-urgente). Use a matriz de Eisenhower para o resto.",
      2:"Mapeie onde seu tempo vai por uma semana e corte/delegue o que é do nível anterior.",
      3:"Refine: confira se sua agenda reflete as prioridades certas. Comece a planejar em horizonte maior.",
      4:"Sua autogestão é madura. Modele isso para o time e ajude-os a proteger o tempo deles."
    }
  },
  {
    id:"g_ritmo", emoji:"🔁", nome:"Cadência & Rituais",
    desc:"O ritmo de gestão que substitui o improviso: 1:1, ritual de time, reviews e alinhamentos cross-área.",
    itens:[
      { t:"Mantenho rituais fixos com o time (1:1, reunião semanal) que raramente cancelo." },
      { t:"Os rituais têm pauta clara e começam e terminam no horário." },
      { t:"Nosso ritmo depende mais de improviso do que de cadência.", inv:true },
      { t:"Tenho pontos de alinhamento combinados com gestores de outras áreas." },
      { t:"Conecto os rituais entre si (o semanal alimenta o mensal, e assim por diante)." }
    ],
    foco:{
      1:"Implante o básico: 1:1 semanal/quinzenal + uma reunião semanal de time com pauta fixa.",
      2:"Dê consistência: pauta clara, horário respeitado e combinados revisados a cada ciclo.",
      3:"Conecte as cadências e estabeleça rituais cross-área com quem você depende.",
      4:"Use o ritmo trimestral para ligar o time à estratégia e antecipar capacidade futura."
    }
  },
  {
    id:"g_coaching", emoji:"🗣️", nome:"1:1 & Coaching",
    desc:"Usar o 1:1 para desenvolver: conhecer a pessoa, perguntar mais que responder, conectar aspirações à rotina.",
    itens:[
      { t:"Uso o 1:1 para desenvolver a pessoa, não só para cobrar status." },
      { t:"Faço mais perguntas do que dou respostas prontas (estilo coach / GROW)." },
      { t:"Conheço as aspirações e o próximo passo de carreira de cada pessoa." },
      { t:"Quando alguém traz um problema, eu costumo resolver pela pessoa.", inv:true },
      { t:"Ajudo cada pessoa a conectar o desenvolvimento à rotina atual." }
    ],
    foco:{
      1:"Comece 1:1s com roteiro (veja o Kit de Templates). Reserve espaço para a pessoa, não só para o status.",
      2:"Pratique o GROW: antes de responder, pergunte 'o que você faria?'. Mapeie aspirações de cada um.",
      3:"Aprofunde o coaching e conecte desenvolvimento à rotina e às metas do time.",
      4:"Forme outros gestores no uso do 1:1 como ferramenta de desenvolvimento."
    }
  },
  {
    id:"g_delegacao", emoji:"🤲", nome:"Delegação & Autonomia",
    desc:"Adaptar o estilo (situacional), delegar decisões e construir um time que não depende de você.",
    itens:[
      { t:"Adapto meu estilo (dirigir / treinar / apoiar / delegar) a cada pessoa e tarefa." },
      { t:"Delego decisões (não só tarefas) e amplio a autonomia com o tempo." },
      { t:"Tenho receio de delegar o que é importante; prefiro garantir eu mesmo(a).", inv:true },
      { t:"Documento e ensino o que só eu sei, para o time não depender de mim." },
      { t:"Quando delego, combino o resultado e saio do caminho." }
    ],
    foco:{
      1:"Escolha 2 coisas que só você faz e delegue nesta semana — com contexto e combinado de acompanhamento.",
      2:"Use a liderança situacional: diagnostique cada pessoa por tarefa e ajuste o estilo. Suba o nível de delegação aos poucos.",
      3:"Monte um plano de delegação de 90 dias: o que sai de você e para quem.",
      4:"Forme quem forma: desenvolva pessoas capazes de assumir partes do seu papel."
    }
  },
  {
    id:"g_feedback", emoji:"💬", nome:"Feedback & Conversas difíceis",
    desc:"Dar feedback específico e frequente, encarar a conversa difícil e equilibrar cuidar + desafiar.",
    itens:[
      { t:"Dou feedback específico com frequência, não só na avaliação formal." },
      { t:"Encaro conversas difíceis em vez de adiá-las." },
      { t:"Evito dar feedback corretivo para não gerar desconforto.", inv:true },
      { t:"Equilibro reforço e ajuste (importar-se com a pessoa e desafiar diretamente)." },
      { t:"Também peço feedback sobre a minha própria atuação." }
    ],
    foco:{
      1:"Adote uma estrutura (DESC/SBI) e comece pelo feedback positivo específico, com frequência.",
      2:"Encare a conversa difícil que vem adiando: descreva o fato, o impacto e combine o próximo passo.",
      3:"Equilibre cuidar + desafiar (Radical Candor) e peça feedback sobre você também.",
      4:"Dissemine a cultura de feedback no time — torne-a um hábito coletivo, não um evento."
    }
  },
  {
    id:"g_performance", emoji:"📈", nome:"Metas & Performance",
    desc:"Clareza de metas (SMART) e papéis (RACI), poucos indicadores certos e ação cedo nos desvios.",
    itens:[
      { t:"Defino metas claras (SMART) e papéis sem zona cinzenta (RACI)." },
      { t:"Acompanho poucos indicadores que realmente importam." },
      { t:"Ajo cedo quando um número desvia, em vez de esperar o fim do período." },
      { t:"Misturo a conversa de desenvolvimento com a cobrança de resultado.", inv:true },
      { t:"O time sabe, sem dúvida, o que é sucesso no período." }
    ],
    foco:{
      1:"Defina metas SMART e deixe claro quem é o dono (A do RACI) de cada entrega.",
      2:"Escolha poucos indicadores (leading e lagging) e acompanhe-os no ritual semanal.",
      3:"Aja cedo nos desvios pela causa-raiz; separe a conversa de resultado da de desenvolvimento.",
      4:"Garanta que as metas do time movem os números que importam para o negócio."
    }
  }
];

/* faixas de nível — mesmas do tracking (reaproveitadas) */
const NIVEIS_G = [
  { n:1, max:2.49, nome:"Inicial",            classe:1, cor:"#EF4444",
    desc:"Base de gestão ainda em formação aqui — ótimo ponto de partida e de maior alavancagem." },
  { n:2, max:3.39, nome:"Em desenvolvimento", classe:2, cor:"#F59E0B",
    desc:"Você já faz isso às vezes, de forma inconsistente. Com intenção, vira hábito." },
  { n:3, max:4.19, nome:"Consolidado",        classe:3, cor:"#0EA5E9",
    desc:"Prática de gestão sólida no seu dia a dia. Pronto(a) para elevar a altitude." },
  { n:4, max:5.01, nome:"Referência",         classe:4, cor:"#22C55E",
    desc:"Ponto forte de gestão — use-o para formar outros gestores nessa frente." }
];
function nivelDeG(media){ return NIVEIS_G.find(f => media <= f.max) || NIVEIS_G[NIVEIS_G.length-1]; }
