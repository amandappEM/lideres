/* ============================================================
   diagnostico-gestao.js — Diagnóstico de Gestão
   Autodeclaração de cargo/altitude + Likert por dimensão,
   cálculo e relatório com calibração operacional→estratégico.
   Registra com tipo "gestao" (alimenta o Painel do Gestor).
   ============================================================ */

const LIKERT = [
  { v:1, l:"Discordo\ntotalmente" },{ v:2, l:"Discordo" },{ v:3, l:"Neutro" },
  { v:4, l:"Concordo" },{ v:5, l:"Concordo\ntotalmente" }
];

let secAtual = 0;
let respostas = DIMENSOES_G.map(d => new Array(d.itens.length).fill(0));
let nome = "", cargoId = "";
const Track = window.LideresTrack || null;
const $ = id => document.getElementById(id);

/* ---------- Entrada ---------- */
const inNome = $("in-nome");
const perfilSalvo = Track ? Track.getPerfil() : null;
if(perfilSalvo && perfilSalvo.nome) inNome.value = perfilSalvo.nome;
inNome.focus();

$("nivel-grid").innerHTML = PASSAGENS_G.map(p => `
  <button class="nivel-card" data-id="${p.id}">
    <span class="ne">${p.emoji}</span>
    <strong>${p.nome}</strong>
    <span>${p.desc}</span>
  </button>`).join("");

document.querySelectorAll(".nivel-card").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nivel-card").forEach(b => b.classList.remove("sel"));
    btn.classList.add("sel");
    cargoId = btn.dataset.id;
    validarEntrada();
  });
});
inNome.addEventListener("input", validarEntrada);
inNome.addEventListener("keydown", e => { if(e.key==="Enter" && !$("btn-iniciar").disabled) iniciar(); });
$("btn-iniciar").addEventListener("click", iniciar);

function validarEntrada(){ $("btn-iniciar").disabled = !(inNome.value.trim() && cargoId); }

function iniciar(){
  nome = inNome.value.trim();
  if(!nome || !cargoId) return;
  $("tela-entrada").style.display = "none";
  $("tela-quiz").style.display = "block";
  renderStepper(); renderSecao();
}

/* ---------- Stepper ---------- */
function renderStepper(){
  $("stepper").innerHTML = DIMENSOES_G.map((d,i) =>
    `<div class="step-pill ${i===secAtual?'active':(i<secAtual?'done':'')}">
       <span class="n">Dim ${i+1}</span>${d.emoji}</div>`
  ).join("");
}

/* ---------- Render de uma dimensão ---------- */
function renderSecao(){
  const dim = DIMENSOES_G[secAtual];
  $("sec-titulo").textContent = `${dim.emoji} ${dim.nome}`;
  $("sec-sub").textContent = dim.desc;

  $("perguntas").innerHTML = dim.itens.map((item, i) => `
    <div class="q-card">
      <div class="q-num">Afirmação ${i+1} de ${dim.itens.length}</div>
      <div class="q-text">${item.t}</div>
      <div class="likert" data-i="${i}">
        ${LIKERT.map(o => `
          <button data-v="${o.v}" class="${respostas[secAtual][i]===o.v?'sel':''}">
            <span class="dot"></span>${o.l.replace(/\n/g,'<br>')}
          </button>`).join("")}
      </div>
    </div>`).join("");

  document.querySelectorAll(".likert").forEach(grp => {
    const i = +grp.dataset.i;
    grp.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => {
        respostas[secAtual][i] = +b.dataset.v;
        grp.querySelectorAll("button").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        atualizarProg();
      });
    });
  });

  $("btn-voltar").style.visibility = secAtual === 0 ? "hidden" : "visible";
  $("btn-avancar").textContent = secAtual === DIMENSOES_G.length-1 ? "Ver meu resultado ✨" : "Avançar →";
  atualizarProg();
  window.scrollTo({top:0, behavior:"smooth"});
}

function atualizarProg(){
  const respondidas = respostas.flat().filter(v => v>0).length;
  $("prog").style.width = Math.round(respondidas/respostas.flat().length*100) + "%";
  $("btn-avancar").disabled = !respostas[secAtual].every(v => v>0);
}

$("btn-voltar").addEventListener("click", () => { if(secAtual>0){ secAtual--; renderStepper(); renderSecao(); } });
$("btn-avancar").addEventListener("click", () => {
  if(!respostas[secAtual].every(v => v>0)) return;
  if(secAtual < DIMENSOES_G.length-1){ secAtual++; renderStepper(); renderSecao(); }
  else gerarRelatorio();
});

/* ============================================================ CÁLCULO */
function calcular(){
  const dims = DIMENSOES_G.map((dim, di) => {
    let soma = 0;
    dim.itens.forEach((item, i) => { const v = respostas[di][i]; soma += item.inv ? (6 - v) : v; });
    const media = soma / dim.itens.length;
    const pct = Math.round((media - 1) / 4 * 100);
    return { dim, media, pct, nivel: nivelDeG(media) };
  });
  const mediaGeral = dims.reduce((a,d) => a + d.media, 0) / dims.length;
  const ordenadas = [...dims].sort((a,b) => b.media - a.media);
  return { dims, mediaGeral, nivelGeral: nivelDeG(mediaGeral),
           fortes: ordenadas.slice(0,2), focos: ordenadas.slice(-2).reverse() };
}

/* ============================================================ RELATÓRIO */
function gerarRelatorio(){
  const r = calcular();
  const cargo = PASSAGENS_G.find(p => p.id === cargoId);
  const dataStr = new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" });

  const dimsMap = {};
  r.dims.forEach(d => { dimsMap[d.dim.id] = +d.media.toFixed(2); });
  const eventoDiag = { tipo:"gestao", passagem: cargo.nome, media:+r.mediaGeral.toFixed(2),
    nivel:`${r.nivelGeral.n} · ${r.nivelGeral.nome}`, dims: dimsMap };
  let registrado = false;
  if(Track){
    const perfil = Track.getPerfil();
    if(perfil){ Track.setPerfil(nome || perfil.nome, perfil.email); Track.log(eventoDiag); registrado = true; }
  }

  const barrasHTML = r.dims.map(d => `
    <div class="diag-dim">
      <div class="dd-top">
        <strong>${d.dim.emoji} ${d.dim.nome}</strong>
        <span class="dd-lvl lvl-${d.nivel.classe}">Nível ${d.nivel.n} · ${d.nivel.nome} · ${d.media.toFixed(1)}/5</span>
      </div>
      <div class="diag-bar"><div class="fill bg-${d.nivel.classe}" style="width:${Math.max(d.pct,4)}%"></div></div>
      <div class="dd-desc">${d.dim.desc}</div>
    </div>`).join("");

  const fortesHTML = r.fortes.map(d =>
    `<li><strong>${d.dim.emoji} ${d.dim.nome}</strong> — ${d.nivel.nome} (${d.media.toFixed(1)}/5)</li>`).join("");

  const focosHTML = r.focos.map(d => `
    <div class="foco-card">
      <h5>${d.dim.emoji} ${d.dim.nome} · Nível ${d.nivel.n} (${d.media.toFixed(1)}/5)</h5>
      <p><strong>Próximo passo:</strong> ${d.dim.foco[d.nivel.classe]}</p>
    </div>`).join("");

  const ng = r.nivelGeral;
  const altNome = ALT_LABEL[cargo.alt];

  $("tela-relatorio").innerHTML = `
    <div class="report-head">
      <div class="report-brand">
        <img src="logo_EM.png" alt="Estante Mágica" class="report-logo"
             onerror="this.outerHTML='<div class=&quot;report-logo-fb&quot;>📚</div>'">
        <div class="report-brand-meta"><strong>Jornada da Gestão</strong><span>Diagnóstico de Gestão</span></div>
      </div>
      <div class="tipo-emoji">${cargo.emoji}</div>
      <h2>${nome}</h2>
      <div class="code">${cargo.nome.toUpperCase()} · ${altNome.toUpperCase()}</div>
      <div class="report-meta">
        <span><strong>Nível geral:</strong> ${ng.n} · ${ng.nome}</span>
        <span><strong>Média:</strong> ${r.mediaGeral.toFixed(1)}/5</span>
        <span>${dataStr}</span>
      </div>
    </div>

    <div class="report-section">
      <h3>🧭 Visão geral</h3>
      <div class="diag-score">
        <div class="ring" style="background:${ng.cor}"><strong>${r.mediaGeral.toFixed(1)}</strong><span>de 5</span></div>
        <p style="flex:1;min-width:240px;color:var(--cinza-700)">
          Como <strong>${cargo.nome.toLowerCase()}</strong> (altitude <strong>${altNome.toLowerCase()}</strong>), seu nível geral de gestão hoje é
          <strong class="lvl-${ng.classe}">${ng.nome}</strong>. ${ng.desc}
        </p>
      </div>
    </div>

    <div class="report-section">
      <h3>🔭 Calibração por altitude</h3>
      <p style="color:var(--cinza-700)">${ALT_GUIA[cargo.alt]}</p>
      <div class="alt-legend">
        <span class="alt-item"><span class="alt-badge alt-op">Operacional</span> faço acontecer</span>
        <span class="alt-item"><span class="alt-badge alt-tat">Tático</span> organizo o sistema</span>
        <span class="alt-item"><span class="alt-badge alt-est">Estratégico</span> defino direção</span>
      </div>
    </div>

    <div class="report-section">
      <h3>📊 Seu nível por capacidade</h3>
      ${barrasHTML}
    </div>

    <div class="report-section">
      <h3>💪 Seus pontos fortes</h3>
      <ul style="padding-left:20px;color:var(--cinza-700)">${fortesHTML}</ul>
    </div>

    <div class="report-section">
      <h3>🎯 Seu foco de desenvolvimento</h3>
      <p style="color:var(--cinza-700);margin-bottom:12px">As 2 capacidades de maior alavancagem agora. Comece por aqui — e aprofunde na <a href="gestao.html">Jornada da Gestão</a>.</p>
      ${focosHTML}
    </div>

    <div class="report-section no-print">
      <h3>🔁 E agora?</h3>
      <p style="color:var(--cinza-700)">Retrato de <strong>hoje</strong>. Refaça em ~90 dias para ver a evolução. Leve seu foco para a conversa com seu gestor.</p>
      ${registrado
        ? `<div class="foco-card"><h5>✅ Diagnóstico salvo no seu histórico</h5><p>Veja sua evolução em <a href="resultados.html">Meus resultados</a> e baixe o CSV para o gestor.</p></div>`
        : `<div class="foco-card"><h5>💾 Quer acompanhar sua evolução?</h5><p>Você não está identificado. <a href="#" id="lid-identificar">Identifique-se</a> para salvar e habilitar o painel do gestor.</p></div>`}
      <div class="report-actions">
        <button class="btn btn-primary btn-lg" onclick="window.print()">🖨️ Salvar em PDF / Imprimir</button>
        <a class="btn btn-ghost btn-lg" href="gestao.html">📚 Jornada da Gestão</a>
        <a class="btn btn-ghost btn-lg" href="index.html">Voltar ao início</a>
      </div>
    </div>`;

  $("tela-quiz").style.display = "none";
  $("tela-relatorio").style.display = "block";

  const lnk = $("lid-identificar");
  if(lnk && Track){
    lnk.addEventListener("click", e => {
      e.preventDefault();
      Track.promptLogin(() => { Track.log(eventoDiag); Track.renderBarra("#ec-identity"); location.href = "resultados.html"; });
    });
  }
  window.scrollTo({top:0, behavior:"smooth"});
}
