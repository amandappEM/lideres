/* ============================================================
   tracking.js — identificação leve + registro de diagnósticos
   Trilha de Líderes · 100% no navegador (localStorage). Sem servidor.
   API global: window.LideresTrack
   ============================================================ */
(function(){
  const KP = "LID_PERFIL", KE = "LID_EVENTOS";

  /* colunas do CSV: [chave, rótulo] — ordem fixa.
     As 6 últimas são as dimensões do diagnóstico (médias 1-5). */
  const COLS = [
    ["data","Data/Hora"],["nome","Nome"],["email","E-mail"],
    ["passagem","Momento"],["media","Media geral"],["nivel","Nivel geral"],
    ["delegacao","Delegacao"],["tempo","Tempo"],["valores","Valores"],
    ["execucao","Execucao"],["pessoas","Pessoas"],["negocio","Negocio"]
  ];
  const DIM_KEYS = ["delegacao","tempo","valores","execucao","pessoas","negocio"];

  /* ---------- storage ---------- */
  function read(k,def){ try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?def:v; }catch(e){ return def; } }
  function write(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

  function getPerfil(){ return read(KP,null); }
  function setPerfil(nome,email){ const p={nome:String(nome||"").trim(),email:String(email||"").trim(),desde:new Date().toISOString()}; write(KP,p); return p; }
  function limparPerfil(){ localStorage.removeItem(KP); }

  function getEventos(){ return read(KE,[]); }
  function limparEventos(){ localStorage.removeItem(KE); }

  /* registra um diagnóstico. ev = {passagem, media, nivel, dims:{id:media}} */
  function log(ev){
    const p = getPerfil() || {nome:"(anônimo)",email:""};
    const evs = getEventos();
    const agora = new Date();
    const row = {
      ts: agora.getTime(), data: agora.toISOString(),
      nome: p.nome, email: p.email,
      passagem: ev.passagem||"", media: (ev.media==null?"":ev.media), nivel: ev.nivel||""
    };
    const dims = ev.dims || {};
    DIM_KEYS.forEach(k => { row[k] = (dims[k]==null?"":dims[k]); });
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
    const csv = "﻿" + toCSV(evs);             // BOM p/ Excel abrir acentos certo
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArq || ("diagnostico_lideres_" + new Date().toISOString().slice(0,10) + ".csv");
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  /* parser de CSV (lida com aspas, vírgulas e quebras dentro de campos) */
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
  /* converte CSV (no nosso formato) em objetos {chave:valor} */
  function objetosDoCSV(text){
    const rows = parseCSV(text).filter(r => r.length && r.some(c => c!==""));
    if(!rows.length) return [];
    const header = rows[0];
    const idxToKey = header.map((rot,i) => {
      const found = COLS.find(c => c[1].toLowerCase() === String(rot).trim().toLowerCase());
      return found ? found[0] : (COLS[i] ? COLS[i][0] : ("col"+i));
    });
    return rows.slice(1).map(r => {
      const o={}; idxToKey.forEach((k,i)=> o[k]=r[i]!=null?r[i]:""); return o;
    });
  }

  /* ---------- e-mail (enviar pra si) ---------- */
  function resumoTexto(evs){
    if(!evs.length) return "Você ainda não tem diagnósticos registrados.";
    const ult = evs.slice().sort((a,b)=>(b.ts||0)-(a.ts||0))[0];
    const linhas = [
      "Resumo — Diagnóstico de Liderança",
      "Diagnósticos registrados: " + evs.length,
      "",
      "Último diagnóstico (" + dataLocal(ult) + "):",
      "Momento: " + (ult.passagem||"—"),
      "Nível geral: " + (ult.nivel||"—") + " · média " + (ult.media||"—") + "/5",
      "Por competência:",
      "  Delegação: " + (ult.delegacao||"—") + " · Tempo: " + (ult.tempo||"—") + " · Valores: " + (ult.valores||"—"),
      "  Execução: " + (ult.execucao||"—") + " · Pessoas: " + (ult.pessoas||"—") + " · Negócio: " + (ult.negocio||"—")
    ];
    return linhas.join("\n");
  }
  function enviarEmail(){
    const p = getPerfil();
    const evs = getEventos();
    const dest = (p && p.email) ? p.email : "";
    const corpo = resumoTexto(evs) +
      "\n\n— Para o histórico completo, use \"Baixar meu CSV\" e anexe o arquivo a este e-mail.";
    location.href = "mailto:" + encodeURIComponent(dest) +
      "?subject=" + encodeURIComponent("Meu diagnóstico — Trilha de Líderes") +
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
    renderBarra, promptLogin, COLS, DIM_KEYS
  };
})();
