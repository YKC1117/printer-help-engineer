'use strict';

// 顯示層只讀取 app-version.js 的 window.APP_BUILD；不得在此重複定義版本號。
document.addEventListener('DOMContentLoaded',()=>{
  const meta=window.APP_BUILD||{};
  const version=meta.version||'版本未載入';
  const updated=meta.updated||'未知時間';
  const stat=document.getElementById('headerStat');
  if(stat) stat.textContent=version;
  document.title=`萬里資訊｜工程師標籤機故障排查工具 ${version}｜更新 ${updated}`;
  const footer=document.querySelector('footer');
  if(footer && !footer.querySelector('.build-meta-line')){
    const line=document.createElement('div');
    line.className='build-meta-line';
    line.style.marginTop='6px';
    line.style.fontWeight='800';
    line.textContent=`版本：${version}｜最後更新：${updated}（台灣時間）`;
    footer.appendChild(line);
  }
});
