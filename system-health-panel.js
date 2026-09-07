'use strict';

// 工程師工具內顯示本機實際載入狀態，方便確認 GitHub Desktop Pull 後是否為完整 Bundle。
(function(){
  function bundleId(){
    const src=[...document.scripts].map(s=>s.src||'').find(x=>x.includes('/dist/engineer-app.bundle.js'))||'';
    try{return new URL(src,location.href).searchParams.get('v')||'未知'}catch{return'未知'}
  }
  function render(){
    const box=document.getElementById('tab-tools');if(!box)return;
    box.querySelector('.system-health-panel')?.remove();
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    const products=typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)?PRODUCTS:[];
    const sources=window.KB_SOURCES||{};
    const health=window.KB_HEALTH||{};
    const smoke=window.APP_SMOKE||{};
    const meta=window.APP_BUILD||{};
    const evidence=health.evidenceCount||{};
    const assetErrors=Array.isArray(window.__assetLoadFailures)?window.__assetLoadFailures.length:0;
    const runtimeErrors=Array.isArray(window.__runtimeFailures)?window.__runtimeFailures.length:0;
    const ok=(health.errors?.length||0)===0&&smoke.ok!==false&&assetErrors===0&&runtimeErrors===0;
    const panel=document.createElement('div');panel.className='system-health-panel result '+(ok?'info':'danger');
    panel.style.marginBottom='12px';
    panel.innerHTML=`<h3>🩺 本機系統狀態｜${ok?'正常':'需要檢查'}</h3><div class="small" style="line-height:1.8"><b>版本：</b>${esc(meta.version||'未知')}｜更新 ${esc(meta.updated||'未知')}<br><b>Bundle ID：</b>${esc(bundleId())}<br><b>維修資料：</b>${kb.length} 筆｜<b>型號：</b>${products.length}｜<b>來源：</b>${Object.keys(sources).length}<br><b>資料自檢：</b>Errors ${(health.errors||[]).length}｜Warnings ${(health.warnings||[]).length}<br><b>資料等級：</b>A 原廠料號 ${evidence['A原廠料號']||0}｜B 雙來源料號 ${evidence['B雙來源料號']||0}｜內部案例 ${evidence['內部實機案例']||0}<br><b>Runtime Smoke：</b>${smoke.ok===true?'PASS':smoke.ok===false?'FAIL':'尚未完成'}｜<b>資源錯誤：</b>${assetErrors}｜<b>執行錯誤：</b>${runtimeErrors}</div><div class="small" style="margin-top:6px">若 Pull 後版本或筆數與預期不同，先看這裡；Asset Guard / Smoke Check 有異常時畫面上方也會直接警告。</div>`;
    box.prepend(panel);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,360),{once:true});
  const old=window.renderTools;
  if(typeof old==='function'){
    window.renderTools=function(){old();setTimeout(render,180)};
    try{renderTools=window.renderTools}catch(e){}
  }
  window.renderSystemHealth=render;
})();
