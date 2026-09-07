'use strict';

(function(){
  const failures=[];
  const runtimeFailures=[];

  function shortName(url){
    try{
      const u=new URL(url,location.href);
      return decodeURIComponent(u.pathname.split('/').pop()||url);
    }catch(e){
      return String(url||'未知檔案');
    }
  }

  function runtimeMessage(value){
    if(value instanceof Error)return value.message||value.name||'未知執行錯誤';
    if(typeof value==='string')return value;
    try{return JSON.stringify(value)}catch{return String(value||'未知執行錯誤')}
  }

  function renderWarning(){
    if(!document.body||(!failures.length&&!runtimeFailures.length))return;
    let box=document.getElementById('assetLoadWarning');
    if(!box){
      box=document.createElement('div');
      box.id='assetLoadWarning';
      box.setAttribute('role','alert');
      box.style.cssText='position:sticky;top:0;z-index:99999;background:#fee2e2;border-bottom:2px solid #ef4444;color:#991b1b;padding:10px 14px;font:800 13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.12)';
      document.body.insertBefore(box,document.body.firstChild);
    }
    const parts=[];
    const names=[...new Set(failures.map(x=>shortName(x)))];
    const runtime=[...new Set(runtimeFailures.map(runtimeMessage))].slice(0,3);
    if(names.length)parts.push(`系統檔案載入失敗：${names.join('、')}`);
    if(runtime.length)parts.push(`程式執行錯誤：${runtime.join('、')}`);
    box.textContent=`⚠️ ${parts.join('；')}。部分維修功能可能不完整，請先重新整理；若仍出現，請把此訊息回報。`;
  }

  window.addEventListener('error',function(event){
    const el=event.target;
    if(el&&el!==window){
      const isScript=el.tagName==='SCRIPT';
      const isCss=el.tagName==='LINK'&&String(el.rel).toLowerCase()==='stylesheet';
      if(isScript||isCss){
        const url=isScript?el.src:el.href;
        failures.push(url||'未知檔案');
        console.error('[萬里工程師工具] 資源載入失敗：',url||el);
        renderWarning();
        return;
      }
    }
    if(event.message||event.error){
      runtimeFailures.push(event.error||event.message);
      console.error('[萬里工程師工具] 程式執行錯誤：',event.error||event.message);
      renderWarning();
    }
  },true);

  window.addEventListener('unhandledrejection',function(event){
    runtimeFailures.push(event.reason||'Promise 執行失敗');
    console.error('[萬里工程師工具] 未處理的 Promise 錯誤：',event.reason);
    renderWarning();
  });

  document.addEventListener('DOMContentLoaded',renderWarning);
  window.__assetLoadFailures=failures;
  window.__runtimeFailures=runtimeFailures;
})();
