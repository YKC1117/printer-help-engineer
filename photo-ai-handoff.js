'use strict';

(function(){
  const FEATURE='AI 圖片排查';
  const MAX_IMAGES=6;
  const MAX_BYTES=20*1024*1024;
  const state={images:[],prompt:''};

  function byId(id){return document.getElementById(id)}
  function h(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function value(id){return byId(id)?.value?.trim()||''}
  function notify(msg){
    try{
      if(typeof window.toast==='function')window.toast(msg);
      else console.info(`[${FEATURE}] ${msg}`);
    }catch(e){console.info(`[${FEATURE}] ${msg}`)}
  }
  function copyTextSafe(text){
    try{
      if(typeof window.copyText==='function'){window.copyText(text);return}
      if(navigator.clipboard&&location.protocol!=='file:'){
        navigator.clipboard.writeText(text).then(()=>notify('已複製 AI 排查包')).catch(()=>fallbackCopy(text));
      }else fallbackCopy(text);
    }catch(e){fallbackCopy(text)}
  }
  function fallbackCopy(text){
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.focus();ta.select();
    try{document.execCommand('copy');notify('已複製 AI 排查包')}catch(e){notify('複製失敗，請手動全選文字')}
    ta.remove();
  }
  function prettyBytes(n){
    if(n<1024*1024)return `${Math.max(1,Math.round(n/1024))} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  }
  function revoke(item){try{URL.revokeObjectURL(item.url)}catch(e){}}
  function resetImages(){
    state.images.forEach(revoke);state.images=[];
    const input=byId('photoAiFiles');if(input)input.value='';
    renderImages();
  }
  function currentCase(){
    return {
      brand:value('brand'),
      type:value('type'),
      series:value('series'),
      model:value('model'),
      symptom:value('symptom'),
      customer:value('customer'),
      serial:value('serial'),
      engineer:value('engineer'),
      notes:value('notes'),
      customerText:value('photoAiCustomerText'),
      done:value('photoAiDone')
    };
  }
  function maskSerial(s){
    const x=String(s||'').trim();
    if(!x)return '未填';
    if(x.length<=4)return '已填';
    return `••••${x.slice(-4)}`;
  }
  function renderCaseSnapshot(){
    const box=byId('photoAiCaseSnapshot');if(!box)return;
    const c=currentCase();
    box.innerHTML=`<div class="photoai-summary-grid">
      <div><b>設備</b><span>${h([c.brand,c.model].filter(Boolean).join(' ')||'尚未選擇')}</span></div>
      <div><b>症狀</b><span>${h(c.symptom||'尚未選擇')}</span></div>
      <div><b>客戶</b><span>${h(c.customer||'未填')} <small>（只在本頁顯示）</small></span></div>
      <div><b>序號</b><span>${h(maskSerial(c.serial))} <small>（不放進 AI 文字包）</small></span></div>
    </div>
    <div class="photoai-note"><b>目前觀察：</b>${h(c.notes||'未填')}</div>`;
  }
  function addFiles(fileList){
    const files=[...(fileList||[])];
    let rejected=0,oversize=0;
    for(const file of files){
      if(state.images.length>=MAX_IMAGES)break;
      const imageLike=String(file.type||'').startsWith('image/')||/\.(heic|heif)$/i.test(file.name||'');
      if(!imageLike){rejected++;continue}
      if(file.size>MAX_BYTES){oversize++;continue}
      state.images.push({
        id:`p${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        file,
        url:URL.createObjectURL(file)
      });
    }
    renderImages();
    if(files.length&&state.images.length>=MAX_IMAGES)notify(`最多保留 ${MAX_IMAGES} 張照片`);
    if(rejected)notify(`${rejected} 個檔案不是圖片，已略過`);
    if(oversize)notify(`${oversize} 張圖片超過 20 MB，已略過`);
  }
  function renderImages(){
    const box=byId('photoAiPreviews'),count=byId('photoAiCount');
    if(count)count.textContent=`${state.images.length}/${MAX_IMAGES} 張`;
    if(!box)return;
    if(!state.images.length){
      box.innerHTML='<div class="photoai-empty">尚未加入照片。可直接拖曳、貼上截圖，或點「選擇照片」。</div>';
      return;
    }
    box.innerHTML=state.images.map((x,i)=>`<div class="photoai-preview">
      <div class="photoai-thumb"><img src="${h(x.url)}" alt="故障照片預覽 ${i+1}" loading="lazy"></div>
      <div class="photoai-file"><b>照片 ${i+1}</b><span>${h(x.file.name||'未命名圖片')}</span><small>${h(x.file.type||'image')}・${prettyBytes(x.file.size||0)}</small></div>
      <button type="button" class="btn ghost photoai-remove" data-photo-remove="${h(x.id)}">移除</button>
    </div>`).join('');
    box.querySelectorAll('[data-photo-remove]').forEach(btn=>btn.addEventListener('click',()=>{
      const idx=state.images.findIndex(x=>x.id===btn.dataset.photoRemove);
      if(idx>=0){revoke(state.images[idx]);state.images.splice(idx,1);renderImages()}
    }));
  }
  function kbMatches(c){
    const kb=Array.isArray(window.REPAIR_KB)?window.REPAIR_KB:[];
    if(!kb.length)return [];
    const direct=kb.filter(x=>Array.isArray(x.models)&&c.model&&x.models.includes(c.model));
    const pool=direct.length?direct:kb.filter(x=>Array.isArray(x.models)&&x.models.includes('ALL'));
    const context=`${c.symptom} ${c.customerText} ${c.notes} ${c.done}`.toLowerCase();
    const keywords=['ribbon','色帶','碳帶','paper','media','紙張','紙','sensor','感應','校正','皺','淡','偏','error','錯誤','cutter','切刀','列印','print','motor','馬達','主板','電源','網路','network','條碼','barcode'];
    return pool.map(x=>{
      const text=`${x.title||''} ${x.category||''} ${x.summary||''} ${(x.keyFacts||[]).join(' ')}`.toLowerCase();
      let score=Array.isArray(x.models)&&x.models.includes(c.model)?20:0;
      for(const k of keywords)if(context.includes(k)&&text.includes(k))score+=3;
      if(c.symptom&&text.includes(c.symptom.toLowerCase()))score+=8;
      return {x,score};
    }).sort((a,b)=>b.score-a.score).slice(0,4).map(v=>v.x);
  }
  function kbText(entries){
    if(!entries.length)return '目前沒有自動帶入的內部維修資料，請以照片與案件描述先做初判。';
    return entries.map((x,i)=>{
      const eng=Array.isArray(x.engineering)?x.engineering.slice(0,2):[];
      const facts=Array.isArray(x.keyFacts)?x.keyFacts.slice(0,2):[];
      const detail=[
        `${i+1}. ${x.title||x.category||'維修資料'}`,
        x.summary?`   摘要：${x.summary}`:'',
        facts.length?`   關鍵：${facts.join('；')}`:'',
        eng.length?`   工程原則：${eng.join('；')}`:''
      ].filter(Boolean);
      return detail.join('\n');
    }).join('\n');
  }
  function buildPrompt(){
    const c=currentCase();
    if(!state.images.length){notify('請先加入至少一張照片');return ''}
    const kb=kbMatches(c);
    const lines=[
      '【萬里資訊｜AI 圖片排查交接包】',
      '',
      `我會在這則訊息另外附上 ${state.images.length} 張標籤機／故障相關照片，請把「圖片可見內容」和以下案件資料一起分析。`,
      '照片本身不包含在這段文字裡；若聊天中沒有實際收到圖片，請直接告訴我，不要假裝已看過。',
      '',
      '【案件資料】',
      `品牌：${c.brand||'尚未確認'}`,
      `機型類別：${c.type||'尚未確認'}`,
      `產品系列：${c.series||'尚未確認'}`,
      `實際型號：${c.model||'尚未確認'}`,
      `目前症狀：${c.symptom||'尚未確認'}`,
      `客戶原話：${c.customerText||'未填'}`,
      `現場額外觀察：${c.notes||'未填'}`,
      `已做過的檢查／處理：${c.done||'未填'}`,
      '',
      '※ 客戶名稱、完整序號、工程師姓名刻意不放入此 AI 文字包。',
      '',
      '【工程師工具自動帶入的相關維修資料】',
      kbText(kb),
      '',
      '【請依下列格式回覆】',
      '1. 圖片中「可以確定」看到的事實：包含面板錯誤文字、燈號、耗材走法、列印異常型態、零件或接頭外觀；看不清楚就明講。',
      '2. 圖片中無法確認、需要我補拍或補問客戶的資訊。',
      '3. 故障可能性排序：高／中／低，逐項說明判斷依據；不要把推測寫成確定故障。',
      '4. 建議工程師下一步：由安全、低風險、可逆的檢查開始，再進設定／校正／感應器／機構／線路／主板。',
      '5. 若需要量測：說明應量什麼訊號或狀態；如果沒有可靠的機型接腳資料，不要猜 Pin、線色或電壓。',
      '6. 建議進入哪一條排查方向，以及目前最值得先排除的 1～3 件事。',
      '7. 最後給一段「工程師現場版結論」，簡短到我可以直接照著做。',
      '',
      '【判斷規則】',
      '- 圖片辨識到的品牌／型號若與案件資料衝突，要指出衝突，不可直接覆蓋。',
      '- 不可只因一張照片就直接判定要換主板、Printhead、Sensor 或馬達；除非已有足夠排除證據。',
      '- 涉及拆接頭、阻值量測、Printhead、電源或主板時要提醒斷電／安全條件。',
      '- 若照片品質不足，優先告訴我「下一張應該怎麼拍」而不是硬猜。'
    ];
    state.prompt=lines.join('\n');
    return state.prompt;
  }
  function renderPrompt(){
    const p=buildPrompt();if(!p)return;
    const out=byId('photoAiPrompt');
    if(out)out.textContent=p;
    byId('photoAiOutput')?.classList.add('show');
    notify('AI 排查包已整理完成');
  }
  function copyPrompt(){
    const p=state.prompt||buildPrompt();if(!p)return false;
    copyTextSafe(p);return true;
  }
  function copyAndOpen(){
    if(!copyPrompt())return;
    const win=window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
    if(!win)notify('排查包已複製；瀏覽器阻擋新視窗時，請手動開啟 ChatGPT');
  }
  function showTab(){
    document.querySelectorAll('.toolbox').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    const panel=byId('tab-photoai'),btn=byId('photoAiTabBtn');
    panel?.classList.add('active');btn?.classList.add('active');
    renderCaseSnapshot();
  }
  function injectStyle(){
    if(byId('photoAiStyle'))return;
    const style=document.createElement('style');style.id='photoAiStyle';
    style.textContent=`
      #tab-photoai .photoai-privacy{padding:10px 12px;border:1px solid #86efac;background:#f0fdf4;color:#166534;border-radius:10px;font-size:12px;font-weight:750;line-height:1.6;margin-bottom:12px}
      #tab-photoai .photoai-drop{border:2px dashed #94a3b8;border-radius:14px;padding:18px;text-align:center;background:#f8fafc;transition:.15s}
      #tab-photoai .photoai-drop.drag{border-color:#2563eb;background:#eff6ff}
      #tab-photoai .photoai-drop b{display:block;margin-bottom:6px}
      #tab-photoai .photoai-drop input{display:none}
      #tab-photoai .photoai-previews{display:grid;gap:8px;margin-top:10px}
      #tab-photoai .photoai-preview{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid #e2e8f0;border-radius:12px;padding:8px;background:#fff}
      #tab-photoai .photoai-thumb{width:92px;height:72px;border-radius:9px;overflow:hidden;background:#e2e8f0;display:flex;align-items:center;justify-content:center}
      #tab-photoai .photoai-thumb img{width:100%;height:100%;object-fit:cover}
      #tab-photoai .photoai-file{min-width:0;display:flex;flex-direction:column;gap:2px}
      #tab-photoai .photoai-file span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #tab-photoai .photoai-file small,#tab-photoai small{color:#64748b}
      #tab-photoai .photoai-empty{padding:14px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b;text-align:center}
      #tab-photoai .photoai-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
      #tab-photoai .photoai-summary-grid>div{padding:9px 10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff}
      #tab-photoai .photoai-summary-grid b{display:block;font-size:12px;color:#475569;margin-bottom:3px}
      #tab-photoai .photoai-summary-grid span{font-weight:750}
      #tab-photoai .photoai-note{padding:9px 10px;background:#f8fafc;border-radius:10px;line-height:1.6}
      #tab-photoai .photoai-output{display:none;margin-top:12px}.photoai-output.show{display:block}
      #tab-photoai .photoai-prompt{white-space:pre-wrap;max-height:420px;overflow:auto;background:#0f172a;color:#e2e8f0;border-radius:12px;padding:12px;font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace}
      #tab-photoai .photoai-step{border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:10px 0;background:#fff}
      #tab-photoai .photoai-step h3{margin:0 0 8px;font-size:15px}
      @media(max-width:720px){
        #tab-photoai .photoai-preview{grid-template-columns:76px minmax(0,1fr)}
        #tab-photoai .photoai-thumb{width:76px;height:64px}
        #tab-photoai .photoai-remove{grid-column:1/-1;width:100%}
        #tab-photoai .photoai-summary-grid{grid-template-columns:1fr}
      }`;
    document.head.appendChild(style);
  }
  function mount(){
    if(byId('tab-photoai'))return;
    const tabs=document.querySelector('.tabs');
    const work=byId('work');
    if(!tabs||!work)throw new Error('找不到工程師工具分頁容器');

    injectStyle();

    const tab=document.createElement('button');
    tab.type='button';tab.className='tab';tab.id='photoAiTabBtn';tab.textContent='AI 圖片排查';
    tab.addEventListener('click',showTab);
    tabs.appendChild(tab);

    const panel=document.createElement('div');
    panel.className='toolbox';panel.id='tab-photoai';
    panel.innerHTML=`<div class="hero"><div><span class="badge">可選模組｜故障圖片</span><h1>AI 圖片排查交接</h1><div class="small">上傳照片 → 本機預覽 → 整理案件 → 產生 AI 排查包 → 複製到 ChatGPT</div></div></div>
      <div class="photoai-privacy">🔒 照片只在目前瀏覽器分頁做本機預覽，不會自動上傳 GitHub、不會寫進案件紀錄，也不會由此頁直接送給任何 AI。最後仍由你決定要把哪些照片附到 ChatGPT。</div>

      <div class="photoai-step">
        <h3>① 加入客戶照片 <small id="photoAiCount">0/${MAX_IMAGES} 張</small></h3>
        <div class="photoai-drop" id="photoAiDrop">
          <b>拖曳照片到這裡，或直接貼上截圖</b>
          <div class="small">支援一般圖片格式；單張上限 20 MB，最多 ${MAX_IMAGES} 張。</div>
          <div class="btnrow" style="justify-content:center;margin-top:10px">
            <label class="btn primary" for="photoAiFiles" style="cursor:pointer">選擇照片</label>
            <button type="button" class="btn ghost" id="photoAiClear">清除照片</button>
          </div>
          <input id="photoAiFiles" type="file" accept="image/*,.heic,.heif" multiple>
        </div>
        <div class="photoai-previews" id="photoAiPreviews"></div>
      </div>

      <div class="photoai-step">
        <h3>② 補上客戶原話與已做處理</h3>
        <div class="field"><label for="photoAiCustomerText">客戶原話 <small>建議照貼，不用先整理</small></label><textarea id="photoAiCustomerText" placeholder="例如：昨天還可以印，今天一開機就一直顯示 Ribbon Out。"></textarea></div>
        <div class="field"><label for="photoAiDone">已經做過的檢查／處理 <small>可不填</small></label><textarea id="photoAiDone" placeholder="例如：重裝碳帶、清 Sensor、重新校正後仍異常。"></textarea></div>
      </div>

      <div class="photoai-step">
        <h3>③ 自動整理目前案件</h3>
        <div id="photoAiCaseSnapshot"></div>
        <div class="btnrow"><button type="button" class="btn ghost" id="photoAiSync">重新抓目前案件資料</button></div>
      </div>

      <div class="photoai-step">
        <h3>④ 產生 ChatGPT AI 排查包</h3>
        <div class="small">會自動帶入品牌／型號／症狀、客戶原話、現場觀察，以及工具內最相關的維修資料；不會放入客戶名稱、完整序號與工程師姓名。</div>
        <div class="btnrow" style="margin-top:10px">
          <button type="button" class="btn primary" id="photoAiBuild">產生 AI 排查包</button>
          <button type="button" class="btn secondary" id="photoAiCopy">複製排查包</button>
          <button type="button" class="btn ghost" id="photoAiOpen">複製後開啟 ChatGPT</button>
        </div>
        <div class="photoai-output" id="photoAiOutput"><pre class="photoai-prompt" id="photoAiPrompt"></pre></div>
      </div>`;

    work.appendChild(panel);

    const input=byId('photoAiFiles'),drop=byId('photoAiDrop');
    input?.addEventListener('change',e=>addFiles(e.target.files));
    byId('photoAiClear')?.addEventListener('click',resetImages);
    byId('photoAiSync')?.addEventListener('click',()=>{renderCaseSnapshot();notify('已重新整理目前案件資料')});
    byId('photoAiBuild')?.addEventListener('click',renderPrompt);
    byId('photoAiCopy')?.addEventListener('click',copyPrompt);
    byId('photoAiOpen')?.addEventListener('click',copyAndOpen);
    byId('photoAiCustomerText')?.addEventListener('input',()=>{state.prompt='';renderCaseSnapshot()});
    byId('photoAiDone')?.addEventListener('input',()=>{state.prompt='';renderCaseSnapshot()});

    ['brand','type','series','model','symptom','customer','serial','engineer','notes'].forEach(id=>{
      byId(id)?.addEventListener('change',()=>{state.prompt='';renderCaseSnapshot()});
      if(id==='notes')byId(id)?.addEventListener('input',()=>{state.prompt='';renderCaseSnapshot()});
    });

    ['dragenter','dragover'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('drag')}));
    ['dragleave','drop'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('drag')}));
    drop?.addEventListener('drop',e=>addFiles(e.dataTransfer?.files));
    panel.addEventListener('paste',e=>{
      const files=[...(e.clipboardData?.files||[])];
      if(files.length){e.preventDefault();addFiles(files)}
    });

    window.addEventListener('beforeunload',()=>state.images.forEach(revoke),{once:true});
    renderImages();renderCaseSnapshot();
    window.PHOTO_AI_HANDOFF={ok:true,feature:FEATURE,version:1,buildPrompt:()=>buildPrompt(),imageCount:()=>state.images.length};
    if(window.__optionalFeatureStatus)window.__optionalFeatureStatus[FEATURE]='ready';
    console.info(`[萬里工程師工具] ${FEATURE} ready`);
  }

  try{
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
    else mount();
  }catch(error){
    console.error(`[萬里工程師工具] ${FEATURE} 初始化失敗`,error);
    if(typeof window.__reportOptionalFeatureFailure==='function')window.__reportOptionalFeatureFailure(FEATURE,error);
  }
})();
