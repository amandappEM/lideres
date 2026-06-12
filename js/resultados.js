/* ============================================================
   resultados.js — "Meus resultados": evolução dos diagnósticos
   Type-aware: mostra Gestão e Liderança separadamente.
   ============================================================ */
const T = window.LideresTrack;
const $r = id => document.getElementById(id);
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

const TIPOS = [
  { id:"gestao",    titulo:"🧰 Gestão",    refazer:"diagnostico-gestao.html" },
  { id:"lideranca", titulo:"🪄 Liderança", refazer:"diagnostico.html" }
];
function fmt(v){ const n = parseFloat(v); return isNaN(n) ? "—" : n.toFixed(1); }
function clsDe(v){ const n = T.nivel(v); return n ? n.classe : 0; }

function secaoTipo(tp){
  const evs = T.getEventos(tp.id).sort((a,b)=>(b.ts||0)-(a.ts||0));
  if(!evs.length) return "";
  const keys = T.DIM_KEYS_BY_TIPO[tp.id];
  const ult = evs[0], ant = evs[1];

  const dimCards = keys.map(k => {
    const atual = parseFloat(ult[k]);
    const cls = clsDe(ult[k]);
    let delta = "";
    if(ant && !isNaN(parseFloat(ant[k]))){
      const d = atual - parseFloat(ant[k]);
      const sym = d > 0.05 ? "▲" : (d < -0.05 ? "▼" : "▬");
      const col = d > 0.05 ? "var(--verde)" : (d < -0.05 ? "var(--vermelho)" : "var(--cinza-400)");
      delta = ` <span style="color:${col};font-size:12px;font-weight:700">${sym} ${d>0?"+":""}${d.toFixed(1)}</span>`;
    }
    const pct = isNaN(atual) ? 0 : Math.max(Math.round((atual-1)/4*100), 4);
    return `<div class="diag-dim">
      <div class="dd-top"><strong>${T.DIM_META[k].label}</strong>
        <span class="dd-lvl lvl-${cls}">${fmt(ult[k])}/5${delta}</span></div>
      <div class="diag-bar"><div class="fill bg-${cls}" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");

  const linhas = evs.map(e => `
    <tr><td>${escH(new Date(e.ts).toLocaleDateString("pt-BR"))}</td>
      <td>${escH(e.passagem||"—")}</td>
      <td><strong>${fmt(e.media)}</strong></td>
      <td>${keys.map(k=>fmt(e[k])).join(" · ")}</td></tr>`).join("");

  return `
    <div class="report-section">
      <div class="pg-top"><h3 style="margin:0">${tp.titulo} — mais recente</h3>
        <a class="ec-back" href="${tp.refazer}">🔄 Refazer</a></div>
      <p style="color:var(--cinza-700);margin:8px 0 16px">
        ${escH(new Date(ult.ts).toLocaleDateString("pt-BR"))} ·
        ${escH(ult.passagem||"—")} · Nível <strong>${escH(ult.nivel||"—")}</strong> · média <strong>${fmt(ult.media)}/5</strong>
        ${ant ? `<br><span style="font-size:13px">Setas comparam com ${escH(new Date(ant.ts).toLocaleDateString("pt-BR"))}.</span>` : ""}
      </p>
      ${dimCards}
      <details style="margin-top:14px"><summary style="cursor:pointer;font-weight:700;color:var(--roxo)">🕓 Histórico (${evs.length})</summary>
        <div class="res-tab-wrap" style="margin-top:10px">
          <table class="ec-table"><thead><tr><th>Data</th><th>Momento</th><th>Média</th><th>Dimensões (1–5)</th></tr></thead>
            <tbody>${linhas}</tbody></table>
        </div>
      </details>
    </div>`;
}

function render(){
  const perfil = T.getPerfil();
  const cont = $r("res-conteudo");

  if(!perfil){
    cont.innerHTML = `
      <div class="prose"><h3>🔒 Identifique-se para ver seus resultados</h3>
        <p>Seu nome e e-mail ficam só neste navegador. A partir daí, cada diagnóstico (de Gestão ou de Liderança) fica registrado aqui.</p>
        <button class="btn btn-primary btn-lg" id="r-entrar">Entrar para salvar</button></div>`;
    $r("r-entrar").onclick = () => T.promptLogin(() => { T.renderBarra("#ec-identity"); render(); });
    return;
  }

  const evs = T.getEventos();
  if(!evs.length){
    cont.innerHTML = `
      <div class="prose"><h3>🌱 Você ainda não tem diagnósticos</h3>
        <p>Comece pelo <a href="diagnostico-gestao.html">Diagnóstico de Gestão</a> ou pelo <a href="diagnostico.html">Diagnóstico de Liderança</a>.</p>
        <div class="report-actions">
          <a class="btn btn-primary btn-lg" href="diagnostico-gestao.html">Diagnóstico de Gestão →</a>
          <a class="btn btn-ghost btn-lg" href="diagnostico.html">Diagnóstico de Liderança →</a>
        </div></div>`;
    return;
  }

  const secoes = TIPOS.map(secaoTipo).join("");
  cont.innerHTML = `
    <div class="report-section">
      <div class="pg-top"><h3 style="margin:0">📊 Olá, ${escH(perfil.nome)}</h3></div>
      <p style="color:var(--cinza-700);margin-top:6px">${evs.length} diagnóstico(s) registrado(s). Acompanhe sua evolução abaixo.</p>
      <div class="res-acts" style="margin-top:12px">
        <button class="btn btn-primary btn-lg" id="r-csv">📥 Baixar meu CSV</button>
        <button class="btn btn-ghost btn-lg" id="r-mail">✉️ Enviar pra mim</button>
        <button class="btn btn-ghost btn-lg" id="r-limpar">🗑️ Limpar histórico</button>
      </div>
    </div>
    ${secoes}`;

  $r("r-csv").onclick  = () => T.baixarCSV();
  $r("r-mail").onclick = () => T.enviarEmail();
  $r("r-limpar").onclick = () => {
    if(confirm("Apagar todo o seu histórico de diagnósticos neste navegador? Esta ação não pode ser desfeita.")){
      T.limparEventos(); render();
    }
  };
}

render();
