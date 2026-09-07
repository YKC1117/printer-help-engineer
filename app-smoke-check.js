'use strict';

// 執行層煙霧測試：Asset Guard 抓「檔案沒載到」；這裡抓「檔案有載，但核心資料／功能／Bundle 狀態不完整」。
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

    const checks=[
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
      bundleMode
    };
    if(!failed.length){
      console.info(`[萬里工程師工具] Smoke Check OK｜KB ${kb.length} 筆｜型號 ${products.length}/${products.length} 覆蓋｜Bundle OK`);
      return;
    }
    console.error('[萬里工程師工具] Smoke Check failed:',window.APP_SMOKE);
    if(document.getElementById('appSmokeAlert'))return;
    const box=document.createElement('div');
    box.id='appSmokeAlert';
    box.setAttribute('role','alert');
    box.style.cssText='max-width:1240px;margin:10px auto;padding:10px 14px;border:1px solid #ef4444;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12px;font-weight:800';
    box.textContent=`⚠️ 工程師工具啟動自檢失敗：${failed.join('、')}。請暫停使用異常功能並查看 Console。`;
    document.body.insertBefore(box,document.body.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,120),{once:true});
  else setTimeout(run,120);
})();
