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
