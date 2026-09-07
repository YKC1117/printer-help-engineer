'use strict';

// 維修資料庫完整性自檢：資料量變大後避免重複 ID、來源代號錯誤或流程資料殘缺悄悄混入。
(function(){
  function runKBIntegrityCheck(){
    const list=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    const sources=window.KB_SOURCES||{};
    const errors=[];
    const warnings=[];
    const seen=new Map();

    list.forEach((x,i)=>{
      const pos=i+1;
      if(!x||typeof x!=='object'){errors.push(`#${pos} 不是有效物件`);return;}
      if(!x.id)errors.push(`#${pos} 缺少 id`);
      else if(seen.has(x.id))errors.push(`重複 id：${x.id}（#${seen.get(x.id)} / #${pos}）`);
      else seen.set(x.id,pos);
      if(!x.brand)warnings.push(`${x.id||'#'+pos} 缺少 brand`);
      if(!Array.isArray(x.models)||!x.models.length)warnings.push(`${x.id||'#'+pos} 沒有 models`);
      if(!x.title)warnings.push(`${x.id||'#'+pos} 缺少 title`);
      if(!x.category)warnings.push(`${x.id||'#'+pos} 缺少 category`);
      if(!x.summary)warnings.push(`${x.id||'#'+pos} 缺少 summary`);
      if(!Array.isArray(x.flow)||!x.flow.length)warnings.push(`${x.id||'#'+pos} 沒有排查流程 flow`);
      for(const s of (x.sources||[])){
        if(!sources[s])warnings.push(`${x.id||'#'+pos} 使用不存在的來源代號：${s}`);
      }
    });

    window.KB_HEALTH={count:list.length,errors,warnings,ok:errors.length===0};
    console.info(`[萬里維修資料庫] ${list.length} 筆｜錯誤 ${errors.length}｜警告 ${warnings.length}`);
    if(warnings.length)console.warn('[萬里維修資料庫] 資料警告：',warnings);
    if(errors.length){
      console.error('[萬里維修資料庫] 完整性錯誤：',errors);
      const box=document.createElement('div');
      box.id='kbIntegrityAlert';
      box.style.cssText='max-width:1240px;margin:10px auto;padding:10px 14px;border:1px solid #ef4444;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12px;font-weight:800';
      box.textContent=`⚠️ 維修資料庫自檢發現 ${errors.length} 個錯誤，請暫停依賴新增資料並查看 Console。`;
      document.body.insertBefore(box,document.body.firstChild);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',runKBIntegrityCheck,{once:true});
  else runKBIntegrityCheck();
})();
