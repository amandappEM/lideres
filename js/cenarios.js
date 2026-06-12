/* ============================================================
   cenarios.js — motor dos Cenários de Decisão
   Apresenta um caso por vez, revela feedback e pontua.
   ============================================================ */
const $c = id => document.getElementById(id);
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

let ordem = [], idx = 0, pontos = 0, maxPontos = 0, respondeu = false;

function iniciar(){
  ordem = shuffle(CENARIOS);
  idx = 0; pontos = 0; respondeu = false;
  maxPontos = ordem.length * CEN_NIVEL.otimo.pts;
  $c("tela-intro").style.display = "none";
  $c("tela-fim").style.display = "none";
  $c("tela-jogo").style.display = "block";
  render();
}

function render(){
  respondeu = false;
  const c = ordem[idx];
  const opcoes = shuffle(c.opcoes);
  $c("tela-jogo").innerHTML = `
    <div class="cen-top">
      <span class="cen-tema">${c.emoji} ${esc(c.tema)}</span>
      <span class="cen-prog">Caso ${idx+1} de ${ordem.length} · ${pontos} pts</span>
    </div>
    <div class="prog-wrap"><div class="fill" style="width:${Math.round(idx/ordem.length*100)}%"></div></div>
    <div class="pg-qbox">
      <div class="cen-sit">${esc(c.situacao)}</div>
      <div id="cen-opts">
        ${opcoes.map((o,i)=>`<button class="popt" data-i="${i}">${esc(o.t)}</button>`).join("")}
      </div>
      <div id="cen-fb"></div>
      <div id="cen-nav" style="margin-top:14px;display:none;text-align:right">
        <button class="btn btn-primary btn-lg" id="cen-next">${idx===ordem.length-1?"Ver resultado ✨":"Próximo caso →"}</button>
      </div>
    </div>`;

  const opts = $c("cen-opts");
  opts.querySelectorAll(".popt").forEach(btn => {
    btn.addEventListener("click", () => {
      if(respondeu) return;
      respondeu = true;
      const o = opcoes[+btn.dataset.i];
      const meta = CEN_NIVEL[o.nivel];
      pontos += meta.pts;
      // revela todas as opções com sua cor e marca a escolhida
      opts.querySelectorAll(".popt").forEach((b,i) => {
        const lvl = CEN_NIVEL[opcoes[i].nivel];
        b.classList.add(lvl.cls);
        b.disabled = true;
        b.insertAdjacentHTML("beforeend", `<span class="popt-tag">${b===btn?"➡️ sua escolha · ":""}${lvl.tag}</span>`);
      });
      $c("cen-fb").innerHTML = `<div class="cen-fb ${meta.cls}"><strong>${meta.tag}</strong> — ${esc(o.fb)}</div>`;
      $c("cen-nav").style.display = "block";
    });
  });

  $c("cen-next").onclick = avancar;
  window.scrollTo({top:0,behavior:"smooth"});
}

function avancar(){
  if(idx < ordem.length-1){ idx++; render(); }
  else fim();
}

function fim(){
  const pct = Math.round(pontos/maxPontos*100);
  let faixa, cor, msg;
  if(pct>=85){ faixa="Decisões de referência 🏆"; cor="var(--verde)"; msg="Você combina cuidado com as pessoas e clareza nas decisões. Siga formando outros líderes."; }
  else if(pct>=60){ faixa="No caminho certo 👍"; cor="#0EA5E9"; msg="Boas escolhas na maioria dos casos. Releia os feedbacks dos casos amarelos e vermelhos."; }
  else { faixa="Bom ponto de partida 🌱"; cor="var(--laranja)"; msg="Vários casos pedem mais delegação, feedback cedo e gestão pra cima. Volte à Jornada da Gestão."; }

  $c("tela-jogo").style.display = "none";
  $c("tela-fim").style.display = "block";
  $c("tela-fim").innerHTML = `
    <div class="report-head" style="text-align:center">
      <div class="tipo-emoji">🧠</div>
      <h2>${pontos} / ${maxPontos} pontos</h2>
      <div class="code">${pct}% · ${faixa}</div>
    </div>
    <div class="report-section">
      <h3>🎯 Como você decidiu</h3>
      <p style="color:var(--cinza-700)">${msg}</p>
      <p style="color:var(--cinza-700)">Princípios que atravessam quase todos os casos: <strong>feedback cedo e específico</strong>, <strong>delegar com suporte</strong> (não abandonar nem reassumir), <strong>proteger a segurança psicológica</strong> e <strong>fazer gestão pra cima</strong> com transparência.</p>
      <div class="report-actions">
        <button class="btn btn-primary btn-lg" id="cen-replay">🔄 Jogar de novo</button>
        <a class="btn btn-ghost btn-lg" href="gestao.html">📚 Jornada da Gestão</a>
        <a class="btn btn-ghost btn-lg" href="index.html">Voltar ao início</a>
      </div>
    </div>`;
  $c("cen-replay").onclick = iniciar;
  window.scrollTo({top:0,behavior:"smooth"});
}

$c("cen-start").addEventListener("click", iniciar);
