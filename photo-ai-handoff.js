'use strict';

(function(){
  const FEATURE='AI 圖片排查';
  const MAX_IMAGES=6;
  const MAX_BYTES=20*1024*1024;
  const state={images:[],prompt:'',lastKbCount:0};

  function byId(id){return document.getElementById(id)}
  function value(id){return byId(id)?.value?.trim()||''}
  function h(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function prettyBytes(n){
    if(n<1024*1024)return `${Math.max(1,Math.round(n/1024))} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  }
  function invalidate(){state.prompt='';state.lastKbCount=0;setActionEnabled(false)}
  function setActionEnabled(ready){
    ['photoAiCopy','photoAiOpen'].forEach(id=>{const el=byId(id);if(el)el.disabled=!ready});
  }
  function setStatus(kind,msg){
    const box=byId('photoAiStatus');
    if(!box)return;
    box.className=`photoai-status ${kind||'info'}`;
    box.textContent=msg;
    box.hidden=false;
  }
  function reportFailure(error,context){
    console.error(`[萬里工程師工具] ${FEATURE} ${context||'執行'}失敗`,error);
    setStatus('error',`⚠️ AI 圖片排查發生錯誤：${error?.message||String(error||'未知錯誤')}。其他工程師功能不受影響。`);
    if(typeof window.__reportOptionalFeatureFailure==='function'){
      try{window.__reportOptionalFeatureFailure(FEATURE,error)}catch(e){}
    }
  }
  function guarded(context,fn){
    return function(...args){
      try{return fn.apply(this,args)}catch(error){reportFailure(error,context);return undefined}
    };
  }

  function currentCase(){
    return {
      brand:value('brand'),type:value('type'),series:value('series'),model:value('model'),symptom:value('symptom'),
      customer:value('customer'),serial:value('serial'),engineer:value('engineer'),notes:value('notes'),
      customerText:value('photoAiCustomerText'),done:value('photoAiDone')
    };
  }
  function maskSerial(s){
    const x=String(s||'').trim();
    if(!x)return '未填';
    if(x.length<=4)return '已填';
    return `••••${x.slice(-4)}`;
  }
  function inferFromText(c){
    const text=`${c.customerText} ${c.notes} ${c.done} ${c.symptom}`.toLowerCase();
    const products=(typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS))?PRODUCTS:[];
    let model='';
    if(text){
      const models=[...new Set(products.map(p=>String(p?.m||'').trim()).filter(Boolean))].sort((a,b)=>b.length-a.length);
      model=models.find(m=>text.includes(m.toLowerCase()))||'';
    }
    let brand='';
    const aliases=[
      ['Zebra',['zebra','斑馬']],['TSC',['tsc']],['Argox',['argox','立象']],['GoDEX',['godex','科誠']],
      ['TOSHIBA',['toshiba','東芝']],['SATO',['sato']],['Honeywell (Datamax/Intermec)',['honeywell','datamax','intermec']]
    ];
    for(const [name,keys] of aliases){if(keys.some(k=>text.includes(k))){brand=name;break}}
    if(model&&!brand){
      const p=products.find(x=>String(x?.m||'').trim()===model);
      brand=String(p?.b||p?.brand||'').trim();
    }
    return {model,brand};
  }
  function renderCaseSnapshot(){
    const box=byId('photoAiCaseSnapshot');if(!box)return;
    const c=currentCase();
    const inferred=inferFromText(c);
    const device=[c.brand,c.model].filter(Boolean).join(' ')||
      (inferred.model?`文字可能提及 ${[inferred.brand,inferred.model].filter(Boolean).join(' ')}（未確認）`:'未選擇也可以直接排查');
    box.innerHTML=`<div class="photoai-summary-grid">
      <div><b>設備</b><span>${h(device)}</span></div>
      <div><b>症狀</b><span>${h(c.symptom||'未選擇也可以')}</span></div>
      <div><b>客戶</b><span>${h(c.customer||'未填')} <small>（只在本頁顯示）</small></span></div>
      <div><b>序號</b><span>${h(maskSerial(c.serial))} <small>（不放進 AI 文字包）</small></span></div>
    </div>
    <div class="photoai-note"><b>使用方式：</b>最快只要放照片就能產生排查包；品牌、型號、症狀是選填，知道再填即可。</div>`;
  }

  function revoke(item){try{URL.revokeObjectURL(item.url)}catch(e){}}
  function resetImages(){
    state.images.forEach(revoke);state.images=[];
    const input=byId('photoAiFiles');if(input)input.value='';
    invalidate();renderImages();setStatus('info','照片已清除；可重新加入照片，或只用文字描述進行排查。');
  }
  function isImageFile(file){return String(file?.type||'').startsWith('image/')||/\.(heic|heif)$/i.test(file?.name||'')}
  function addFiles(fileList){
    const files=[...(fileList||[])];
    if(!files.length)return;
    let rejected=0,oversize=0,duplicate=0,added=0;
    for(const file of files){
      if(state.images.length>=MAX_IMAGES)break;
      if(!isImageFile(file)){rejected++;continue}
      if(file.size>MAX_BYTES){oversize++;continue}
      const same=state.images.some(x=>x.file.name===file.name&&x.file.size===file.size&&x.file.lastModified===file.lastModified);
      if(same){duplicate++;continue}
      state.images.push({id:`p${Date.now()}-${Math.random().toString(36).slice(2,8)}`,file,url:URL.createObjectURL(file)});
      added++;
    }
    const input=byId('photoAiFiles');if(input)input.value='';
    invalidate();renderImages();
    const notes=[];
    if(added)notes.push(`已加入 ${added} 張照片`);
    if(state.images.length>=MAX_IMAGES)notes.push(`最多 ${MAX_IMAGES} 張`);
    if(rejected)notes.push(`${rejected} 個非圖片檔已略過`);
    if(oversize)notes.push(`${oversize} 張超過 20 MB 已略過`);
    if(duplicate)notes.push(`${duplicate} 張重複照片已略過`);
    setStatus('success',notes.join('；')||'照片已更新');
  }
  function renderImages(){
    const box=byId('photoAiPreviews'),count=byId('photoAiCount');
    if(count)count.textContent=`${state.images.length}/${MAX_IMAGES} 張`;
    if(!box)return;
    if(!state.images.length){
      box.innerHTML='<div class="photoai-empty">尚未加入照片。你也可以先只貼「客戶原話」做文字排查。</div>';
      return;
    }
    box.innerHTML=state.images.map((x,i)=>`<div class="photoai-preview">
      <div class="photoai-thumb" data-photo-thumb="${h(x.id)}"><img src="${h(x.url)}" alt="故障照片預覽 ${i+1}"></div>
      <div class="photoai-file"><b>照片 ${i+1}</b><span>${h(x.file.name||'未命名圖片')}</span><small>${h(x.file.type||'圖片')}・${prettyBytes(x.file.size||0)}</small></div>
      <button type="button" class="btn ghost photoai-remove" data-photo-remove="${h(x.id)}">移除</button>
    </div>`).join('');
    box.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
      const thumb=img.closest('[data-photo-thumb]');
      if(thumb)thumb.innerHTML='<div class="photoai-no-preview">圖片已加入<br><small>此瀏覽器無法預覽此格式</small></div>';
    },{once:true}));
    box.querySelectorAll('[data-photo-remove]').forEach(btn=>btn.addEventListener('click',guarded('移除照片',()=>{
      const idx=state.images.findIndex(x=>x.id===btn.dataset.photoRemove);
      if(idx>=0){revoke(state.images[idx]);state.images.splice(idx,1);invalidate();renderImages();setStatus('info','照片已移除')}
    })));
  }

  const keywordGroups=[
    ['ribbon','色帶','碳帶'],['paper','media','紙張','紙','標籤'],['sensor','感應','感應器'],['calibration','校正','定位','跳標'],
    ['皺','皺碳'],['淡','模糊','不清楚'],['偏','走偏'],['error','錯誤','警報'],['cutter','切刀','裁刀'],['列印','print'],
    ['motor','馬達'],['主板','mainboard','motherboard'],['電源','power'],['網路','network','ethernet'],['條碼','barcode'],['printhead','印字頭','列印頭']
  ];
  function contextKeywords(text){
    const t=String(text||'').toLowerCase();
    return keywordGroups.filter(group=>group.some(k=>t.includes(k))).flat();
  }
  function kbMatches(c,inferred){
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    if(!kb.length)return [];
    const chosenModel=c.model||inferred.model||'';
    const chosenBrand=c.brand||inferred.brand||'';
    const context=`${c.symptom} ${c.customerText} ${c.notes} ${c.done}`.toLowerCase().trim();
    const keys=contextKeywords(context);
    if(!chosenModel&&!chosenBrand&&!context)return [];
    return kb.map(x=>{
      const models=Array.isArray(x?.models)?x.models:[];
      const text=`${x?.title||''} ${x?.category||''} ${x?.summary||''} ${(x?.keyFacts||[]).join(' ')} ${(x?.engineering||[]).join(' ')}`.toLowerCase();
      let score=0;
      if(chosenModel&&models.includes(chosenModel))score+=40;
      else if(chosenModel&&models.includes('ALL'))score+=4;
      if(chosenBrand&&String(x?.brand||'').toLowerCase()===chosenBrand.toLowerCase())score+=10;
      if(c.symptom&&text.includes(c.symptom.toLowerCase()))score+=12;
      for(const k of keys)if(text.includes(k))score+=2;
      if(context&&String(x?.title||'').toLowerCase().split(/\s|｜|／|\//).some(t=>t.length>=2&&context.includes(t)))score+=2;
      return {x,score};
    }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,chosenModel?4:3).map(v=>v.x);
  }
  function kbText(entries,hasConfirmedModel){
    if(!entries.length)return '未強行帶入站內資料。請先以照片／客戶描述辨識設備與故障方向；確認型號後再回工程師工具做精準交叉。';
    const intro=hasConfirmedModel?'已依目前型號與症狀挑選：':'目前型號未確認，以下只作「可能相關方向」，不可當成該機型定論：';
    return `${intro}\n`+entries.map((x,i)=>{
      const summary=String(x?.summary||'').trim();
      const engineering=Array.isArray(x?.engineering)?x.engineering.slice(0,1):[];
      return [`${i+1}. ${x?.title||x?.category||'維修資料'}`,summary?`   ${summary}`:'',engineering.length?`   工程提醒：${engineering[0]}`:''].filter(Boolean).join('\n');
    }).join('\n');
  }

  function buildPrompt(){
    const c=currentCase();
    const inferred=inferFromText(c);
    const hasText=!!(c.customerText||c.notes||c.done||c.symptom);
    if(!state.images.length&&!hasText){
      setStatus('error','請至少加入一張照片，或輸入「客戶原話／現場觀察／已做檢查」其中一項；品牌、型號可以完全不選。');
      return '';
    }
    const kb=kbMatches(c,inferred);
    state.lastKbCount=kb.length;
    const photoLine=state.images.length?`我另外附上 ${state.images.length} 張故障照片，請先看照片再判斷。`:'這次沒有附照片，請先依文字做初步排查，並告訴我下一步最值得補拍什麼。';
    const modelLine=c.model?c.model:(inferred.model?`${inferred.model}（只從文字推測，未確認）`:'未確認，請優先從照片的 Logo／面板／銘牌辨識；無法確認就不要硬猜');
    const brandLine=c.brand?c.brand:(inferred.brand?`${inferred.brand}（只從文字推測，未確認）`:'未確認');
    const lines=[
      '【標籤機工程師｜AI 快速排查】',photoLine,'','案件資訊：',
      `- 品牌：${brandLine}`,`- 型號：${modelLine}`,`- 症狀：${c.symptom||'未選擇'}`,`- 客戶原話：${c.customerText||'未填'}`,`- 現場觀察：${c.notes||'未填'}`,`- 已做檢查：${c.done||'未填'}`,'',
      '相關內部維修資料：',kbText(kb,!!c.model),'','請用「工程師現場能直接照做」的方式回覆：',
      '1. 先說照片／資料中能確定看到什麼；看不到的不要猜。',
      '2. 若品牌或型號未確認，先辨識；只能猜到候選就列候選與判斷依據。',
      '3. 列出最可能的 1～3 個故障方向，分高／中／低並說原因。',
      '4. 給我下一步檢查順序，先做安全、低風險、可逆的檢查，再進校正／Sensor／機構／線路／主板。',
      '5. 缺資訊時，直接告訴我「要補拍哪裡／要問客戶什麼／要看哪個數值」。',
      '6. 最後給一段很短的「現在先做這三件事」。','',
      '規則：不要因單張照片直接判定換主板、印字頭、Sensor 或馬達；沒有可靠機型資料時不要猜 Pin、線色、料號或電壓。涉及拆接頭、阻值、印字頭、電源或主板時先提醒斷電／安全條件。客戶名稱、完整序號與工程師姓名不在此 AI 包中。'
    ];
    state.prompt=lines.join('\n');
    return state.prompt;
  }

  function renderPrompt(){
    const btn=byId('photoAiBuild');
    if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='正在整理…'}
    setStatus('working','正在整理照片、案件資料與相關維修方向…');
    try{
      renderCaseSnapshot();
      const p=buildPrompt();if(!p)return;
      const out=byId('photoAiPrompt');if(!out)throw new Error('找不到 AI 排查包輸出區');
      out.textContent=p;
      const panel=byId('photoAiOutput');if(!panel)throw new Error('找不到 AI 排查包區塊');
      panel.classList.add('show');setActionEnabled(true);
      const c=currentCase();
      setStatus('success',`✅ 已產生 AI 排查包｜照片 ${state.images.length} 張｜型號 ${c.model||'未選'}｜帶入相關維修資料 ${state.lastKbCount} 筆。可直接按「複製＋開 ChatGPT」。`);
      setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),0);
    }catch(error){reportFailure(error,'產生排查包')}
    finally{if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'產生 AI 排查包'}}
  }
  function fallbackCopy(text){
    const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();return ok;
  }
  function copyPrompt(){
    const p=state.prompt||buildPrompt();if(!p)return false;
    try{
      if(navigator.clipboard&&location.protocol!=='file:'){
        navigator.clipboard.writeText(p).then(()=>setStatus('success','✅ AI 排查包已複製。接著把客戶照片一起貼到 ChatGPT。')).catch(()=>{
          if(fallbackCopy(p))setStatus('success','✅ AI 排查包已複製。接著把客戶照片一起貼到 ChatGPT。');
          else setStatus('error','複製失敗，請直接在下方排查包全選複製。');
        });
      }else if(fallbackCopy(p))setStatus('success','✅ AI 排查包已複製。接著把客戶照片一起貼到 ChatGPT。');
      else setStatus('error','複製失敗，請直接在下方排查包全選複製。');
      return true;
    }catch(error){reportFailure(error,'複製排查包');return false}
  }
  function copyAndOpen(){
    const p=state.prompt||buildPrompt();if(!p)return;
    copyPrompt();
    const win=window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
    if(!win)setStatus('info','排查包已準備；瀏覽器若阻擋新分頁，請手動開啟 ChatGPT。');
  }

  function showTab(){
    document.querySelectorAll('.toolbox').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    byId('tab-photoai')?.classList.add('active');byId('photoAiTabBtn')?.classList.add('active');renderCaseSnapshot();
  }
  function injectStyle(){
    if(byId('photoAiStyle'))return;
    const style=document.createElement('style');style.id='photoAiStyle';
    style.textContent=`
      #tab-photoai .photoai-intro{padding:12px 14px;border:1px solid #93c5fd;background:#eff6ff;color:#1e3a8a;border-radius:12px;font-size:13px;font-weight:800;line-height:1.65;margin-bottom:12px}
      #tab-photoai .photoai-privacy{padding:9px 12px;border:1px solid #86efac;background:#f0fdf4;color:#166534;border-radius:10px;font-size:12px;font-weight:750;line-height:1.6;margin-bottom:12px}
      #tab-photoai .photoai-step{border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px;background:#fff}#tab-photoai .photoai-step h3{margin:0 0 10px}
      #tab-photoai .photoai-drop{border:2px dashed #94a3b8;border-radius:14px;padding:18px;text-align:center;background:#f8fafc;transition:.15s}#tab-photoai .photoai-drop.drag{border-color:#2563eb;background:#eff6ff}#tab-photoai .photoai-drop input{display:none}
      #tab-photoai .photoai-previews{display:grid;gap:8px;margin-top:10px}#tab-photoai .photoai-preview{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid #e2e8f0;border-radius:12px;padding:8px;background:#fff}
      #tab-photoai .photoai-thumb{width:92px;height:72px;border-radius:9px;overflow:hidden;background:#e2e8f0;display:grid;place-items:center;text-align:center}#tab-photoai .photoai-thumb img{width:100%;height:100%;object-fit:cover;display:block}#tab-photoai .photoai-no-preview{font-size:11px;font-weight:800;color:#475569;line-height:1.4;padding:6px}
      #tab-photoai .photoai-file{min-width:0;display:grid;gap:2px}.photoai-file span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.photoai-file small{color:#64748b}#tab-photoai .photoai-empty{padding:14px;text-align:center;color:#64748b;background:#f8fafc;border-radius:10px}
      #tab-photoai .photoai-summary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#tab-photoai .photoai-summary-grid>div{border:1px solid #e2e8f0;border-radius:10px;padding:9px;display:grid;gap:4px}.photoai-summary-grid span{font-size:13px}.photoai-summary-grid small{color:#64748b}
      #tab-photoai .photoai-note{margin-top:8px;padding:9px;border-radius:9px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.6}#tab-photoai .photoai-status{margin:10px 0;padding:10px 12px;border-radius:10px;font-size:12px;font-weight:800;line-height:1.6}
      #tab-photoai .photoai-status.info{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}#tab-photoai .photoai-status.working{background:#f8fafc;color:#334155;border:1px solid #cbd5e1}#tab-photoai .photoai-status.success{background:#f0fdf4;color:#166534;border:1px solid #86efac}#tab-photoai .photoai-status.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
      #tab-photoai .photoai-output{display:none;margin-top:10px}#tab-photoai .photoai-output.show{display:block}#tab-photoai .photoai-prompt{white-space:pre-wrap;word-break:break-word;max-height:440px;overflow:auto;border:1px solid #cbd5e1;border-radius:12px;padding:12px;background:#0f172a;color:#e2e8f0;font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace}
      #tab-photoai textarea{min-height:90px}#tab-photoai button:disabled{opacity:.55;cursor:not-allowed}@media(max-width:720px){#tab-photoai .photoai-preview{grid-template-columns:78px minmax(0,1fr)}#tab-photoai .photoai-thumb{width:78px;height:64px}#tab-photoai .photoai-remove{grid-column:1/-1;width:100%}#tab-photoai .photoai-summary-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }
  function mount(){
    if(byId('tab-photoai'))return;
    const tabs=document.querySelector('.tabs'),work=byId('work');if(!tabs||!work)throw new Error('找不到工程師工具分頁容器');injectStyle();
    const tab=document.createElement('button');tab.type='button';tab.className='tab';tab.id='photoAiTabBtn';tab.textContent='AI 圖片排查';tab.addEventListener('click',guarded('開啟分頁',showTab));tabs.appendChild(tab);
    const panel=document.createElement('div');panel.className='toolbox';panel.id='tab-photoai';
    panel.innerHTML=`<div class="hero"><div><span class="badge">可選模組｜故障圖片</span><h1>AI 圖片快速排查</h1><div class="small">照片先行，型號可完全不選。系統負責整理案件與提示詞，最後交給 ChatGPT 看圖分析。</div></div></div>
      <div class="photoai-intro">⚡ 最快用法：客戶丟照片 → 直接加照片 → 按「產生 AI 排查包」。品牌、型號、症狀都不是必填；不知道就讓 ChatGPT 先從照片辨識。</div>
      <div class="photoai-privacy">🔒 照片只在目前瀏覽器分頁做本機預覽，不會自動上傳 GitHub、不會寫進案件紀錄，也不會由此頁直接送給任何 AI。只有你最後自己貼到 ChatGPT 的照片才會送出。</div>
      <div class="photoai-step"><h3>① 客戶照片 <small id="photoAiCount">0/${MAX_IMAGES} 張</small></h3><div class="photoai-drop" id="photoAiDrop"><b>拖曳照片到這裡、直接貼上截圖，或選擇照片</b><div class="small">最多 ${MAX_IMAGES} 張；單張 20 MB。iPhone HEIC 若瀏覽器不能顯示縮圖，仍會保留檔案並提示。</div><div class="btnrow" style="justify-content:center;margin-top:10px"><label class="btn primary" for="photoAiFiles">選擇照片</label><button type="button" class="btn ghost" id="photoAiClear">清除照片</button></div><input id="photoAiFiles" type="file" accept="image/*,.heic,.heif" multiple></div><div class="photoai-previews" id="photoAiPreviews"></div></div>
      <div class="photoai-step"><h3>② 客戶怎麼說 <small>選填</small></h3><div class="field"><label for="photoAiCustomerText">客戶原話</label><textarea id="photoAiCustomerText" placeholder="例如：昨天都正常，今天一開機就一直亮紅燈；不知道型號也沒關係。"></textarea></div><div class="field"><label for="photoAiDone">已經做過什麼</label><textarea id="photoAiDone" placeholder="例如：重開機、重新裝紙、清感應器；還沒處理也可以空白。"></textarea></div></div>
      <div class="photoai-step"><h3>③ 目前案件資料 <small>全部選填</small></h3><div id="photoAiCaseSnapshot"></div><div class="btnrow" style="margin-top:10px"><button type="button" class="btn ghost" id="photoAiSync">重新抓目前案件資料</button></div></div>
      <div class="photoai-step"><h3>④ 交給 ChatGPT 排查</h3><div class="small">系統會依你有提供的資訊自動整理；沒有型號時，不會亂套某個機型資料，而是要求 ChatGPT 先從照片辨識。</div><div class="photoai-status info" id="photoAiStatus" role="status" aria-live="polite">可以開始：只放照片就能用，型號不必先選。</div><div class="btnrow" style="margin-top:10px"><button type="button" class="btn primary" id="photoAiBuild">產生 AI 排查包</button><button type="button" class="btn secondary" id="photoAiOpen" disabled>複製＋開 ChatGPT</button><button type="button" class="btn ghost" id="photoAiCopy" disabled>只複製</button></div><div class="photoai-output" id="photoAiOutput"><pre class="photoai-prompt" id="photoAiPrompt"></pre></div></div>`;
    work.appendChild(panel);
    const input=byId('photoAiFiles'),drop=byId('photoAiDrop');
    input?.addEventListener('change',guarded('加入照片',e=>addFiles(e.target.files)));byId('photoAiClear')?.addEventListener('click',guarded('清除照片',resetImages));byId('photoAiSync')?.addEventListener('click',guarded('同步案件',()=>{invalidate();renderCaseSnapshot();setStatus('success','✅ 已重新抓取目前案件資料；型號若仍未選也可以直接排查。')}));byId('photoAiBuild')?.addEventListener('click',guarded('產生排查包',renderPrompt));byId('photoAiCopy')?.addEventListener('click',guarded('複製排查包',copyPrompt));byId('photoAiOpen')?.addEventListener('click',guarded('開啟 ChatGPT',copyAndOpen));['photoAiCustomerText','photoAiDone'].forEach(id=>byId(id)?.addEventListener('input',guarded('更新案件文字',()=>{invalidate();renderCaseSnapshot()})));
    if(drop){['dragenter','dragover'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.add('drag')}));['dragleave','drop'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.remove('drag')}));drop.addEventListener('drop',guarded('拖曳照片',e=>addFiles(e.dataTransfer?.files)))}
    document.addEventListener('paste',guarded('貼上圖片',e=>{if(!byId('tab-photoai')?.classList.contains('active'))return;const files=[...(e.clipboardData?.files||[])].filter(isImageFile);if(files.length){e.preventDefault();addFiles(files)}}));
    renderImages();renderCaseSnapshot();setActionEnabled(false);
    window.PHOTO_AI_HANDOFF=Object.freeze({version:'2.0',getState:()=>({imageCount:state.images.length,promptReady:!!state.prompt,kbCount:state.lastKbCount}),buildPrompt,renderPrompt,showTab});
    if(window.__optionalFeatureStatus)window.__optionalFeatureStatus[FEATURE]='ready';console.info(`[萬里工程師工具] ${FEATURE} ready｜無型號模式 enabled`);
  }
  try{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',guarded('初始化',mount),{once:true});else mount()}catch(error){reportFailure(error,'初始化')}
})();
