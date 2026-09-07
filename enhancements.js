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
  const stat=$('headerStat');if(stat)stat.textContent=`v3.1｜${typeof PRODUCTS!=='undefined'?PRODUCTS.length:0} 型號｜${typeof GENERIC!=='undefined'?Object.keys(GENERIC).length:0} 故障流程`;
  if(search){search.placeholder='例如：ZT610、110Xi4、220Xi4、TH240、P4-650';}
});
