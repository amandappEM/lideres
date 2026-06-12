/* ============================================================
   relatorios.js — painel do gestor (consolida CSVs do time)
   Type-aware: separa Gestão e Liderança automaticamente.
   100% no navegador.
   ============================================================ */
const T = window.LideresTrack;
const $g = id => document.getElementById(id);
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

const TIPOS = [ { id:"gestao", titulo:"🧰 Gestão" }, { id:"lideranca", titulo:"🪄 Liderança" } ];

let consolidado = [];
function chave(e){ return [e.data,e.email,e.nome,e.tipo,e.passagem,e.media].join("|"); }
function tsDe(e){ const d = new Date(e.data); return isNaN(d) ? 0 : d.getTime(); }
function num(v){ const n = parseFloat(v); return isNaN(n) ? null : n; }
function fmt(v){ const n = num(v); return n==null ? "—" : n.toFixed(1); }
function clsDe(v){ const n = T.nivel(v); return n ? n.classe : 0; }

function carregar(files){
  const lista = Array.from(files); if(!lista.length) return;
  let lidos = 0, erros = 0; const vistos = new Set(consolidado.map(chave)); let pend = lista.length;
  lista.forEach(f => {
    const fr = new FileReader();
    fr.onload = () => {
      try { T.objetosDoCSV(fr.result).forEach(o => { const k = chave(o); if(!vistos.has(k)){ vistos.add(k); consolidado.push(o); } }); lidos++; }
      catch(e){ erros++; }
      if(--pend === 0) finalizado(lidos, erros);
    };
    fr.onerror = () => { erros++; if(--pend === 0) finalizado(lidos, erros); };
    fr.readAsText(f, "utf-8");
  });
}
function finalizado(lidos, erros){
  $g("rel-status").textContent =
    `${lidos} arquivo(s) processado(s)${erros?` · ${erros} com erro`:""} · ${consolidado.length} diagnóstico(s) único(s).`;
  render();
}

/* diagnóstico MAIS RECENTE por pessoa, dentro de um tipo */
function ultimosPorPessoa(evs){
  const mapa = {};
  evs.forEach(e => { const id = (e.email||e.nome||"(anônimo)").toLowerCase();
    if(!mapa[id] || tsDe(e) >= tsDe(mapa[id])) mapa[id] = e; });
  return Object.values(mapa);
}

function secaoTipo(tp){
  const evs = consolidado.filter(e => (e.tipo||"lideranca") === tp.id);
  if(!evs.length) return "";
  const keys = T.DIM_KEYS_BY_TIPO[tp.id];
  const pessoas = ultimosPorPessoa(evs);

  const mediaDim = {};
  keys.forEach(k => { const vals = pessoas.map(p=>num(p[k])).filter(v=>v!=null);
    mediaDim[k] = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null; });
  const mGeralVals = pessoas.map(p=>num(p.media)).filter(v=>v!=null);
  const mediaGeral = mGeralVals.length ? mGeralVals.reduce((a,b)=>a+b,0)/mGeralVals.length : null;

  const dimOrden = keys.map(k=>({k,m:mediaDim[k]})).filter(d=>d.m!=null).sort((a,b)=>a.m-b.m);
  const lacunas = dimOrden.slice(0,2);

  const barras = keys.map(k => {
    const m = mediaDim[k]; const cls = clsDe(m);
    const pct = m==null ? 0 : Math.max(Math.round((m-1)/4*100),4);
    const nv = T.nivel(m);
    return `<div class="diag-dim">
      <div class="dd-top"><strong>${T.DIM_META[k].label}</strong>
        <span class="dd-lvl lvl-${cls}">${m==null?"—":m.toFixed(1)+"/5 · "+nv.nome}</span></div>
      <div class="diag-bar"><div class="fill bg-${cls}" style="width:${pct}%"></div></div></div>`;
  }).join("");

  const lacunasHTML = lacunas.map(d =>
    `<div class="foco-card"><h5>${T.DIM_META[d.k].label} · ${d.m.toFixed(1)}/5 (${T.nivel(d.m).nome})</h5>
      <p>Capacidade mais frágil do time nesta frente — boa candidata a workshop ou trilha em grupo.</p></div>`).join("");

  const porMomento = {};
  pessoas.forEach(p => { const m = p.passagem||"—"; porMomento[m]=(porMomento[m]||0)+1; });
  const momentoHTML = Object.entries(porMomento).sort((a,b)=>b[1]-a[1])
    .map(([k,v])=>`<tr><td>${escH(k)}</td><td>${v}</td></tr>`).join("");

  const thDims = keys.map(k => `<th title="${escH(T.DIM_META[k].label)}">${T.DIM_META[k].label.split(" ")[0]}</th>`).join("");
  const rows = pessoas.slice().sort((a,b)=>(num(a.media)||0)-(num(b.media)||0)).map(p => `
    <tr><td>${escH(p.nome||"(anônimo)")}</td><td>${escH(p.email||"—")}</td><td>${escH(p.passagem||"—")}</td>
      <td><strong>${fmt(p.media)}</strong></td>
      ${keys.map(k=>`<td class="lvl-${clsDe(p[k])}">${fmt(p[k])}</td>`).join("")}
      <td>${escH(new Date(tsDe(p)).toLocaleDateString("pt-BR"))}</td></tr>`).join("");

  return `
    <div class="hub-sec"><div class="hub-ic" style="background:var(--roxo-claro)">${tp.titulo.split(" ")[0]}</div>
      <div><h2>${tp.titulo.replace(/^\S+\s/,"")}</h2><p>${pessoas.length} pessoa(s) · ${evs.length} diagnóstico(s)</p></div></div>
    <div class="report-section">
      <h3>📈 Visão geral</h3>
      <div class="res-stats">
        <div class="res-stat"><span class="rs-num">${pessoas.length}</span><span class="rs-lbl">pessoas</span></div>
        <div class="res-stat"><span class="rs-num">${evs.length}</span><span class="rs-lbl">diagnósticos</span></div>
        <div class="res-stat"><span class="rs-num">${mediaGeral==null?"—":mediaGeral.toFixed(1)}</span><span class="rs-lbl">média do time</span></div>
        <div class="res-stat"><span class="rs-num">${mediaGeral==null?"—":T.nivel(mediaGeral).nome}</span><span class="rs-lbl">nível médio</span></div>
      </div>
    </div>
    <div class="report-section"><h3>📊 Média do time por dimensão</h3>${barras}</div>
    <div class="report-section"><h3>🎯 Lacunas coletivas</h3>${lacunasHTML}</div>
    <div class="rel-cols">
      <div class="report-section"><h3 style="margin-top:0">🪜 Distribuição por momento</h3>
        <table class="ec-table"><thead><tr><th>Momento</th><th>Pessoas</th></tr></thead><tbody>${momentoHTML}</tbody></table></div>
      <div class="report-section"><h3 style="margin-top:0">👥 Por pessoa (último diagnóstico)</h3>
        <div class="res-tab-wrap"><table class="ec-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Momento</th><th>Média</th>${thDims}<th>Data</th></tr></thead>
          <tbody>${rows}</tbody></table></div></div>
    </div>`;
}

function render(){
  if(!consolidado.length){ $g("rel-saida").innerHTML = ""; return; }
  let tmin=Infinity, tmax=-Infinity;
  consolidado.forEach(e => { const t = tsDe(e); if(t){ tmin=Math.min(tmin,t); tmax=Math.max(tmax,t); } });
  const periodo = (tmin!==Infinity) ? `${new Date(tmin).toLocaleDateString("pt-BR")} – ${new Date(tmax).toLocaleDateString("pt-BR")}` : "—";

  const secoes = TIPOS.map(secaoTipo).join("");
  $g("rel-saida").innerHTML = `
    <div class="report-section">
      <div class="pg-top"><h3 style="margin:0">🗂️ Consolidado do time</h3>
        <button class="btn btn-primary" id="rel-exp">⬇️ Exportar consolidado</button></div>
      <p style="color:var(--cinza-700);margin-top:8px">Período: <strong>${periodo}</strong> · usando o diagnóstico mais recente de cada pessoa, por frente.</p>
    </div>
    ${secoes || `<div class="prose"><p>Nenhum diagnóstico reconhecido nos arquivos.</p></div>`}`;

  const exp = $g("rel-exp");
  if(exp) exp.onclick = () => {
    const ord = consolidado.slice().sort((a,b)=>tsDe(a)-tsDe(b));
    T.baixarCSV("consolidado_" + new Date().toISOString().slice(0,10) + ".csv", ord);
  };
}

$g("rel-files").addEventListener("change", e => carregar(e.target.files));
