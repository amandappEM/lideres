/* ============================================================
   relatorios.js — consolida diagnósticos do time (100% no navegador)
   ============================================================ */
const T = window.LideresTrack;
const $g = id => document.getElementById(id);
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

const DIM_LABEL = {};
DIMENSOES.forEach(d => { DIM_LABEL[d.id] = `${d.emoji} ${d.nome}`; });

let consolidado = [];

function chave(e){ return [e.data,e.email,e.nome,e.passagem,e.media].join("|"); }
function tsDe(e){ const d = new Date(e.data); return isNaN(d) ? 0 : d.getTime(); }
function num(v){ const n = parseFloat(v); return isNaN(n) ? null : n; }

function carregar(files){
  const lista = Array.from(files);
  if(!lista.length) return;
  let lidos = 0, erros = 0;
  const vistos = new Set(consolidado.map(chave));
  let pend = lista.length;

  lista.forEach(f => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const objs = T.objetosDoCSV(fr.result);
        objs.forEach(o => { const k = chave(o); if(!vistos.has(k)){ vistos.add(k); consolidado.push(o); } });
        lidos++;
      } catch(e){ erros++; }
      if(--pend === 0) finalizado(lidos, erros);
    };
    fr.onerror = () => { erros++; if(--pend === 0) finalizado(lidos, erros); };
    fr.readAsText(f, "utf-8");
  });
}

function finalizado(lidos, erros){
  $g("rel-status").textContent =
    `${lidos} arquivo(s) processado(s)${erros?` · ${erros} com erro`:""} · ${consolidado.length} diagnóstico(s) único(s) no total.`;
  render();
}

/* mantém o diagnóstico MAIS RECENTE por pessoa (email||nome) */
function ultimosPorPessoa(evs){
  const mapa = {};
  evs.forEach(e => {
    const id = (e.email || e.nome || "(anônimo)").toLowerCase();
    if(!mapa[id] || tsDe(e) >= tsDe(mapa[id])) mapa[id] = e;
  });
  return mapa;
}

function nivelClasse(v){ const n = num(v); return n==null ? 0 : nivelDe(n).classe; }
function fmt(v){ const n = num(v); return n==null ? "—" : n.toFixed(1); }

function render(){
  if(!consolidado.length){ $g("rel-saida").innerHTML = ""; return; }

  const ultimos = ultimosPorPessoa(consolidado);
  const pessoas = Object.values(ultimos);
  const nPessoas = pessoas.length;

  // médias do time por dimensão (usando o diagnóstico mais recente de cada pessoa)
  const mediaDim = {};
  T.DIM_KEYS.forEach(k => {
    const vals = pessoas.map(p => num(p[k])).filter(v => v!=null);
    mediaDim[k] = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
  });
  const mediaGeralVals = pessoas.map(p => num(p.media)).filter(v => v!=null);
  const mediaGeral = mediaGeralVals.length ? mediaGeralVals.reduce((a,b)=>a+b,0)/mediaGeralVals.length : null;

  // ranking de dimensões (da mais frágil para a mais forte) — lacunas do time
  const dimOrden = T.DIM_KEYS.map(k => ({ k, m: mediaDim[k] }))
    .filter(d => d.m != null).sort((a,b) => a.m - b.m);
  const lacunas = dimOrden.slice(0, 2);

  // período
  let tmin=Infinity, tmax=-Infinity;
  consolidado.forEach(e => { const t = tsDe(e); if(t){ tmin=Math.min(tmin,t); tmax=Math.max(tmax,t); } });
  const periodo = (tmin!==Infinity)
    ? `${new Date(tmin).toLocaleDateString("pt-BR")} – ${new Date(tmax).toLocaleDateString("pt-BR")}` : "—";

  // distribuição por momento
  const porMomento = {};
  pessoas.forEach(p => { const m = p.passagem||"—"; porMomento[m]=(porMomento[m]||0)+1; });

  // barras de média do time por dimensão
  const barrasHTML = T.DIM_KEYS.map(k => {
    const m = mediaDim[k];
    const cls = nivelClasse(m);
    const pct = m==null ? 0 : Math.max(Math.round((m-1)/4*100), 4);
    return `
      <div class="diag-dim">
        <div class="dd-top">
          <strong>${DIM_LABEL[k]}</strong>
          <span class="dd-lvl lvl-${cls}">${m==null?"—":m.toFixed(1)+"/5 · "+nivelDe(m).nome}</span>
        </div>
        <div class="diag-bar"><div class="fill bg-${cls}" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");

  const lacunasHTML = lacunas.map(d => {
    const dim = DIMENSOES.find(x => x.id === d.k);
    const cls = nivelDe(d.m).classe;
    return `<div class="foco-card">
      <h5>${DIM_LABEL[d.k]} · ${d.m.toFixed(1)}/5 (${nivelDe(d.m).nome})</h5>
      <p><strong>Ação coletiva sugerida:</strong> ${dim ? dim.foco[cls] : ""}</p>
    </div>`;
  }).join("");

  const momentoHTML = Object.entries(porMomento).sort((a,b)=>b[1]-a[1])
    .map(([k,v])=>`<tr><td>${escH(k)}</td><td>${v}</td></tr>`).join("");

  // tabela por pessoa (último diagnóstico)
  const pessoasRows = pessoas.slice().sort((a,b)=>(num(a.media)||0)-(num(b.media)||0)).map(p => `
    <tr>
      <td>${escH(p.nome||"(anônimo)")}</td>
      <td>${escH(p.email||"—")}</td>
      <td>${escH(p.passagem||"—")}</td>
      <td><strong>${fmt(p.media)}</strong></td>
      ${T.DIM_KEYS.map(k=>`<td class="lvl-${nivelClasse(p[k])}">${fmt(p[k])}</td>`).join("")}
      <td>${escH(new Date(tsDe(p)).toLocaleDateString("pt-BR"))}</td>
    </tr>`).join("");

  const thDims = T.DIM_KEYS.map(k => `<th title="${escH(DIM_LABEL[k])}">${DIM_LABEL[k].split(" ")[0]}</th>`).join("");

  $g("rel-saida").innerHTML = `
    <div class="report-section">
      <div class="pg-top">
        <h3 style="margin:0">📈 Visão geral do time</h3>
        <button class="btn btn-primary" id="rel-exp">⬇️ Exportar consolidado</button>
      </div>
      <p style="color:var(--cinza-700);margin-top:8px">Período: <strong>${periodo}</strong> · usando o diagnóstico mais recente de cada pessoa.</p>
      <div class="res-stats">
        <div class="res-stat"><span class="rs-num">${nPessoas}</span><span class="rs-lbl">líderes</span></div>
        <div class="res-stat"><span class="rs-num">${consolidado.length}</span><span class="rs-lbl">diagnósticos</span></div>
        <div class="res-stat"><span class="rs-num">${mediaGeral==null?"—":mediaGeral.toFixed(1)}</span><span class="rs-lbl">média do time</span></div>
        <div class="res-stat"><span class="rs-num">${mediaGeral==null?"—":nivelDe(mediaGeral).nome}</span><span class="rs-lbl">nível médio</span></div>
      </div>
    </div>

    <div class="report-section">
      <h3>📊 Média do time por competência</h3>
      ${barrasHTML}
    </div>

    <div class="report-section">
      <h3>🎯 Lacunas coletivas — onde investir primeiro</h3>
      <p style="color:var(--cinza-700);margin-bottom:12px">As 2 competências mais frágeis do time hoje. Boas candidatas a workshop ou trilha em grupo.</p>
      ${lacunasHTML}
    </div>

    <div class="rel-cols">
      <div class="report-section">
        <h3 style="margin-top:0">🪜 Distribuição por momento</h3>
        <table class="ec-table"><thead><tr><th>Momento</th><th>Líderes</th></tr></thead><tbody>${momentoHTML}</tbody></table>
      </div>
      <div class="report-section">
        <h3 style="margin-top:0">👥 Por líder (último diagnóstico)</h3>
        <div class="res-tab-wrap">
          <table class="ec-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Momento</th><th>Média</th>${thDims}<th>Data</th></tr></thead>
            <tbody>${pessoasRows}</tbody>
          </table>
        </div>
      </div>
    </div>`;

  $g("rel-exp").onclick = () => {
    const ord = consolidado.slice().sort((a,b)=>tsDe(a)-tsDe(b));
    T.baixarCSV("lideres_consolidado_" + new Date().toISOString().slice(0,10) + ".csv", ord);
  };
}

$g("rel-files").addEventListener("change", e => carregar(e.target.files));
