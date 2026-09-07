'use strict';

// 工程師現場工具箱：純前端、無外部服務。個人筆記與案件資料只留在目前瀏覽器。
(function(){
  const byId=id=>document.getElementById(id);
  const htmlEsc=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const readCasesSafe=()=>{try{return typeof readCases==='function'?readCases():JSON.parse(localStorage.getItem('printer_engineer_cases')||'[]')}catch{return[]}};
  const currentModelSafe=()=>{try{return (typeof currentProduct!=='undefined'&&currentProduct?.m&&currentProduct.m!=='未指定機型')?currentProduct:null}catch{return null}};
  const relatedArticles=p=>{
    if(!p||!Array.isArray(window.REPAIR_KB))return [];
    return REPAIR_KB.filter(a=>Array.isArray(a.models)&&(a.models.includes(p.m)||a.models.includes('ALL')));
  };
  function countEvidence(list,key){return list.filter(a=>a.evidence===key).length}
  function safeNumber(v){const n=Number(v);return Number.isFinite(n)?n:null}
  function toastSafe(msg){if(typeof toast==='function')toast(msg);else alert(msg)}

  function openKb(query='',modelOnly=false){
    const btn=[...document.querySelectorAll('.tabs .tab')].find(x=>x.textContent.includes('維修資料庫'));
    if(typeof showTab==='function')showTab('kb',btn);
    if(typeof renderKB==='function')renderKB({q:query,modelOnly});
    byId('tab-kb')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  window.engineerToolOpenKB=openKb;

  function calcDots(){
    const dpi=safeNumber(byId('toolDpi')?.value)||203;
    const w=safeNumber(byId('toolMmW')?.value),h=safeNumber(byId('toolMmH')?.value);
    const result=byId('toolDotsResult');if(!result)return;
    if(w===null&&h===null){result.textContent='輸入標籤尺寸後顯示 dots。';return}
    const conv=x=>Math.round(x*dpi/25.4);
    const pitch=(25.4/dpi).toFixed(4);
    const parts=[];
    if(w!==null)parts.push(`寬 ${w} mm ≈ ${conv(w)} dots`);
    if(h!==null)parts.push(`高 ${h} mm ≈ ${conv(h)} dots`);
    result.innerHTML=`<b>${htmlEsc(parts.join('｜'))}</b><span>每 dot 約 ${pitch} mm（${dpi} dpi）</span>`;
  }
  function calcMm(){
    const dpi=safeNumber(byId('toolDpi')?.value)||203;
    const dots=safeNumber(byId('toolDots')?.value);
    const result=byId('toolMmResult');if(!result)return;
    if(dots===null){result.textContent='輸入 dots 後反算 mm。';return}
    result.innerHTML=`<b>${dots} dots ≈ ${(dots*25.4/dpi).toFixed(2)} mm</b><span>${dpi} dpi</span>`;
  }
  function calcSpeed(){
    const ips=safeNumber(byId('toolIps')?.value);
    const len=safeNumber(byId('toolLabelLen')?.value);
    const result=byId('toolSpeedResult');if(!result)return;
    if(ips===null||ips<=0){result.textContent='輸入列印速度 IPS。';return}
    const mms=ips*25.4;
    let text=`${ips} IPS = ${mms.toFixed(1)} mm/s`;
    let sub='1 IPS = 25.4 mm/s';
    if(len!==null&&len>0){
      const sec=len/mms;
      text+=`｜${len} mm 約 ${sec.toFixed(2)} 秒/張`;
      sub=`理論上約 ${(60/sec).toFixed(0)} 張/分；未計回捲、切刀、通訊與停頓時間`;
    }
    result.innerHTML=`<b>${htmlEsc(text)}</b><span>${htmlEsc(sub)}</span>`;
  }
  window.engineerToolCalcDots=calcDots;
  window.engineerToolCalcMm=calcMm;
  window.engineerToolCalcSpeed=calcSpeed;

  function validHost(v){
    const s=String(v||'').trim();
    return /^[a-zA-Z0-9.-]{1,253}$/.test(s)?s:'';
  }
  function copyCommand(kind){
    const host=validHost(byId('toolPrinterIp')?.value);
    let cmd='';
    if(kind==='ipconfig')cmd='ipconfig /all';
    if(kind==='arp')cmd='arp -a';
    if(kind==='ping'){
      if(!host)return toastSafe('先輸入印表機 IP 或主機名稱');
      cmd=`ping ${host}`;
    }
    if(kind==='port'){
      if(!host)return toastSafe('先輸入印表機 IP 或主機名稱');
      cmd=`powershell Test-NetConnection ${host} -Port 9100`;
    }
    if(cmd&&typeof copyText==='function')copyText(cmd);
  }
  window.engineerToolCopyCommand=copyCommand;

  const NOTE_KEY='printer_engineer_tool_scratchpad';
  function loadNote(){try{return localStorage.getItem(NOTE_KEY)||''}catch{return''}}
  function saveNote(){
    const el=byId('toolScratchpad');if(!el)return;
    try{localStorage.setItem(NOTE_KEY,el.value)}catch(e){}
    const stat=byId('toolScratchStatus');if(stat)stat.textContent=`已保存在此瀏覽器｜${new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}`;
  }
  function clearNote(){
    if(!confirm('清除工程師工具裡的現場筆記？'))return;
    try{localStorage.removeItem(NOTE_KEY)}catch(e){}
    if(byId('toolScratchpad'))byId('toolScratchpad').value='';
    if(byId('toolScratchStatus'))byId('toolScratchStatus').textContent='已清除';
  }
  function copyNote(){
    const p=currentModelSafe();const note=byId('toolScratchpad')?.value?.trim()||'';
    if(!note)return toastSafe('目前沒有現場筆記');
    const head=`【現場維修筆記】\n時間：${new Date().toLocaleString('zh-TW')}\n設備：${p?`${p.b} ${p.m}`:'未指定'}\n`;
    if(typeof copyText==='function')copyText(head+'\n'+note);
  }
  window.engineerToolSaveNote=saveNote;
  window.engineerToolClearNote=clearNote;
  window.engineerToolCopyNote=copyNote;

  function modelContextHtml(){
    const p=currentModelSafe();
    if(!p)return `<div class="et-model-empty"><b>目前未選機型</b><span>先在左側搜尋設備；選好後這裡會顯示該機型的維修資料、A/B 料號與快捷入口。</span><button class="btn secondary" type="button" onclick="document.getElementById('modelSearch')?.focus();document.getElementById('modelSearch')?.scrollIntoView({behavior:'smooth',block:'center'})">搜尋機型</button></div>`;
    const rel=relatedArticles(p);
    const a=countEvidence(rel,'oem-parts'),b=countEvidence(rel,'verified-b-parts');
    return `<div class="et-model-current"><div><span class="et-kicker">目前機型</span><h2>${htmlEsc(p.m)}</h2><div class="small">${htmlEsc(p.b)}｜${htmlEsc(p.s||'')}｜${htmlEsc(p.status||'')}</div></div><div class="et-model-stats"><span><b>${rel.length}</b> 維修主題</span><span><b>${a}</b> A 原廠料號</span><span><b>${b}</b> B 雙來源料號</span></div><div class="et-actions"><button class="btn primary" type="button" onclick="engineerToolOpenKB(${JSON.stringify(p.m)},true)">只看此機型</button><button class="btn secondary" type="button" onclick="engineerToolOpenKB(${JSON.stringify(p.m+' 料號')},true)">查零件料號</button></div></div>`;
  }

  function quickKbHtml(){
    const qs=[
      ['⚠️','錯誤碼','Error code'],['🎞️','Sensor','Sensor'],['🔥','Printhead','Printhead'],['🛞','Platen','Platen'],
      ['✂️','Cutter','Cutter'],['⚡','PSU／電源','PSU 電源'],['🧠','Mainboard','Mainboard'],['🌐','網路／Port','Network Port']
    ];
    return qs.map(x=>`<button class="et-quick" type="button" onclick="engineerToolOpenKB(${JSON.stringify(x[2])},false)"><span>${x[0]}</span><b>${htmlEsc(x[1])}</b></button>`).join('');
  }

  function renderEngineerTools(){
    const box=byId('tab-tools');if(!box)return;
    const cases=readCasesSafe();
    const backup=(()=>{try{return localStorage.getItem('printer_engineer_last_backup')||''}catch{return''}})();
    box.innerHTML=`
      <div class="hero et-hero"><div><span class="badge">工程師工具</span><h1>現場維修工具箱</h1><div class="small">手機／平板可直接用。換算與指令都在瀏覽器內完成，不會把輸入內容送到外部服務。</div></div></div>
      <section class="et-section">${modelContextHtml()}</section>
      <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">快速查資料</span><h3>常用維修主題</h3></div><span class="small">直接切到維修資料庫</span></div><div class="et-quick-grid">${quickKbHtml()}</div></section>
      <div class="et-grid">
        <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">尺寸換算</span><h3>mm ↔ dots</h3></div></div><div class="et-form"><label>DPI<select id="toolDpi"><option value="203">203 dpi</option><option value="300">300 dpi</option><option value="600">600 dpi</option></select></label><div class="et-row"><label>寬 mm<input id="toolMmW" type="number" inputmode="decimal" min="0" step="0.1" placeholder="例如 100"></label><label>高 mm<input id="toolMmH" type="number" inputmode="decimal" min="0" step="0.1" placeholder="例如 50"></label></div><div id="toolDotsResult" class="et-result">輸入標籤尺寸後顯示 dots。</div><label>反算 dots<input id="toolDots" type="number" inputmode="numeric" min="0" step="1" placeholder="例如 800"></label><div id="toolMmResult" class="et-result">輸入 dots 後反算 mm。</div></div></section>
        <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">速度換算</span><h3>IPS ↔ mm/s</h3></div></div><div class="et-form"><div class="et-row"><label>速度 IPS<input id="toolIps" type="number" inputmode="decimal" min="0" step="0.1" placeholder="例如 4"></label><label>標籤長度 mm<input id="toolLabelLen" type="number" inputmode="decimal" min="0" step="0.1" placeholder="選填"></label></div><div id="toolSpeedResult" class="et-result">輸入列印速度 IPS。</div><div class="small">可估算純走紙時間；實際速度會受切刀、回捲、資料傳輸與機器停頓影響。</div></div></section>
        <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">Windows 網路</span><h3>Port 9100 快速測試</h3></div></div><div class="et-form"><label>印表機 IP／主機名稱<input id="toolPrinterIp" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="例如 192.168.1.100"></label><div class="et-command-grid"><button type="button" onclick="engineerToolCopyCommand('ping')"><b>Ping</b><span>確認基本連線</span></button><button type="button" onclick="engineerToolCopyCommand('port')"><b>TCP 9100</b><span>確認 RAW 列印 Port</span></button><button type="button" onclick="engineerToolCopyCommand('ipconfig')"><b>ipconfig /all</b><span>看電腦網路設定</span></button><button type="button" onclick="engineerToolCopyCommand('arp')"><b>arp -a</b><span>看區網 ARP</span></button></div><div class="small">按鈕只會複製指令，貼到 Windows CMD／PowerShell 執行。</div></div></section>
        <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">Zebra</span><h3>常用校正指令</h3></div></div><div class="et-command-line"><div><b>短校正</b><span>現有維修流程使用</span></div><button type="button" onclick="copyText('^XA^MFS,S^JUS^XZ')">複製</button></div><code>^XA^MFS,S^JUS^XZ</code><div class="et-command-line"><div><b>恢復完整校正</b><span>現有維修流程使用</span></div><button type="button" onclick="copyText('^XA^MFC,C^JUS^XZ')">複製</button></div><code>^XA^MFC,C^JUS^XZ</code><div class="small">實際行為仍依機型／韌體為準；執行前先確認紙材與 Sensor 位置。</div></section>
      </div>
      <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">現場暫存</span><h3>工程師筆記板</h3></div><span id="toolScratchStatus" class="small">只存在此瀏覽器</span></div><textarea id="toolScratchpad" class="et-scratch" placeholder="例如：\n• 開機即 Ribbon Out\n• Sensor 讀值遮擋前後無變化\n• 拔除接頭後可完成校正\n• 待交叉正常 Sensor"></textarea><div class="btnrow"><button class="btn primary" type="button" onclick="engineerToolCopyNote()">複製筆記</button><button class="btn secondary" type="button" onclick="engineerToolSaveNote()">立即儲存</button><button class="btn ghost" type="button" onclick="engineerToolClearNote()">清除</button></div></section>
      <section class="et-section"><div class="et-section-head"><div><span class="et-kicker">案件資料</span><h3>本機案件與備份</h3></div><span class="small">目前 ${cases.length} 筆${backup?`｜最近備份 ${htmlEsc(backup)}`:''}</span></div><div class="et-backup-actions"><button class="btn secondary" type="button" onclick="typeof showHistory==='function'&&showHistory();document.getElementById('historyBox')?.scrollIntoView({behavior:'smooth',block:'center'})">查看本機案件</button><button class="btn secondary" type="button" onclick="typeof exportCaseHistory==='function'&&exportCaseHistory()">匯出 JSON 備份</button><button class="btn secondary" type="button" onclick="typeof importCaseHistory==='function'&&importCaseHistory()">匯入 JSON 備份</button></div><div class="small" style="margin-top:8px">公司電腦、手機、iPad 的案件紀錄彼此獨立；需要搬資料時用 JSON 備份／還原。</div></section>
      <section class="et-section et-field-order"><div class="et-section-head"><div><span class="et-kicker">現場順序</span><h3>先切問題，再拆機</h3></div></div><div class="et-order"><span>1<b>耗材</b></span><i>→</i><span>2<b>安裝</b></span><i>→</i><span>3<b>設定</b></span><i>→</i><span>4<b>校正／Sensor</b></span><i>→</i><span>5<b>機構</b></span><i>→</i><span>6<b>線路／主板</b></span></div><div class="small" style="margin-top:10px">拆接頭、量阻值、拆 Printhead 前先斷電；特定 Pin、電壓、阻值、扭力與 Service Mode 以該機 Service Manual 為準。</div></section>`;

    ['toolDpi','toolMmW','toolMmH'].forEach(id=>byId(id)?.addEventListener('input',calcDots));
    ['toolDpi','toolDots'].forEach(id=>byId(id)?.addEventListener('input',calcMm));
    ['toolIps','toolLabelLen'].forEach(id=>byId(id)?.addEventListener('input',calcSpeed));
    const scratch=byId('toolScratchpad');if(scratch){scratch.value=loadNote();let timer;scratch.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(saveNote,500)})}
  }

  window.renderEngineerToolsPlus=renderEngineerTools;
  window.renderTools=renderEngineerTools;
  try{renderTools=window.renderTools}catch(e){}
})();
