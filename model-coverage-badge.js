'use strict';

// 選到機型時直接顯示該機型資料深度，避免「筆數很多」但某一型號其實只有通用文章。
(function(){
  function stats(model){
    const direct=(window.REPAIR_KB||[]).filter(x=>Array.isArray(x.models)&&x.models.includes(model));
    const generic=(window.REPAIR_KB||[]).filter(x=>Array.isArray(x.models)&&x.models.includes('ALL'));
    return {
      direct:direct.length,
      generic:generic.length,
      sourced:direct.filter(x=>(x.sources||[]).length>0).length,
      oemParts:direct.filter(x=>x.evidence==='oem-parts').length,
      internal:direct.filter(x=>String(x.evidence||'').startsWith('internal-field')).length,
      sop:direct.filter(x=>x.evidence==='workflow-sop'||/SOP/.test(x.category||'')).length
    };
  }
  function attach(){
    if(!window.currentProduct&&typeof currentProduct==='undefined')return;
    const p=typeof currentProduct!=='undefined'?currentProduct:window.currentProduct;
    if(!p?.m||p.m==='未指定機型'||!window.productInfo)return;
    productInfo.querySelector('.kb-coverage-line')?.remove();
    const s=stats(p.m);
    const d=document.createElement('div');
    d.className='kb-coverage-line';
    d.style.cssText='margin-top:8px;padding:7px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#f8fafc;font-size:12px;font-weight:800';
    if(!s.direct){
      d.innerHTML=`⚠️ 此機型目前沒有專屬維修文章；可先使用通用工程基線 ${s.generic} 套。`;
    }else{
      const quality=s.sourced?`來源化 ${s.sourced}`:'來源化 0';
      d.innerHTML=`📊 專屬資料 ${s.direct} 套｜${quality}｜原廠料號 ${s.oemParts}｜內部實機案例 ${s.internal}｜SOP ${s.sop}`;
    }
    productInfo.appendChild(d);
  }
  window.getModelKBCoverage=stats;
  if(typeof renderProductInfo==='function'){
    const old=renderProductInfo;
    renderProductInfo=function(){old();setTimeout(attach,0)};
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(attach,120));
})();
