'use strict';

// AnyDesk 維修情境：直接選機型、搜尋已核對指令、複製後貼到品牌工具送出。
(function(){
  const byId=id=>document.getElementById(id);
  const h=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const notify=t=>typeof toast==='function'?toast(t):alert(t);
  const RECENT_KEY='printer_engineer_recent_models';
  let activeBrand='ALL';

  const commands=[
    {brand:'Zebra',group:'校正／Sensor',title:'完整耗材／Sensor 校正',cmd:'~JC',desc:'強制量測標籤長度，重新校正 Media 與 Ribbon Sensor。',risk:'normal',save:'會更新校正值',tags:'校正 感應器 sensor ribbon media 標籤 碳帶'},
    {brand:'Zebra',group:'校正／Sensor',title:'Sensor Profile 圖',cmd:'~JG',desc:'重新校正並列印 Sensor Profile，現場判斷 Gap／Mark／Ribbon 讀值很實用。',risk:'caution',save:'會走紙並列印',tags:'sensor profile 感應器 曲線 gap mark ribbon'},
    {brand:'Zebra',group:'校正／Sensor',title:'Sensor 自動偵測',cmd:'^XA^MNA^JUS^XZ',desc:'將 Media Sensor Select 設回 Auto-Detect 並保存。',risk:'normal',save:'會保存',tags:'sensor auto 自動 感應器 media'},
    {brand:'Zebra',group:'Xi4／舊平台',title:'短校正（Power-up／Head-close）',cmd:'^XA^MFS,S^JUS^XZ',desc:'Power-up 與 Head-close 使用 Short Calibration；Xi4／S4M 等舊平台特別常用。',risk:'caution',save:'會保存；先確認機型支援',tags:'xi4 short calibration 短校正 110xi4 220xi4'},
    {brand:'Zebra',group:'校正／Sensor',title:'完整校正（Power-up／Head-close）',cmd:'^XA^MFC,C^JUS^XZ',desc:'Power-up 與 Head-close 都執行 Calibration。',risk:'normal',save:'會保存',tags:'full calibration 開機 上蓋 關頭 校正'},
    {brand:'Zebra',group:'設定保存',title:'儲存目前設定',cmd:'^XA^JUS^XZ',desc:'把目前可保存的印表機設定寫入非揮發性記憶體。',risk:'normal',save:'會保存',tags:'save 儲存 設定 jus'},
    {brand:'Zebra',group:'設定保存',title:'叫回上次已保存設定',cmd:'^XA^JUR^XZ',desc:'重新載入上次保存的設定；適合誤改參數後快速回復。',risk:'caution',save:'讀取已保存值',tags:'restore recall 回復 還原 jur'},
    {brand:'Zebra',group:'列印方式',title:'強制熱轉印',cmd:'^XA^MTT^JUS^XZ',desc:'Print Method 改為 Thermal Transfer。',risk:'normal',save:'會保存',tags:'熱轉印 thermal transfer ribbon 碳帶'},
    {brand:'Zebra',group:'列印方式',title:'強制熱感應',cmd:'^XA^MTD^JUS^XZ',desc:'Print Method 改為 Direct Thermal。',risk:'normal',save:'會保存',tags:'熱感應 direct thermal 無碳帶'},
    {brand:'Zebra',group:'出紙模式',title:'Tear-off 撕紙',cmd:'^XA^MMT^JUS^XZ',desc:'切換為 Tear-off 模式。',risk:'normal',save:'會保存',tags:'tear 撕紙 出紙 mode'},
    {brand:'Zebra',group:'出紙模式',title:'Peel-off 剝紙',cmd:'^XA^MMP^JUS^XZ',desc:'切換為 Peel-off；只在機器已安裝剝紙器時使用。',risk:'caution',save:'會保存',tags:'peel 剝紙 出紙 sensor'},
    {brand:'Zebra',group:'出紙模式',title:'Cutter 切刀',cmd:'^XA^MMC^JUS^XZ',desc:'切換為 Cutter；只在機器已安裝切刀時使用。',risk:'caution',save:'會保存',tags:'cutter 切刀 裁切 出紙'},
    {brand:'Zebra',group:'出紙模式',title:'Rewind 回捲',cmd:'^XA^MMR^JUS^XZ',desc:'切換為 Rewind；限支援回捲的機型／選配。',risk:'caution',save:'會保存',tags:'rewind 回捲 出紙'},
    {brand:'Zebra',group:'位置',title:'水平／垂直位移歸零',cmd:'^XA^LS0^LT0^JUS^XZ',desc:'Left Position 與 Label Top 都歸零，快速排除設定被改偏。',risk:'normal',save:'會保存',tags:'位置 偏移 left top ls lt 歸零'},
    {brand:'Zebra',group:'診斷／測試',title:'列印組態標籤',cmd:'~WC',desc:'列印 Configuration Label，可看韌體、Sensor、列印模式、網路等設定。',risk:'normal',save:'只列印，不修改',tags:'configuration 組態 測試 設定 標籤 firmware'},
    {brand:'Zebra',group:'診斷／測試',title:'列印網路組態標籤',cmd:'~WL',desc:'列印 Network Configuration Label；印表機需在 Idle。',risk:'normal',save:'只列印，不修改',tags:'network 網路 ip ethernet wlan 組態'},
    {brand:'Zebra',group:'工作控制',title:'取消目前所有列印批次',cmd:'~JA',desc:'完成目前這張後停止，清除輸入 Buffer 與尚未完成的批次。',risk:'caution',save:'會取消尚未列印工作',tags:'cancel stop 停止 取消 列印 queue buffer 卡住'},

    {brand:'TSC',group:'校正／Sensor',title:'Gap 自動校正',cmd:'GAPDETECT\r\n',desc:'自動偵測紙張長度與 Gap；省略參數時由印表機自動判斷。',risk:'normal',save:'會走紙並更新校正值',tags:'gap detect 校正 sensor 間隙 標籤'},
    {brand:'TSC',group:'校正／Sensor',title:'Black Mark 自動校正',cmd:'BLINEDETECT\r\n',desc:'自動偵測紙張與 Black Mark。',risk:'normal',save:'會走紙並更新校正值',tags:'black mark bline 黑標 sensor 校正'},
    {brand:'TSC',group:'校正／Sensor',title:'Gap／Black Mark 自動判斷',cmd:'AUTODETECT\r\n',desc:'自動判斷 Gap 或 Black Mark 並校正；需確認機型韌體支援。',risk:'caution',save:'會走紙並更新校正值',tags:'auto detect gap black mark 自動 sensor'},
    {brand:'TSC',group:'方向／位置',title:'DIRECTION 0',cmd:'DIRECTION 0\r\n',desc:'列印方向設為 0。',risk:'normal',save:'會存入印表機記憶體',tags:'direction 方向 正向'},
    {brand:'TSC',group:'方向／位置',title:'DIRECTION 1',cmd:'DIRECTION 1\r\n',desc:'列印方向設為 1。',risk:'normal',save:'會存入印表機記憶體',tags:'direction 方向 反向'},
    {brand:'TSC',group:'方向／位置',title:'Mirror ON',cmd:'DIRECTION 0,1\r\n',desc:'方向 0 並開啟鏡像列印；少數舊機不支援 Mirror。',risk:'caution',save:'會存入印表機記憶體',tags:'mirror 鏡像 direction'},
    {brand:'TSC',group:'方向／位置',title:'Mirror OFF',cmd:'DIRECTION 0,0\r\n',desc:'方向 0 並關閉鏡像列印。',risk:'normal',save:'會存入印表機記憶體',tags:'mirror off 關閉 鏡像'},
    {brand:'TSC',group:'出紙模式',title:'Tear ON',cmd:'SET TEAR ON\r\n',desc:'列印後把 Gap／Black Mark 停在 Tear-off 位置。',risk:'normal',save:'會保存',tags:'tear 撕紙 停紙 出紙'},
    {brand:'TSC',group:'出紙模式',title:'Tear OFF',cmd:'SET TEAR OFF\r\n',desc:'關閉 Tear 模式，標籤起點回到 Printhead 位置。',risk:'normal',save:'會保存',tags:'tear off 關閉 撕紙'},
    {brand:'TSC',group:'出紙模式',title:'Peel ON',cmd:'SET PEEL ON\r\n',desc:'開啟剝紙模式；必須有對應剝紙器／Sensor。',risk:'caution',save:'會保存',tags:'peel 剝紙 sensor'},
    {brand:'TSC',group:'出紙模式',title:'Peel OFF',cmd:'SET PEEL OFF\r\n',desc:'關閉剝紙模式。',risk:'normal',save:'會保存',tags:'peel off 關閉 剝紙'},
    {brand:'TSC',group:'出紙模式',title:'Cutter OFF',cmd:'SET CUTTER OFF\r\n',desc:'關閉 Cutter 模式。',risk:'normal',save:'會保存',tags:'cutter 切刀 off 關閉'},
    {brand:'TSC',group:'出紙模式',title:'每張切一刀',cmd:'SET CUTTER 1\r\n',desc:'每 1 張切一次；必須已安裝 Cutter。',risk:'caution',save:'會保存',tags:'cutter 切刀 每張 裁切'},
    {brand:'TSC',group:'出紙模式',title:'整批完成再切',cmd:'SET CUTTER BATCH\r\n',desc:'整批列印工作完成後再切。',risk:'caution',save:'會保存',tags:'cutter batch 切刀 批次'},
    {brand:'TSC',group:'出紙模式',title:'Rewind ON',cmd:'SET REWIND ON\r\n',desc:'開啟回捲；限支援 Rewind 的機型／選配。',risk:'caution',save:'會保存',tags:'rewind 回捲 on'},
    {brand:'TSC',group:'出紙模式',title:'Rewind OFF',cmd:'SET REWIND OFF\r\n',desc:'關閉回捲。',risk:'normal',save:'會保存',tags:'rewind off 關閉 回捲'},
    {brand:'TSC',group:'診斷／測試',title:'完整 Self Test',cmd:'SELFTEST\r\n',desc:'列印完整 Printer Information／Self-test 頁。',risk:'normal',save:'只列印，不修改',tags:'selftest self test 測試 組態 information'},
    {brand:'TSC',group:'診斷／測試',title:'Printhead Pattern 測試',cmd:'SELFTEST PATTERN\r\n',desc:'列印 Pattern，用於檢查 Printhead Heat Line 狀態。',risk:'normal',save:'只列印，不修改',tags:'printhead head pattern 斷針 壞點 測試'},
    {brand:'TSC',group:'診斷／測試',title:'Ethernet Self Test',cmd:'SELFTEST ETHERNET\r\n',desc:'列印 Ethernet 設定資訊。',risk:'normal',save:'只列印，不修改',tags:'ethernet network 網路 selftest ip'},
    {brand:'TSC',group:'診斷／測試',title:'System Self Test',cmd:'SELFTEST SYSTEM\r\n',desc:'列印 Printer System Settings。',risk:'normal',save:'只列印，不修改',tags:'system settings 系統 設定 selftest'}
  ];

  function copyRaw(cmd){
    if(typeof copyText==='function')copyText(cmd);
    else navigator.clipboard?.writeText(cmd);
  }
  window.eccCopyRaw=copyRaw;

  function currentProductSafe(){
    try{return (typeof currentProduct!=='undefined'&&currentProduct?.m)?currentProduct:null}catch{return null}
  }
  function productsSafe(){
    try{return Array.isArray(PRODUCTS)?PRODUCTS:[]}catch{return[]}
  }
  function normalize(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]+/g,'')}
  function modelScore(p,q){
    const n=normalize(q),m=normalize(p.m),all=normalize(`${p.b}${p.s}${p.m}`);
    if(!n)return 999;
    if(m===n)return 0;
    if(m.startsWith(n))return 1+(m.length-n.length)/100;
    if(m.includes(n))return 2+(m.length-n.length)/100;
    if(all.includes(n))return 3;
    return 999;
  }
  function recentKeys(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch{return[]}}
  function rememberModel(p){
    try{
      const key=`${p.b}|${p.m}`;
      const next=[key,...recentKeys().filter(x=>x!==key)].slice(0,6);
      localStorage.setItem(RECENT_KEY,JSON.stringify(next));
    }catch(e){}
  }
  function pickModel(index){
    const p=productsSafe()[Number(index)];if(!p)return;
    rememberModel(p);
    if(typeof selectProduct==='function')selectProduct(p);
    activeBrand=['Zebra','TSC'].includes(p.b)?p.b:'ALL';
    render();
  }
  window.engineerToolPickModel=pickModel;

  function modelResults(q){
    return productsSafe().map((p,i)=>({p,i,s:modelScore(p,q)})).filter(x=>x.s<999).sort((a,b)=>a.s-b.s||a.p.m.localeCompare(b.p.m)).slice(0,10);
  }
  function renderModelMatches(q){
    const box=byId('etModelMatches');if(!box)return;
    if(!String(q||'').trim()){box.innerHTML='';box.style.display='none';return}
    const list=modelResults(q);
    box.innerHTML=list.length?list.map(x=>`<button type="button" onclick="engineerToolPickModel(${x.i})"><b>${h(x.p.m)}</b><span>${h(x.p.b)}｜${h(x.p.s||'')}｜${h(x.p.status||'')}</span></button>`).join(''):'<div class="et-picker-none">找不到相符機型</div>';
    box.style.display='block';
  }
  window.engineerToolModelSearch=v=>renderModelMatches(v);

  function recentHtml(){
    const all=productsSafe();
    const rows=recentKeys().map(key=>{const [b,m]=String(key).split('|');const i=all.findIndex(p=>p.b===b&&p.m===m);return i>=0?{p:all[i],i}:null}).filter(Boolean);
    if(!rows.length)return'';
    return `<div class="et-recent"><span>最近使用</span>${rows.map(x=>`<button type="button" onclick="engineerToolPickModel(${x.i})">${h(x.p.m)}</button>`).join('')}</div>`;
  }

  function modelPickerHtml(){
    const p=currentProductSafe();
    const rel=p&&Array.isArray(window.REPAIR_KB)?window.REPAIR_KB.filter(a=>Array.isArray(a.models)&&(a.models.includes(p.m)||a.models.includes('ALL'))):[];
    const a=rel.filter(x=>x.evidence==='oem-parts').length,b=rel.filter(x=>x.evidence==='verified-b-parts').length;
    return `<div class="et-inline-picker">
      <div class="et-picker-top"><div><span class="et-kicker">機型快速切換</span><h2>${p?h(p.m):'直接在這裡選機型'}</h2>${p?`<div class="small">${h(p.b)}｜${h(p.s||'')}｜${h(p.status||'')}</div>`:'<div class="small">不用回左側。可輸入 ZT610、220X、TH240、P4 65 等關鍵字。</div>'}</div>${p?`<div class="et-model-stats"><span><b>${rel.length}</b> 維修主題</span><span><b>${a}</b> A 原廠料號</span><span><b>${b}</b> B 雙來源料號</span></div>`:''}</div>
      <div class="et-picker-search"><input id="etModelQuickSearch" type="search" autocomplete="off" placeholder="搜尋型號…" oninput="engineerToolModelSearch(this.value)" onfocus="engineerToolModelSearch(this.value)"><div id="etModelMatches" class="et-picker-matches"></div></div>
      ${recentHtml()}
      ${p?`<div class="et-actions"><button class="btn primary" type="button" onclick="engineerToolOpenKB(${JSON.stringify(p.m)},true)">查此機型維修資料</button><button class="btn secondary" type="button" onclick="engineerToolOpenKB(${JSON.stringify(p.m+' 料號')},true)">查零件料號</button></div>`:''}
    </div>`;
  }

  function enhanceModelPicker(){
    const box=byId('tab-tools');if(!box)return;
    const target=box.querySelector('.et-model-empty,.et-model-current');
    if(target)target.outerHTML=modelPickerHtml();
    else{
      const first=box.querySelector('.et-section');
      if(first&&!first.querySelector('.et-inline-picker'))first.innerHTML=modelPickerHtml();
    }
    document.addEventListener('click',e=>{
      if(!e.target.closest('.et-picker-search')){
        const m=byId('etModelMatches');if(m)m.style.display='none';
      }
    },{once:true});
  }

  function commandCard(x){
    const label=x.risk==='caution'?'注意':'一般';
    return `<article class="ecc-card ${x.risk}"><div class="ecc-card-head"><div><span class="ecc-brand">${h(x.brand)}｜${h(x.group)}</span><h4>${h(x.title)}</h4></div><span class="ecc-risk">${label}</span></div><p>${h(x.desc)}</p><code>${h(x.cmd.replace(/\r?\n/g,' ↵ '))}</code><div class="ecc-meta">${h(x.save)}</div><div class="ecc-actions"><button type="button" onclick='eccCopyRaw(${JSON.stringify(x.cmd)})'>複製指令</button></div></article>`;
  }
  function filteredCommands(){
    const q=String(byId('eccSearch')?.value||'').trim().toLowerCase();
    return commands.filter(x=>(activeBrand==='ALL'||x.brand===activeBrand)&&(!q||`${x.brand} ${x.group} ${x.title} ${x.desc} ${x.tags} ${x.cmd}`.toLowerCase().includes(q)));
  }
  function renderCommandList(){
    const box=byId('eccCommandList');if(!box)return;
    const list=filteredCommands();
    const groups=[...new Set(list.map(x=>`${x.brand}|${x.group}`))];
    box.innerHTML=list.length?groups.map(g=>{
      const [brand,group]=g.split('|');const rows=list.filter(x=>x.brand===brand&&x.group===group);
      return `<div class="ecc-group"><div class="ecc-heading"><h3>${h(brand)}｜${h(group)}</h3><span>${rows.length} 條</span></div><div class="ecc-grid">${rows.map(commandCard).join('')}</div></div>`;
    }).join(''):'<div class="ecc-empty">沒有符合的指令；換個關鍵字或品牌。</div>';
    document.querySelectorAll('[data-ecc-brand]').forEach(btn=>btn.classList.toggle('active',btn.dataset.eccBrand===activeBrand));
  }
  function setBrand(brand){activeBrand=brand;renderCommandList()}
  window.eccSetBrand=setBrand;
  window.eccFilter=renderCommandList;

  function buildZebra(){
    const dark=String(byId('eccZDark')?.value||'').trim(),speed=String(byId('eccZSpeed')?.value||'').trim();
    const width=String(byId('eccZWidth')?.value||'').trim(),length=String(byId('eccZLength')?.value||'').trim();
    const method=byId('eccZMethod')?.value||'',mode=byId('eccZMode')?.value||'';const host=[],z=[];
    if(dark!==''){const n=Number(dark);if(!Number.isFinite(n)||n<0||n>30){notify('Zebra 濃度請輸入 0～30');return}host.push(`~SD${dark}`)}
    if(method)z.push(`^MT${method}`);if(mode)z.push(`^MM${mode}`);
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0||n>14){notify('速度請輸入 >0 且 ≤14 IPS，仍須確認該機型上限');return}z.push(`^PR${speed}`)}
    if(width!==''){const n=Math.round(Number(width));if(!Number.isFinite(n)||n<2){notify('Print Width 請輸入 dots');return}z.push(`^PW${n}`)}
    if(length!==''){const n=Math.round(Number(length));if(!Number.isFinite(n)||n<1){notify('Label Length 請輸入 dots');return}z.push(`^LL${n}`)}
    if(!host.length&&!z.length){notify('至少選一個 Zebra 設定');return}
    const cmd=host.join('\n')+(host.length&&z.length?'\n':'')+(z.length?`^XA${z.join('')}^JUS^XZ`:'');
    byId('eccZOut').textContent=cmd;return cmd;
  }
  function buildTsc(){
    const density=String(byId('eccTDensity')?.value||'').trim(),speed=String(byId('eccTSpeed')?.value||'').trim();
    const direction=byId('eccTDir')?.value||'',tear=byId('eccTTear')?.value||'',offset=String(byId('eccTOffset')?.value||'').trim();const lines=[];
    if(density!==''){const n=Number(density);if(!Number.isInteger(n)||n<0||n>15){notify('TSC DENSITY 請輸入 0～15 整數');return}lines.push(`DENSITY ${n}`)}
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0){notify('TSC SPEED 請輸入正數，並確認該機型支援速度');return}lines.push(`SPEED ${speed}`)}
    if(direction)lines.push(`DIRECTION ${direction}`);if(tear)lines.push(`SET TEAR ${tear}`);
    if(offset!==''){const n=Number(offset);if(!Number.isFinite(n)||n<-25.4||n>25.4){notify('OFFSET 請限制在 -25.4～25.4 mm');return}lines.push(`OFFSET ${offset} mm`)}
    if(!lines.length){notify('至少選一個 TSC 設定');return}
    const cmd=lines.join('\r\n')+'\r\n';byId('eccTOut').textContent=cmd;return cmd;
  }
  window.eccBuildZebra=()=>{const c=buildZebra();if(c)copyRaw(c)};
  window.eccBuildTsc=()=>{const c=buildTsc();if(c)copyRaw(c)};

  function centerHtml(){
    const version=h(window.APP_BUILD?.version||'');
    const p=currentProductSafe();
    const preferred=p&&['Zebra','TSC'].includes(p.b)?p.b:'ALL';
    activeBrand=preferred;
    return `<section id="engineerCommandCenter" class="ecc-section">
      <div class="ecc-title"><div><span class="et-kicker">${version}｜AnyDesk 維修</span><h2>設定指令快速中心</h2><p>AnyDesk 進客戶電腦後，選好機型、找到要改的設定，複製指令貼到對應品牌的指令傳送工具即可。這裡不負責建立遠端連線，也不需要輸入客戶 IP。</p></div></div>
      <div class="ecc-how"><b>實際流程</b><span>AnyDesk → 客戶電腦 → Zebra Setup Utilities／TSC 工具 → 貼上指令 → Send → 立即確認機器反應</span></div>
      <details class="ecc-builder" ${preferred==='TSC'?'':'open'}><summary>Zebra｜快速組合設定</summary><div class="ecc-fields"><label>列印方式<select id="eccZMethod"><option value="">不修改</option><option value="T">熱轉印</option><option value="D">熱感應</option></select></label><label>出紙模式<select id="eccZMode"><option value="">不修改</option><option value="T">Tear-off</option><option value="P">Peel-off</option><option value="C">Cutter</option><option value="R">Rewind</option></select></label><label>濃度 0～30<input id="eccZDark" type="number" min="0" max="30" step="0.1" placeholder="例如 15"></label><label>速度 IPS<input id="eccZSpeed" type="number" min="0.1" max="14" step="0.1" placeholder="例如 4"></label><label>Print Width dots<input id="eccZWidth" type="number" min="2" step="1" placeholder="選填"></label><label>Label Length dots<input id="eccZLength" type="number" min="1" step="1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button type="button" onclick="eccBuildZebra()">產生＋複製 ZPL</button></div><pre id="eccZOut">尚未產生</pre><div class="ecc-note">不同 Zebra 機型的最高速度、選配模組與部分舊平台行為不同；送出後以機器實際反應／Configuration Label 再確認。</div></details>
      <details class="ecc-builder" ${preferred==='TSC'?'open':''}><summary>TSC｜快速組合設定</summary><div class="ecc-fields"><label>DENSITY 0～15<input id="eccTDensity" type="number" min="0" max="15" step="1" placeholder="例如 8"></label><label>SPEED<input id="eccTSpeed" type="number" min="0.1" step="0.1" placeholder="例如 4"></label><label>DIRECTION<select id="eccTDir"><option value="">不修改</option><option value="0">0</option><option value="1">1</option><option value="0,1">0 + Mirror ON</option><option value="0,0">0 + Mirror OFF</option></select></label><label>TEAR<select id="eccTTear"><option value="">不修改</option><option value="ON">ON</option><option value="OFF">OFF</option></select></label><label>OFFSET mm<input id="eccTOffset" type="number" min="-25.4" max="25.4" step="0.1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button type="button" onclick="eccBuildTsc()">產生＋複製 TSPL</button></div><pre id="eccTOut">尚未產生</pre><div class="ecc-note">OFFSET 是出紙停止位置微調，數值不當可能造成走紙／卡紙；需要時小幅調整。</div></details>
      <div class="ecc-library"><div class="ecc-library-head"><div><span class="et-kicker">指令庫</span><h3>直接搜尋要做的事情</h3></div><input id="eccSearch" type="search" autocomplete="off" placeholder="例如：校正、Sensor、熱轉印、切刀、停止列印…" oninput="eccFilter()"></div><div class="ecc-brand-filter"><button type="button" data-ecc-brand="ALL" onclick="eccSetBrand('ALL')">全部</button><button type="button" data-ecc-brand="Zebra" onclick="eccSetBrand('Zebra')">Zebra</button><button type="button" data-ecc-brand="TSC" onclick="eccSetBrand('TSC')">TSC</button></div><div id="eccCommandList"></div></div>
      <div class="ecc-source">先收 Zebra ZPL 與 TSC TSPL／TSPL2 已核對指令。其他品牌等找到原廠 Programming Guide 再加入，不用猜。</div>
    </section>`;
  }

  function inject(){
    const box=byId('tab-tools');if(!box)return;
    byId('engineerCommandCenter')?.remove();
    const first=box.querySelector('.et-section');
    if(first)first.insertAdjacentHTML('afterend',centerHtml());else box.insertAdjacentHTML('beforeend',centerHtml());
    renderCommandList();
  }
  function render(){
    if(typeof window.renderEngineerToolsPlus==='function')window.renderEngineerToolsPlus();
    enhanceModelPicker();
    inject();
  }
  window.renderEngineerCommandCenter=render;
  window.renderTools=render;
  try{renderTools=window.renderTools}catch(e){}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0),{once:true});else setTimeout(render,0);
})();
