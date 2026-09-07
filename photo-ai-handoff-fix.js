'use strict';

(function(){
  const FEATURE='AI 圖片排查修正版';
  const AI_VERSION='1.1.1';
  const MAX_WAIT=12000;
  const started=Date.now();

  const byId=id=>document.getElementById(id);
  const setStatus=(kind,msg)=>{
    const box=byId('photoAiStatus');
    if(!box)return;
    box.className=`photoai-status ${kind||'info'}`;
    box.textContent=msg;
    box.hidden=false;
  };

  function copyText(text){
    if(!text)return Promise.reject(new Error('沒有可複製的排查內容'));
    if(navigator.clipboard&&location.protocol!=='file:')return navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text));
    return fallbackCopy(text);
  }
  function fallbackCopy(text){
    return new Promise((resolve,reject)=>{
      const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();
      try{if(!document.execCommand('copy'))throw new Error('瀏覽器拒絕複製');resolve()}catch(error){reject(error)}finally{ta.remove()}
    });
  }

  function enhance(){
    const api=window.__photoAiHandoff;
    const build=byId('photoAiBuild'),open=byId('photoAiOpen'),copy=byId('photoAiCopy'),panel=byId('tab-photoai');
    if(!api||!build||!panel)return false;
    if(panel.dataset.aiFixReady==='1')return true;
    panel.dataset.aiFixReady='1';panel.dataset.aiVersion=AI_VERSION;

    const h1=panel.querySelector('.hero h1'),sub=panel.querySelector('.hero .small'),badge=panel.querySelector('.hero .badge');
    if(h1)h1.textContent='AI 圖片排查｜交給 ChatGPT 判斷';
    if(sub)sub.textContent='不用先選型號。丟照片或輸入客戶原話後，一鍵整理案件並開啟 ChatGPT。';
    if(badge)badge.textContent=`AI 排查 v${AI_VERSION}｜快速排除`;

    build.textContent='⚡ 產生排查內容';
    if(open){open.disabled=false;open.textContent='🚀 複製並開 ChatGPT'}
    if(copy)copy.textContent='只複製排查內容';

    if(!byId('photoAiRealAiNote')){
      const note=document.createElement('div');note.id='photoAiRealAiNote';note.className='photoai-status info';
      note.innerHTML='本頁負責整理工程師案件；<b>真正的 AI 判斷在 ChatGPT 進行</b>。照片不會由這個 GitHub Pages 頁面自行上傳。';
      const actions=byId('photoAiActions');actions?.parentNode?.insertBefore(note,actions);
    }

    build.addEventListener('click',function(){setTimeout(()=>{const out=byId('photoAiOutput'),details=out?.querySelector('details');if(out&&!out.hidden&&details)details.open=true},0)},true);

    if(open){open.addEventListener('click',function(event){
      event.preventDefault();event.stopImmediatePropagation();
      let prompt='';try{prompt=api.buildPrompt()}catch(error){setStatus('error',`⚠️ 無法整理案件：${error?.message||error}`);return}
      if(!prompt)return;
      const win=window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
      copyText(prompt).then(()=>{const count=Array.isArray(api.state?.images)?api.state.images.length:0;setStatus('success',count?`✅ 已開啟 ChatGPT，文字已複製。請貼上文字，再把 ${count} 張照片一起拖進 ChatGPT。`:'✅ 已開啟 ChatGPT，排查文字已複製，貼上即可開始排查。')}).catch(error=>setStatus('error',`⚠️ 已開啟 ChatGPT，但複製失敗：${error?.message||error}。請點「只複製排查內容」。`));
      if(!win)setStatus('info','瀏覽器擋住新分頁；請先複製排查內容，再手動開 ChatGPT。');
    },true)}

    window.__photoAiVersion=AI_VERSION;
    console.info(`[萬里工程師工具] ${FEATURE} v${AI_VERSION} ready`);
    return true;
  }
  function wait(){if(enhance())return;if(Date.now()-started>MAX_WAIT){console.error(`[萬里工程師工具] ${FEATURE} 初始化逾時`);return}setTimeout(wait,120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
