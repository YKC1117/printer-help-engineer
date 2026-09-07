'use strict';

// 品牌設定介面補強：中文為主、全部預設收合；不改既有指令產生邏輯。
(function(){
  const FEATURE='品牌設定介面補強';
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

  const otherBrands=[
    {label:'Argox',query:'Argox'},
    {label:'GoDEX',query:'GoDEX'},
    {label:'TOSHIBA',query:'TOSHIBA'},
    {label:'SATO',query:'SATO'},
    {label:'Honeywell（Datamax／Intermec）',query:'Honeywell Datamax Intermec'}
  ];

  function commandCenter(){return byId('engineerCommandCenter')}

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

  function simplifyHeader(center){
    const title=center.querySelector('.ecc-title');
    title?.querySelector('.et-kicker')?.remove();
    title?.querySelector('p')?.remove();
    center.querySelector('.ecc-how')?.remove();
    const h2=title?.querySelector('h2');
    if(h2)h2.textContent='設定指令快速中心';
  }

  function closeByDefault(center){
    center.querySelectorAll('.ecc-builder').forEach(detail=>{
      if(detail.dataset.defaultClosed==='1')return;
      detail.open=false;
      detail.dataset.defaultClosed='1';
    });
  }

  function openBrandKb(query){
    try{
      if(typeof window.engineerToolOpenKB==='function'){
        window.engineerToolOpenKB(query,false);
        return;
      }
      if(typeof window.showTab==='function')window.showTab('kb');
      if(typeof window.renderKB==='function')window.renderKB({q:query,modelOnly:false});
    }catch(error){console.warn('[萬里工程師工具] 開啟品牌維修資料失敗',error)}
  }
  window.eccOpenBrandKB=openBrandKb;

  function addOtherBrands(center){
    if(center.querySelector('.ecc-other-brand-builders'))return;
    const builders=[...center.querySelectorAll('.ecc-builder')];
    const tsc=builders.find(x=>x.querySelector('summary')?.textContent?.includes('TSC｜快速組合設定'));
    const library=center.querySelector('.ecc-library');
    if(!tsc||!library)return;

    const wrap=document.createElement('div');
    wrap.className='ecc-other-brand-builders';
    otherBrands.forEach(brand=>{
      const detail=document.createElement('details');
      detail.className='ecc-builder ecc-brand-pending';
      detail.dataset.defaultClosed='1';
      detail.open=false;
      const summary=document.createElement('summary');
      summary.textContent=`${brand.label}｜快速組合設定（待核對）`;
      const note=document.createElement('div');
      note.className='ecc-note';
      note.textContent='此品牌的維修資料已收錄；快速組合指令尚未開放。原廠指令核對完成後再加入，避免送出未確認命令。';
      const actions=document.createElement('div');
      actions.className='ecc-gen-actions';
      const btn=document.createElement('button');
      btn.type='button';
      btn.textContent='查此品牌維修資料';
      btn.addEventListener('click',()=>openBrandKb(brand.query));
      actions.appendChild(btn);
      detail.append(summary,note,actions);
      wrap.appendChild(detail);
    });
    library.before(wrap);
  }

  function removeRedundantReference(builder){
    builder.querySelectorAll('.ecc-mode-reference').forEach(x=>x.remove());
  }

  function localizeFooter(builder){
    const note=builder.querySelector('.ecc-note');
    if(note)note.textContent='不同 Zebra 機型的最高速度、選配模組與舊平台行為可能不同；送出後請以機器實際反應與組態標籤（Configuration Label）再確認。';
  }

  function simplifySource(center){
    const source=center.querySelector('.ecc-source');
    if(source)source.textContent='目前可直接產生設定指令：Zebra、TSC。其他販售品牌先提供維修資料入口，原廠指令核對完成後再開放。';
  }

  function apply(){
    const center=commandCenter();
    const builder=zebraBuilder();
    if(!center||!builder)return;
    simplifyHeader(center);
    removeRedundantReference(builder);
    localizeOptions('eccZMethod');
    localizeOptions('eccZMode');
    fields.forEach(x=>decorateField(...x));
    localizeFooter(builder);
    addOtherBrands(center);
    simplifySource(center);
    closeByDefault(center);
    center.dataset.brandUiHelper='1';
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
