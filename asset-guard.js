'use strict';

(function(){
  const failures=[];
  const runtimeFailures=[];
  const optionalFailures=[];
  const optionalStatus={};
  const guardScript=document.currentScript;
  const guardVersion=(()=>{
    try{return new URL(guardScript?.src||'',location.href).searchParams.get('v')||''}
    catch{return''}
  })();

  // 可選工具一律獨立載入：任何一支失敗，只影響該工具，不阻斷核心 Bundle。
  const optionalAssets=Object.freeze({
    'photo-ai-handoff.js':'AI 圖片排查',
    'command-analyzer.js':'指令反向辨識'
  });
  window.__optionalFeatureAssets=optionalAssets;
  window.__optionalFeatureStatus=optionalStatus;

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

  function optionalFeatureFromUrl(url){
    if(!url)return'';
    let name='';
    try{name=decodeURIComponent(new URL(url,location.href).pathname.split('/').pop()||'')}
    catch{name=String(url).split('?')[0].split('/').pop()||''}
    return optionalAssets[name]||'';
  }

  function optionalFeatureFromError(value){
    const text=value instanceof Error?`${value.message||''}\n${value.stack||''}`:String(value||'');
    for(const [file,label] of Object.entries(optionalAssets))if(text.includes(file))return label;
    return '';
  }

  function renderCoreWarning(){
    if(!document.body)return;
    const existing=document.getElementById('assetLoadWarning');
    if(!failures.length&&!runtimeFailures.length){
      existing?.remove();
      return;
    }
    let box=existing;
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
    box.textContent=`⚠️ ${parts.join('；')}。部分核心維修功能可能不完整，請先重新整理；若仍出現，請把此訊息回報。`;
  }

  function renderOptionalWarning(){
    if(!document.body)return;
    const existing=document.getElementById('optionalFeatureWarning');
    if(!optionalFailures.length){
      existing?.remove();
      return;
    }
    let box=existing;
    if(!box){
      box=document.createElement('div');
      box.id='optionalFeatureWarning';
      box.setAttribute('role','status');
      box.style.cssText='max-width:1240px;margin:8px auto;padding:9px 12px;border:1px solid #f59e0b;border-radius:10px;background:#fffbeb;color:#92400e;font:800 12px/1.6 system-ui,-apple-system,Segoe UI,sans-serif';
      const anchor=document.getElementById('assetLoadWarning');
      if(anchor?.nextSibling)document.body.insertBefore(box,anchor.nextSibling);
      else document.body.insertBefore(box,document.body.firstChild);
    }
    const labels=[...new Set(optionalFailures.map(x=>x.feature).filter(Boolean))];
    box.textContent=`⚠️ 可選工具暫時不可用：${labels.join('、')||'未知工具'}。核心排查、維修資料庫、案件紀錄與其他工具仍可正常使用。`;
  }

  function reportOptional(feature,error){
    const label=feature||'未知工具';
    const detail=runtimeMessage(error||'載入失敗');
    optionalStatus[label]='failed';
    optionalFailures.push({feature:label,detail,time:new Date().toISOString()});
    console.error(`[萬里工程師工具] 可選工具失敗：${label}`,error||detail);
    renderOptionalWarning();
  }
  window.__reportOptionalFeatureFailure=reportOptional;

  function loadOptionalFeature(file,label){
    try{
      optionalStatus[label]='loading';
      const s=document.createElement('script');
      s.src=file+(guardVersion?`?v=${encodeURIComponent(guardVersion)}`:'');
      s.async=true;
      s.dataset.optionalFeature=label;
      document.head.appendChild(s);
    }catch(error){
      reportOptional(label,error);
    }
  }
  window.__loadOptionalFeature=loadOptionalFeature;

  function loadOptionalFeatures(){
    for(const [file,label] of Object.entries(optionalAssets)){
      const already=[...document.scripts].some(s=>s.dataset?.optionalFeature===label);
      if(already)continue;
      loadOptionalFeature(file,label);
    }
  }

  window.addEventListener('error',function(event){
    const el=event.target;
    if(el&&el!==window){
      const isScript=el.tagName==='SCRIPT';
      const isCss=el.tagName==='LINK'&&String(el.rel).toLowerCase()==='stylesheet';
      if(isScript||isCss){
        const url=isScript?el.src:el.href;
        const feature=el.dataset?.optionalFeature||optionalFeatureFromUrl(url);
        if(feature){
          reportOptional(feature,`資源載入失敗：${shortName(url)}`);
          return;
        }
        failures.push(url||'未知檔案');
        console.error('[萬里工程師工具] 核心資源載入失敗：',url||el);
        renderCoreWarning();
        return;
      }
    }
    if(event.message||event.error){
      const feature=optionalFeatureFromUrl(event.filename)||optionalFeatureFromError(event.error||event.message);
      if(feature){
        reportOptional(feature,event.error||event.message);
        return;
      }
      runtimeFailures.push(event.error||event.message);
      console.error('[萬里工程師工具] 核心程式執行錯誤：',event.error||event.message);
      renderCoreWarning();
    }
  },true);

  window.addEventListener('unhandledrejection',function(event){
    const feature=optionalFeatureFromError(event.reason);
    if(feature){
      reportOptional(feature,event.reason||'Promise 執行失敗');
      return;
    }
    runtimeFailures.push(event.reason||'Promise 執行失敗');
    console.error('[萬里工程師工具] 核心未處理的 Promise 錯誤：',event.reason);
    renderCoreWarning();
  });

  document.addEventListener('DOMContentLoaded',function(){
    renderCoreWarning();
    renderOptionalWarning();
    // defer 的核心 Bundle 已在 DOMContentLoaded 前執行完成；此時才載入可選工具，確保完全不阻斷核心啟動。
    loadOptionalFeatures();
  },{once:true});

  window.__assetLoadFailures=failures;
  window.__runtimeFailures=runtimeFailures;
  window.__optionalFeatureFailures=optionalFailures;
})();
