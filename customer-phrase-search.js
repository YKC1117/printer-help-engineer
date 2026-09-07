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
