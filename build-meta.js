'use strict';

window.APP_BUILD={
  version:'v3.3',
  updated:'2026/09/07 11:50',
  timezone:'Asia/Taipei'
};

document.addEventListener('DOMContentLoaded',()=>{
  const meta=window.APP_BUILD;
  const stat=document.getElementById('headerStat');
  if(stat) stat.textContent=`${meta.version}｜更新 ${meta.updated}`;
  document.title=`萬里資訊｜工程師標籤機故障排查工具 ${meta.version}｜更新 ${meta.updated}`;
  const footer=document.querySelector('footer');
  if(footer && !footer.querySelector('.build-meta-line')){
    const line=document.createElement('div');
    line.className='build-meta-line';
    line.style.marginTop='6px';
    line.style.fontWeight='800';
    line.textContent=`版本：${meta.version}｜最後更新：${meta.updated}（台灣時間）`;
    footer.appendChild(line);
  }
});
