'use strict';

// 執行層煙霧測試：Asset Guard 能抓「檔案沒載到」，這裡再抓「檔案有載但核心資料/功能沒有成功建立」。
(function(){
  function run(){
    const checks=[
      ['型號 catalog',typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)&&PRODUCTS.length>20],
      ['維修資料庫',Array.isArray(window.REPAIR_KB)&&REPAIR_KB.length>100],
      ['Zebra ZT610 覆蓋',Array.isArray(window.REPAIR_KB)&&REPAIR_KB.some(x=>Array.isArray(x.models)&&x.models.includes('ZT610'))],
      ['TSC TH240 覆蓋',Array.isArray(window.REPAIR_KB)&&REPAIR_KB.some(x=>Array.isArray(x.models)&&x.models.includes('TH240'))],
      ['Argox P4-650 覆蓋',Array.isArray(window.REPAIR_KB)&&REPAIR_KB.some(x=>Array.isArray(x.models)&&x.models.includes('P4-650'))],
      ['資料庫搜尋',typeof window.renderKB==='function'],
      ['案例本機紀錄',typeof window.saveCase==='function'&&typeof window.showHistory==='function'],
      ['私人案例庫',Array.isArray(window.INTERNAL_CASE_LIBRARY)&&typeof window.registerSharedInternalCase==='function'],
      ['案例提交包',typeof window.prepareInternalCaseSubmission==='function'],
      ['資料庫自檢',!!window.KB_HEALTH]
    ];
    const failed=checks.filter(x=>!x[1]).map(x=>x[0]);
    window.APP_SMOKE={ok:failed.length===0,failed,checks:Object.fromEntries(checks),count:window.REPAIR_KB?.length||0};
    if(!failed.length){
      console.info(`[萬里工程師工具] Smoke Check OK｜KB ${window.REPAIR_KB?.length||0} 筆`);
      return;
    }
    console.error('[萬里工程師工具] Smoke Check failed:',failed);
    if(document.getElementById('appSmokeAlert'))return;
    const box=document.createElement('div');
    box.id='appSmokeAlert';
    box.style.cssText='max-width:1240px;margin:10px auto;padding:10px 14px;border:1px solid #ef4444;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12px;font-weight:800';
    box.textContent=`⚠️ 工程師工具啟動自檢失敗：${failed.join('、')}。請暫停使用異常功能並查看 Console。`;
    document.body.insertBefore(box,document.body.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,80),{once:true});
  else setTimeout(run,80);
})();
