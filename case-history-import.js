'use strict';

// 本機案件備份還原：只讀取本機選擇的 JSON，不上傳任何內容。
(function(){
  const STORAGE='printer_engineer_cases';
  const BACKUP_KEY='printer_engineer_last_backup';
  const el=id=>document.getElementById(id);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'[]')}catch{return[]}};
  const write=list=>localStorage.setItem(STORAGE,JSON.stringify(list.slice(0,100)));
  const safeText=v=>typeof v==='string'?v:'';

  function normalizeCase(x){
    if(!x||typeof x!=='object')return null;
    const model=safeText(x.model).trim(),symptom=safeText(x.symptom).trim();
    if(!model&&!symptom)return null;
    return {
      schema:Number(x.schema)||1,
      time:safeText(x.time),brand:safeText(x.brand),model,serial:safeText(x.serial),symptom,
      customer:safeText(x.customer),engineer:safeText(x.engineer),notes:safeText(x.notes),
      rootCause:safeText(x.rootCause),action:safeText(x.action),parts:safeText(x.parts),verify:safeText(x.verify),sharedNote:safeText(x.sharedNote),
      answers:x.answers&&typeof x.answers==='object'&&!Array.isArray(x.answers)?x.answers:{},
      diagnosis:x.diagnosis&&typeof x.diagnosis==='object'?x.diagnosis:null,
      text:safeText(x.text),sharePreparedAt:safeText(x.sharePreparedAt),shareCaseId:safeText(x.shareCaseId)
    };
  }
  function caseKey(x){return [x.time,x.brand,x.model,x.symptom,x.rootCause,x.action,x.parts].join('|').toLowerCase();}

  function ensureInput(){
    let input=el('caseHistoryImportFile');
    if(input)return input;
    input=document.createElement('input');
    input.id='caseHistoryImportFile';input.type='file';input.accept='.json,application/json';input.hidden=true;
    input.addEventListener('change',async()=>{
      const file=input.files?.[0];input.value='';if(!file)return;
      if(file.size>5*1024*1024)return alert('備份檔超過 5 MB，為避免誤選大型檔案，本工具不匯入。');
      let payload;
      try{payload=JSON.parse(await file.text())}catch{return alert('JSON 格式無法讀取，請確認是由工程師工具匯出的案件備份。');}
      const raw=Array.isArray(payload)?payload:Array.isArray(payload?.cases)?payload.cases:null;
      if(!raw)return alert('找不到 cases 陣列，這不像工程師工具的案件備份。');
      const imported=raw.map(normalizeCase).filter(Boolean);
      if(!imported.length)return alert('備份裡沒有可匯入的有效案件。');
      if(!confirm(`準備匯入 ${imported.length} 筆案件。\n\n會與目前本機紀錄合併，相同案件會自動去重；不會上傳到 GitHub。\n\n繼續？`))return;
      const current=read().map(normalizeCase).filter(Boolean);
      const map=new Map();
      [...imported,...current].forEach(x=>{const k=caseKey(x);if(!map.has(k))map.set(k,x)});
      const merged=[...map.values()].slice(0,100);
      try{write(merged);localStorage.setItem('printer_engineer_last_restore',new Date().toLocaleString('zh-TW'));}
      catch{return alert('瀏覽器無法寫入本機案件資料。');}
      if(typeof showHistory==='function')showHistory();
      if(typeof toast==='function')toast(`已還原／合併 ${imported.length} 筆案件`);
    });
    document.body.appendChild(input);return input;
  }
  window.importCaseHistory=function(){ensureInput().click();};

  if(typeof window.exportCaseHistory==='function'){
    const oldExport=window.exportCaseHistory;
    window.exportCaseHistory=function(){
      oldExport();
      try{localStorage.setItem(BACKUP_KEY,new Date().toLocaleString('zh-TW'));}catch(e){}
      setTimeout(()=>typeof showHistory==='function'&&showHistory(),50);
    };
    try{exportCaseHistory=window.exportCaseHistory}catch(e){}
  }

  if(typeof window.showHistory==='function'){
    const oldShow=window.showHistory;
    window.showHistory=function(){
      oldShow();
      const box=el('historyBox');if(!box||el('caseImportBtn'))return;
      const row=document.createElement('div');row.className='btnrow';row.style.marginTop='8px';
      const lastBackup=(()=>{try{return localStorage.getItem(BACKUP_KEY)||''}catch{return''}})();
      const lastRestore=(()=>{try{return localStorage.getItem('printer_engineer_last_restore')||''}catch{return''}})();
      row.innerHTML=`<button id="caseImportBtn" class="btn secondary" type="button">匯入 JSON 備份</button><span class="small" style="align-self:center">${lastBackup?`最近匯出：${esc(lastBackup)}`:'尚未記錄匯出時間'}${lastRestore?`｜最近還原：${esc(lastRestore)}`:''}</span>`;
      box.appendChild(row);el('caseImportBtn').onclick=()=>window.importCaseHistory();
    };
    try{showHistory=window.showHistory}catch(e){}
  }

  document.addEventListener('DOMContentLoaded',ensureInput,{once:true});
})();
