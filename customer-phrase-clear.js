'use strict';

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    const input=document.getElementById('customerPhraseSearch');
    if(!input||document.getElementById('customerPhraseClear'))return;
    const row=input.closest('.phrase-input-row');
    if(!row)return;

    const wrap=document.createElement('div');
    wrap.className='phrase-input-wrap';
    input.parentNode.insertBefore(wrap,input);
    wrap.appendChild(input);

    const clear=document.createElement('button');
    clear.id='customerPhraseClear';
    clear.className='phrase-clear-btn';
    clear.type='button';
    clear.textContent='×';
    clear.title='清除文字';
    clear.setAttribute('aria-label','清除客戶描述');
    wrap.appendChild(clear);

    const sync=()=>{clear.hidden=!input.value.trim()};
    clear.onclick=()=>{
      input.value='';
      const result=document.getElementById('customerPhraseResults');
      if(result)result.innerHTML='';
      sync();
      input.focus();
    };
    input.addEventListener('input',sync);
    sync();
  },150);
});
