'use strict';

(function(){
  const FEATURE='AI 圖片排查修正版';
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
    if(navigator.clipboard&&location.protocol!=='file:'){
      return navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text));
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text){
    return new Promise((resolve,reject)=>{
      const ta=document.createElement('textarea');
      ta.value=text;
      ta.style.position='fixed';
      ta.style.left='-9999px';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.focus();ta.select();
      try{
        if(!document.execCommand('copy'))throw new Error('瀏覽器拒絕複製');
        resolve();
      }catch(error){reject(error)}finally{ta.remove()}
    });
  }

  function enhance(){
    const api=window.__photoAiHandoff;
    const build=byId('photoAiBuild');
    const open=byId('photoAiOpen');
    const copy=byId('photoAiCopy');
    const panel=byId('tab-photoai');
    if(!api||!build||!panel)return false;
    if(panel.dataset.aiFixReady==='1')return true;
    panel.dataset.aiFixReady='1';

    const h1=panel.querySelector('.hero h1');
    const sub=panel.querySelector('.hero .small');
    if(h1)h1.textContent='AI 圖片排查｜交給 ChatGPT 判斷';
    if(sub)sub.textContent='不用先選型號。丟照片或輸入客戶原話後，一鍵整理案件並開啟 ChatGPT。';

    build.textContent='⚡ 產生排查內容';
    if(open){open.disabled=false;open.textContent='🚀 複製並開 ChatGPT'}
    if(copy){copy.textContent='只複製排查內容'}

    const note=document.createElement('div');
    note.id='photoAiRealAiNote';
    note.className='photoai-status info';
    note.innerHTML='這個頁面本身不會假裝有 AI 在背景回答。<b>真正的 AI 判斷會在 ChatGPT 裡進行</b>；本頁負責把照片案件整理成工程師用的排查格式。';
    const actions=byId('photoAiActions');
    actions?.parentNode?.insertBefore(note,actions);

    build.addEventListener('click',function(){
      setTimeout(()=>{
        const out=byId('photoAiOutput');
        const details=out?.querySelector('details');
        if(out&&!out.hidden&&details)details.open=true;
      },0);
    },true);

    if(open){
      open.addEventListener('click',function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        let prompt='';
        try{prompt=api.buildPrompt()}catch(error){
          setStatus('error',`⚠️ 無法整理案件：${error?.message||error}`);
          return;
        }
        if(!prompt)return;

        const win=window.open('https://chatgpt.com/','_blank');
        copyText(prompt).then(()=>{
          const count=Array.isArray(api.state?.images)?api.state.images.length:0;
          setStatus('success',count
            ?`✅ 已開啟 ChatGPT，排查文字已複製。到 ChatGPT 按 Ctrl+V 貼上文字，再把這 ${count} 張照片一起拖進去即可。`
            :'✅ 已開啟 ChatGPT，排查文字已複製。到 ChatGPT 按 Ctrl+V 貼上即可開始排查。');
        }).catch(error=>{
          setStatus('error',`⚠️ 已開啟 ChatGPT，但自動複製失敗：${error?.message||error}。請點「只複製排查內容」。`);
        });
        if(!win)setStatus('info','瀏覽器擋住新分頁；排查內容仍可先複製，再手動開 ChatGPT。');
      },true);
    }

    console.info(`[萬里工程師工具] ${FEATURE} ready`);
    return true;
  }

  function wait(){
    if(enhance())return;
    if(Date.now()-started>MAX_WAIT){
      console.error(`[萬里工程師工具] ${FEATURE} 初始化逾時`);
      return;
    }
    setTimeout(wait,120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();
