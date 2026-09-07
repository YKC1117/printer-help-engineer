/* 萬里資訊工程師工具｜AUTO-GENERATED ENGINEER APP BUNDLE
 * 請勿直接編輯 dist 檔案；修改原始 JS 後由 GitHub Actions 自動重建。
 */

/* ===== SOURCE: app-version.js ===== */
'use strict';

// 全站唯一版本來源。版本號、更新時間與時區只在此維護；其他模組一律讀取 window.APP_BUILD。
window.APP_BUILD=Object.freeze({
  version:'v4.0',
  updated:'2026/09/07 13:24',
  timezone:'Asia/Taipei',
  schema:1
});

window.getAppVersion=function(){
  return window.APP_BUILD?.version||'版本未載入';
};
;

/* ===== SOURCE: source-backed-flows.js ===== */
'use strict';

(function(){
  if(typeof MODEL_CASES==='undefined'||!window.REPAIR_KB)return;
  const flow=id=>REPAIR_KB.find(x=>x.id===id)?.flow;
  const put=(brand,models,symptoms,id)=>{const f=flow(id);if(!Array.isArray(f))return;models.forEach(m=>symptoms.forEach(s=>MODEL_CASES[`${brand}|${m}|${s}`]=f));};

  const xi4=['110Xi4','140Xi4','170Xi4','220Xi4'];
  put('Zebra',xi4,['Ribbon Out／色帶用盡','碳帶皺褶／破碳'],'zebra-xi4-ribbon');
  put('Zebra',xi4,['Paper Out／紙張用盡','校正一直吐紙／停不下來'],'zebra-xi4-media');
  put('Zebra',xi4,['列印太淡／不清楚','固定缺線／白線','列印歪斜／左右深淺不一','紙張越走越偏'],'zebra-xi4-quality');

  const zt600=['ZT610','ZT620'];
  put('Zebra',zt600,['Ribbon Out／色帶用盡','碳帶皺褶／破碳'],'zebra-zt600-ribbon');
  put('Zebra',zt600,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'zebra-zt600-media');
  put('Zebra',zt600,['列印太淡／不清楚','固定缺線／白線','列印歪斜／左右深淺不一','紙張越走越偏'],'zebra-zt600-quality');
  put('Zebra',zt600,['切刀不切／卡刀','印字頭過熱／列印一段時間就暫停','開機卡住／面板異常'],'zebra-zt600-alerts');

  const zt400=['ZT411','ZT421'];
  put('Zebra',zt400,['Ribbon Out／色帶用盡','Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'zebra-zt400-sensor');
  put('Zebra',zt400,['列印太淡／不清楚','固定缺線／白線','列印歪斜／左右深淺不一','紙張越走越偏','碳帶皺褶／破碳'],'zebra-zt400-pressure');
  put('Zebra',zt400,['切刀不切／卡刀'],'zebra-zt400-cutter');

  put('Zebra',['ZT231'],['Ribbon Out／色帶用盡','Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移','列印太淡／不清楚','固定缺線／白線'],'zebra-zt231-cal-quality');
  put('Zebra',['ZT231'],['開機卡住／面板異常','無法開機／完全沒反應'],'zebra-zt231-boot');

  const th=['TH240','TH340'];
  put('TSC',th,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'tsc-th240-media');
  put('TSC',th,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'tsc-th240-tph');
  put('TSC',th,['切刀不切／卡刀'],'tsc-th240-cutter');
  put('TSC',th,['無法列印／電腦連不到','網路列印斷線／IP 找不到','USB 無法辨識／USB 列印失敗'],'tsc-network');

  const tscCare=['MH241','MH341','MH641','MB240T','MB340T'];
  put('TSC',tscCare,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'tsc-th240-tph');
  put('TSC',tscCare,['無法列印／電腦連不到','網路列印斷線／IP 找不到','USB 無法辨識／USB 列印失敗'],'tsc-network');

  const p4=['P4-250 Pro','P4-350 Pro','P4-650 Pro','P4-650'];
  put('Argox',p4,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'argox-p4-cal');
  put('Argox',p4,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'argox-p4-quality');
  put('Argox',p4,['無法列印／電腦連不到','USB 無法辨識／USB 列印失敗','切刀不切／卡刀'],'argox-p4-errors');

  if(typeof EXTRA_SYMPTOMS!=='undefined'){
    const add=(brand,model,name)=>{const k=`${brand}|${model}`,v=EXTRA_SYMPTOMS[k]||[];if(!v.includes(name))EXTRA_SYMPTOMS[k]=[...v,name];};
    [...xi4,...zt600,...zt400].forEach(m=>add('Zebra',m,'列印歪斜／左右深淺不一'));
  }
})();
;

/* ===== SOURCE: app.js ===== */
'use strict';
const $=id=>document.getElementById(id);
const brand=$('brand'),typeSel=$('type'),seriesSel=$('series'),modelSel=$('model'),symptom=$('symptom'),productInfo=$('productInfo'),search=$('modelSearch'),matches=$('matches');
let current=null,currentProduct=null,answers={};
function uniq(a){return [...new Set(a)]}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function setSelect(el,items,placeholder,enabled=true){el.innerHTML=`<option value="">${esc(placeholder)}</option>`+items.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');el.value='';el.disabled=!enabled}
function clearSelect(el,p){setSelect(el,[],p,false)}
function resetDiag(){current=null;answers={};$('tab-diag').innerHTML='<div class="empty"><div class="big">🔧</div><b>先從左側選擇設備與症狀</b><br><span class="small">也可以直接輸入型號搜尋。</span></div>'}
function resetSelectors(){brand.value='';clearSelect(typeSel,'請先選擇品牌');clearSelect(seriesSel,'請先選擇機型類別');clearSelect(modelSel,'請先選擇產品系列');clearSelect(symptom,'請先選擇實際型號');currentProduct=null;renderProductInfo()}
function updateTypes(){clearSelect(seriesSel,'請先選擇機型類別');clearSelect(modelSel,'請先選擇產品系列');clearSelect(symptom,'請先選擇實際型號');currentProduct=null;renderProductInfo();if(!brand.value)return;setSelect(typeSel,uniq(PRODUCTS.filter(p=>p.b===brand.value).map(p=>p.t)),'請選擇機型類別')}
function updateSeries(){clearSelect(modelSel,'請先選擇產品系列');clearSelect(symptom,'請先選擇實際型號');currentProduct=null;renderProductInfo();if(!brand.value||!typeSel.value)return;setSelect(seriesSel,uniq(PRODUCTS.filter(p=>p.b===brand.value&&p.t===typeSel.value).map(p=>p.s)),'請選擇產品系列')}
function updateModels(){clearSelect(symptom,'請先選擇實際型號');currentProduct=null;renderProductInfo();if(!brand.value||!typeSel.value||!seriesSel.value)return;setSelect(modelSel,PRODUCTS.filter(p=>p.b===brand.value&&p.t===typeSel.value&&p.s===seriesSel.value).map(p=>p.m),'請選擇實際型號')}
function updateProduct(){currentProduct=PRODUCTS.find(p=>p.b===brand.value&&p.t===typeSel.value&&p.s===seriesSel.value&&p.m===modelSel.value)||null;renderProductInfo();if(!currentProduct){clearSelect(symptom,'請先選擇實際型號');return}const extra=EXTRA_SYMPTOMS[`${brand.value}|${modelSel.value}`]||[];setSelect(symptom,uniq([...extra,...Object.keys(GENERIC)]),'請選擇故障症狀')}
function renderProductInfo(){if(!currentProduct){productInfo.innerHTML='';return}const c=currentProduct.status==='已停產'?'stop':currentProduct.status==='維修常見舊機'?'legacy':'';productInfo.innerHTML=`<div class="product-card"><div class="product-head"><div><div class="product-model">${esc(currentProduct.m)}</div><div class="chips"><span class="chip">${esc(currentProduct.b)}</span><span class="chip">${esc(currentProduct.t)}</span><span class="chip">${esc(currentProduct.s)}</span><span class="chip ${c}">${esc(currentProduct.status)}</span></div></div><a class="source-link" href="${BRAND_URLS[currentProduct.b]}" target="_blank" rel="noopener">萬里官網 ↗</a></div>${currentProduct.note?`<div class="product-note">${esc(currentProduct.note)}</div>`:''}</div>`}
function selectProduct(p){resetDiag();brand.value=p.b;updateTypes();typeSel.value=p.t;updateSeries();seriesSel.value=p.s;updateModels();modelSel.value=p.m;updateProduct();search.value=p.m;matches.style.display='none'}
function setupSearch(){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();if(!q){matches.style.display='none';return}const found=PRODUCTS.filter(p=>`${p.b} ${p.s} ${p.m}`.toLowerCase().includes(q)).sort((a,b)=>{const am=a.m.toLowerCase(),bm=b.m.toLowerCase();const ae=am===q?0:am.startsWith(q)?1:2,be=bm===q?0:bm.startsWith(q)?1:2;return ae-be||am.length-bm.length||am.localeCompare(bm)}).slice(0,15);matches.innerHTML=found.map(p=>`<div class="match" data-i="${PRODUCTS.indexOf(p)}"><b>${esc(p.m)}｜${esc(p.b)}</b><span>${esc(p.t)}・${esc(p.s)}・${esc(p.status)}</span></div>`).join('')||'<div class="match"><span>找不到型號。</span></div>';matches.style.display='block';matches.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>selectProduct(PRODUCTS[+el.dataset.i]))});document.addEventListener('click',e=>{if(!e.target.closest('.searchbox'))matches.style.display='none'})}
function startCase(){if(!currentProduct||!symptom.value){toast('請先選完整設備與故障症狀');return}current=MODEL_CASES[`${brand.value}|${modelSel.value}|${symptom.value}`]||GENERIC[symptom.value];if(!Array.isArray(current)){toast('此流程資料異常');return}answers={};showTab('diag',document.querySelector('.tab'));renderDiag()}
function renderDiag(){if(!current)return resetDiag();const done=Object.keys(answers).length,pct=Math.round(done/current.length*100);let html=`<div class="hero"><div><span class="badge">${esc(brand.value)}｜${esc(typeSel.value)}｜${esc(seriesSel.value)}</span><h1>${esc(modelSel.value)}｜${esc(symptom.value)}</h1><div class="small">${esc(currentProduct?.status||'')}・已完成 ${done}/${current.length} 項</div></div><button class="btn secondary no-print" onclick="makeReport(true)">複製維修摘要</button></div><div class="progress"><div style="width:${pct}%"></div></div><div class="steps">`;current.forEach((s,i)=>{const cmd=s[3]&&String(s[3]).startsWith('^')?s[3]:'',tip=s[3]&&!cmd?s[3]:'';html+=`<div class="step ${answers[i]?'done':''}"><div class="stephead"><div class="num">${i+1}</div><div><div class="stitle">${esc(s[0])}</div><div class="desc">${esc(s[1])}</div></div></div><div class="answers">${s[2].map(a=>`<button class="ans ${answers[i]===a?'active':''}" onclick='setAns(${i},${JSON.stringify(a)})'>${esc(a)}</button>`).join('')}</div>${tip?`<div class="tip">💡 ${esc(tip)}</div>`:''}${cmd?`<div class="cmd"><button class="copy" onclick='copyText(${JSON.stringify(cmd)})'>複製</button>${esc(cmd)}</div>`:''}</div>`});html+='</div>'+diagnose()+'<div id="reportBox"></div>';$('tab-diag').innerHTML=html}
function setAns(i,a){answers[i]=a;renderDiag()}
function diagnose(){const vals=Object.values(answers);if(!vals.length)return'';const hints=[];if(vals.some(v=>v.includes('固定／幾乎不變')))hints.push('Sensor 數值無變化：優先查 Sensor、本體接頭、線材與輸入電路。');if(vals.some(v=>v.includes('拔除後行為正常很多')))hints.push('隔離 Sensor 後明顯改善：Sensor／線路為高優先嫌疑。');if(vals.some(v=>v.includes('差異很小／沒有')))hints.push('Media Sensor 無法可靠區分耗材：查位置、污染、紙材與 Sensor。');if(vals.some(v=>v.includes('開始破碳')||v.includes('約 20 已破碳')))hints.push('已有過熱／破碳：不要再只加濃度，改查耗材、壓力、印字頭與滾輪。');if(vals.some(v=>v.includes('固定區域淡')||v.includes('固定同位置')))hints.push('固定區域異常：提高 Printhead、Platen Roller 或壓力不均嫌疑。');if(!hints.length)hints.push(Object.keys(answers).length===current.length?'基本排查已完成，依異常結果由設定／耗材 → 感應器／機構 → 線路／主板處理。':'繼續完成剩餘步驟。');return `<div class="result info"><h3>目前判斷</h3><ul>${hints.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="btnrow no-print" style="margin-top:10px"><button class="btn primary" onclick="makeReport(true)">複製完整維修紀錄</button><button class="btn secondary" onclick="window.print()">列印／存 PDF</button><button class="btn ghost" onclick="saveCase()">儲存案件</button></div></div>`}
function reportText(){const lines=['【標籤機故障排查紀錄】',`日期：${new Date().toLocaleString('zh-TW')}`,`客戶：${$('customer').value.trim()||'未填'}`,`工程師：${$('engineer').value.trim()||'未填'}`,`設備：${brand.value} ${modelSel.value}`,`類別／系列：${typeSel.value}／${seriesSel.value}`,`產品狀態：${currentProduct?.status||''}`,`序號：${$('serial').value.trim()||'未填'}`,`症狀：${symptom.value}`,'','檢查結果：'];if(current)current.forEach((s,i)=>lines.push(`${i+1}. ${s[0]}：${answers[i]||'尚未確認'}`));lines.push('',`額外觀察：${$('notes').value.trim()||'無'}`);return lines.join('\n')}
function makeReport(copy=false){const t=reportText(),box=$('reportBox');if(box)box.innerHTML=`<div class="report">${esc(t)}</div>`;if(copy)copyText(t)}
function copyText(t){if(navigator.clipboard&&location.protocol!=='file:')navigator.clipboard.writeText(t).then(()=>toast('已複製')).catch(()=>fallbackCopy(t));else fallbackCopy(t)}
function fallbackCopy(t){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('已複製')}
function readCases(){try{return JSON.parse(localStorage.getItem('printer_engineer_cases')||'[]')}catch{return[]}}
function saveCase(){if(!current)return toast('請先開始一個排查案件');const list=readCases();list.unshift({time:new Date().toLocaleString('zh-TW'),model:modelSel.value,symptom:symptom.value,customer:$('customer').value.trim(),text:reportText()});try{localStorage.setItem('printer_engineer_cases',JSON.stringify(list.slice(0,30)));toast('案件已儲存在此瀏覽器');showHistory()}catch{toast('無法儲存本機紀錄')}}
function showHistory(){const list=readCases();$('historyBox').innerHTML=list.length?`<div class="history">${list.map((x,i)=>`<div class="hist" onclick="copySaved(${i})"><b>${esc(x.model)}｜${esc(x.symptom)}</b><div>${esc(x.time)}${x.customer?'・'+esc(x.customer):''}</div></div>`).join('')}</div><button class="btn danger" style="margin-top:8px;width:100%" onclick="clearHistory()">清除本機紀錄</button>`:'<div class="small" style="margin-top:8px">目前沒有已儲存案件。</div>'}
function copySaved(i){const x=readCases()[i];if(x)copyText(x.text)}
function clearHistory(){if(confirm('確定清除本機維修紀錄？')){localStorage.removeItem('printer_engineer_cases');showHistory()}}
function showTab(name,btn){document.querySelectorAll('.toolbox').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));$('tab-'+name).classList.add('active');if(btn)btn.classList.add('active')}
function renderTools(){$('tab-tools').innerHTML=`<div class="hero"><div><span class="badge">工程師工具</span><h1>常用指令與現場原則</h1></div></div><div class="command-card"><b>Zebra｜短校正</b><div class="cmd"><button class="copy" onclick="copyText('^XA^MFS,S^JUS^XZ')">複製</button>^XA^MFS,S^JUS^XZ</div></div><div class="command-card"><b>Zebra｜恢復完整校正</b><div class="cmd"><button class="copy" onclick="copyText('^XA^MFC,C^JUS^XZ')">複製</button>^XA^MFC,C^JUS^XZ</div></div><div class="result info"><h3>現場先做</h3><ul><li>拍下錯誤畫面與完整型號。</li><li>確認最近是否換耗材、電腦、網路或設定。</li><li>先印機器自身測試頁，切開硬體與電腦／軟體問題。</li><li>校正前先確認 Sensor 位置。</li><li>拆機前記錄原設定與線路位置。</li></ul></div>`}
function renderCatalog(){const brands=uniq(PRODUCTS.map(p=>p.b));$('tab-catalog').innerHTML=`<div class="hero"><div><span class="badge">設備資料庫</span><h1>標籤條碼列印機型號總覽</h1><div class="small">${brands.length} 品牌・${PRODUCTS.length} 型號</div></div></div>`+brands.map(b=>`<div class="catalog-brand"><h3>${esc(b)}</h3>${uniq(PRODUCTS.filter(p=>p.b===b).map(p=>p.t)).map(t=>`<div class="catalog-type">${esc(t)}</div>`+uniq(PRODUCTS.filter(p=>p.b===b&&p.t===t).map(p=>p.s)).map(s=>`<div class="series-row"><span class="series-name">${esc(s)}：</span> ${PRODUCTS.filter(p=>p.b===b&&p.t===t&&p.s===s).map(p=>`<span class="modelpill ${p.status==='已停產'?'stop':p.status==='維修常見舊機'?'legacy':''}">${esc(p.m)}</span>`).join('')}</div>`).join('')).join('')}</div>`).join('')}
function resetCase(){resetDiag();search.value='';matches.style.display='none';resetSelectors()}
function toast(t){const x=document.createElement('div');x.textContent=t;x.style='position:fixed;left:50%;bottom:25px;transform:translateX(-50%);background:#111827;color:#fff;padding:9px 14px;border-radius:9px;z-index:99;font-weight:800;font-size:12px';document.body.appendChild(x);setTimeout(()=>x.remove(),1400)}
function selfTest(){const problems=[];if(!Array.isArray(PRODUCTS)||PRODUCTS.length<100)problems.push('型號資料不足');for(const k of Object.keys(GENERIC))if(!Array.isArray(GENERIC[k]))problems.push(k);console.info('[engineer self-test]',{brands:uniq(PRODUCTS.map(p=>p.b)).length,products:PRODUCTS.length,problems})}
function init(){brand.onchange=()=>{resetDiag();updateTypes()};typeSel.onchange=()=>{resetDiag();updateSeries()};seriesSel.onchange=()=>{resetDiag();updateModels()};modelSel.onchange=()=>{resetDiag();updateProduct()};symptom.onchange=resetDiag;setupSearch();renderTools();renderCatalog();showHistory();$('headerStat').textContent=`${uniq(PRODUCTS.map(p=>p.b)).length} 品牌・${PRODUCTS.length} 型號`;selfTest()}
window.addEventListener('error',e=>console.error('Engineer tool error',e.message));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
;

/* ===== SOURCE: model-search-fuzzy-patch.js ===== */
'use strict';

// 「直接搜尋型號」也支援省略連字號/空白：P4 65、ZT61、220X、TTP244 等。
(function(){
  if(typeof search==='undefined'||typeof matches==='undefined'||typeof PRODUCTS==='undefined')return;
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  search.addEventListener('input',()=>{
    const raw=search.value.trim();
    const q=norm(raw);
    if(!q){matches.style.display='none';return;}
    const found=PRODUCTS.map(p=>{
      const mn=norm(p.m),bn=norm(p.b),sn=norm(p.s);
      let score=0;
      if(mn===q)score=100;
      else if(mn.startsWith(q))score=80-Math.min(20,mn.length-q.length);
      else if(mn.includes(q))score=55;
      else if((bn+sn+mn).includes(q))score=20;
      return {p,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.p.m.length-b.p.m.length||a.p.m.localeCompare(b.p.m)).slice(0,15).map(x=>x.p);
    matches.innerHTML=found.map(p=>`<div class="match" data-fuzzy-model="${PRODUCTS.indexOf(p)}"><b>${esc(p.m)}｜${esc(p.b)}</b><span>${esc(p.t)}・${esc(p.s)}・${esc(p.status)}</span></div>`).join('')||'<div class="match"><span>找不到型號。</span></div>';
    matches.style.display='block';
    matches.querySelectorAll('[data-fuzzy-model]').forEach(el=>el.onclick=()=>selectProduct(PRODUCTS[+el.dataset.fuzzyModel]));
  });
})();
;

/* ===== SOURCE: case-history-plus.js ===== */
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
;

/* ===== SOURCE: case-submission-privacy.js ===== */
'use strict';

// 共用案例提交前的第二層個資防呆：本機案件可保留客戶資料，但私人 GitHub 正式案例只收去識別化知識。
(function(){
  if(typeof window.prepareInternalCaseSubmission!=='function')return;
  const old=window.prepareInternalCaseSubmission;

  function privacyProblems(x){
    const s=String(x?.sharedNote||'').trim();
    const bad=[];
    const direct=[['客戶名稱',x?.customer],['完整序號',x?.serial],['工程師姓名',x?.engineer]];
    for(const [label,v] of direct){
      const t=String(v||'').trim();
      if(t.length>=3&&s.includes(t))bad.push(label);
    }
    if(/\b09\d{8}\b/.test(s)||/\b0\d{1,2}[-\s]?\d{6,8}\b/.test(s))bad.push('疑似電話號碼');
    if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(s))bad.push('Email');
    if(/(?:統編|統一編號)[：:\s]*\d{8}/.test(s))bad.push('統一編號');
    return [...new Set(bad)];
  }

  window.prepareInternalCaseSubmission=function(i){
    const list=typeof readCases==='function'?readCases():[];
    const x=list[i];
    if(x){
      const bad=privacyProblems(x);
      if(bad.length){
        alert(`內部案例摘要可能包含不該進 GitHub 的識別資料：\n\n• ${bad.join('\n• ')}\n\n請先修改「內部案例摘要／關鍵觀察」，只保留維修技術內容，再重新儲存案件。`);
        return;
      }
    }
    return old(i);
  };
})();
;

/* ===== SOURCE: case-history-import.js ===== */
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
;

/* ===== SOURCE: enhancements.js ===== */
'use strict';

const QUICK_ISSUES=[
['🔌','無法開機／完全沒反應','電源、PSU、主板供電'],
['📄','Paper Out／紙張用盡','紙張、Media Sensor、校正'],
['🎞️','Ribbon Out／色帶用盡','模式、碳帶、Ribbon Sensor'],
['📏','校正一直吐紙／停不下來','紙材、Sensor、Calibration'],
['🖨️','列印太淡／不清楚','耗材、速度、濃度、壓力'],
['⬜','列印空白／完全沒字','列印方式、碳帶、Printhead'],
['〰️','固定缺線／白線','Printhead、Platen、髒污'],
['↔️','列印位置偏移','尺寸、校正、Offset、Driver'],
['📐','紙張越走越偏','導紙、壓力、Platen、機構'],
['🎗️','碳帶皺褶／破碳','熱量、張力、壓力、滾輪'],
['💻','無法列印／電腦連不到','USB、LAN、Driver、Port'],
['🌐','網路列印斷線／IP 找不到','IP、Ping、Port、網路介面'],
['🔗','USB 無法辨識／USB 列印失敗','線材、Driver、USB 介面'],
['✂️','切刀不切／卡刀','設定、殘膠、Cutter 模組'],
['⚙️','異音／齒輪聲／走紙抖動','齒輪、皮帶、滾輪、馬達'],
['🧴','標籤黏住／殘膠／出紙不順','殘膠、滾輪、走紙機構'],
['🔄','剝紙／回捲異常','Peel Sensor、回捲、模式'],
['🧠','開機卡住／面板異常','供電、外接模組、韌體、主板'],
['🌡️','印字頭過熱／列印一段時間就暫停','Darkness、Duty、Printhead']
];

function quickStartIssue(name){
  if(typeof GENERIC==='undefined'||!GENERIC[name]){toast('目前沒有這個排查流程');return}
  if(currentProduct){
    if([...symptom.options].some(o=>o.value===name)) symptom.value=name;
    else { const o=document.createElement('option');o.value=name;o.textContent=name;symptom.appendChild(o);symptom.value=name; }
    startCase();
    return;
  }
  current=GENERIC[name]; answers={};
  if(![...modelSel.options].some(o=>o.value==='未指定機型')){
    const o=document.createElement('option');o.value='未指定機型';o.textContent='未指定機型（通用流程）';modelSel.appendChild(o);
  }
  modelSel.disabled=false; modelSel.value='未指定機型';
  if(![...symptom.options].some(o=>o.value===name)){
    const o=document.createElement('option');o.value=name;o.textContent=name;symptom.appendChild(o);
  }
  symptom.disabled=false; symptom.value=name;
  currentProduct={b:'',t:'通用流程',s:'',m:'未指定機型',status:'通用工程排查'};
  showTab('diag',document.querySelector('.tab'));
  renderDiag();
}
window.quickStartIssue=quickStartIssue;

function injectQuickPanel(){
  const firstCard=document.querySelector('main .card'); if(!firstCard) return;
  const h2=[...firstCard.querySelectorAll('h2')].find(x=>x.textContent.includes('②')); if(!h2) return;
  const panel=document.createElement('div'); panel.className='quick-panel';
  panel.innerHTML=`<h3>⚡ 快速故障入口</h3><div class="quick-note">有選型號就跑機型流程；還沒選型號也能先直接做通用工程排查。</div><div class="quick-grid">${QUICK_ISSUES.map(x=>`<button class="quick-issue" type="button" data-q="${esc(x[1])}"><span class="qi-ico">${x[0]}</span><span><b>${esc(x[1])}</b><small>${esc(x[2])}</small></span></button>`).join('')}</div><div class="quick-tools"><button type="button" id="focusSearch">⌨️ 直接搜尋型號</button><button type="button" id="showRecent">🕘 最近使用機型</button></div><div class="recent-models" id="recentModels" hidden></div>`;
  h2.parentNode.insertBefore(panel,h2);
  panel.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>quickStartIssue(b.dataset.q));
  panel.querySelector('#focusSearch').onclick=()=>{search.focus();search.scrollIntoView({behavior:'smooth',block:'center'})};
  panel.querySelector('#showRecent').onclick=()=>{const box=$('recentModels');box.hidden=!box.hidden;renderRecentModels()};
}

function rememberModel(p){
  if(!p||!p.m)return;let list=[];try{list=JSON.parse(localStorage.getItem('printer_recent_models')||'[]')}catch{}
  list=[{b:p.b,t:p.t,s:p.s,m:p.m},...list.filter(x=>x.m!==p.m||x.b!==p.b)].slice(0,8);
  localStorage.setItem('printer_recent_models',JSON.stringify(list));
}
function renderRecentModels(){
  const box=$('recentModels');if(!box)return;let list=[];try{list=JSON.parse(localStorage.getItem('printer_recent_models')||'[]')}catch{}
  box.innerHTML=list.length?list.map((x,i)=>`<button type="button" class="recent-model" data-r="${i}">${esc(x.m)} · ${esc(x.b)}</button>`).join(''):'<span class="small">還沒有最近使用紀錄。</span>';
  box.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.r],p=PRODUCTS.find(p=>p.b===x.b&&p.m===x.m);if(p){selectProduct(p);search.scrollIntoView({behavior:'smooth',block:'center'})}})
}

if(typeof selectProduct==='function'){
  const _selectProduct=selectProduct;
  selectProduct=function(p){_selectProduct(p);rememberModel(p)};
}

function buildDiagnosis(){
  const vals=Object.values(answers||{}); const done=vals.length,total=current?.length||0;
  let likely='尚未收斂', next='繼續完成下一個未確認步驟', risk='一般';
  if(vals.some(v=>/固定／幾乎不變|無反應／不穩|差異很小／沒有/.test(v))){likely='Sensor／線路／輸入電路';next='優先做 Sensor 隔離、接頭與訊號變化確認';risk='中高'}
  if(vals.some(v=>/測試頁可印/.test(v))){likely='電腦端／Driver／Port／標籤檔案';next='先查 Windows Port、Driver 與 BarTender 設定';risk='低'}
  if(vals.some(v=>/完全看不到|另一台也無法辨識/.test(v))){likely='介面線材／USB 介面／主板';next='交叉線材與電腦後，再查介面板與接頭';risk='中'}
  if(vals.some(v=>/固定同位置|固定區域淡|單側偏淡/.test(v))){likely='Printhead／Platen／壓力不均';next='印滿版測試後檢查固定位置、滾輪與左右壓力';risk='中'}
  if(vals.some(v=>/開始破碳|過熱/.test(v))){likely='熱量過高／耗材／壓力／Printhead 接觸';next='停止增加濃度，改查速度、耗材、壓力與滾輪';risk='中高'}
  if(vals.some(v=>/清潔後正常|調整後正常|已修正|恢復正常/.test(v))){likely='已找到可修正因素';next='保留目前設定並做連續列印確認';risk='低'}
  if(done===total&&total>0&&likely==='尚未收斂'){likely='基本工程排查已完成';next='依異常答案由耗材／設定 → Sensor／機構 → 線路／主板收斂';risk='中'}
  return {likely,next,risk,done,total};
}

function diagnose(){
  if(!current||!Object.keys(answers).length)return'';
  const d=buildDiagnosis();
  return `<div class="result info"><h3>目前工程判斷</h3><div class="diag-summary"><div class="diag-box"><div class="k">最可能方向</div><div class="v">${esc(d.likely)}</div></div><div class="diag-box ${d.risk==='低'?'good':'warn'}"><div class="k">風險層級</div><div class="v">${esc(d.risk)}</div></div><div class="diag-box"><div class="k">進度</div><div class="v">${d.done} / ${d.total} 項</div></div></div><div class="next-action"><b>下一步建議：</b>${esc(d.next)}</div><div class="filterbar no-print"><button type="button" onclick="focusUnanswered()">只看下一個未確認</button><button type="button" onclick="showAllSteps()">顯示全部步驟</button><button type="button" onclick="makeReport(true)">複製完整維修紀錄</button><button type="button" onclick="saveCase()">儲存案件</button></div></div>`;
}
window.diagnose=diagnose;

function focusUnanswered(){
  document.querySelectorAll('.step').forEach(x=>{x.style.display='none';x.classList.remove('step-focus')});
  const idx=[...Array(current?.length||0).keys()].find(i=>!answers[i]);
  const steps=document.querySelectorAll('.step');if(idx!==undefined&&steps[idx]){steps[idx].style.display='block';steps[idx].classList.add('step-focus');steps[idx].scrollIntoView({behavior:'smooth',block:'center'})}
  else showAllSteps();
}
function showAllSteps(){document.querySelectorAll('.step').forEach(x=>{x.style.display='';x.classList.remove('step-focus')})}
window.focusUnanswered=focusUnanswered;window.showAllSteps=showAllSteps;

document.addEventListener('DOMContentLoaded',()=>{
  injectQuickPanel();
  if(search){search.placeholder='例如：ZT610、110Xi4、220Xi4、TH240、P4-650';}
});
;

/* ===== SOURCE: repair-kb-ui.js ===== */
'use strict';

function kbEsc(s){
  return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function kbSourceHtml(ids){
  if(!ids?.length)return '<span class="kb-muted">內部通用工程整理；實際電壓、Pin 定義與拆裝仍以該機型 Service Manual 為準。</span>';
  return ids.map(id=>KB_SOURCES[id]).filter(Boolean).map(s=>`<a class="kb-source" href="${kbEsc(s.url)}" target="_blank" rel="noopener"><b>${kbEsc(s.level)}</b><span>${kbEsc(s.label)}</span> ↗</a>`).join('');
}

function kbRelated(model,brand){
  return REPAIR_KB.filter(a=>a.models.includes('ALL')||(model&&a.models.includes(model))||(brand&&a.brand===brand&&a.models.includes('ALL')));
}

function kbCard(a){
  return `<button class="kb-card" type="button" data-kb="${kbEsc(a.id)}"><div class="kb-card-top"><span class="kb-brand">${kbEsc(a.brand)}</span><span class="kb-sev">${kbEsc(a.severity||'')}</span></div><b>${kbEsc(a.title)}</b><small>${kbEsc(a.category)} · ${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}</small><p>${kbEsc(a.summary)}</p></button>`;
}

function renderKB(filters={}){
  const box=$('tab-kb');
  if(!box||!window.REPAIR_KB)return;
  const cur=(typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
  const q=(filters.q??$('kbSearch')?.value??'').trim().toLowerCase();
  const br=filters.brand??$('kbBrand')?.value??'全部';
  const cat=filters.cat??$('kbCat')?.value??'全部';
  const only=filters.modelOnly??$('kbModelOnly')?.checked??false;
  const brands=['全部',...new Set(REPAIR_KB.map(a=>a.brand))];
  const cats=['全部',...new Set(REPAIR_KB.map(a=>a.category))];
  const version=window.APP_BUILD?.version||'工程師版';
  const list=REPAIR_KB.filter(a=>{
    const hay=[a.title,a.brand,a.category,a.summary,...a.models,...(a.keyFacts||[]),...(a.engineering||[])].join(' ').toLowerCase();
    return(!q||hay.includes(q))&&(br==='全部'||a.brand===br)&&(cat==='全部'||a.category===cat)&&(!only||!cur||a.models.includes(cur)||a.models.includes('ALL'));
  });
  box.innerHTML=`<div class="kb-head"><span class="badge">${kbEsc(version)} 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。可搜尋錯誤、Sensor、Cutter、TPH、IP 或機型，直接啟動排查。</div></div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：Ribbon Out、Sensor、Cutter、TPH、110Xi4…" value="${kbEsc(filters.q??q)}"><select id="kbBrand">${brands.map(x=>`<option ${x===br?'selected':''}>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option ${x===cat?'selected':''}>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${only?'checked':''} ${cur?'':'disabled'}> 只看目前機型${cur?`（${kbEsc(cur)}）`:''}</label></div><div class="kb-count">找到 <b>${list.length}</b> 筆</div><div class="kb-grid">${list.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料。</div>'}</div><div id="kbDetail"></div>`;
  ['kbSearch','kbBrand','kbCat','kbModelOnly'].forEach(id=>{
    const el=$(id);
    if(el)el.addEventListener(id==='kbSearch'?'input':'change',()=>renderKB());
  });
  box.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>openKBArticle(b.dataset.kb));
}
window.renderKB=renderKB;

function openKBArticle(id){
  const a=REPAIR_KB.find(x=>x.id===id),box=$('kbDetail');
  if(!a||!box)return;
  box.innerHTML=`<article class="kb-detail"><div class="kb-detail-head"><div><span class="kb-brand">${kbEsc(a.brand)}</span> <span class="kb-sev">${kbEsc(a.severity||'')}</span><h2>${kbEsc(a.title)}</h2><div class="small">${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}｜${kbEsc(a.category)}</div></div><button class="btn primary" onclick="startKBFlow('${kbEsc(a.id)}')">▶ 啟動這套排查</button></div><div class="kb-summary">${kbEsc(a.summary)}</div><details open><summary>原廠／關鍵判斷</summary><ul>${(a.keyFacts||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>工程師深入處理</summary><ul>${(a.engineering||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>修復後驗證</summary><ul>${(a.verify||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>完整排查步驟（${a.flow?.length||0}）</summary><ol>${(a.flow||[]).map(s=>`<li><b>${kbEsc(s[0])}</b><div>${kbEsc(s[1])}</div>${s[3]?`<small>${kbEsc(s[3])}</small>`:''}</li>`).join('')}</ol></details><div class="kb-sources"><h3>資料來源</h3>${kbSourceHtml(a.sources)}</div></article>`;
  box.scrollIntoView({behavior:'smooth',block:'start'});
}
window.openKBArticle=openKBArticle;

function kbEnsure(select,value,text=value){
  if(![...select.options].some(o=>o.value===value)){
    const o=document.createElement('option');
    o.value=value;
    o.textContent=text;
    select.appendChild(o);
  }
}

function startKBFlow(id){
  const a=REPAIR_KB.find(x=>x.id===id);
  if(!a||!Array.isArray(a.flow))return;
  let p=(typeof currentProduct!=='undefined')?currentProduct:null;
  if(!p||p.m==='未指定機型'||(!a.models.includes('ALL')&&!a.models.includes(p.m))){
    p=PRODUCTS.find(x=>a.models.includes(x.m))||null;
    if(p)selectProduct(p);
  }
  if(!p){
    currentProduct={b:a.brand==='通用'?'':a.brand,t:'工程維修資料庫',s:a.category,m:'未指定機型',status:'來源化深度排查'};
    kbEnsure(modelSel,'未指定機型','未指定機型（資料庫流程）');
    modelSel.disabled=false;
    modelSel.value='未指定機型';
  }
  kbEnsure(symptom,a.title);
  symptom.disabled=false;
  symptom.value=a.title;
  current=a.flow;
  answers={};
  showTab('diag',[...document.querySelectorAll('.tabs .tab')].find(x=>x.textContent.includes('故障排查')));
  renderDiag();
  const d=$('tab-diag');
  if(d){
    const src=document.createElement('div');
    src.className='kb-inline-source';
    src.innerHTML=`<b>📚 此流程依據：</b>${kbSourceHtml(a.sources)}`;
    d.prepend(src);
    d.scrollIntoView({behavior:'smooth',block:'start'});
  }
}
window.startKBFlow=startKBFlow;

function attachModelKB(){
  if(!productInfo)return;
  productInfo.querySelector('.kb-model-shortcut')?.remove();
  const m=(typeof currentProduct!=='undefined'&&currentProduct)?currentProduct.m:'';
  if(!m)return;
  const n=kbRelated(m,currentProduct.b).length;
  if(!n)return;
  const b=document.createElement('button');
  b.className='kb-model-shortcut';
  b.type='button';
  b.textContent=`📚 此機型有 ${n} 套深度維修資料`;
  b.onclick=()=>{
    const tab=[...document.querySelectorAll('.tabs .tab')].find(x=>x.textContent.includes('維修資料庫'));
    showTab('kb',tab);
    renderKB({modelOnly:true});
  };
  productInfo.appendChild(b);
}

if(typeof renderProductInfo==='function'){
  const old=renderProductInfo;
  renderProductInfo=function(){old();setTimeout(attachModelKB,0)};
}

if(typeof buildDiagnosis==='function'){
  buildDiagnosis=function(){
    const vals=Object.values(answers||{}),text=vals.join('｜'),done=vals.length,total=current?.length||0,sym=symptom?.value||'',m=currentProduct?.m||modelSel?.value||'',br=currentProduct?.b||brand?.value||'';
    let likely='尚未收斂',next='完成下一個未確認步驟',risk='一般';
    if(/固定／幾乎不變|差異小|無波形|Signal 不變|reading 接近/.test(text)){likely='Sensor／線束／感應輸入';next='先看 Sensor Profile／讀值，再做斷電接頭、線束與正常 Sensor 交叉';risk='中高'}
    if(/供電異常|無輸出|掉壓|Rail 被拉低/.test(text)){likely='PSU／供電路徑／負載短路';next='隔離負載並依 Service Manual 量 DC Rail，不要先換主板';risk='高'}
    if(/換 Sensor 仍異常|主板方向高/.test(text)){likely='主板 Sensor Input／控制電路';next='確認 Sensor、線束、供電均已交叉正常後再查主板';risk='高'}
    if(/測試頁正常|Self Test 正常|自身測試正常/.test(text)&&/無法列印|USB|LAN|Command|Driver|Port|BarTender/.test(sym)){likely='電腦端／Driver／Port／資料格式';next='先查 Windows Test Page、Port、Queue，再查 BarTender';risk='低'}
    if(/Ping 正常|Ping 通/.test(text)){likely='Windows Port／Queue／Driver／列印協定';next='核對 Standard TCP/IP Port、RAW/LPR，再清 Queue';risk='低'}
    if(/固定同位置|單側淡|固定區域/.test(text)){likely='Printhead／Platen／左右壓力';next='先清潔＋測試圖，再查 Platen 與左右壓力/Toggle';risk='中'}
    if(/開始破碳|過熱/.test(text)){likely='熱量過高／耗材／壓力接觸';next='停止增加 Darkness，改查速度、耗材、壓力與 Platen';risk='中高'}
    if(/會動但卡|仍 Cutter error/.test(text)){likely='Cutter 機構／殘膠／Home Sensor';next='斷電清 Cutter path，再查 Home Sensor、Gear、Motor、接頭';risk='高'}
    if(/完全不動/.test(text)&&/Cutter|切刀/.test(sym)){likely='Cutter 供電／接頭／驅動';next='先排設定，再斷電查模組辨識、接頭與 Motor/Driver';risk='高'}
    if(/bad dots|defective dots|spike/.test(text)){likely='Printhead 壞點';next='清潔後重跑 TPH/Test Pattern；同位置持續再準備換 Printhead';risk='中'}
    if(/校正後正常|清潔後正常|已修正|已修復|達到可用品質/.test(text)){likely='已找到可修正因素';next='保留設定，做連續列印／冷熱機／重開機驗證再結案';risk='低'}
    const n=kbRelated(m,br).length;
    if(done===total&&total>0&&likely==='尚未收斂'){
      likely='流程完成但尚未單點收斂';
      next=n?`切到維修資料庫查看 ${n} 套相關深度資料，依異常答案做交叉測試`:'依耗材/設定 → Sensor/機構 → 線路/主板隔離';
      risk='中';
    }
    return{likely,next,risk,done,total};
  };
}

if(typeof diagnose==='function'){
  const oldDiag=diagnose;
  diagnose=function(){
    const base=oldDiag();
    if(!base)return base;
    const m=currentProduct?.m||modelSel?.value||'',br=currentProduct?.b||'',list=kbRelated(m,br);
    if(!list.length)return base;
    return base+`<div class="kb-next"><b>📚 相關深度維修資料</b><span>${list.slice(0,3).map(a=>`<button type="button" onclick="showTab('kb',[...document.querySelectorAll('.tabs .tab')].find(x=>x.textContent.includes('維修資料庫')));renderKB({q:${JSON.stringify(m)}})">${kbEsc(a.title)}</button>`).join('')}</span></div>`;
  };
}

document.addEventListener('DOMContentLoaded',()=>{
  renderKB();
  setTimeout(attachModelKB,80);
});
;

/* ===== SOURCE: repair-kb-search-patch.js ===== */
'use strict';

// 大資料庫搜尋：完整索引全部資料，分批顯示；提高精確機型、完整片語與證據型內容的排序品質。
(function(){
  if(typeof window.renderKB!=='function'||typeof window.REPAIR_KB==='undefined')return;

  let searchIndex=[];
  let indexedLength=-1;
  let searchTimer=null;
  let visibleLimit=60;
  const PAGE_SIZE=60;
  const norm=s=>String(s||'').toLowerCase().replace(/[\s_\-–—/／()（）\[\]【】]+/g,'');
  const appVersion=()=>window.APP_BUILD?.version||'工程師版';

  function evidenceType(a){
    if(a.evidence==='oem-parts')return 'A｜原廠料號';
    if(a.evidence==='verified-b-parts')return 'B｜雙來源料號';
    if(String(a.evidence||'').startsWith('internal-field'))return '內部實機案例';
    if(a.evidence==='workflow-sop')return '工程 SOP';
    if((a.sources||[]).length)return '有來源資料';
    return '通用工程基線';
  }

  function ensureIndex(){
    if(indexedLength===REPAIR_KB.length)return;
    searchIndex=REPAIR_KB.map(a=>({
      a,
      title:(a.title||'').toLowerCase(),
      titleN:norm(a.title),
      category:(a.category||'').toLowerCase(),
      models:(a.models||[]).join(' ').toLowerCase(),
      modelNorms:(a.models||[]).map(norm),
      evidence:(a.evidence||'').toLowerCase(),
      evidenceType:evidenceType(a),
      sourceCount:(a.sources||[]).length,
      hay:[a.title,a.brand,a.category,a.summary,a.evidence,a.evidenceNote,...(a.models||[]),...(a.keyFacts||[]),...(a.engineering||[]),...(a.verify||[])].join(' ').toLowerCase()
    }));
    indexedLength=REPAIR_KB.length;
  }

  function currentModel(){
    return (typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
  }

  function scoreList(q,br,cat,ev,only,cur){
    ensureIndex();
    const tokens=q.split(/[\s,，、/／|｜]+/).map(x=>x.trim()).filter(x=>x.length>=2);
    const qn=norm(q);
    const wantsCase=/案例|實測|field|case/.test(q);
    const wantsSop=/sop|保養|交機|完修|換件|收機|交叉測試/.test(q);
    const wantsParts=/料號|part\s*number|parts?|p\/n|pn|printhead|platen|cutter|主板|電源|psu|sensor|motor|belt/.test(q);
    return searchIndex.map(x=>{
      let score=0;
      if(!q)score=1;
      else {
        if(qn&&x.titleN.includes(qn))score+=12;
        for(const t of tokens){
          const tn=norm(t);
          if(x.hay.includes(t))score+=1;
          if(x.title.includes(t))score+=5;
          if(x.category.includes(t))score+=2;
          for(const mn of x.modelNorms){
            if(!tn)continue;
            if(mn===tn)score+=24;
            else if(mn.startsWith(tn))score+=14;
            else if(mn.includes(tn))score+=8;
          }
        }
        if(wantsCase&&x.evidence.startsWith('internal-field'))score+=8;
        if(wantsSop&&x.evidence==='workflow-sop')score+=6;
        if(wantsParts&&x.evidence==='oem-parts')score+=12;
        if(wantsParts&&x.evidence==='verified-b-parts')score+=9;
        if(x.sourceCount)score+=1;
      }
      if(cur&&x.a.models.includes(cur))score+=4;
      return {a:x.a,score,evidenceType:x.evidenceType};
    }).filter(x=>(!q||x.score>0)
      &&(br==='全部'||x.a.brand===br)
      &&(cat==='全部'||x.a.category===cat)
      &&(ev==='全部'||x.evidenceType===ev)
      &&(!only||!cur||x.a.models.includes(cur)||x.a.models.includes('ALL')))
      .sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
  }

  function buildShell(){
    const box=$('tab-kb');
    if(!box||$('kbSearch'))return;
    const brands=['全部',...new Set(REPAIR_KB.map(a=>a.brand))];
    const cats=['全部',...new Set(REPAIR_KB.map(a=>a.category))];
    const evidence=['全部','A｜原廠料號','B｜雙來源料號','內部實機案例','工程 SOP','有來源資料','通用工程基線'];
    const cur=currentModel();
    const ec=window.KB_HEALTH?.evidenceCount||{};
    const composition=Object.keys(ec).length?`A原廠料號 ${ec['A原廠料號']||ec['原廠料號']||0}｜B雙來源料號 ${ec['B雙來源料號']||0}｜內部實機案例 ${ec['內部實機案例']||0}｜工程 SOP ${ec['工程SOP']||0}｜有來源資料 ${ec['有來源資料']||0}｜通用基線 ${ec['通用工程基線']||0}`:'';
    box.innerHTML=`<div class="kb-head"><span class="badge">${kbEsc(appVersion())} 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。精確料號分為 A 原廠與 B 雙來源；搜尋時 A 級優先，B 級仍需下料前實機核對。</div>${composition?`<div class="small" style="margin-top:5px;font-weight:800">資料組成：${kbEsc(composition)}</div>`:''}</div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：110X Ribbon Sensor、ZT61 Printhead 料號、MH241 Platen、1015…"><select id="kbBrand">${brands.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbEvidence" title="資料等級">${evidence.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${cur?'':'disabled'}> <span id="kbModelOnlyText">只看目前機型${cur?`（${kbEsc(cur)}）`:''}</span></label></div><div class="kb-count" id="kbCount"></div><div class="kb-grid" id="kbGrid"></div><div id="kbMoreWrap"></div><div id="kbDetail"></div>`;

    const input=$('kbSearch');
    input.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{visibleLimit=PAGE_SIZE;refreshResults(true)},180)});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(searchTimer);visibleLimit=PAGE_SIZE;refreshResults(true)}});
    ['kbBrand','kbCat','kbEvidence','kbModelOnly'].forEach(id=>$(id)?.addEventListener('change',()=>{visibleLimit=PAGE_SIZE;refreshResults(true)}));
  }

  function refreshModelState(){
    const cur=currentModel(),check=$('kbModelOnly'),txt=$('kbModelOnlyText');
    if(!check)return;
    check.disabled=!cur;
    if(!cur)check.checked=false;
    if(txt)txt.textContent=`只看目前機型${cur?`（${cur}）`:''}`;
  }

  function refreshResults(clearDetail=false){
    const grid=$('kbGrid'),count=$('kbCount'),more=$('kbMoreWrap');
    if(!grid||!count)return;
    const q=($('kbSearch')?.value||'').trim().toLowerCase();
    const br=$('kbBrand')?.value||'全部';
    const cat=$('kbCat')?.value||'全部';
    const ev=$('kbEvidence')?.value||'全部';
    const only=!!$('kbModelOnly')?.checked;
    const cur=currentModel();
    const scored=scoreList(q,br,cat,ev,only,cur);
    const fullList=scored.map(x=>x.a);
    const shown=fullList.slice(0,visibleLimit);
    count.innerHTML=`找到 <b>${fullList.length}</b> 筆${q?'（依機型／片語／證據相關度排序）':''}${ev!=='全部'?`｜${kbEsc(ev)}`:''}${fullList.length>shown.length?`｜目前顯示 ${shown.length} 筆`:''}`;
    grid.innerHTML=shown.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料，請縮短關鍵詞、改故障名稱或調整資料等級。</div>';
    grid.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>openKBArticle(b.dataset.kb));
    if(more){
      if(fullList.length>shown.length){
        const remain=fullList.length-shown.length;
        more.innerHTML=`<div style="text-align:center;margin:14px 0"><button id="kbMoreBtn" class="btn secondary" type="button">顯示更多（還有 ${remain} 筆）</button></div>`;
        $('kbMoreBtn').onclick=()=>{visibleLimit+=PAGE_SIZE;refreshResults(false)};
      }else more.innerHTML='';
    }
    if(clearDetail){const d=$('kbDetail');if(d)d.innerHTML=''}
  }

  window.renderKB=function(filters={}){
    buildShell();refreshModelState();visibleLimit=PAGE_SIZE;
    if(filters.q!==undefined&&$('kbSearch'))$('kbSearch').value=filters.q;
    if(filters.brand!==undefined&&$('kbBrand'))$('kbBrand').value=filters.brand;
    if(filters.cat!==undefined&&$('kbCat'))$('kbCat').value=filters.cat;
    if(filters.evidence!==undefined&&$('kbEvidence'))$('kbEvidence').value=filters.evidence;
    if(filters.modelOnly!==undefined&&$('kbModelOnly')&&!$('kbModelOnly').disabled)$('kbModelOnly').checked=!!filters.modelOnly;
    refreshResults(false);
  };
  try{renderKB=window.renderKB}catch(e){}
})();
;

/* ===== SOURCE: kb-evidence-ui.js ===== */
'use strict';

// 維修資料證據標示：工程師可一眼分辨 A 原廠料號、B 雙來源料號、內部實機、SOP、來源化資料與通用基線。
(function(){
  function meta(a){
    if(a?.evidence==='oem-parts')return {label:'🏷️ A｜原廠料號',note:'依原廠 Parts Catalog／Accessories Guide 整理；正式下單仍需核對實機 S/N、DPI、Hardware Revision、選配及最新替代料號。'};
    if(a?.evidence==='verified-b-parts')return {label:'🔎 B｜雙來源料號',note:a.evidenceNote||'原廠未公開完整 Parts Catalog 時，僅收至少兩個獨立 B 級來源一致的料號；正式下料仍必須回到實機 Model、S/N、DPI、Revision、Option 再確認。'};
    if(a?.evidence==='internal-field')return {label:'🧪 內部實機案例',note:a.evidenceNote||'內部實機排查紀錄；單機數值不可當通用規格。'};
    if(a?.evidence==='internal-field-open')return {label:'🧪 內部案例｜未完全收斂',note:a.evidenceNote||'原始案例尚未確認最終根因。'};
    if(a?.evidence==='workflow-sop')return {label:'📋 工程 SOP',note:'工作流程整理；精確料號、Pin、電壓與扭力仍依該機原廠文件。'};
    if(a?.sources?.length)return {label:'📚 來源化資料',note:'依列示原廠或文件來源整理。'};
    return {label:'🛠️ 工程通用基線',note:'未綁定單一原廠深度文件；精確硬體規格需回查 Service Manual。'};
  }
  function badge(m){return `<span style="display:inline-flex;align-items:center;padding:2px 7px;border:1px solid #cbd5e1;border-radius:999px;font-size:11px;font-weight:800;margin-left:6px;background:#fff">${kbEsc(m.label)}</span>`}

  window.kbCard=function(a){
    const m=meta(a);
    return `<button class="kb-card" type="button" data-kb="${kbEsc(a.id)}"><div class="kb-card-top"><span class="kb-brand">${kbEsc(a.brand)}</span><span class="kb-sev">${kbEsc(a.severity||'')}</span></div><b>${kbEsc(a.title)}</b>${badge(m)}<small>${kbEsc(a.category)} · ${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}</small><p>${kbEsc(a.summary)}</p></button>`;
  };
  try{kbCard=window.kbCard}catch(e){}

  window.openKBArticle=function(id){
    const a=REPAIR_KB.find(x=>x.id===id),box=$('kbDetail');if(!a||!box)return;
    const m=meta(a);
    box.innerHTML=`<article class="kb-detail"><div class="kb-detail-head"><div><span class="kb-brand">${kbEsc(a.brand)}</span> <span class="kb-sev">${kbEsc(a.severity||'')}</span>${badge(m)}<h2>${kbEsc(a.title)}</h2><div class="small">${kbEsc(a.models.includes('ALL')?'通用':a.models.join(' / '))}｜${kbEsc(a.category)}</div></div><button class="btn primary" onclick="startKBFlow('${kbEsc(a.id)}')">▶ 啟動這套排查</button></div><div class="kb-summary">${kbEsc(a.summary)}</div><div style="margin:10px 0;padding:9px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;font-size:12px"><b>${kbEsc(m.label)}</b><div style="margin-top:4px">${kbEsc(m.note)}</div></div><details open><summary>原廠／關鍵判斷</summary><ul>${(a.keyFacts||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>工程師深入處理</summary><ul>${(a.engineering||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>修復後驗證</summary><ul>${(a.verify||[]).map(x=>`<li>${kbEsc(x)}</li>`).join('')}</ul></details><details><summary>完整排查步驟（${a.flow?.length||0}）</summary><ol>${(a.flow||[]).map(s=>`<li><b>${kbEsc(s[0])}</b><div>${kbEsc(s[1])}</div>${s[3]?`<small>${kbEsc(s[3])}</small>`:''}</li>`).join('')}</ol></details><div class="kb-sources"><h3>資料來源</h3>${kbSourceHtml(a.sources)}</div></article>`;
    box.scrollIntoView({behavior:'smooth',block:'start'});
  };
  try{openKBArticle=window.openKBArticle}catch(e){}
})();
;

/* ===== SOURCE: model-coverage-badge.js ===== */
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
      bParts:direct.filter(x=>x.evidence==='verified-b-parts').length,
      internal:direct.filter(x=>String(x.evidence||'').startsWith('internal-field')).length,
      sop:direct.filter(x=>x.evidence==='workflow-sop'||/SOP/.test(x.category||'')).length
    };
  }
  function attach(){
    if(typeof currentProduct==='undefined'||typeof productInfo==='undefined'||!productInfo)return;
    const p=currentProduct;
    if(!p?.m||p.m==='未指定機型')return;
    productInfo.querySelector('.kb-coverage-line')?.remove();
    const s=stats(p.m);
    const d=document.createElement('div');
    d.className='kb-coverage-line';
    d.style.cssText='margin-top:8px;padding:7px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#f8fafc;font-size:12px;font-weight:800';
    if(!s.direct){
      d.innerHTML=`⚠️ 此機型目前沒有專屬維修文章；可先使用通用工程基線 ${s.generic} 套。`;
    }else{
      const quality=s.sourced?`來源化 ${s.sourced}`:'來源化 0';
      d.innerHTML=`📊 專屬資料 ${s.direct} 套｜${quality}｜A原廠料號 ${s.oemParts}｜B雙來源料號 ${s.bParts}｜內部案例 ${s.internal}｜SOP ${s.sop}`;
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
;

/* ===== SOURCE: customer-phrase-search.js ===== */
'use strict';

// v3.3 客戶口語描述快速查
// 目的：工程師可直接輸入客戶原話，例如「沒反應、一直吐紙、碳帶明明還有卻說沒有」。

const CUSTOMER_PHRASE_RULES=[
  {id:'power',icon:'🔌',title:'整台完全沒電／面板不亮',issue:'無法開機／完全沒反應',keywords:['整台沒反應','完全沒反應','沒電','開不了機','不能開機','開機沒反應','面板不亮','螢幕不亮','燈都不亮','按電源沒反應'],hint:'先分清楚是否真的完全無電；若面板有亮，應改走其他方向。',kb:'電源 PSU 主板供電'},
  {id:'print',icon:'🖨️',title:'面板正常，但電腦按列印沒反應',issue:'無法列印／電腦連不到',keywords:['列印沒反應','按列印沒反應','印不出來','不能列印','電腦送了沒反應','送印沒反應','工作送不出去','電腦找不到','印表機離線','printer offline'],hint:'先用機器自身測試頁切開硬體與電腦／Driver／Port 問題。',kb:'無法列印 Driver Port USB LAN'},
  {id:'feed',icon:'⏩',title:'FEED／走紙鍵按了沒反應',issue:null,keywords:['feed沒反應','feed 沒反應','按feed沒反應','按 feed 沒反應','按鍵沒反應','走紙沒反應','不走紙','按走紙不動','紙不會走'],hint:'先看面板是否有錯誤，再分成 Sensor 阻擋、馬達／傳動、按鍵／面板或主板控制。',kb:'FEED 走紙 馬達 Sensor 面板'},
  {id:'paperout',icon:'📄',title:'明明有紙，卻一直顯示 Paper Out／紙張用盡',issue:'Paper Out／紙張用盡',keywords:['paper out','紙張用盡','明明有紙','有紙卻說沒紙','一直說沒紙','偵測不到紙','感應不到紙','紅燈沒紙'],hint:'優先看紙材類型、Media Sensor 位置／污染與校正。',kb:'Paper Out Media Sensor Calibration'},
  {id:'ribbonout',icon:'🎞️',title:'明明有碳帶，卻一直顯示 Ribbon Out',issue:'Ribbon Out／色帶用盡',keywords:['ribbon out','色帶用盡','碳帶用盡','明明有碳帶','有碳帶卻說沒有','一直說沒碳帶','偵測不到碳帶','碳帶感應不到'],hint:'先確認 Thermal Transfer，再看碳帶路徑、Ribbon Sensor 與校正。',kb:'Ribbon Out Ribbon Sensor Calibration'},
  {id:'calibration',icon:'📏',title:'一直吐紙／校正停不下來／跳很多張',issue:'校正一直吐紙／停不下來',keywords:['一直吐紙','一直出紙','一直跑紙','跑不停','停不下來','跳很多張','跳標','一直校正','校正失敗','校正不停','一直走紙'],hint:'常見方向是紙材類型、Sensor 位置、Gap／Black Mark 判讀或 Calibration。',kb:'Calibration Sensor Profile 跳標'},
  {id:'light',icon:'🌫️',title:'列印很淡／不清楚／掃不到',issue:'列印太淡／不清楚',keywords:['印很淡','列印很淡','印不清楚','字不清楚','條碼不清楚','掃不到','印不黑','顏色太淡','列印模糊','字很淡'],hint:'先判斷耗材搭配、速度、Darkness，再看 Printhead／Platen／壓力。',kb:'Print Quality Darkness Printhead Platen'},
  {id:'blank',icon:'⬜',title:'紙有出來，但完全沒有字／整張空白',issue:'列印空白／完全沒字',keywords:['整張空白','列印空白','沒有字','完全沒字','出紙沒字','有走紙沒印','紙出來是白的','印不出字'],hint:'先分 Thermal Transfer／Direct Thermal、碳帶墨面、Printhead 接頭與驅動。',kb:'列印空白 Printhead Ribbon'},
  {id:'white_line',icon:'〰️',title:'固定位置白線／缺線／少一條',issue:'固定缺線／白線',keywords:['白線','缺線','少一條','固定一條線','固定位置不印','有一條印不到','斷線','字少一截'],hint:'固定同位置優先清 Printhead、看 Platen，再確認 Printhead dot failure。',kb:'Printhead bad dots white line TPH'},
  {id:'offset',icon:'↔️',title:'列印位置跑掉／上下左右偏移',issue:'列印位置偏移',keywords:['位置跑掉','列印偏移','往上跑','往下跑','往左跑','往右跑','位置不準','印歪了','每張位置不一樣','越印越偏'],hint:'固定偏移與累積偏移是兩種問題：前者偏 Offset／Driver，後者偏尺寸／Sensor／Calibration。',kb:'位置偏移 Offset Calibration Driver'},
  {id:'tracking',icon:'📐',title:'紙張越走越歪／一直往單邊跑',issue:'紙張越走越偏',keywords:['紙跑掉','紙跑偏','紙一直歪','往左偏','往右偏','紙越走越偏','越走越歪','標籤歪掉','紙張偏移'],hint:'查導紙、左右壓力、Platen、軸承與傳動平行度。',kb:'紙張走偏 壓力 Platen Roller'},
  {id:'ribbon_wrinkle',icon:'🎗️',title:'碳帶皺掉／一直皺／破碳',issue:'碳帶皺褶／破碳',keywords:['碳帶皺','皺碳帶','碳帶一直皺','破碳','碳帶破掉','碳帶斷掉','皺褶','碳帶摺到'],hint:'查碳帶路徑、熱量、左右壓力、Printhead 平行與 Platen。',kb:'Ribbon Wrinkle Darkness Pressure Platen'},
  {id:'cutter',icon:'✂️',title:'切刀不切／切刀沒反應／一直卡刀',issue:'切刀不切／卡刀',keywords:['切刀沒反應','切刀不動','切刀不切','不會切','卡刀','cutter error','cutter jam','切不斷','切刀卡住'],hint:'先分成「設定沒下 Cut」、「完全不動」和「會動但卡住」，故障方向不同。',kb:'Cutter Motor Home Sensor Full Cut Partial Cut'},
  {id:'usb',icon:'🔗',title:'USB 插了沒反應／電腦辨識不到',issue:'USB 無法辨識／USB 列印失敗',keywords:['usb沒反應','usb 沒反應','usb找不到','usb 找不到','usb無法辨識','unknown device','插電腦沒反應','插usb沒反應'],hint:'先換線、換 Port、看裝置管理員，再交叉另一台電腦。',kb:'USB Driver Unknown Device'},
  {id:'lan',icon:'🌐',title:'網路印不到／IP 找不到／一下通一下不通',issue:'網路列印斷線／IP 找不到',keywords:['ip找不到','找不到ip','網路印不到','網路斷線','ping不到','連不到ip','ip不見','網路沒反應','網路印表機找不到','一下可以一下不行'],hint:'先印 Network Config，依 Link → IP → Ping → Windows Port 的順序切問題。',kb:'Network IP Ping Standard TCP/IP Port'},
  {id:'jam',icon:'🧻',title:'卡紙／出紙不順／標籤黏住',issue:'標籤黏住／殘膠／出紙不順',keywords:['卡紙','紙卡住','出紙不順','標籤黏住','黏紙','殘膠','紙出不來','卡標籤'],hint:'先斷電清走紙路徑、Platen、Peel/Cutter 區域，並看是否耗材滲膠。',kb:'卡紙 殘膠 Platen Peel Cutter'},
  {id:'noise',icon:'⚙️',title:'機器有異音／齒輪聲／走紙抖動',issue:'異音／齒輪聲／走紙抖動',keywords:['有怪聲','異音','齒輪聲','喀喀聲','卡卡聲','很大聲','馬達聲','走紙抖','震動','怪聲音'],hint:'空機與有負載分開測，再查耗材阻力、Platen、齒輪、皮帶與馬達。',kb:'異音 齒輪 皮帶 馬達 Platen'},
  {id:'panel',icon:'🧠',title:'面板有亮但卡住／按鍵沒有反應',issue:'開機卡住／面板異常',keywords:['面板沒反應','螢幕卡住','開機卡住','卡在開機','按鍵不能按','觸控沒反應','一直停在logo','logo不動'],hint:'先隔離外接裝置與耗材，再看韌體、面板線、供電與 Main Logic Board。',kb:'Panel Boot Firmware Main Logic Board'},
  {id:'heat',icon:'🌡️',title:'印一陣子就停／印字頭過熱',issue:'印字頭過熱／列印一段時間就暫停',keywords:['印一半停','印一下就停','印一陣子停','過熱','印字頭過熱','很燙','列印頭很熱','印久會停'],hint:'降低 Darkness／速度負載，確認通風，再看 Printhead 溫度感測與主板控制。',kb:'Printhead Over Temperature Darkness'},
  {id:'peel',icon:'🔄',title:'剝紙／回捲不動／剝一張就停',issue:'剝紙／回捲異常',keywords:['剝紙不動','剝標不動','回捲不動','回收不動','剝一張就停','peel不動','rewind不動','底紙不回收'],hint:'查 Print Mode、Peel Sensor、底紙路徑、Rewinder／Clutch 與接頭。',kb:'Peel Rewind Sensor'},
];

function phraseNorm(s){return String(s||'').toLowerCase().replace(/[，。！？、,!?;；:\s]/g,'')}
function detectPhraseModel(text){
  const n=phraseNorm(text);
  if(typeof PRODUCTS==='undefined')return null;
  return PRODUCTS.filter(p=>n.includes(phraseNorm(p.m))).sort((a,b)=>b.m.length-a.m.length)[0]||null;
}
function phraseRuleScore(rule,q){
  const n=phraseNorm(q); if(!n)return 0;
  let score=0;
  for(const kw of rule.keywords){const k=phraseNorm(kw);if(!k)continue;if(n===k)score=Math.max(score,120+k.length);else if(n.includes(k))score=Math.max(score,70+k.length*2);else if(k.includes(n)&&n.length>=2)score=Math.max(score,35+n.length)}
  // 核心字補強，避免客戶只打一兩個關鍵詞完全找不到
  const title=phraseNorm(rule.title+' '+rule.issue+' '+rule.kb);
  if(title.includes(n)&&n.length>=2)score=Math.max(score,28+n.length);
  return score;
}
function phraseResults(q){
  const n=phraseNorm(q),model=detectPhraseModel(q);
  const cleaned=model?n.replace(phraseNorm(model.m),''):n;
  let list=CUSTOMER_PHRASE_RULES.map(r=>({r,score:phraseRuleScore(r,cleaned||n)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  // 「沒反應」非常模糊：刻意提供數個最常見分流，不直接替工程師猜死。
  if(/沒反應|無反應/.test(n)&&list.length<4){
    for(const id of ['power','print','feed','cutter','panel']){const r=CUSTOMER_PHRASE_RULES.find(x=>x.id===id);if(r&&!list.some(x=>x.r.id===id))list.push({r,score:22})}
  }
  return {model,list:list.slice(0,6)};
}
function phraseModelBadge(p){return p?`<div class="phrase-model">已辨識型號：<b>${esc(p.m)}</b> · ${esc(p.b)} <button type="button" data-phrase-model="${esc(p.m)}">套用型號</button></div>`:''}
function renderPhraseSearch(q=''){
  const box=$('customerPhraseResults');if(!box)return;
  const text=q.trim();if(!text){box.innerHTML='';return}
  const {model,list}=phraseResults(text);
  if(!list.length){box.innerHTML=`${phraseModelBadge(model)}<div class="phrase-none"><b>目前沒有直接命中的口語症狀。</b><span>可以換短一點的說法，例如「不走紙」、「沒碳帶」、「切刀不動」、「印很淡」；也可以直接查維修資料庫。</span><button type="button" data-phrase-kb="${esc(text)}">🔎 用這句搜尋維修資料庫</button></div>`;bindPhraseButtons(box,model);return}
  box.innerHTML=`${phraseModelBadge(model)}<div class="phrase-result-head"><b>最可能是在說：</b><span>點最符合現場狀況的項目，不確定就先看前幾個分流。</span></div><div class="phrase-result-grid">${list.map(({r},i)=>`<div class="phrase-result ${i===0?'best':''}"><div class="phrase-rank">${i===0?'最可能':'可能'}</div><div class="phrase-title"><span>${r.icon}</span><b>${esc(r.title)}</b></div><p>${esc(r.hint)}</p><div class="phrase-actions">${r.issue&&typeof GENERIC!=='undefined'&&GENERIC[r.issue]?`<button class="btn primary" type="button" data-phrase-run="${esc(r.id)}">開始排查</button>`:''}<button class="btn ghost" type="button" data-phrase-kb="${esc((model?model.m+' ':'')+r.kb)}">查維修資料</button></div></div>`).join('')}</div>`;
  bindPhraseButtons(box,model);
}
function bindPhraseButtons(box,model){
  box.querySelectorAll('[data-phrase-model]').forEach(b=>b.onclick=()=>{const p=PRODUCTS.find(x=>x.m===b.dataset.phraseModel);if(p){selectProduct(p);toast(`已套用 ${p.m}`)}});
  box.querySelectorAll('[data-phrase-run]').forEach(b=>b.onclick=()=>runPhraseRule(b.dataset.phraseRun,model?.m||''));
  box.querySelectorAll('[data-phrase-kb]').forEach(b=>b.onclick=()=>openPhraseKB(b.dataset.phraseKb));
}
function runPhraseRule(id,modelName=''){
  const r=CUSTOMER_PHRASE_RULES.find(x=>x.id===id);if(!r)return;
  let p=modelName?PRODUCTS.find(x=>x.m===modelName):null;
  if(p)selectProduct(p);
  if(r.issue&&typeof quickStartIssue==='function'){quickStartIssue(r.issue);return}
  openPhraseKB((p?p.m+' ':'')+r.kb);
}
function openPhraseKB(q){
  const tab=[...document.querySelectorAll('.tabs .tab')].find(x=>x.textContent.includes('維修資料庫'));
  if(typeof showTab==='function')showTab('kb',tab);
  if(typeof renderKB==='function')renderKB({q:q});
  $('work')?.scrollIntoView({behavior:'smooth',block:'start'});
}
window.runPhraseRule=runPhraseRule;window.openPhraseKB=openPhraseKB;

function injectCustomerPhraseSearch(){
  const first=document.querySelector('main .card');if(!first||$('customerPhraseSearch'))return;
  const h=first.querySelector('h2');if(!h)return;
  const wrap=document.createElement('div');wrap.className='phrase-search';
  wrap.innerHTML=`<div class="phrase-label"><div><b>💬 客戶描述快速查</b><span>客戶怎麼說，你就怎麼打</span></div><small>可連型號一起輸入，例如：ZT610 明明有碳帶卻一直 Ribbon Out</small></div><div class="phrase-input-row"><input id="customerPhraseSearch" autocomplete="off" placeholder="例如：完全沒反應、一直吐紙、切刀不會動、印出來很淡…"><button type="button" id="customerPhraseBtn">快速判斷</button></div><div class="phrase-examples"><span>快速範例：</span>${['完全沒反應','按列印沒反應','明明有紙卻說沒紙','一直吐紙','切刀不動','印很淡'].map(x=>`<button type="button" data-phrase-example="${x}">${x}</button>`).join('')}</div><div id="customerPhraseResults"></div>`;
  h.insertAdjacentElement('afterend',wrap);
  const input=$('customerPhraseSearch');
  const go=()=>renderPhraseSearch(input.value);
  $('customerPhraseBtn').onclick=go;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  input.addEventListener('input',()=>{if(input.value.trim().length>=2)renderPhraseSearch(input.value);else $('customerPhraseResults').innerHTML='' });
  wrap.querySelectorAll('[data-phrase-example]').forEach(b=>b.onclick=()=>{input.value=b.dataset.phraseExample;renderPhraseSearch(input.value)});
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(injectCustomerPhraseSearch,50));
;

/* ===== SOURCE: fuzzy-phrase-search.js ===== */
'use strict';

// v3.3 patch: 客戶描述快速查支援「型號只打一部分」＋更白話的說法。
// 例：220X -> 220Xi4、ZT61 -> ZT610、TH24 -> TH240、P4 65 -> P4-650。

function fuzzyModelNorm(s){
  return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
}

function fuzzyModelHit(text){
  if(typeof PRODUCTS==='undefined') return {model:null,token:''};
  const raw=String(text||'').toLowerCase();
  const chunks=raw.match(/[a-z0-9]+/g)||[];
  const candidates=[];
  const add=v=>{v=fuzzyModelNorm(v);if(v.length>=3&&!candidates.includes(v))candidates.push(v)};

  chunks.forEach(add);
  for(let i=0;i<chunks.length-1;i++) add(chunks[i]+chunks[i+1]);
  for(let i=0;i<chunks.length-2;i++) add(chunks[i]+chunks[i+1]+chunks[i+2]);

  let best=null;
  for(const p of PRODUCTS){
    const m=fuzzyModelNorm(p.m);
    let score=0,token='';
    for(const c of candidates){
      let s=0;
      if(c===m) s=1000+c.length;
      else if(m.startsWith(c)) s=700+c.length*8;
      else if(m.includes(c)) s=430+c.length*5;
      else if(c.startsWith(m)) s=350+m.length*4;
      if(s>score){score=s;token=c}
    }
    if(score && (!best || score>best.score || (score===best.score && m.length<best.norm.length))){
      best={model:p,score,token,norm:m};
    }
  }
  return best?{model:best.model,token:best.token}:{model:null,token:''};
}

// 覆寫舊版「一定要輸入完整型號」的辨識方式。
detectPhraseModel=function(text){
  return fuzzyModelHit(text).model;
};

// 讓部分型號字串不會干擾後面的症狀判讀。
phraseResults=function(q){
  const n=phraseNorm(q),hit=fuzzyModelHit(q),model=hit.model;
  let cleaned=n;
  if(hit.token) cleaned=cleaned.replace(hit.token,'');
  if(model) cleaned=cleaned.replace(phraseNorm(model.m),'');

  let list=CUSTOMER_PHRASE_RULES
    .map(r=>({r,score:phraseRuleScore(r,cleaned||n)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score);

  if(/沒反應|無反應|沒動作|不會動|沒動靜/.test(cleaned||n) && list.length<4){
    for(const id of ['power','print','feed','cutter','panel']){
      const r=CUSTOMER_PHRASE_RULES.find(x=>x.id===id);
      if(r&&!list.some(x=>x.r.id===id)) list.push({r,score:22});
    }
  }
  return {model,list:list.slice(0,6)};
};

// 擴充工程現場常見白話說法。
const FUZZY_PHRASE_ALIASES={
  power:['整台沒動靜','完全沒動靜','按開關沒反應','按電源都沒動','開不起來','機器開不起來','整台死掉','完全不會亮'],
  print:['按了不印','按列印沒動作','電腦有送但沒印','傳過去沒印','送過去沒反應','機器有亮但不印','按列印機器沒動','電腦按了機器不動'],
  feed:['按feed不會動','按feed不會跑','按出紙沒反應','按出紙不會動','按走紙沒動作','紙完全不動','馬達沒動','按鍵有按但不走紙'],
  paperout:['有裝紙還顯示沒紙','紙明明還有','紙還有卻報錯','裝了紙還是紅燈','一直偵測不到標籤'],
  ribbonout:['碳帶明明還有','碳帶還有卻報錯','裝了碳帶還是報錯','有碳帶還一直紅燈','碳帶偵測不到'],
  calibration:['一直送紙','紙一直跑出來','一按就一直出紙','標籤一直跳','抓不到標籤間隙','每次都多跑好幾張'],
  light:['印出來很淺','顏色很淺','印不深','條碼很淡','印出來掃不太到','字糊糊的','印出來不漂亮'],
  blank:['有出紙可是沒印','紙會跑但沒字','印出來白白的','完全印不到東西','只有走紙沒有印'],
  white_line:['固定少一條','每張都同一個地方沒印','一直有白白一條','條碼固定缺一條','某一區都印不到'],
  offset:['位置一直跑','印的位置不對','每張越跑越遠','標籤位置跑掉','內容越印越歪'],
  tracking:['紙一直跑一邊','紙都往一邊走','標籤越跑越歪','走紙會斜掉','紙一直吃單邊'],
  ribbon_wrinkle:['碳帶一直皺掉','碳帶會皺','碳帶一直裂','碳帶一直斷','印一印碳帶就破'],
  cutter:['刀不會動','刀沒有動作','切刀完全沒動','有切但切不斷','切一半卡住','每次都卡刀'],
  usb:['插usb完全沒反應','插上去電腦沒看到','電腦抓不到usb','換usb孔也沒反應'],
  lan:['網路找不到機器','電腦ping不到','ip一直變','突然網路印不到','昨天可以今天不行'],
  jam:['紙卡在裡面','標籤黏在滾輪','紙拉不出來','標籤一直黏住','出紙卡卡的'],
  noise:['機器一直叫','裡面有卡卡聲','轉的時候很吵','走紙聲音怪怪的','馬達一直叫'],
  panel:['畫面有亮但不能按','面板亮著沒反應','按什麼都沒用','停在logo','開機一直卡畫面'],
  heat:['印沒多久就停','印幾張就停','印一陣子休息一下又可以','機器很熱就不印'],
  peel:['剝標不會回收','底紙不會捲','回捲軸不動','剝一張後就卡住']
};
for(const [id,words] of Object.entries(FUZZY_PHRASE_ALIASES)){
  const rule=CUSTOMER_PHRASE_RULES.find(r=>r.id===id);
  if(rule) for(const w of words) if(!rule.keywords.includes(w)) rule.keywords.push(w);
}

function fuzzyPhraseUiHint(){
  const wrap=document.querySelector('.phrase-search');
  if(!wrap)return;
  const small=wrap.querySelector('.phrase-label small');
  if(small) small.textContent='型號不用打完整：220X、ZT61、TH24、P4 65 都可以；後面直接接客戶白話描述';
  const input=document.getElementById('customerPhraseSearch');
  if(input) input.placeholder='例如：220X 紙一直偏、ZT61 碳帶還有卻報錯、TH24 切刀不動…';
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(fuzzyPhraseUiHint,100));
;

/* ===== SOURCE: deep-phrase-rules.js ===== */
'use strict';

// 深度維修白話入口：讓客戶原話可直接命中新增加的硬體/間歇故障主題。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'restart_loop',icon:'🔁',title:'印一印自己重開／反覆重新開機',issue:'使用中突然重開／反覆重啟',keywords:['印一印自己重開','印到一半重開','一直重新開機','反覆重啟','自己關機又開機','用一陣子就重開','突然斷電又開','一直重開機'],hint:'先分整機掉電、PSU 負載、過熱、外接模組與韌體／主板，不直接判主板。',kb:'突然重開 反覆重啟 PSU 過熱 主板'},
    {id:'head_open_false',icon:'🔓',title:'蓋子關好了還顯示 Head Open',issue:'Head Open 誤報／上蓋感應異常',keywords:['蓋子關了還說沒關','上蓋關好還報錯','head open','一直顯示上蓋開啟','壓住蓋子才正常','蓋子晃一下就報錯','印字頭關了還說開'],hint:'先查卡榫是否扣到底，再看 Head Open Sensor／磁鐵／微動開關與線束。',kb:'Head Open Sensor 上蓋 卡榫 線束'},
    {id:'drift_accumulate',icon:'📉',title:'第一張正常，後面越印越偏',issue:'累積漂移／越印越偏',keywords:['第一張正常後面越來越偏','越印越往上','越印越往下','每張越跑越遠','印越多偏越多','位置慢慢跑掉','累積偏移'],hint:'累積漂移優先查 Label Length、Calibration、Sensor 與 Platen 打滑；固定偏才先查 Offset。',kb:'累積漂移 Label Length Calibration Platen'},
    {id:'blackmark_fail',icon:'⬛',title:'黑標抓不到／黑線有印但一直跑紙',issue:'Black Mark 偵測異常',keywords:['黑標抓不到','黑線抓不到','有黑標還一直跑','黑標紙一直跳標','反射感應抓不到','black mark抓不到','黑線有印但不停'],hint:'確認 Reflective Sensor、黑標面向與實際感應位置，再做黑標校正。',kb:'Black Mark Reflective Sensor 黑標 校正'},
    {id:'ribbon_rewind',icon:'🧵',title:'碳帶回收軸不轉／廢碳帶不會捲',issue:'碳帶回捲／Clutch 異常',keywords:['碳帶回收軸不轉','廢碳帶不會捲','碳帶不回收','回收碳帶鬆掉','碳帶後面不會收','ribbon rewind不動','回收軸空轉'],hint:'先確認穿帶，再分 Gear／Clutch／單向軸承與驅動。',kb:'碳帶回收 Rewind Clutch Gear'},
    {id:'settings_lost',icon:'💾',title:'設定存不住／關機再開又變回去',issue:'設定重開後恢復／NVRAM',keywords:['設定存不住','關機後設定不見','重開又變回去','參數自己跑掉','改完又恢復','設定會自己改','每次開機都要重設'],hint:'先做不接電腦的單機保存測試，再分 Driver 覆蓋、Save/Apply、NVRAM/Flash。',kb:'設定存不住 NVRAM Driver 覆蓋 Flash'},
    {id:'sensor_stuck',icon:'📟',title:'Sensor 數值一直固定／遮住也不變',issue:'Sensor 讀值固定／線束／主板輸入',keywords:['sensor數值不變','感應器數值固定','遮住感應器也不變','拿紙擋住也一樣','讀值卡住','sensor卡死','感應器一直同一個數字'],hint:'先確認看的是正確通道，再做遮擋測試、線束與 Sensor 交叉；不要套用其他機器的正常值。',kb:'Sensor 數值固定 線束 主板輸入'},
    {id:'motor_stall',icon:'⚙️',title:'馬達會抖但轉不動／走兩步就停',issue:'Motor Stall／機構卡滯',keywords:['馬達會抖但不轉','馬達抖一下','走兩步就停','紙只動一下','馬達卡住','motor stall','有馬達聲但轉不動'],hint:'先斷電查機構阻力與負載，再查 Motor／線束／Driver。',kb:'Motor Stall 馬達 Gear Platen Driver'},
    {id:'cut_position',icon:'📍',title:'切刀切到字／撕紙線位置固定偏掉',issue:'Cut / Tear-off / Backfeed Offset',keywords:['切刀切到字','切的位置不對','每張都切太前面','每張都切太後面','撕紙位置不對','停紙位置不對','backfeed不對','tear off偏'],hint:'固定偏差先確認 Label Length 與 Calibration，再調 Cut/Tear-off/Backfeed Offset。',kb:'Cut Position Tear-off Backfeed Offset'},
    {id:'platen_slip',icon:'🛞',title:'滾輪打滑／紙會走但長度每次不一樣',issue:'Platen 打滑／老化／殘膠',keywords:['滾輪打滑','platen打滑','紙走的長度不一樣','滾輪很滑','滾輪硬掉','滾輪有殘膠','紙有走但距離不準'],hint:'查 Platen 表面硬化、凹痕、殘膠、壓力與導紙，修復後重新驗證定位。',kb:'Platen 打滑 殘膠 走紙長度'}
  );
}
;

/* ===== SOURCE: error-code-phrase-rules.js ===== */
'use strict';

// 錯誤碼／面板訊息口語搜尋補強。
(function(){
  if(typeof CUSTOMER_PHRASE_RULES==='undefined')return;
  const extra=[
    {id:'sato1007',icon:'🔓',title:'SATO 1007 Head Open',issue:'Head Open／印字頭開啟',keywords:['1007','sato 1007','head open 1007','印字頭開啟1007'],hint:'CL4NX Plus 先確認 Head Lock，再查 Head Open Sensor/觸發機構。',kb:'1007 Head Open Sensor'},
    {id:'sato1008',icon:'📄',title:'SATO 1008 Out of Paper',issue:'Out of Paper／有紙卻報缺紙',keywords:['1008','sato 1008','out of paper 1008','缺紙1008'],hint:'先確認紙材、Media Sensor Level、Jam 與 Calibration。',kb:'1008 Out of Paper Media Sensor'},
    {id:'sato1009',icon:'🎞️',title:'SATO 1009 Ribbon End',issue:'Ribbon End／碳帶未用完卻報錯',keywords:['1009','sato 1009','ribbon end 1009','碳帶1009'],hint:'先查 Ribbon 路徑、Supply/Take-up 軸與 Ribbon Sensor。',kb:'1009 Ribbon End Sensor'},
    {id:'sato1010',icon:'📏',title:'SATO 1010 Media Error',issue:'Media Error／校正定位異常',keywords:['1010','sato 1010','media error 1010'],hint:'先確認 Gap/I-Mark Sensor Type、位置與 Calibration。',kb:'1010 Media Error Calibration'},
    {id:'sato1012',icon:'🖨️',title:'SATO 1012 Head Error',issue:'Head Error／Printhead 壞點',keywords:['1012','sato 1012','head error 1012','印字頭1012'],hint:'固定壞點清潔後仍存在，Printhead 方向高。',kb:'1012 Head Error Printhead'},
    {id:'sato1013',icon:'💾',title:'SATO 1013 USB R/W Error',issue:'USB R/W Error',keywords:['1013','sato 1013','usb r/w error','usb rw error'],hint:'先換正常 USB 儲存裝置交叉，再查 Printer USB Host。',kb:'1013 USB R/W Error'},
    {id:'sato1014',icon:'💾',title:'SATO 1014 USB Memory Full',issue:'USB Memory Full',keywords:['1014','sato 1014','usb memory full'],hint:'先確認 USB 儲存空間與檔案，再判 Printer。',kb:'1014 USB Memory Full'},
    {id:'sato1015',icon:'✂️',title:'SATO 1015 Cutter Error',issue:'Cutter Error／刀片未回位',keywords:['1015','sato 1015','cutter error 1015','切刀1015'],hint:'先斷電清 Jam，再依官方方式讓 Cutter 回 Home。',kb:'1015 Cutter Error'},
    {id:'sato1016',icon:'✂️',title:'SATO 1016 Cutter Cover Open',issue:'Cutter Cover Open',keywords:['1016','sato 1016','cutter cover open'],hint:'先確認 Cutter Cover 卡榫與 Cover Sensor。',kb:'1016 Cutter Cover Open'},
    {id:'sato1017',icon:'⌨️',title:'SATO 1017 SBPL Command Error',issue:'SBPL Command Error',keywords:['1017','sato 1017','sbpl command error'],hint:'若只有特定工作出錯，優先查 SBPL 資料/Driver/Emulation。',kb:'1017 SBPL Command Error'},
    {id:'zebra_headopen_alert',icon:'🔓',title:'Zebra PRINTHEAD OPEN',issue:'Printhead Open／Head Open',keywords:['printhead open','head open zebra','zebra head open','印字頭開啟'],hint:'關到底仍報錯時查 Head Open Sensor、觸發片與線束。',kb:'ZT610 ZT620 PRINTHEAD OPEN'},
    {id:'zebra_mediaout_alert',icon:'📄',title:'Zebra MEDIA OUT',issue:'Media Out／紙張用盡',keywords:['media out','zebra media out','紙張用盡 media out'],hint:'先查 Media Type、Sensor 位置與 Calibration。',kb:'ZT610 ZT620 MEDIA OUT'},
    {id:'zebra_ribbonin_alert',icon:'🎞️',title:'Zebra RIBBON IN',issue:'Ribbon In／熱感模式偵測到碳帶',keywords:['ribbon in','zebra ribbon in','direct thermal ribbon'],hint:'先確認 Direct Thermal / Thermal Transfer 與實際耗材。',kb:'ZT610 ZT620 RIBBON IN'},
    {id:'zebra_headtemp_alert',icon:'🌡️',title:'Zebra Head Temperature Alert',issue:'Printhead Over/Under Temperature',keywords:['head over temp','printhead over temp','head under temp','printhead under temp','頭過熱','印字頭低溫'],hint:'真過熱先降溫；高低溫訊息反覆切換要查 Head Cable/Thermistor。',kb:'ZT610 ZT620 printhead temperature'},
    {id:'tsc_take_label_alert',icon:'🏷️',title:'TSC Take Label',issue:'Take Label／剝紙後不續印',keywords:['take label','tsc take label','取標後不印','剝紙後不續印'],hint:'先確認 Peel Mode，再查 Peel Sensor 與模組接頭。',kb:'TSC Take Label Peel Sensor'}
  ];
  const ids=new Set(CUSTOMER_PHRASE_RULES.map(x=>x.id));
  extra.forEach(x=>{if(!ids.has(x.id))CUSTOMER_PHRASE_RULES.push(x)});
})();
;

/* ===== SOURCE: parts-phrase-rules.js ===== */
'use strict';

// 零件／換件白話入口：讓工程師可直接用現場口語找「要不要換哪個零件」。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'part_head_replace',icon:'🧩',title:'印字頭是不是壞了／要不要換 Printhead',issue:'Printhead 換件判斷',keywords:['印字頭是不是壞了','印字頭要不要換','printhead要換嗎','印字頭壞掉','換印字頭','固定白線換頭','印字頭缺點'],hint:'先用固定測試圖、清潔、Head Cable 與交叉測試確認，不要因為印淡就直接換頭。',kb:'Printhead 換件判斷 Head Cable 固定白線'},
    {id:'part_platen_replace',icon:'🛞',title:'滾輪硬掉／凹掉／要不要換 Platen',issue:'Platen 換件判斷',keywords:['滾輪硬掉','滾輪凹掉','滾輪裂掉','platen要換','滾輪要不要換','滾輪磨損','滾輪老化','滾輪沒摩擦力'],hint:'先清潔、看偏磨/凹痕/硬化，再用連續列印確認是否真的造成打滑或局部淡。',kb:'Platen 換件判斷 打滑 硬化 凹痕'},
    {id:'part_sensor_replace',icon:'📟',title:'Sensor 是不是壞了／感應器要不要換',issue:'Sensor 換件判斷',keywords:['感應器是不是壞了','sensor是不是壞了','感應器要不要換','sensor要換嗎','換感應器','感應器完全沒變化','感應器死掉'],hint:'先確認位置、清潔、Calibration 與讀值變化；線束正常且交叉支持才換 Sensor。',kb:'Sensor 換件判斷 線束 讀值固定 Calibration'},
    {id:'part_cutter_replace',icon:'✂️',title:'切刀是不是壞了／要不要換 Cutter',issue:'Cutter 換件判斷',keywords:['切刀是不是壞了','切刀要不要換','cutter要換嗎','換切刀','切刀模組壞了','切刀馬達壞','切刀home sensor'],hint:'先分設定、卡滯、Motor、Home Sensor 與整組 Cutter Assy，不要直接整組更換。',kb:'Cutter 換件判斷 Home Sensor Motor Assy'},
    {id:'part_motor_replace',icon:'⚙️',title:'馬達是不是壞了／有聲音但紙不走',issue:'Motor / Gear 換件判斷',keywords:['馬達是不是壞了','馬達要不要換','motor要換嗎','有馬達聲紙不走','馬達轉齒輪不轉','齒輪裂掉','皮帶鬆掉','換馬達'],hint:'有馬達聲先查 Gear/Belt/Clutch/Platen；完全不動才往 Motor/Driver 深入。',kb:'Drive Motor Gear Belt 換件判斷'},
    {id:'part_psu_replace',icon:'🔌',title:'電源板是不是壞了／PSU 要不要換',issue:'PSU 換件判斷',keywords:['電源板是不是壞了','psu是不是壞了','電源供應器要換嗎','換psu','電源板沒輸出','接負載掉壓','一開機就掉電'],hint:'先確認 AC、PSU 正確測點與外接負載；空載正常、接某模組掉壓時先查負載。',kb:'PSU 換件判斷 掉壓 負載 Mainboard'},
    {id:'part_mainboard_replace',icon:'🧠',title:'主板是不是壞了／Mainboard 要不要換',issue:'Mainboard 換件判斷',keywords:['主板是不是壞了','主機板是不是壞了','mainboard要換嗎','換主板','主板壞了嗎','logic board壞','電源正常但不開機'],hint:'主板放最後：PSU、負載、線束、Sensor/Motor 與面板支路都排除後再判。',kb:'Mainboard 換件判斷 PSU 負載 Logic Board'},
    {id:'part_cable',icon:'🔗',title:'線束／接頭鬆掉／退 Pin／接觸不良',issue:'Cable / Connector / Harness',keywords:['線束壞掉','接頭鬆掉','退pin','線斷掉','接觸不良','晃線就正常','插頭氧化','接頭歪掉'],hint:'斷電檢查端子退 Pin、折傷、氧化與拉扯痕；不要只看外皮完整就判線束正常。',kb:'線束 Connector Harness 退 Pin 接觸不良'},
    {id:'part_order_number',icon:'🏷️',title:'零件料號怎麼確認／怕買錯版本',issue:'Parts number / 料號核對',keywords:['料號怎麼看','零件料號','怕買錯零件','零件版本','part number','parts number','印字頭料號','滾輪料號','切刀料號'],hint:'料號要依完整型號、序號、DPI、寬度、選配與硬體 revision 核對，不只看系列名稱。',kb:'料號 序號 DPI Parts List 選配 版本'}
  );
}
;

/* ===== SOURCE: hardware-phrase-rules.js ===== */
'use strict';

// 硬體層白話搜尋：把現場口語直接導向線束、Clutch、Interface、Firmware/NVRAM 與 PSU 負載排查。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'wire_intermit',icon:'🪢',title:'碰到線就好／晃一下又壞',issue:'線束／接頭間歇故障',keywords:['碰到線就好','晃一下又壞','晃線會好','壓著線就正常','開蓋就壞','蓋子動一下就報錯','線動一下就恢復','接頭鬆鬆的'],hint:'優先做退 Pin、折傷、夾傷、氧化與晃線導通測試，不要直接換 Sensor 或主板。',kb:'線束 接頭 退Pin 間歇故障'},
    {id:'rewind_slip',icon:'🧵',title:'碳帶回收很鬆／空軸會轉、上碳帶就不轉',issue:'Ribbon Rewind／Clutch 打滑',keywords:['碳帶回收很鬆','回收軸沒力','空軸會轉上碳帶不轉','回收軸打滑','碳帶越印越鬆','碳帶回捲沒力','clutch打滑'],hint:'先分穿帶、Clutch、Gear/Belt 與驅動，不把回收問題誤判成 Ribbon Sensor。',kb:'Ribbon Rewind Clutch Spindle Gear'},
    {id:'usb_loose',icon:'🔌',title:'USB 要喬角度才有反應／插座鬆',issue:'USB Interface／Connector 機械故障',keywords:['usb要喬角度','usb插座鬆','usb碰一下就斷','usb插著會斷線','插頭要壓著才有反應','usb孔鬆掉'],hint:'跨線材/電腦測試後若仍跟插座角度有關，查 Connector、焊點與 Interface，不先重裝 Driver。',kb:'USB Interface Connector 焊點'},
    {id:'lan_no_link',icon:'🌐',title:'網路孔完全沒燈／Link 不亮',issue:'LAN Interface／PHY／Connector',keywords:['網路孔沒燈','lan燈不亮','link不亮','插網路線完全沒反應','網路燈都不亮','換網路線還是沒燈'],hint:'先換線與 Switch Port，再查 RJ45、Interface/NIC 與供電；Link 都沒有和 IP 設定不同。',kb:'LAN Link RJ45 Interface NIC PHY'},
    {id:'firmware_boot',icon:'💿',title:'更新後開不了／卡 Logo／一直重開',issue:'Firmware／Recovery／Boot',keywords:['更新後開不了','更新韌體後卡住','更新後一直重開','卡logo進不去','firmware更新失敗','韌體刷壞','更新一半斷電'],hint:'不要反覆亂刷，先依該機原廠 Recovery 流程與版本要求處理。',kb:'Firmware Recovery Boot NVRAM'},
    {id:'nvram_lost',icon:'💾',title:'關機再開設定全部跑掉',issue:'NVRAM／Flash／外部覆蓋',keywords:['關機再開設定全跑掉','每次開機都恢復預設','ip每次重開都變','darkness重開就變','設定保存不了','設定不記憶'],hint:'先拔掉 USB/LAN 做單機 Save 測試，切開 Driver 覆蓋與 NVRAM/Flash。',kb:'NVRAM Flash 設定保存 Driver 覆蓋'},
    {id:'bearing_noise',icon:'🛞',title:'轉一圈固定某個位置卡／喀一聲',issue:'Bearing／Bushing／軸偏心',keywords:['轉一圈固定會卡','每轉一圈喀一聲','滾輪轉一圈有卡點','軸承有間隙','軸會晃','轉到某個角度很緊','齒輪每圈叫一次'],hint:'斷電卸載後手轉整圈，查軸承、軸套、偏心、齒輪嚙合與軸向間隙。',kb:'Bearing Bushing 軸承 軸套 偏心'},
    {id:'headopen_press',icon:'🔒',title:'要壓住上蓋才不報 Head Open',issue:'Head Open Sensor／Latch 對位',keywords:['要壓住蓋子才正常','壓上蓋就不報錯','壓著印字頭才ready','蓋子關了要用力壓','head open壓住就好'],hint:'這種症狀先看 Latch、觸發片/磁鐵、Sensor 距離與線束。',kb:'Head Open Sensor Latch 磁鐵 微動開關'},
    {id:'peel_wait',icon:'🏷️',title:'剝一張就停／拿走標籤還是不繼續',issue:'Peel／Label Taken Sensor',keywords:['剝一張就停','拿走標籤還是不印','取標後不繼續','peel一張就停','label taken沒反應','剝紙模式卡住'],hint:'先確認普通模式正常，再查 Label Taken Sensor、底紙路徑與 Rewinder。',kb:'Peel Label Taken Sensor Rewinder'},
    {id:'psu_load',icon:'⚡',title:'待機正常，一列印／切刀就重開',issue:'PSU 負載掉壓／過載',keywords:['待機正常一列印就重開','切刀一動就重開','馬達一動就重開','開始印就斷電','一加速就重開','列印加熱就重啟'],hint:'這種不是只量待機電壓；要做負載隔離、PSU/接頭與選配模組測試。',kb:'PSU 負載 掉壓 過載 重啟'},
    {id:'option_board',icon:'🧩',title:'裝上切刀／剝紙／介面板就不正常',issue:'Option Board／外接模組隔離',keywords:['裝上切刀就壞','接上剝紙就重開','裝介面卡後不能開機','拔掉選配就正常','接上模組就掉電','裝配件後開始異常'],hint:'斷電隔離選配板/模組，確認是否拉低供電或造成通訊衝突。',kb:'Option Board Cutter Peeler Interface 負載隔離'},
    {id:'connector_burn',icon:'🔥',title:'接頭焦黑／塑膠變色／有燒焦味',issue:'Connector 過熱／接觸電阻／供電',keywords:['接頭焦黑','插頭燒黑','塑膠變黃','有燒焦味','接頭很燙','端子燒掉','插座融掉'],hint:'先斷電，不只換接頭；還要查負載過流、端子鬆動與相鄰線材，避免再次燒毀。',kb:'Connector 過熱 接觸電阻 PSU 線束'}
  );
}
;

/* ===== SOURCE: workflow-phrase-rules.js ===== */
'use strict';

if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'pm_schedule',icon:'🧹',title:'這台多久要保養／PM 怎麼排',issue:'預防保養週期建立',keywords:['多久要保養','保養週期','多久清一次','pm多久一次','預防保養','定期保養','要多久保養一次'],hint:'依原廠建議、列印量、紙塵/膠材與現場環境建立 PM，不硬套同一個月份。',kb:'預防保養 PM 清潔 磨耗件'},
    {id:'after_repair_cal',icon:'🎯',title:'拆完要校正什麼／換頭換滾輪後怎麼測',issue:'拆裝後重新校正與定位',keywords:['拆完要校正什麼','換頭後要做什麼','換滾輪後怎麼測','換sensor後要校正嗎','拆裝後測試','維修後校正','換印字頭後校正'],hint:'Sensor、Printhead、Platen 或走紙機構拆裝後，要重新做 Calibration、定位與品質基準。',kb:'拆裝後 Calibration 定位 Printhead Platen Sensor'},
    {id:'board_replace',icon:'🧠',title:'換主板後要設定什麼／換板怎麼初始化',issue:'板件更換後初始化',keywords:['換主板後要設定什麼','換板後怎麼設定','換主板怎麼初始化','換網路板後設定','換psu後測什麼','換板後ip不見','更換主板流程'],hint:'先備份設定，再核對 DPI/選配/韌體，換板後復原網路、模式、Calibration 與完整功能。',kb:'Mainboard Interface Board 初始化 設定復原 Firmware'},
    {id:'ab_swap',icon:'🔁',title:'怎麼交叉測試／正常件怎麼比',issue:'A-B Swap 交叉測試',keywords:['怎麼交叉測試','正常件交叉','ab swap','換一顆正常的測','拿另一台來比','交叉零件','正常機互換'],hint:'一次只交換一個變因，確認故障是否跟著零件移動，並先核對相容性。',kb:'交叉測試 A-B Swap 正常件 故障跟件'},
    {id:'part_order',icon:'📦',title:'料號怎麼核對／零件怎麼下單才不會錯',issue:'零件採購料號核對',keywords:['料號怎麼核對','零件怎麼買','怎麼確認料號','下單怕買錯','印字頭料號','主板料號','cutter料號','零件相不相容'],hint:'至少收 Model、S/N、DPI、Revision、選配與舊件標籤，再查 Parts List/替代料號。',kb:'零件採購 料號 S/N DPI Revision Parts List'},
    {id:'repair_finish',icon:'✅',title:'修好後要測什麼／交機前檢查',issue:'維修完成完整驗證',keywords:['修好後要測什麼','交機前測試','維修完成檢查','完修測試','修完怎麼驗證','可以交機了嗎','結案前檢查'],hint:'不要只看原故障消失；冷開機、FEED、Self Test、客戶耗材、USB/LAN、選配與設定保存都要回歸。',kb:'完修驗證 交機 回歸測試 客戶耗材'},
    {id:'before_disassembly',icon:'📸',title:'收機先做什麼／拆機前要記錄什麼',issue:'維修前基準紀錄',keywords:['收機先做什麼','拆機前要做什麼','維修前檢查','拆之前要記錄','先拍什麼','客戶送修怎麼檢查','收機流程'],hint:'先保存錯誤畫面、設定頁、Network Config、耗材路徑、接線與可重現條件，再拆。',kb:'收機 基準 拆前照片 設定頁 故障重現'}
  );
}
;

/* ===== SOURCE: customer-phrase-clear.js ===== */
'use strict';

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    const input=document.getElementById('customerPhraseSearch');
    if(!input||document.getElementById('customerPhraseClear'))return;
    const row=input.closest('.phrase-input-row');
    if(!row)return;

    const wrap=document.createElement('div');
    wrap.className='phrase-input-wrap';
    input.parentNode.insertBefore(wrap,input);
    wrap.appendChild(input);

    const clear=document.createElement('button');
    clear.id='customerPhraseClear';
    clear.className='phrase-clear-btn';
    clear.type='button';
    clear.textContent='×';
    clear.title='清除文字';
    clear.setAttribute('aria-label','清除客戶描述');
    wrap.appendChild(clear);

    const sync=()=>{clear.hidden=!input.value.trim()};
    clear.onclick=()=>{
      input.value='';
      const result=document.getElementById('customerPhraseResults');
      if(result)result.innerHTML='';
      sync();
      input.focus();
    };
    input.addEventListener('input',sync);
    sync();
  },150);
});
;

/* ===== SOURCE: app-smoke-check.js ===== */
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
;

/* ===== SOURCE: system-health-panel.js ===== */
'use strict';

// 工程師工具內顯示本機實際載入狀態，方便確認 GitHub Desktop Pull 後是否為完整 Bundle。
(function(){
  function bundleId(){
    const src=[...document.scripts].map(s=>s.src||'').find(x=>x.includes('/dist/engineer-app.bundle.js'))||'';
    try{return new URL(src,location.href).searchParams.get('v')||'未知'}catch{return'未知'}
  }
  function render(){
    const box=document.getElementById('tab-tools');if(!box)return;
    box.querySelector('.system-health-panel')?.remove();
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    const products=typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)?PRODUCTS:[];
    const sources=window.KB_SOURCES||{};
    const health=window.KB_HEALTH||{};
    const smoke=window.APP_SMOKE||{};
    const meta=window.APP_BUILD||{};
    const evidence=health.evidenceCount||{};
    const ok=(health.errors?.length||0)===0&&smoke.ok!==false;
    const panel=document.createElement('div');panel.className='system-health-panel result '+(ok?'info':'danger');
    panel.style.marginBottom='12px';
    panel.innerHTML=`<h3>🩺 本機系統狀態｜${ok?'正常':'需要檢查'}</h3><div class="small" style="line-height:1.8"><b>版本：</b>${esc(meta.version||'未知')}｜更新 ${esc(meta.updated||'未知')}<br><b>Bundle ID：</b>${esc(bundleId())}<br><b>維修資料：</b>${kb.length} 筆｜<b>型號：</b>${products.length}｜<b>來源：</b>${Object.keys(sources).length}<br><b>資料自檢：</b>Errors ${(health.errors||[]).length}｜Warnings ${(health.warnings||[]).length}<br><b>資料等級：</b>A 原廠料號 ${evidence['A原廠料號']||0}｜B 雙來源料號 ${evidence['B雙來源料號']||0}｜內部案例 ${evidence['內部實機案例']||0}<br><b>Runtime Smoke：</b>${smoke.ok===true?'PASS':smoke.ok===false?'FAIL':'尚未完成'}</div><div class="small" style="margin-top:6px">若 Pull 後版本或筆數與預期不同，先看這裡；Asset Guard / Smoke Check 有異常時畫面上方也會直接警告。</div>`;
    box.prepend(panel);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,300),{once:true});
  const old=window.renderTools;
  if(typeof old==='function'){
    window.renderTools=function(){old();setTimeout(render,160)};
    try{renderTools=window.renderTools}catch(e){}
  }
  window.renderSystemHealth=render;
})();
;

/* ===== SOURCE: build-meta.js ===== */
'use strict';

// 顯示層只讀取 app-version.js 的 window.APP_BUILD；不得在此重複定義版本號。
document.addEventListener('DOMContentLoaded',()=>{
  const meta=window.APP_BUILD||{};
  const version=meta.version||'版本未載入';
  const updated=meta.updated||'未知時間';
  const stat=document.getElementById('headerStat');
  if(stat) stat.textContent=`${version}｜更新 ${updated}`;
  document.title=`萬里資訊｜工程師標籤機故障排查工具 ${version}｜更新 ${updated}`;
  const footer=document.querySelector('footer');
  if(footer && !footer.querySelector('.build-meta-line')){
    const line=document.createElement('div');
    line.className='build-meta-line';
    line.style.marginTop='6px';
    line.style.fontWeight='800';
    line.textContent=`版本：${version}｜最後更新：${updated}（台灣時間）`;
    footer.appendChild(line);
  }
});
;
