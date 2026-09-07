'use strict';

// 維修資料庫完整性自檢：資料量變大後避免重複 ID、錯誤來源、型號拼寫或殘缺流程悄悄混入。
(function(){
  function runKBIntegrityCheck(){
    const list=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    const sources=window.KB_SOURCES||{};
    const products=Array.isArray(window.PRODUCTS)?window.PRODUCTS:(typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)?PRODUCTS:[]);
    const knownModels=new Set(products.map(p=>String(p.m||'').trim()).filter(Boolean));
    const errors=[];
    const warnings=[];
    const seenId=new Map();
    const seenTopic=new Map();
    const brandCount={};
    const categoryCount={};
    const evidenceCount={'原廠料號':0,'內部實機案例':0,'工程SOP':0,'有來源資料':0,'通用工程基線':0};

    list.forEach((x,i)=>{
      const pos=i+1;
      if(!x||typeof x!=='object'){errors.push(`#${pos} 不是有效物件`);return;}
      const tag=x.id||`#${pos}`;
      const ev=String(x.evidence||'');
      if(!x.id)errors.push(`#${pos} 缺少 id`);
      else if(seenId.has(x.id))errors.push(`重複 id：${x.id}（#${seenId.get(x.id)} / #${pos}）`);
      else seenId.set(x.id,pos);
      if(!x.brand)warnings.push(`${tag} 缺少 brand`);else brandCount[x.brand]=(brandCount[x.brand]||0)+1;
      if(!x.category)warnings.push(`${tag} 缺少 category`);else categoryCount[x.category]=(categoryCount[x.category]||0)+1;
      if(!Array.isArray(x.models)||!x.models.length)warnings.push(`${tag} 沒有 models`);
      else for(const m of x.models){if(!m||typeof m!=='string')warnings.push(`${tag} 有無效 model 值`);else if(knownModels.size&&m!=='ALL'&&!knownModels.has(m))warnings.push(`${tag} 的機型不在 catalog：${m}`);}
      if(!x.title)warnings.push(`${tag} 缺少 title`);
      if(!x.summary)warnings.push(`${tag} 缺少 summary`);
      if(!Array.isArray(x.keyFacts)||!x.keyFacts.length)warnings.push(`${tag} 沒有 keyFacts`);
      if(!Array.isArray(x.engineering)||!x.engineering.length)warnings.push(`${tag} 沒有 engineering`);
      if(!Array.isArray(x.verify)||!x.verify.length)warnings.push(`${tag} 沒有 verify`);
      if(!Array.isArray(x.flow)||!x.flow.length)warnings.push(`${tag} 沒有排查流程 flow`);
      else x.flow.forEach((step,si)=>{if(!Array.isArray(step)||step.length<3)errors.push(`${tag} flow 第 ${si+1} 步格式錯誤`);else{if(typeof step[0]!=='string'||!step[0].trim())errors.push(`${tag} flow 第 ${si+1} 步缺少標題`);if(typeof step[1]!=='string'||!step[1].trim())warnings.push(`${tag} flow 第 ${si+1} 步缺少說明`);if(!Array.isArray(step[2])||!step[2].length)warnings.push(`${tag} flow 第 ${si+1} 步沒有結果選項`);}});
      if(!Array.isArray(x.sources)||!x.sources.length){
        if(ev==='oem-parts'||ev==='source-backed')errors.push(`${tag} 標示為 ${ev} 但沒有來源`);
        else if(!ev.startsWith('internal-field')&&ev!=='workflow-sop')warnings.push(`${tag} 沒有來源；應確認是否只是工程通用基線`);
      }else for(const s of x.sources){if(!sources[s])errors.push(`${tag} 使用不存在的來源代號：${s}`);}

      if(ev==='oem-parts'){
        evidenceCount['原廠料號']++;
        if(!/料號|P\/N|Parts|Printhead|Platen|Cutter|Sensor|Drive|Electronics|Ribbon/i.test([x.title,...(x.keyFacts||[])].join(' ')))warnings.push(`${tag} 標示為原廠料號但內容未見料號/零件資訊`);
      }else if(ev.startsWith('internal-field')){
        evidenceCount['內部實機案例']++;
        if(!x.evidenceNote)warnings.push(`${tag} 為內部實機案例但缺 evidenceNote`);
        if(x.internalCaseId&&!String(x.id||'').includes(String(x.internalCaseId)))warnings.push(`${tag} 的 internalCaseId 與 id 對應異常`);
      }else if(ev==='workflow-sop'||/SOP|保養|交機|收機|交叉測試|零件採購/.test(x.category||''))evidenceCount['工程SOP']++;
      else if((x.sources||[]).length)evidenceCount['有來源資料']++;
      else evidenceCount['通用工程基線']++;

      const topicKey=[x.brand,(x.models||[]).slice().sort().join('|'),x.title].join('::');
      if(x.title&&seenTopic.has(topicKey))warnings.push(`可能重複主題：${x.title}（${(x.models||[]).join('/')}）`);else if(x.title)seenTopic.set(topicKey,pos);
    });

    window.KB_HEALTH={count:list.length,sourceCount:Object.keys(sources).length,modelCount:knownModels.size,brandCount,categoryCount,evidenceCount,errors,warnings,ok:errors.length===0};
    console.info(`[萬里維修資料庫] ${list.length} 筆｜來源 ${Object.keys(sources).length}｜型號 ${knownModels.size}｜錯誤 ${errors.length}｜警告 ${warnings.length}`);
    console.info('[萬里維修資料庫] 資料組成：',evidenceCount);
    if(warnings.length)console.warn('[萬里維修資料庫] 資料警告：',warnings);
    if(errors.length){
      console.error('[萬里維修資料庫] 完整性錯誤：',errors);
      const box=document.createElement('div');box.id='kbIntegrityAlert';box.style.cssText='max-width:1240px;margin:10px auto;padding:10px 14px;border:1px solid #ef4444;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12px;font-weight:800';box.textContent=`⚠️ 維修資料庫自檢發現 ${errors.length} 個結構/來源錯誤，請暫停依賴新增資料並查看 Console。`;document.body.insertBefore(box,document.body.firstChild);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',runKBIntegrityCheck,{once:true});else runKBIntegrityCheck();
})();
