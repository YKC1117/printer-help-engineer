'use strict';

// 執行層煙霧測試：Asset Guard 抓「檔案沒載到／執行中拋錯」；這裡抓核心資料、畫面節點與功能是否完整。
(function(){
  function run(){
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    const products=(typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS))?PRODUCTS:[];
    const known=new Set(products.map(p=>p.m));
    const direct=new Set(kb.flatMap(x=>(x.models||[]).filter(m=>m!=='ALL')));
    const invalidModels=[...direct].filter(m=>!known.has(m));
    const missingCoverage=[...known].filter(m=>!direct.has(m));
    const scripts=[...document.scripts].map(s=>s.src||'');
    const bundleMode=scripts.some(x=>x.includes('/dist/repair-data.bundle.js'))&&scripts.some(x=>x.includes('/dist/engineer-app.bundle.js'));
    const health=window.KB_HEALTH;
    const requiredNodes=['brand','type','series','model','symptom','modelSearch','matches','productInfo','historyBox','tab-diag','tab-kb','tab-tools','tab-catalog'];
    const missingNodes=requiredNodes.filter(id=>!document.getElementById(id));
    const guardReady=Array.isArray(window.__assetLoadFailures)&&Array.isArray(window.__runtimeFailures);
    const optionalIsolationReady=typeof window.__loadOptionalFeature==='function'&&Array.isArray(window.__optionalFeatureFailures);
    const assetFailures=guardReady?window.__assetLoadFailures:[];
    const runtimeFailures=guardReady?window.__runtimeFailures:[];
    const coreFunctions=['startCase','resetCase','showTab','copyText','saveCase','showHistory','renderTools','renderCatalog','renderKB'];
    const missingFunctions=coreFunctions.filter(name=>typeof window[name]!=='function');

    const checks=[
      ['核心畫面節點完整',missingNodes.length===0],
      ['核心操作函式完整',missingFunctions.length===0],
      ['資源守門器已啟動',guardReady],
      ['可選工具隔離機制已啟動',optionalIsolationReady],
      ['型號 catalog',products.length>20],
      ['維修資料庫',kb.length>100],
      ['所有 catalog 型號都有專屬資料',missingCoverage.length===0],
      ['沒有不存在的機型引用',invalidModels.length===0],
      ['A/B／來源結構自檢無錯誤',!!health&&Array.isArray(health.errors)&&health.errors.length===0],
      ['Zebra ZT610 覆蓋',kb.some(x=>(x.models||[]).includes('ZT610'))],
      ['TSC TH240 覆蓋',kb.some(x=>(x.models||[]).includes('TH240'))],
      ['Argox P4-650 覆蓋',kb.some(x=>(x.models||[]).includes('P4-650'))],
      ['資料庫搜尋',typeof window.renderKB==='function'],
      ['案例本機紀錄',typeof window.saveCase==='function'&&typeof window.showHistory==='function'],
      ['私人案例庫',Array.isArray(window.INTERNAL_CASE_LIBRARY)&&typeof window.registerSharedInternalCase==='function'],
      ['案例提交包',typeof window.prepareInternalCaseSubmission==='function'],
      ['正式 Bundle 模式',bundleMode],
      ['核心資源載入無錯誤',assetFailures.length===0],
      ['核心啟動期間無執行錯誤',runtimeFailures.length===0],
      ['版本資訊',!!window.APP_BUILD?.version&&!!window.APP_BUILD?.updated]
    ];
    const failed=checks.filter(x=>!x[1]).map(x=>x[0]);
    window.APP_SMOKE={
      ok:failed.length===0,
      failed,
      checks:Object.fromEntries(checks),
      kbCount:kb.length,
      modelCount:products.length,
      invalidModels,
      missingCoverage,
      missingNodes,
      missingFunctions,
      guardReady,
      optionalIsolationReady,
      assetFailures:[...assetFailures],
      runtimeFailures:[...runtimeFailures],
      bundleMode
    };
    if(!failed.length){
      console.info(`[萬里工程師工具] Smoke Check OK｜KB ${kb.length} 筆｜型號 ${products.length}/${products.length} 覆蓋｜Bundle OK｜Optional isolation OK`);
      return;
    }
    console.error('[萬里工程師工具] Smoke Check failed:',window.APP_SMOKE);
    if(document.getElementById('appSmokeAlert'))return;
    const box=document.createElement('div');
    box.id='appSmokeAlert';
    box.setAttribute('role','alert');
    box.style.cssText='max-width:1240px;margin:10px auto;padding:10px 14px;border:1px solid #ef4444;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12px;font-weight:800';
    box.textContent=`⚠️ 工程師工具啟動自檢失敗：${failed.join('、')}。請暫停使用異常功能並查看畫面上方警告。`;
    document.body.insertBefore(box,document.body.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,180),{once:true});
  else setTimeout(run,180);
})();
