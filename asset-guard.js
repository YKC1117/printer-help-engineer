'use strict';

(function(){
  const failures=[];

  function shortName(url){
    try{
      const u=new URL(url,location.href);
      return decodeURIComponent(u.pathname.split('/').pop()||url);
    }catch(e){
      return String(url||'未知檔案');
    }
  }

  function renderWarning(){
    if(!document.body||!failures.length)return;
    let box=document.getElementById('assetLoadWarning');
    if(!box){
      box=document.createElement('div');
      box.id='assetLoadWarning';
      box.setAttribute('role','alert');
      box.style.cssText='position:sticky;top:0;z-index:99999;background:#fee2e2;border-bottom:2px solid #ef4444;color:#991b1b;padding:10px 14px;font:800 13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.12)';
      document.body.insertBefore(box,document.body.firstChild);
    }
    const names=[...new Set(failures.map(x=>shortName(x)))];
    box.textContent=`⚠️ 系統檔案載入失敗：${names.join('、')}。部分維修功能可能不完整，請先確認 GitHub 已同步到最新版後重新開啟。`;
  }

  window.addEventListener('error',function(event){
    const el=event.target;
    if(!el||el===window)return;
    const isScript=el.tagName==='SCRIPT';
    const isCss=el.tagName==='LINK'&&String(el.rel).toLowerCase()==='stylesheet';
    if(!isScript&&!isCss)return;
    const url=isScript?el.src:el.href;
    failures.push(url||'未知檔案');
    console.error('[萬里工程師工具] 資源載入失敗：',url||el);
    renderWarning();
  },true);

  document.addEventListener('DOMContentLoaded',renderWarning);
  window.__assetLoadFailures=failures;
})();
