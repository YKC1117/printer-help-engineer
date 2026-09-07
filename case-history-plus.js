'use strict';

// 本機維修案例紀錄 v2：保留舊 localStorage 格式相容，新增根因、處置、零件與完修驗證。
(function(){
  const el=id=>document.getElementById(id);
  function injectFields(){
    if(el('rootCause')||!el('notes'))return;
    const notesField=el('notes').closest('.field');
    if(!notesField)return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="row2"><div class="field"><label for="rootCause">最終根因／故障零件 <small>可後補</small></label><input id="rootCause" placeholder="例如：Ribbon Sensor 本體異常、Platen 老化"></div><div class="field"><label for="repairAction">維修處置</label><input id="repairAction" placeholder="例如：更換 Sensor、清潔＋重新校正"></div></div><div class="row2"><div class="field"><label for="partsUsed">更換零件／料號</label><input id="partsUsed" placeholder="例如：P/N、Revision；不確定可先留空"></div><div class="field"><label for="caseVerify">完修驗證</label><select id="caseVerify"><option value="">尚未結案</option><option>已通過基本測試</option><option>已通過連續列印／冷熱機</option><option>已用客戶實際耗材驗證</option><option>暫時恢復，根因未完全確認</option></select></div></div>`;
    notesField.insertAdjacentElement('afterend',wrap);
  }

  function textV(id){return el(id)?.value?.trim()||''}
  const oldReport=window.reportText||reportText;
  window.reportText=function(){
    const base=oldReport();
    const extra=[
      '',
      `最終根因／故障零件：${textV('rootCause')||'尚未確認'}`,
      `維修處置：${textV('repairAction')||'尚未填寫'}`,
      `更換零件／料號：${textV('partsUsed')||'無／未填'}`,
      `完修驗證：${textV('caseVerify')||'尚未結案'}`
    ];
    return base+extra.join('\n');
  };
  try{reportText=window.reportText}catch(e){}

  window.saveCase=function(){
    if(!current)return toast('請先開始一個排查案件');
    const list=readCases();
    const diag=(typeof buildDiagnosis==='function')?buildDiagnosis():null;
    list.unshift({
      schema:2,
      time:new Date().toLocaleString('zh-TW'),
      brand:brand?.value||currentProduct?.b||'',
      model:modelSel?.value||'',
      serial:textV('serial'),
      symptom:symptom?.value||'',
      customer:textV('customer'),
      engineer:textV('engineer'),
      notes:textV('notes'),
      rootCause:textV('rootCause'),
      action:textV('repairAction'),
      parts:textV('partsUsed'),
      verify:textV('caseVerify'),
      answers:{...(answers||{})},
      diagnosis:diag,
      text:window.reportText()
    });
    try{
      localStorage.setItem('printer_engineer_cases',JSON.stringify(list.slice(0,100)));
      toast('案件已儲存在此瀏覽器');
      showHistory();
    }catch{toast('無法儲存本機紀錄')}
  };
  try{saveCase=window.saveCase}catch(e){}

  window.deleteSavedCase=function(i){
    const list=readCases();
    if(!list[i])return;
    if(!confirm(`刪除 ${list[i].model||''}｜${list[i].symptom||''} 這筆紀錄？`))return;
    list.splice(i,1);
    localStorage.setItem('printer_engineer_cases',JSON.stringify(list));
    showHistory();
  };

  window.exportCaseHistory=function(){
    const list=readCases();
    if(!list.length)return toast('目前沒有案件可匯出');
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),cases:list},null,2)],{type:'application/json;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`printer-repair-cases-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };

  window.showHistory=function(){
    const list=readCases(),box=el('historyBox');if(!box)return;
    if(!list.length){box.innerHTML='<div class="small" style="margin-top:8px">目前沒有已儲存案件。</div>';return;}
    box.innerHTML=`<div class="history">${list.map((x,i)=>`<div class="hist"><div onclick="copySaved(${i})" style="cursor:pointer"><b>${esc(x.model||'')}｜${esc(x.symptom||'')}</b><div>${esc(x.time||'')}${x.customer?'・'+esc(x.customer):''}</div>${x.rootCause?`<div class="small">根因：${esc(x.rootCause)}</div>`:''}${x.verify?`<div class="small">驗證：${esc(x.verify)}</div>`:''}</div><button class="btn ghost" type="button" onclick="event.stopPropagation();deleteSavedCase(${i})" style="margin-top:6px">刪除此筆</button></div>`).join('')}</div><div class="btnrow" style="margin-top:8px"><button class="btn secondary" type="button" onclick="exportCaseHistory()">匯出 JSON 備份</button><button class="btn danger" type="button" onclick="clearHistory()">清除全部本機紀錄</button></div>`;
  };
  try{showHistory=window.showHistory}catch(e){}

  document.addEventListener('DOMContentLoaded',()=>{injectFields();});
})();
