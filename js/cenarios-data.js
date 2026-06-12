/* ============================================================
   cenarios-data.js — Cenários de Decisão (Gestão & Liderança)
   Mini-casos com escolhas e feedback. Cada opção tem um nível:
   "otimo" (melhor escolha), "bom" (aceitável) ou "evitar".
   ============================================================ */

const CENARIOS = [
  {
    tema:"Delegação", emoji:"🤲",
    situacao:"Você delegou um projeto importante. A primeira entrega veio claramente abaixo do esperado.",
    opcoes:[
      { t:"Reassume o projeto e termina você mesmo — é mais rápido e garante a qualidade.",
        nivel:"evitar", fb:"Resolve hoje e cria dependência amanhã. A pessoa não aprende e você vira gargalo." },
      { t:"Dá um feedback específico (DESC), mostra o padrão esperado e apoia a pessoa a refazer.",
        nivel:"otimo", fb:"Isso é delegar de verdade: clareza + suporte. A pessoa cresce e a próxima entrega melhora." },
      { t:"Refaz silenciosamente as partes ruins para não constranger ninguém.",
        nivel:"evitar", fb:"Você sonega o feedback que a pessoa precisa — e ela repetirá o erro sem saber." },
      { t:"Aceita como está para não desmotivar e segue em frente.",
        nivel:"evitar", fb:"Baixar a régua em silêncio corrói o padrão do time e é injusto com quem entrega bem." }
    ]
  },
  {
    tema:"Feedback", emoji:"💬",
    situacao:"Uma pessoa do time costuma interromper os colegas nas reuniões, e isso começa a incomodar.",
    opcoes:[
      { t:"Corta na hora, em público, para todos verem que não é aceitável.",
        nivel:"evitar", fb:"Feedback corretivo em público humilha e quebra a segurança psicológica do time." },
      { t:"Leva ao 1:1, usa SBI (situação-comportamento-impacto) e combina um ajuste.",
        nivel:"otimo", fb:"Privado, específico e cedo: a fórmula do feedback que muda comportamento sem ferir." },
      { t:"Manda um e-mail ao time pedindo 'que todos respeitem a vez de falar'.",
        nivel:"evitar", fb:"Recado genérico não corrige quem precisa e irrita quem não tem o problema." },
      { t:"Guarda para a avaliação formal, daqui a alguns meses.",
        nivel:"evitar", fb:"Feedback adiado perde o efeito e vira ressentimento acumulado." }
    ]
  },
  {
    tema:"Gestão pra cima", emoji:"⬆️",
    situacao:"Você percebe que vai estourar o prazo de uma entrega importante para o seu gestor.",
    opcoes:[
      { t:"Espera para ter certeza e avisa só quando o prazo realmente passar.",
        nivel:"evitar", fb:"Quebra o princípio 'no surprises'. Surpresa tarde tira do gestor a chance de ajudar." },
      { t:"Avisa cedo, com contexto, 2–3 opções e uma recomendação.",
        nivel:"otimo", fb:"Gestão pra cima exemplar: transparência + solução. Facilita uma boa decisão." },
      { t:"Esconde e vira a noite com o time para tentar entregar no prazo.",
        nivel:"evitar", fb:"Heroísmo escondido não escala, queima o time e mascara um problema real." },
      { t:"Avisa em cima da hora deixando claro que a culpa é do time.",
        nivel:"evitar", fb:"Jogar a culpa destrói confiança — para cima e para baixo." }
    ]
  },
  {
    tema:"Autonomia / no-compete", emoji:"🔓",
    situacao:"Você é a única pessoa que domina um processo crítico. Te procuram o tempo todo por causa disso.",
    opcoes:[
      { t:"Mantém assim — ser insubstituível protege o seu lugar.",
        nivel:"evitar", fb:"Quem vira gargalo raramente é promovido: 'quem ficaria no seu lugar?'. Retenção te prende." },
      { t:"Documenta o processo e treina pelo menos uma pessoa para assumir.",
        nivel:"otimo", fb:"Conhecimento espalhado é poder que volta multiplicado. Você se liberta para crescer." },
      { t:"Continua fazendo você mesmo, mas mais rápido, para dar conta.",
        nivel:"evitar", fb:"Trata o sintoma, não a causa. A dependência continua intacta." },
      { t:"Cria uma fila de pedidos para organizar melhor as interrupções.",
        nivel:"bom", fb:"Organiza o caos no curto prazo, mas só some o problema se você ensinar o time." }
    ]
  },
  {
    tema:"Segurança psicológica", emoji:"🛡️",
    situacao:"Alguém do time cometeu um erro honesto que gerou um custo visível.",
    opcoes:[
      { t:"Repreende para marcar que erro tem consequência e não pode se repetir.",
        nivel:"evitar", fb:"Punir erro honesto ensina o time a esconder problemas — o oposto do que você quer." },
      { t:"Faz uma análise sem culpa: 'o que aprendemos e como evitamos da próxima?'.",
        nivel:"otimo", fb:"Transforma erro em aprendizado e fortalece a segurança para falar a verdade." },
      { t:"Ignora para não constranger a pessoa.",
        nivel:"evitar", fb:"Varrer para baixo do tapete perde o aprendizado — e o time nota a omissão." },
      { t:"Assume o erro publicamente como se fosse só seu.",
        nivel:"bom", fb:"Proteger o time é nobre, mas sem a análise o aprendizado se perde. Acolha E aprenda." }
    ]
  },
  {
    tema:"Prioridades", emoji:"📌",
    situacao:"Seu gestor te manda 5 'urgências' no mesmo dia, e o time já está no limite da capacidade.",
    opcoes:[
      { t:"Aceita tudo e repassa as 5 para o time — é o chefe que está pedindo.",
        nivel:"evitar", fb:"Repassar pressão sem filtrar afoga o time e mina a sua função de gestor." },
      { t:"Alinha com o gestor o que é realmente prioritário e renegocia prazos/escopo.",
        nivel:"otimo", fb:"Gestão pra cima + proteção do time: você traduz, prioriza e protege a entrega." },
      { t:"Recusa as 5, dizendo que o time não tem capacidade.",
        nivel:"evitar", fb:"Só dizer 'não' sem alternativa não resolve o problema do negócio nem da relação." },
      { t:"Assume as 5 você mesmo para poupar o time.",
        nivel:"evitar", fb:"Vira herói exausto e gargalo. Não é sustentável nem desenvolve ninguém." }
    ]
  },
  {
    tema:"1:1 & coaching", emoji:"🗣️",
    situacao:"No 1:1, um liderado te pergunta diretamente: 'como você resolveria esse problema?'.",
    opcoes:[
      { t:"Entrega a resposta pronta — você já sabe o caminho e poupa tempo.",
        nivel:"bom", fb:"Às vezes cabe, mas se vira padrão a pessoa nunca desenvolve o próprio julgamento." },
      { t:"Devolve com 'e o que você faria?' e constrói a solução junto (GROW).",
        nivel:"otimo", fb:"Coaching de verdade: a autonomia nasce quando a pessoa pensa, não quando você responde." },
      { t:"Diz 'isso é com você, se vira' para forçar a independência.",
        nivel:"evitar", fb:"Autonomia sem suporte é abandono — gera insegurança, não desenvolvimento." },
      { t:"Assume o problema para você e tira o peso da pessoa.",
        nivel:"evitar", fb:"Alívio momentâneo que reforça a dependência e te sobrecarrega." }
    ]
  },
  {
    tema:"Liderança situacional", emoji:"🎚️",
    situacao:"Você precisa passar uma tarefa nova e complexa para alguém recém-chegado e ainda inseguro.",
    opcoes:[
      { t:"Delega por completo e cobra só o resultado final — confiança motiva.",
        nivel:"evitar", fb:"Delegar a quem ainda não tem competência na tarefa gera erro e frustração." },
      { t:"Dirige de perto: explica o porquê, mostra o passo a passo e acompanha.",
        nivel:"otimo", fb:"Estilo certo para baixa competência: dirigir/treinar. Autonomia vem depois, por etapas." },
      { t:"Faz a tarefa por ela desta vez e delega 'quando estiver pronta'.",
        nivel:"evitar", fb:"Sem prática supervisionada, 'pronta' nunca chega. A pessoa aprende fazendo, com apoio." },
      { t:"Passa um manual e fica disponível se ela tiver dúvidas.",
        nivel:"bom", fb:"Melhor que abandonar, mas alguém inseguro precisa de acompanhamento ativo, não só reativo." }
    ]
  }
];

const CEN_NIVEL = {
  otimo: { pts:2, cls:"correct", tag:"🟢 Melhor escolha" },
  bom:   { pts:1, cls:"bom",     tag:"🟡 Aceitável" },
  evitar:{ pts:0, cls:"wrong",   tag:"🔴 Evite" }
};
