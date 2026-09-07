'use strict';

(function(){
  const FEATURE='AI 圖片排查';
  const MAX_IMAGES=6;
  const MAX_BYTES=20*1024*1024;
  const state={images:[],prompt:'',lastKbCount:0};

  const byId=id=>document.getElementById(id);
  const value=id=>byId(id)?.value?.trim()||'';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const clamp=(s,n=180)=>{const x=String(s||'').replace(/\s+/g,' ').trim();return x.length>n?x.slice(0,n-1)+'…':x};

  function setStatus(kind,msg){
    const box=byId('photoAiStatus');
    if(!box)return;
    box.className=`photoai-status ${kind||'info'}`;
    box.textContent=msg;
    box.hidden=false;
  }
  function reportFailure(error,context){
    console.error(`[萬里工程師工具] ${FEATURE} ${context||'執行'}失敗`,error);
    setStatus('error',`⚠️ ${context||'功能'}失敗：${error?.message||String(error||'未知錯誤')}。其他功能不受影響。`);
    try{window.__reportOptionalFeatureFailure?.(FEATURE,error)}catch(e){}
  }
  function guarded(context,fn){
    return function(...args){
      try{return fn.apply(this,args)}catch(error){reportFailure(error,context)}
    };
  }
  function invalidate(){
    state.prompt='';state.lastKbCount=0;
    ['photoAiCopy','photoAiOpen'].forEach(id=>{const el=byId(id);if(el)el.disabled=true});
    const out=byId('photoAiOutput');if(out)out.hidden=true;
  }
  function currentCase(){
    return {
      brand:value('brand'),model:value('model'),symptom:value('symptom'),notes:value('notes'),
      customerText:value('photoAiCustomerText'),done:value('photoAiDone')
    };
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
      ['TOSHIBA',['toshiba','東芝']],['SATO',['sato']],['Honeywell',['honeywell','datamax','intermec']]
    ];
    for(const [name,keys] of aliases){if(keys.some(k=>text.includes(k))){brand=name;break}}
    if(model&&!brand){
      const p=products.find(x=>String(x?.m||'').trim()===model);
      brand=String(p?.b||p?.brand||'').trim();
    }
    return {model,brand};
  }
  function compactCaseText(){
    const c=currentCase(),i=inferFromText(c);
    const device=[c.brand||i.brand,c.model||i.model].filter(Boolean).join(' ')||'型號未確認';
    const symptom=c.symptom||clamp(c.customerText,52)||'直接看照片排查';
    return `${device}｜${symptom}`;
  }
  function renderCaseLine(){
    const box=byId('photoAiCaseLine');
    if(box)box.textContent=compactCaseText();
  }

  function prettyBytes(n){
    if(n<1024*1024)return `${Math.max(1,Math.round(n/1024))} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  }
  function revoke(item){try{URL.revokeObjectURL(item.url)}catch(e){}}
  function isImageFile(file){return String(file?.type||'').startsWith('image/')||/\.(heic|heif)$/i.test(file?.name||'')}
  function addFiles(fileList){
    const files=[...(fileList||[])];if(!files.length)return;
    let added=0,rejected=0,oversize=0,duplicate=0;
    for(const file of files){
      if(state.images.length>=MAX_IMAGES)break;
      if(!isImageFile(file)){rejected++;continue}
      if(file.size>MAX_BYTES){oversize++;continue}
      if(state.images.some(x=>x.file.name===file.name&&x.file.size===file.size&&x.file.lastModified===file.lastModified)){duplicate++;continue}
      state.images.push({id:`p${Date.now()}-${Math.random().toString(36).slice(2,8)}`,file,url:URL.createObjectURL(file)});
      added++;
    }
    const input=byId('photoAiFiles');if(input)input.value='';
    invalidate();renderImages();renderCaseLine();
    const msg=[added?`已加入 ${added} 張`:'' ,oversize?`${oversize} 張超過 20 MB`:'' ,rejected?`${rejected} 個非圖片`:'' ,duplicate?`${duplicate} 張重複`:'' ].filter(Boolean).join('；');
    setStatus(added?'success':'info',msg||'照片沒有變更');
  }
  function clearImages(){
    state.images.forEach(revoke);state.images=[];
    const input=byId('photoAiFiles');if(input)input.value='';
    invalidate();renderImages();setStatus('info','照片已清除');
  }
  function renderImages(){
    const box=byId('photoAiPreviews'),count=byId('photoAiCount');
    if(count)count.textContent=`${state.images.length}/${MAX_IMAGES}`;
    if(!box)return;
    if(!state.images.length){
      box.innerHTML='<div class="photoai-empty">拖照片進來，或直接貼上截圖。</div>';
      return;
    }
    box.innerHTML=state.images.map((x,i)=>`<div class="photoai-preview">
      <div class="photoai-thumb" data-photo-thumb="${esc(x.id)}"><img src="${esc(x.url)}" alt="故障照片 ${i+1}"></div>
      <div class="photoai-file"><b>照片 ${i+1}</b><span>${esc(x.file.name||'未命名')}</span><small>${prettyBytes(x.file.size||0)}</small></div>
      <button type="button" class="btn ghost photoai-remove" data-photo-remove="${esc(x.id)}">移除</button>
    </div>`).join('');
    box.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
      const thumb=img.closest('[data-photo-thumb]');
      if(thumb)thumb.innerHTML='<div class="photoai-no-preview">已加入<br><small>此格式無法預覽</small></div>';
    },{once:true}));
    box.querySelectorAll('[data-photo-remove]').forEach(btn=>btn.addEventListener('click',guarded('移除照片',()=>{
      const idx=state.images.findIndex(x=>x.id===btn.dataset.photoRemove);
      if(idx>=0){revoke(state.images[idx]);state.images.splice(idx,1);invalidate();renderImages();setStatus('info','照片已移除')}
    })));
  }

  const keywordGroups=[
    ['ribbon','色帶','碳帶'],['paper','media','紙張','紙','標籤'],['sensor','感應','感應器'],['校正','定位','跳標'],
    ['皺','皺碳'],['淡','模糊','不清楚'],['偏','走偏'],['error','錯誤','警報'],['cutter','切刀','裁刀'],['列印','print'],
    ['motor','馬達'],['主板','mainboard','motherboard'],['電源','power'],['網路','network','ethernet'],['條碼','barcode'],['printhead','印字頭','列印頭']
  ];
  function contextKeywords(text){
    const t=String(text||'').toLowerCase();
    return keywordGroups.filter(g=>g.some(k=>t.includes(k))).flat();
  }
  function kbMatches(c,inferred){
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    if(!kb.length)return [];
    const model=c.model||inferred.model||'';
    const brand=c.brand||inferred.brand||'';
    const context=`${c.symptom} ${c.customerText} ${c.notes} ${c.done}`.toLowerCase().trim();
    const keys=contextKeywords(context);
    if(!model&&!brand&&!context)return [];
    return kb.map(x=>{
      const models=Array.isArray(x?.models)?x.models:[];
      const text=`${x?.title||''} ${x?.category||''} ${x?.summary||''} ${(x?.keyFacts||[]).join(' ')}`.toLowerCase();
      let score=0;
      if(model&&models.includes(model))score+=40;
      if(brand&&String(x?.brand||'').toLowerCase()===brand.toLowerCase())score+=8;
      if(c.symptom&&text.includes(c.symptom.toLowerCase()))score+=12;
      keys.forEach(k=>{if(text.includes(k))score+=2});
      return {x,score};
    }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,2).map(v=>v.x);
  }
  function kbHints(entries,confirmedModel){
    if(!entries.length)return '';
    return entries.map(x=>{
      const title=clamp(x?.title||x?.category||'維修資料',72);
      const summary=clamp(x?.summary||'',120);
      return `- ${title}${summary?`：${summary}`:''}`;
    }).join('\n')+(confirmedModel?'':'\n（型號未確認，只能當方向，不可當機型定論）');
  }

  function buildPrompt(){
    const c=currentCase(),inferred=inferFromText(c);
    const hasText=!!(c.customerText||c.notes||c.done||c.symptom);
    if(!state.images.length&&!hasText){
      setStatus('error','先放一張照片，或至少輸入一句客戶描述。型號不用選。');
      return '';
    }
    const kb=kbMatches(c,inferred);state.lastKbCount=kb.length;
    const brand=c.brand||inferred.brand||'未確認';
    const model=c.model||inferred.model||'未確認';
    const hints=kbHints(kb,!!c.model);
    const lines=[
      '【標籤機快速排查】',
      state.images.length?`照片：${state.images.length} 張（請先看照片）`:'照片：無',
      `設備：${brand} / ${model}`,
      c.symptom?`症狀：${c.symptom}`:'',
      c.customerText?`客戶：${c.customerText}`:'',
      c.notes?`觀察：${c.notes}`:'',
      c.done?`已做：${c.done}`:'',
      hints?`站內提示：\n${hints}`:'',
      '',
      '不要寫長篇分析，直接幫工程師排除問題。',
      '回覆固定只用下面格式：',
      '',
      '【先判斷】最可能原因 1～3 個，短句即可。',
      '【現在先做】最多 3 步，從最快、最安全、最容易排除的開始。每一步都寫「怎麼做 → 看到什麼代表什麼 → 下一步」。',
      '【缺什麼】只有真的無法往下判斷時，才要求補 1 張照片或 1 個資訊。',
      '',
      '型號不確定就先從照片辨識；辨識不了也要先給通用安全檢查，不要卡住。',
      '不要重述案件、不要教科書解釋、不要列一堆可能性、不要猜 Pin／線色／電壓／料號。',
      '除非涉及拆機或帶電量測，否則不用一直寫安全提醒。',
      '整體盡量控制在 250 字內，目標是讓我立刻照著做。'
    ].filter(Boolean);
    state.prompt=lines.join('\n');
    return state.prompt;
  }
  function buildAndShow(){
    const btn=byId('photoAiBuild'),old=btn?.textContent;
    if(btn){btn.disabled=true;btn.textContent='整理中…'}
    try{
      const p=buildPrompt();if(!p)return;
      const pre=byId('photoAiPrompt');if(pre)pre.textContent=p;
      const out=byId('photoAiOutput');if(out)out.hidden=false;
      ['photoAiCopy','photoAiOpen'].forEach(id=>{const el=byId(id);if(el)el.disabled=false});
      setStatus('success',`✅ 快速排查已準備好${state.lastKbCount?`｜帶入 ${state.lastKbCount} 筆相關資料`:''}`);
      byId('photoAiActions')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }finally{
      if(btn){btn.disabled=false;btn.textContent=old||'⚡ 產生快速排查'}
    }
  }
  function fallbackCopy(text){
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.focus();ta.select();
    try{document.execCommand('copy');setStatus('success','✅ 已複製')}
    catch(e){setStatus('error','複製失敗，請展開內容後手動複製')}
    ta.remove();
  }
  function copyPrompt(){
    const p=state.prompt||buildPrompt();if(!p)return false;
    if(navigator.clipboard&&location.protocol!=='file:'){
      navigator.clipboard.writeText(p).then(()=>setStatus('success','✅ 已複製')).catch(()=>fallbackCopy(p));
    }else fallbackCopy(p);
    return true;
  }
  function copyAndOpen(){
    if(!copyPrompt())return;
    const win=window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
    if(!win)setStatus('info','排查內容已複製；瀏覽器擋住新分頁時請手動開 ChatGPT。');
  }

  function showTab(){
    document.querySelectorAll('.toolbox').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    byId('tab-photoai')?.classList.add('active');byId('photoAiTabBtn')?.classList.add('active');
    renderCaseLine();
  }
  function injectStyle(){
    if(byId('photoAiStyle'))return;
    const style=document.createElement('style');style.id='photoAiStyle';
    style.textContent=`
      #tab-photoai .photoai-topline{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:9px 11px;margin-bottom:10px;border:1px solid #dbeafe;background:#eff6ff;border-radius:10px;font-size:12px;color:#1e3a8a}
      #tab-photoai .photoai-topline b{font-size:13px}
      #tab-photoai .photoai-drop{border:2px dashed #94a3b8;border-radius:14px;padding:16px;text-align:center;background:#f8fafc;transition:.15s}
      #tab-photoai .photoai-drop.drag{border-color:#2563eb;background:#eff6ff}
      #tab-photoai .photoai-drop input{display:none}
      #tab-photoai .photoai-drop .big{font-weight:850;font-size:15px;margin-bottom:5px}
      #tab-photoai .photoai-previews{display:grid;gap:7px;margin-top:8px}
      #tab-photoai .photoai-preview{display:grid;grid-template-columns:82px minmax(0,1fr) auto;gap:9px;align-items:center;border:1px solid #e2e8f0;border-radius:10px;padding:7px;background:#fff}
      #tab-photoai .photoai-thumb{width:82px;height:64px;border-radius:8px;overflow:hidden;background:#e2e8f0;display:flex;align-items:center;justify-content:center;text-align:center}
      #tab-photoai .photoai-thumb img{width:100%;height:100%;object-fit:cover}.photoai-no-preview{font-size:11px;line-height:1.35;color:#475569}
      #tab-photoai .photoai-file{min-width:0;display:grid;gap:2px}#tab-photoai .photoai-file span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}#tab-photoai .photoai-file small{color:#64748b}
      #tab-photoai .photoai-empty{padding:10px;color:#64748b;font-size:12px}
      #tab-photoai .photoai-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}#tab-photoai .photoai-fields label{font-size:12px;font-weight:800}#tab-photoai textarea{min-height:74px;margin-top:5px}
      #tab-photoai .photoai-status{margin:9px 0;padding:8px 10px;border-radius:9px;font-size:12px;font-weight:750}#tab-photoai .photoai-status.info{background:#f1f5f9;color:#334155}#tab-photoai .photoai-status.success{background:#ecfdf5;color:#166534}#tab-photoai .photoai-status.error{background:#fef2f2;color:#991b1b}
      #tab-photoai .photoai-buildrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}#tab-photoai .photoai-build{font-size:15px;padding:11px 18px}
      #tab-photoai .photoai-output{margin-top:10px}#tab-photoai .photoai-output details{border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;padding:8px 10px}#tab-photoai .photoai-output summary{cursor:pointer;font-size:12px;font-weight:800;color:#475569}
      #tab-photoai .photoai-prompt{white-space:pre-wrap;word-break:break-word;max-height:320px;overflow:auto;margin:8px 0 0;border-top:1px solid #e2e8f0;padding-top:8px;font:12px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;color:#334155}
      #tab-photoai button:disabled{opacity:.5;cursor:not-allowed}
      @media(max-width:720px){#tab-photoai .photoai-fields{grid-template-columns:1fr}#tab-photoai .photoai-preview{grid-template-columns:70px minmax(0,1fr)}#tab-photoai .photoai-thumb{width:70px;height:58px}#tab-photoai .photoai-remove{grid-column:1/-1;width:100%}}
    `;
    document.head.appendChild(style);
  }
  function mount(){
    if(byId('tab-photoai'))return;
    const tabs=document.querySelector('.tabs'),work=byId('work');
    if(!tabs||!work)throw new Error('找不到工程師工具分頁容器');
    injectStyle();
    const tab=document.createElement('button');tab.type='button';tab.className='tab';tab.id='photoAiTabBtn';tab.textContent='AI 圖片排查';tab.addEventListener('click',guarded('開啟分頁',showTab));tabs.appendChild(tab);

    const panel=document.createElement('div');panel.className='toolbox';panel.id='tab-photoai';
    panel.innerHTML=`
      <div class="hero"><div><span class="badge">可選模組｜快速排除</span><h1>AI 圖片快速排查</h1><div class="small">丟照片 → 補一句話（可省略）→ 直接排查。品牌、型號都不是必填。</div></div></div>
      <div class="photoai-topline"><b id="photoAiCaseLine">型號未確認｜直接看照片排查</b><span>照片只留在本機預覽</span></div>

      <div class="photoai-drop" id="photoAiDrop">
        <div class="big">① 丟照片進來 <small id="photoAiCount">0/${MAX_IMAGES}</small></div>
        <div class="small">拖曳、貼上截圖，或選照片</div>
        <div class="btnrow" style="justify-content:center;margin-top:8px">
          <label class="btn secondary" for="photoAiFiles">選擇照片</label>
          <button type="button" class="btn ghost" id="photoAiClear">清除照片</button>
        </div>
        <input id="photoAiFiles" type="file" accept="image/*,.heic,.heif" multiple>
      </div>
      <div class="photoai-previews" id="photoAiPreviews"></div>

      <div class="photoai-fields">
        <label>② 客戶怎麼說（選填）<textarea id="photoAiCustomerText" placeholder="例如：昨天正常，今天一直顯示 Ribbon Out"></textarea></label>
        <label>已經試過什麼（選填）<textarea id="photoAiDone" placeholder="例如：重裝碳帶、清 Sensor、重新校正"></textarea></label>
      </div>

      <div id="photoAiStatus" class="photoai-status info">型號不用選。只放照片就可以開始。</div>
      <div class="photoai-buildrow" id="photoAiActions">
        <button type="button" class="btn primary photoai-build" id="photoAiBuild">⚡ 產生快速排查</button>
        <button type="button" class="btn secondary" id="photoAiOpen" disabled>複製＋開 ChatGPT</button>
        <button type="button" class="btn ghost" id="photoAiCopy" disabled>只複製</button>
      </div>
      <div class="photoai-output" id="photoAiOutput" hidden>
        <details><summary>查看交接內容（平常不用看）</summary><pre class="photoai-prompt" id="photoAiPrompt"></pre></details>
      </div>`;
    work.appendChild(panel);

    const input=byId('photoAiFiles'),drop=byId('photoAiDrop');
    input?.addEventListener('change',guarded('加入照片',e=>addFiles(e.target.files)));
    byId('photoAiClear')?.addEventListener('click',guarded('清除照片',clearImages));
    byId('photoAiBuild')?.addEventListener('click',guarded('產生快速排查',buildAndShow));
    byId('photoAiCopy')?.addEventListener('click',guarded('複製排查內容',copyPrompt));
    byId('photoAiOpen')?.addEventListener('click',guarded('開啟 ChatGPT',copyAndOpen));
    ['photoAiCustomerText','photoAiDone'].forEach(id=>byId(id)?.addEventListener('input',()=>{invalidate();renderCaseLine()}));
    ['brand','model','symptom','notes'].forEach(id=>byId(id)?.addEventListener('change',()=>{invalidate();renderCaseLine()}));

    drop?.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag')});
    drop?.addEventListener('dragleave',()=>drop.classList.remove('drag'));
    drop?.addEventListener('drop',guarded('拖曳照片',e=>{e.preventDefault();drop.classList.remove('drag');addFiles(e.dataTransfer?.files)}));
    document.addEventListener('paste',guarded('貼上圖片',e=>{
      if(!byId('tab-photoai')?.classList.contains('active'))return;
      const files=[...(e.clipboardData?.files||[])].filter(isImageFile);
      if(files.length){e.preventDefault();addFiles(files)}
    }));

    renderImages();renderCaseLine();
    window.__photoAiHandoff={buildPrompt,buildAndShow,state,addFiles};
    if(window.__optionalFeatureStatus)window.__optionalFeatureStatus[FEATURE]='ready';
    console.info(`[萬里工程師工具] ${FEATURE} ready`);
  }

  try{
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',guarded('初始化',mount),{once:true});
    else mount();
  }catch(error){reportFailure(error,'初始化')}
})();
