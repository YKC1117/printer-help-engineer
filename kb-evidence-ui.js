'use strict';

// 維修資料證據標示：讓工程師一眼分辨「內部實機案例 / SOP / 有來源整理 / 通用工程基線」。
(function(){
  function meta(a){
    if(a?.evidence==='internal-field')return {label:'🧪 內部實機案例',note:a.evidenceNote||'內部實機排查紀錄；單機數值不可當通用規格。'};
    if(a?.evidence==='internal-field-open')return {label:'🧪 內部案例｜未完全收斂',note:a.evidenceNote||'原始案例尚未確認最終根因。'};
    if(a?.evidence==='workflow-sop')return {label:'📋 工程 SOP',note:'工作流程整理；精確料號、Pin、電壓與扭力仍依該機原廠文件。'};
    if(a?.sources?.length)return {label:'📚 來源化資料',note:'依列示原廠或文件來源整理。'};
    return {label:'🛠️ 工程通用基線',note:'未綁定單一原廠深度文件；精確硬體規格需回查 Service Manual。'};
  }
  function badge(m){return `<span style="display:inline-flex;align-items:center;padding:2px 7px;border:1px solid #cbd5e1;border-radius:999px;font-size:11px;font-weight:800;margin-left:6px;background:#fff">${kbEsc(m.label)}</span>`}

  window.kbCard=function(a){
    const m=meta(a);
    return `<button class="kb-card" type="button" data-kb="${kbEsc(a.id)}"><div class="kb-card-top"><span class="kb-brand">${kbEsc(a.brand)}</span><span class="kb-sev">${kbEsc(a.severity||'')}</span></div><b>${kbEsc(a.title)}</b>${badge(m)}<small>${kbEsc(a.category)} · ${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}</small><p>${kbEsc(a.summary)}</p></button>`;
  };
  try{kbCard=window.kbCard}catch(e){}

  window.openKBArticle=function(id){
    const a=REPAIR_KB.find(x=>x.id===id),box=$('kbDetail');if(!a||!box)return;
    const m=meta(a);
    box.innerHTML=`<article class="kb-detail"><div class="kb-detail-head"><div><span class="kb-brand">${kbEsc(a.brand)}</span> <span class="kb-sev">${kbEsc(a.severity||'')}</span>${badge(m)}<h2>${kbEsc(a.title)}</h2><div class="small">${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}｜${kbEsc(a.category)}</div></div><button class="btn primary" onclick="startKBFlow('${kbEsc(a.id)}')">▶ 啟動這套排查</button></div><div class="kb-summary">${kbEsc(a.summary)}</div><div style="margin:10px 0;padding:9px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;font-size:12px"><b>${kbEsc(m.label)}</b><div style="margin-top:4px">${kbEsc(m.note)}</div></div><details open><summary>原廠／關鍵判斷</summary><ul>${(a.keyFacts||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>工程師深入處理</summary><ul>${(a.engineering||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>修復後驗證</summary><ul>${(a.verify||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>完整排查步驟（${a.flow?.length||0}）</summary><ol>${(a.flow||[]).map(s=>`<li><b>${kbEsc(s[0])}</b><div>${kbEsc(s[1])}</div>${s[3]?`<small>${kbEsc(s[3])}</small>`:''}</li>`).join('')}</ol></details><div class="kb-sources"><h3>資料來源</h3>${kbSourceHtml(a.sources)}</div></article>`;
    box.scrollIntoView({behavior:'smooth',block:'start'});
  };
  try{openKBArticle=window.openKBArticle}catch(e){}
})();
