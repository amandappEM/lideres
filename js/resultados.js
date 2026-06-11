/* ============================================================
   resultados.js — "Meus resultados": evolução dos diagnósticos
   ============================================================ */
const T = window.LideresTrack;
const $r = id => document.getElementById(id);
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

const DIM_LABEL = {};
DIMENSOES.forEach(d => { DIM_LABEL[d.id] = `${d.emoji} ${d.nome}`; });

function fmt(v){ const n = parseFloat(v); return isNaN(n) ? "—" : n.toFixed(1); }
function nivelClasse(v){ const n = parseFloat(v); return isNaN(n) ? 0 : nivelDe(n).classe; }

function render(){
  const perfil = T.getPerfil();
  const cont = $r("res-conteudo");

  if(!perfil){
    cont.innerHTML = `
      <div class="prose">
        <h3>🔒 Identifique-se para ver seus resultados</h3>
        <p>Seu nome e e-mail ficam guardados só neste navegador. A partir daí, cada diagnóstico que você concluir fica registrado aqui — e você acompanha sua evolução.</p>
        <button class="btn btn-primary btn-lg" id="r-entrar">Entrar para salvar</button>
      </div>`;
    $r("r-entrar").onclick = () => T.promptLogin(() => { T.renderBarra("#ec-identity"); render(); });
    return;
  }

  const evs = T.getEventos().slice().sort((a,b)=>(b.ts||0)-(a.ts||0));

  if(!evs.length){
    cont.innerHTML = `
      <div class="prose">
        <h3>🌱 Você ainda não tem diagnósticos</h3>
        <p>Faça seu primeiro <a href="diagnostico.html">Diagnóstico de Liderança</a> para descobrir seu nível atual por competência e começar a acompanhar a evolução.</p>
        <a class="btn btn-primary btn-lg" href="diagnostico.html">Fazer meu diagnóstico →</a>
      </div>`;
    return;
  }

  const ult = evs[0];
  const ant = evs[1]; // diagnóstico anterior (para delta)

  // cartões por dimensão (último diagnóstico) com seta de evolução
  const dimCards = T.DIM_KEYS.map(k => {
    const atual = parseFloat(ult[k]);
    const cls = nivelClasse(ult[k]);
    let delta = "";
    if(ant && !isNaN(parseFloat(ant[k]))){
      const d = atual - parseFloat(ant[k]);
      const sym = d > 0.05 ? "▲" : (d < -0.05 ? "▼" : "▬");
      const col = d > 0.05 ? "var(--verde)" : (d < -0.05 ? "var(--vermelho)" : "var(--cinza-400)");
      delta = ` <span style="color:${col};font-size:12px;font-weight:700">${sym} ${d>0?"+":""}${d.toFixed(1)}</span>`;
    }
    const pct = isNaN(atual) ? 0 : Math.max(Math.round((atual-1)/4*100), 4);
    return `
      <div class="diag-dim">
        <div class="dd-top">
          <strong>${DIM_LABEL[k]||k}</strong>
          <span class="dd-lvl lvl-${cls}">${fmt(ult[k])}/5${delta}</span>
        </div>
        <div class="diag-bar"><div class="fill bg-${cls}" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");

  // histórico (linha por diagnóstico)
  const linhas = evs.map(e => `
    <tr>
      <td>${escH(new Date(e.ts).toLocaleDateString("pt-BR"))}</td>
      <td>${escH(e.passagem||"—")}</td>
      <td><strong>${fmt(e.media)}</strong></td>
      <td>${T.DIM_KEYS.map(k=>fmt(e[k])).join(" · ")}</td>
    </tr>`).join("");

  cont.innerHTML = `
    <div class="report-section">
      <div class="pg-top">
        <h3 style="margin:0">📊 Seu diagnóstico mais recente</h3>
        <span class="res-quem">${escH(perfil.nome)}</span>
      </div>
      <p style="color:var(--cinza-700);margin:8px 0 16px">
        ${escH(new Date(ult.ts).toLocaleDateString("pt-BR"))} ·
        Momento: <strong>${escH(ult.passagem||"—")}</strong> ·
        Nível geral: <strong>${escH(ult.nivel||"—")}</strong> · média <strong>${fmt(ult.media)}/5</strong>
        ${ant ? `<br><span style="font-size:13px">As setas comparam com seu diagnóstico anterior (${escH(new Date(ant.ts).toLocaleDateString("pt-BR"))}).</span>` : ""}
      </p>
      ${dimCards}
    </div>

    <div class="report-section">
      <div class="pg-top">
        <h3 style="margin:0">🕓 Histórico (${evs.length})</h3>
      </div>
      <p style="color:var(--cinza-700);font-size:13px;margin:6px 0 10px">Colunas de competência, na ordem: ${T.DIM_KEYS.map(k=>DIM_LABEL[k].replace(/^.. /,"")).join(" · ")}.</p>
      <div class="res-tab-wrap">
        <table class="ec-table">
          <thead><tr><th>Data</th><th>Momento</th><th>Média</th><th>Competências (1–5)</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
      <div class="res-acts" style="margin-top:16px">
        <button class="btn btn-primary btn-lg" id="r-csv">📥 Baixar meu CSV</button>
        <button class="btn btn-ghost btn-lg" id="r-mail">✉️ Enviar pra mim</button>
        <a class="btn btn-ghost btn-lg" href="diagnostico.html">🔄 Refazer diagnóstico</a>
        <button class="btn btn-ghost btn-lg" id="r-limpar">🗑️ Limpar histórico</button>
      </div>
    </div>`;

  $r("r-csv").onclick  = () => T.baixarCSV();
  $r("r-mail").onclick = () => T.enviarEmail();
  $r("r-limpar").onclick = () => {
    if(confirm("Apagar todo o seu histórico de diagnósticos neste navegador? Esta ação não pode ser desfeita.")){
      T.limparEventos(); render();
    }
  };
}

render();
