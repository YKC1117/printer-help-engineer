'use strict';

// Zebra 快速組合設定：中文為主、英文括號輔助。只補強介面文字，不改 ZPL 產生邏輯。
(function(){
  const FEATURE='Zebra 中文設定提示';
  const byId=id=>document.getElementById(id);

  const fields=[
    ['eccZMethod','列印方式','Print Method','有碳帶 → 熱轉印；熱感紙且不裝碳帶 → 熱感應。熱轉印未裝碳帶常會報 Ribbon Out。'],
    ['eccZMode','出紙模式','Print Mode','一般客戶多數用撕下；剝離／裁切／回捲只有裝對應模組時才選。'],
    ['eccZDark','濃度 0～30','Darkness','印太淡就小幅增加；糊字、條碼太粗就降低，不要一次拉太多。'],
    ['eccZSpeed','速度 IPS','Speed','列印不清楚、細字或特殊碳帶時先降速；正常就不用特別改。'],
    ['eccZWidth','列印寬度 dots','Print Width','通常不用改；只有內容被截掉或橫向範圍不對時才需要調。'],
    ['eccZLength','標籤長度 dots','Label Length','通常不用改；走紙長度異常先做校正，仍有需求再設定固定長度。']
  ];

  const optionText={
    eccZMethod:{'':'不修改（No Change）','T':'熱轉印（Thermal Transfer）','D':'熱感應（Direct Thermal）'},
    eccZMode:{'':'不修改（No Change）','T':'撕下（Tear-Off）','P':'剝離（Peel-Off）','C':'裁切（Cutter）','R':'回捲（Rewind）'}
  };

  function zebraBuilder(){
    return [...document.querySelectorAll('#engineerCommandCenter .ecc-builder')]
      .find(x=>x.querySelector('summary')?.textContent?.includes('Zebra｜快速組合設定'))||null;
  }

  function decorateField(id,zh,en,help){
    const control=byId(id),label=control?.closest('label');
    if(!control||!label)return;
    [...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>n.remove());

    let title=label.querySelector('.ecc-field-title');
    if(!title){
      title=document.createElement('span');
      title.className='ecc-field-title';
      label.insertBefore(title,control);
    }
    title.innerHTML=`${zh} <span class="ecc-en">（${en}）</span>`;

    let note=label.querySelector('.ecc-field-help');
    if(!note){
      note=document.createElement('small');
      note.className='ecc-field-help';
      label.appendChild(note);
    }
    note.textContent=help;
  }

  function localizeOptions(id){
    const select=byId(id),map=optionText[id];
    if(!select||!map)return;
    [...select.options].forEach(opt=>{
      if(Object.prototype.hasOwnProperty.call(map,opt.value))opt.textContent=map[opt.value];
    });
  }

  function removeRedundantReference(builder){
    builder.querySelectorAll('.ecc-mode-reference').forEach(x=>x.remove());
  }

  function localizeFooter(builder){
    const note=builder.querySelector('.ecc-note');
    if(note)note.textContent='不同 Zebra 機型的最高速度、選配模組與舊平台行為可能不同；送出後請以機器實際反應與組態標籤（Configuration Label）再確認。';
  }

  function apply(){
    const builder=zebraBuilder();
    if(!builder)return;
    removeRedundantReference(builder);
    if(builder.dataset.zhHelper==='2')return;
    localizeOptions('eccZMethod');
    localizeOptions('eccZMode');
    fields.forEach(x=>decorateField(...x));
    localizeFooter(builder);
    builder.dataset.zhHelper='2';
  }

  function safeApply(){
    try{apply()}catch(error){console.warn(`[萬里工程師工具] ${FEATURE} 套用失敗，原功能不受影響`,error)}
  }

  function start(){
    safeApply();
    const root=byId('work')||document.body;
    const observer=new MutationObserver(safeApply);
    observer.observe(root,{childList:true,subtree:true});
  }

  try{
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
    else start();
  }catch(error){console.warn(`[萬里工程師工具] ${FEATURE} 初始化失敗，原功能不受影響`,error)}
})();
