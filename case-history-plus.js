'use strict';

// 本機維修案例紀錄：本機保留完整案件；確認完修後可產生「去識別化」提交包，交由維護者加入私人 GitHub 共用案例庫。
(function(){
  const el=id=>document.getElementById(id);
  function injectFields(){
    if(el('rootCause')||!el('notes'))return;
    const notesField=el('notes').closest('.field');
    if(!notesField)return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="row2"><div class="field"><label for="rootCause">最終根因／故障零件 <small>可後補</small></label><input id="rootCause" placeholder="例如：Ribbon Sensor 本體異常、Platen 老化"></div><div class="field"><label for="repairAction">維修處置</label><input id="repairAction" placeholder="例如：更換 Sensor、清潔＋重新校正"></div></div><div class="row2"><div class="field"><label for="partsUsed">更換零件／料號</label><input id="partsUsed" placeholder="例如：P/N、Revision；不確定可先留空"></div><div class="field"><label for="caseVerify">完修驗證</label><select id="caseVerify"><option value="">尚未結案</option><option>已通過基本測試</option><option>已通過連續列印／冷熱機</option><option>已用客戶實際耗材驗證</option><option>暫時恢復，根因未完全確認</option></select></div></div><div class="field"><label for="sharedCaseNote">內部案例摘要／關鍵觀察 <small>確認修好後填；不要寫客戶名稱、電話、地址、完整序號</small></label><textarea id="sharedCaseNote" placeholder="例如：碳帶存在仍持續 Ribbon Out；遮擋 Sensor 讀值無變化，換正常 Sensor 後恢復。這段會用於私人 GitHub 共用案例庫。"></textarea></div>`;
    notesField.insertAdjacentElement('afterend',wrap);
  }

  function textV(id){return el(id)?.value?.trim()||''}
  function stableHash(s){
    let h=2166136261;
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
    return (h>>>0).toString(16).padStart(8,'0');
  }
  function cleanModel(s){return String(s||'unknown').toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18)||'unknown'}
  function isConfirmed(x){
    return !!(x?.rootCause&&x?.action&&x?.verify&&x?.sharedNote&&x.verify!=='暫時恢復，根因未完全確認');
  }

  const oldReport=window.reportText||reportText;
  window.reportText=function(){
    const base=oldReport();
    const extra=[
      '',
      `最終根因／故障零件：${textV('rootCause')||'尚未確認'}`,
      `維修處置：${textV('repairAction')||'尚未填寫'}`,
      `更換零件／料號：${textV('partsUsed')||'無／未填'}`,
      `完修驗證：${textV('caseVerify')||'尚未結案'}`,
      `內部案例摘要：${textV('sharedCaseNote')||'未填'}`
    ];
    return base+extra.join('\n');
  };
  try{reportText=window.reportText}catch(e){}

  window.saveCase=function(){
    if(!current)return toast('請先開始一個排查案件');
    const list=readCases();
    const diag=(typeof buildDiagnosis==='function')?buildDiagnosis():null;
    list.unshift({
      schema:3,
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
      sharedNote:textV('sharedCaseNote'),
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

  function buildSubmissionPacket(x){
    const key=[x.time,x.brand,x.model,x.symptom,x.rootCause,x.action,x.parts,x.verify,x.sharedNote].join('|');
    const date=new Date().toISOString().slice(0,10);
    const id=`case-${date.replaceAll('-','')}-${cleanModel(x.model)}-${stableHash(key)}`;
    const answers=Object.entries(x.answers||{}).slice(0,20).map(([k,v])=>`排查步驟 ${Number(k)+1}：${String(v)}`);
    return {
      schema:'wanli-internal-case-v1',
      caseId:id,
      confirmedAt:date,
      brand:x.brand||'',
      model:x.model||'',
      symptom:x.symptom||'',
      rootCause:x.rootCause||'',
      action:x.action||'',
      parts:x.parts||'',
      verify:x.verify||'',
      sharedNote:x.sharedNote||'',
      evidence:answers,
      sourceBuild:window.APP_BUILD?`${APP_BUILD.version} ${APP_BUILD.updated}`:'版本未載入',
      privacy:'已自動排除 customer / serial / engineer / notes；共享摘要請勿含客戶識別資料'
    };
  }

  window.prepareInternalCaseSubmission=function(i){
    const list=readCases(),x=list[i];
    if(!x)return toast('找不到這筆案件');
    if(!isConfirmed(x)){
      alert('這筆還不能送入正式案例庫。\n\n請先填完整：\n1. 最終根因／故障零件\n2. 維修處置\n3. 完修驗證（不能是「根因未完全確認」）\n4. 內部案例摘要／關鍵觀察');
      return;
    }
    const packet=buildSubmissionPacket(x);
    const text='【萬里資訊｜私人 GitHub 內部案例庫提交】\n'+JSON.stringify(packet,null,2);
    copyText(text);
    x.sharePreparedAt=new Date().toLocaleString('zh-TW');
    x.shareCaseId=packet.caseId;
    try{localStorage.setItem('printer_engineer_cases',JSON.stringify(list));}catch(e){}
    showHistory();
    const box=el('caseSubmitPreview');
    if(box)box.innerHTML=`<div style="margin-top:10px;padding:10px 12px;border:1px solid #86efac;background:#f0fdf4;border-radius:10px"><b>✅ 已產生案例提交包並複製</b><div class="small" style="margin-top:4px">案例 ID：${esc(packet.caseId)}。直接貼到 ChatGPT，我會審核格式後加入私人 GitHub 共用案例庫。</div><div class="small" style="margin-top:4px">客戶名稱、完整序號、工程師姓名與一般備註不會放進提交包。</div></div>`;
    toast('案例提交包已複製，直接貼給 ChatGPT');
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
    box.innerHTML=`<div class="history">${list.map((x,i)=>{const ok=isConfirmed(x);return `<div class="hist"><div onclick="copySaved(${i})" style="cursor:pointer"><b>${esc(x.model||'')}｜${esc(x.symptom||'')}</b><div>${esc(x.time||'')}${x.customer?'・'+esc(x.customer):''}</div>${x.rootCause?`<div class="small">根因：${esc(x.rootCause)}</div>`:''}${x.verify?`<div class="small">驗證：${esc(x.verify)}</div>`:''}${x.shareCaseId?`<div class="small">GitHub 提交包：${esc(x.shareCaseId)}（已產生，仍需貼給 ChatGPT 寫入 Repo）</div>`:''}</div><div class="btnrow" style="margin-top:6px"><button class="btn ${ok?'primary':'ghost'}" type="button" ${ok?'':`disabled title="根因、處置、完修驗證與內部案例摘要尚未完整"`} onclick="event.stopPropagation();prepareInternalCaseSubmission(${i})">${ok?'送入內部案例庫':'尚未符合案例庫條件'}</button><button class="btn ghost" type="button" onclick="event.stopPropagation();deleteSavedCase(${i})">刪除此筆</button></div></div>`}).join('')}</div><div id="caseSubmitPreview"></div><div class="btnrow" style="margin-top:8px"><button class="btn secondary" type="button" onclick="exportCaseHistory()">匯出 JSON 備份</button><button class="btn danger" type="button" onclick="clearHistory()">清除全部本機紀錄</button></div>`;
  };
  try{showHistory=window.showHistory}catch(e){}

  document.addEventListener('DOMContentLoaded',()=>{injectFields();});
})();
