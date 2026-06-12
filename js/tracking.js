/* ============================================================
   tracking.js — identificação leve + registro de diagnósticos
   Trilha de Gestão & Liderança · 100% no navegador (localStorage).
   Type-aware: suporta diagnósticos de "lideranca" e "gestao".
   API global: window.LideresTrack
   ============================================================ */
(function(){
  const KP = "LID_PERFIL", KE = "LID_EVENTOS";

  /* Metadados das dimensões (fonte única de verdade p/ rótulos e tipo) */
  const DIM_META = {
    // Liderança
    delegacao:{label:"🤲 Delegação & Multiplicação", tipo:"lideranca"},
    tempo:    {label:"⏱️ Tempo & Prioridades",        tipo:"lideranca"},
    valores:  {label:"💎 Valores de Liderança",       tipo:"lideranca"},
    execucao: {label:"🏁 Execução",                   tipo:"lideranca"},
    pessoas:  {label:"🌱 Desenvolvimento de Pessoas", tipo:"lideranca"},
    negocio:  {label:"🧭 Visão de Negócio",           tipo:"lideranca"},
    // Gestão
    g_autogestao:{label:"🧭 Autogestão & Prioridades", tipo:"gestao"},
    g_ritmo:     {label:"🔁 Cadência & Rituais",       tipo:"gestao"},
    g_coaching:  {label:"🗣️ 1:1 & Coaching",           tipo:"gestao"},
    g_delegacao: {label:"🤲 Delegação & Autonomia",    tipo:"gestao"},
    g_feedback:  {label:"💬 Feedback & Conversas",     tipo:"gestao"},
    g_performance:{label:"📈 Metas & Performance",     tipo:"gestao"}
  };
  const ALL_DIM_KEYS = Object.keys(DIM_META);
  const DIM_KEYS_BY_TIPO = {
    lideranca: ALL_DIM_KEYS.filter(k => DIM_META[k].tipo==="lideranca"),
    gestao:    ALL_DIM_KEYS.filter(k => DIM_META[k].tipo==="gestao")
  };
  const TIPO_LABEL = { lideranca:"Liderança", gestao:"Gestão" };

  /* colunas do CSV: [chave, rótulo] — ordem fixa (base + dimensões) */
  const COLS = [
    ["data","Data/Hora"],["nome","Nome"],["email","E-mail"],["tipo","Tipo"],
    ["passagem","Momento"],["media","Media geral"],["nivel","Nivel geral"]
  ].concat(ALL_DIM_KEYS.map(k => [k, k]));

  /* Faixas de nível (compartilhadas entre gestão e liderança) */
  const NIVEIS = [
    { n:1, max:2.49, nome:"Inicial",            classe:1, cor:"#EF4444" },
    { n:2, max:3.39, nome:"Em desenvolvimento", classe:2, cor:"#F59E0B" },
    { n:3, max:4.19, nome:"Consolidado",        classe:3, cor:"#0EA5E9" },
    { n:4, max:5.01, nome:"Referência",         classe:4, cor:"#22C55E" }
  ];
  function nivel(media){ const m=parseFloat(media); if(isNaN(m)) return null; return NIVEIS.find(f=>m<=f.max)||NIVEIS[NIVEIS.length-1]; }

  /* ---------- storage ---------- */
  function read(k,def){ try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?def:v; }catch(e){ return def; } }
  function write(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

  function getPerfil(){ return read(KP,null); }
  function setPerfil(nome,email){ const p={nome:String(nome||"").trim(),email:String(email||"").trim(),desde:new Date().toISOString()}; write(KP,p); return p; }
  function limparPerfil(){ localStorage.removeItem(KP); }

  function getEventos(tipo){
    const evs = read(KE,[]).map(e => ({ tipo:"lideranca", ...e }));   // default p/ eventos antigos
    return tipo ? evs.filter(e => e.tipo===tipo) : evs;
  }
  function limparEventos(tipo){
    if(!tipo){ localStorage.removeItem(KE); return; }
    write(KE, getEventos().filter(e => e.tipo!==tipo));
  }

  /* registra um diagnóstico. ev = {tipo, passagem, media, nivel, dims:{key:media}} */
  function log(ev){
    const p = getPerfil() || {nome:"(anônimo)",email:""};
    const evs = read(KE,[]);
    const agora = new Date();
    const row = {
      ts: agora.getTime(), data: agora.toISOString(),
      nome: p.nome, email: p.email, tipo: ev.tipo || "lideranca",
      passagem: ev.passagem||"", media: (ev.media==null?"":ev.media), nivel: ev.nivel||""
    };
    ALL_DIM_KEYS.forEach(k => { row[k] = ""; });
    const dims = ev.dims || {};
    Object.keys(dims).forEach(k => { if(k in row) row[k] = dims[k]; });
    evs.push(row);
    write(KE,evs);
    return evs.length;
  }

  /* ---------- CSV ---------- */
  function csvCell(v){ v=(v==null?"":String(v)); return /[",\n\r]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }
  function dataLocal(e){ return e.ts ? new Date(e.ts).toLocaleString("pt-BR") : (e.data||""); }
  function toCSV(evs){
    const head = COLS.map(c=>csvCell(c[1])).join(",");
    const rows = evs.map(e => COLS.map(c => c[0]==="data" ? csvCell(dataLocal(e)) : csvCell(e[c[0]])).join(","));
    return [head, ...rows].join("\r\n");
  }
  function baixarCSV(nomeArq, evs){
    evs = evs || getEventos();
    const csv = "﻿" + toCSV(evs);
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArq || ("diagnosticos_" + new Date().toISOString().slice(0,10) + ".csv");
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  function parseCSV(text){
    text = String(text||"").replace(/^﻿/,"");
    const rows=[]; let row=[], field="", inq=false, i=0;
    while(i < text.length){
      const ch = text[i];
      if(inq){
        if(ch==='"'){ if(text[i+1]==='"'){ field+='"'; i+=2; continue; } inq=false; i++; continue; }
        field+=ch; i++; continue;
      }
      if(ch==='"'){ inq=true; i++; continue; }
      if(ch===','){ row.push(field); field=""; i++; continue; }
      if(ch==='\r'){ i++; continue; }
      if(ch==='\n'){ row.push(field); rows.push(row); row=[]; field=""; i++; continue; }
      field+=ch; i++;
    }
    if(field!=="" || row.length){ row.push(field); rows.push(row); }
    return rows;
  }
  function objetosDoCSV(text){
    const rows = parseCSV(text).filter(r => r.length && r.some(c => c!==""));
    if(!rows.length) return [];
    const header = rows[0];
    const idxToKey = header.map((rot,i) => {
      const found = COLS.find(c => c[1].toLowerCase() === String(rot).trim().toLowerCase());
      return found ? found[0] : (COLS[i] ? COLS[i][0] : ("col"+i));
    });
    return rows.slice(1).map(r => {
      const o={}; idxToKey.forEach((k,i)=> o[k]=r[i]!=null?r[i]:""); if(!o.tipo) o.tipo="lideranca"; return o;
    });
  }

  /* ---------- e-mail (enviar pra si) ---------- */
  function resumoTexto(evs){
    evs = evs || getEventos();
    if(!evs.length) return "Você ainda não tem diagnósticos registrados.";
    const linhas = ["Resumo — Diagnósticos (Gestão & Liderança)", "Total: " + evs.length, ""];
    ["gestao","lideranca"].forEach(tp => {
      const list = evs.filter(e=>e.tipo===tp).sort((a,b)=>(b.ts||0)-(a.ts||0));
      if(!list.length) return;
      const u = list[0];
      linhas.push(`• ${TIPO_LABEL[tp]} — último (${dataLocal(u)}): ${u.nivel||"—"} · média ${u.media||"—"}/5 · ${u.passagem||""}`);
    });
    return linhas.join("\n");
  }
  function enviarEmail(){
    const p = getPerfil();
    const dest = (p && p.email) ? p.email : "";
    const corpo = resumoTexto() + "\n\n— Para o histórico completo, use \"Baixar meu CSV\" e anexe a este e-mail.";
    location.href = "mailto:" + encodeURIComponent(dest) +
      "?subject=" + encodeURIComponent("Meus diagnósticos — Gestão & Liderança") +
      "&body=" + encodeURIComponent(corpo);
  }

  /* ---------- UI: barra de identificação + modal de login ---------- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

  function renderBarra(sel){
    const el = typeof sel==="string" ? document.querySelector(sel) : sel;
    if(!el) return;
    const p = getPerfil();
    if(p){
      el.className = "ec-identity logado no-print";
      el.innerHTML =
        `<span class="eci-user">👤 <strong>${esc(p.nome)}</strong> <span class="eci-mail">${esc(p.email)}</span></span>
         <span class="eci-actions">
           <a class="eci-link" href="resultados.html">📊 Meus resultados</a>
           <button class="eci-btn" id="eci-trocar">Trocar</button>
         </span>`;
      el.querySelector("#eci-trocar").onclick = () => promptLogin(()=>renderBarra(el));
    } else {
      el.className = "ec-identity no-print";
      el.innerHTML =
        `<span class="eci-user">🔒 Você não está identificado — seu diagnóstico <strong>não será salvo no histórico</strong>.</span>
         <span class="eci-actions"><button class="eci-btn primary" id="eci-entrar">Entrar para salvar</button></span>`;
      el.querySelector("#eci-entrar").onclick = () => promptLogin(()=>renderBarra(el));
    }
  }

  function promptLogin(cb){
    const p = getPerfil() || {nome:"",email:""};
    const ov = document.createElement("div");
    ov.className = "ec-modal-ov";
    ov.innerHTML =
      `<div class="ec-modal">
        <h3>Identifique-se</h3>
        <p class="ec-modal-sub">Seu nome e e-mail ficam guardados só neste navegador, para registrar e acompanhar a evolução dos seus diagnósticos.</p>
        <label class="ec-lbl">Nome</label>
        <input class="ec-input" id="lid-in-nome" type="text" placeholder="Seu nome" value="${esc(p.nome)}">
        <label class="ec-lbl">E-mail</label>
        <input class="ec-input" id="lid-in-mail" type="email" placeholder="voce@empresa.com" value="${esc(p.email)}">
        <p class="ec-err" id="lid-err"></p>
        <div class="ec-modal-acts">
          <button class="btn btn-ghost" id="lid-cancel">Cancelar</button>
          <button class="btn btn-primary" id="lid-salvar">Salvar</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    const fechar = () => ov.remove();
    ov.addEventListener("click", e => { if(e.target===ov) fechar(); });
    ov.querySelector("#lid-cancel").onclick = fechar;
    ov.querySelector("#lid-salvar").onclick = () => {
      const nome = ov.querySelector("#lid-in-nome").value.trim();
      const mail = ov.querySelector("#lid-in-mail").value.trim();
      if(nome.length < 2){ ov.querySelector("#lid-err").textContent = "Digite seu nome."; return; }
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)){ ov.querySelector("#lid-err").textContent = "Digite um e-mail válido."; return; }
      setPerfil(nome, mail);
      fechar();
      if(typeof cb==="function") cb();
    };
    setTimeout(()=>{ const n=ov.querySelector("#lid-in-nome"); n&&n.focus(); }, 50);
  }

  /* ---------- init automático ---------- */
  function init(){ const el = document.getElementById("ec-identity"); if(el) renderBarra(el); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.LideresTrack = {
    getPerfil, setPerfil, limparPerfil, getEventos, limparEventos, log,
    toCSV, baixarCSV, parseCSV, objetosDoCSV, enviarEmail, resumoTexto,
    renderBarra, promptLogin, nivel,
    COLS, DIM_META, DIM_KEYS_BY_TIPO, TIPO_LABEL
  };
})();
