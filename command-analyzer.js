'use strict';

// 反向指令辨識：貼上既有指令，判斷品牌／語言與用途。
// 僅做已知語法的確定性解析；無法由通用指令判斷的機型不亂猜。
(function(){
  const FEATURE='指令反向辨識';
  const byId=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  const zebraRules=[
    [/~JC\b/i,'完整耗材／Sensor 校正','重新量測標籤與感應器校正值，通常會走紙。'],
    [/~JG\b/i,'Sensor Profile','校正並列印感應器曲線，用來判斷 Gap／Black Mark／Ribbon 感應狀況。'],
    [/~WC\b/i,'列印組態標籤','列印 Configuration Label，不修改設定。'],
    [/~WL\b/i,'列印網路組態','列印 Network Configuration Label，不修改設定。'],
    [/~JA\b/i,'取消列印工作','停止／清除尚未完成的列印工作。'],
    [/~SD\s*([0-9.]+)/i,'列印濃度',m=>`把 Zebra Darkness 設為 ${m[1]}。`],
    [/\^MT([TD])/i,'列印方式',m=>m[1].toUpperCase()==='T'?'設定為熱轉印（Thermal Transfer）。':'設定為熱感應（Direct Thermal）。'],
    [/\^MM([TPCR])/i,'出紙模式',m=>({T:'Tear-off 撕下',P:'Peel-off 剝離',C:'Cutter 裁切',R:'Rewind 回捲'}[m[1].toUpperCase()]+' 模式。')],
    [/\^PR\s*([0-9.]+)/i,'列印速度',m=>`設定列印速度 ${m[1]} IPS（實際上限仍依機型）。`],
    [/\^PW\s*(\d+)/i,'列印寬度',m=>`設定 Print Width 為 ${m[1]} dots。`],
    [/\^LL\s*(\d+)/i,'標籤長度',m=>`設定 Label Length 為 ${m[1]} dots。`],
    [/\^LS\s*(-?\d+)/i,'水平位置',m=>`設定 Left Position 為 ${m[1]} dots。`],
    [/\^LT\s*(-?\d+)/i,'垂直位置',m=>`設定 Label Top 為 ${m[1]} dots。`],
    [/\^MN([A-Z])/i,'Media Sensor',m=>m[1].toUpperCase()==='A'?'Media Sensor 設為自動偵測。':`Media Sensor 模式代碼 ${m[1].toUpperCase()}。`],
    [/\^MF([A-Z]),([A-Z])/i,'開機／關頭動作',m=>`設定 Power-up / Head-close 動作代碼 ${m[1].toUpperCase()},${m[2].toUpperCase()}。`],
    [/\^JUS/i,'儲存設定','把可保存的設定寫入非揮發性記憶體。'],
    [/\^JUR/i,'重新載入設定','叫回上次已保存的設定。']
  ];

  const tscRules=[
    [/^\s*GAPDETECT\b/im,'Gap 自動校正','自動偵測標籤 Gap 並更新感應器校正值。'],
    [/^\s*BLINEDETECT\b/im,'Black Mark 自動校正','自動偵測 Black Mark 並更新感應器校正值。'],
    [/^\s*AUTODETECT\b/im,'Gap／Black Mark 自動判斷','自動判斷紙張感應方式並校正；需確認該機型韌體支援。'],
    [/^\s*DENSITY\s+([0-9.]+)/im,'列印濃度',m=>`設定 TSC Density 為 ${m[1]}。`],
    [/^\s*SPEED\s+([0-9.]+)/im,'列印速度',m=>`設定列印速度 ${m[1]}（單位／可用值依 TSPL 與機型）。`],
    [/^\s*DIRECTION\s+([^\r\n]+)/im,'列印方向',m=>`設定 DIRECTION ${m[1].trim()}。`],
    [/^\s*OFFSET\s+([^\r\n]+)/im,'停止位置偏移',m=>`設定 OFFSET ${m[1].trim()}，用於出紙停止位置微調。`],
    [/^\s*SET\s+TEAR\s+(ON|OFF)/im,'Tear 模式',m=>`${m[1].toUpperCase()==='ON'?'開啟':'關閉'} Tear-off 停紙模式。`],
    [/^\s*SET\s+PEEL\s+(ON|OFF)/im,'Peel 模式',m=>`${m[1].toUpperCase()==='ON'?'開啟':'關閉'}剝紙模式。`],
    [/^\s*SET\s+CUTTER\s+([^\r\n]+)/im,'Cutter 模式',m=>`設定 Cutter 為 ${m[1].trim()}；需確認已安裝切刀。`],
    [/^\s*SET\s+REWIND\s+(ON|OFF)/im,'Rewind 模式',m=>`${m[1].toUpperCase()==='ON'?'開啟':'關閉'}回捲模式。`],
    [/^\s*SELFTEST(?:\s+([^\r\n]+))?/im,'Self Test',m=>m[1]?`列印 ${m[1].trim()} Self Test／資訊頁。`:'列印完整 Self Test／Printer Information。']
  ];

  function runRules(text,rules){
    const out=[];
    for(const [re,title,desc] of rules){
      const m=text.match(re);
      if(!m)continue;
      out.push({title,desc:typeof desc==='function'?desc(m):desc});
    }
    return out;
  }

  function detect(text){
    const raw=String(text||'').trim();
    if(!raw)return {brand:'—',language:'—',confidence:'',actions:[],note:'請先貼上指令。'};
    const zActions=runRules(raw,zebraRules);
    const tActions=runRules(raw,tscRules);
    const zSyntax=/\^XA|\^XZ|\^[A-Z]{1,2}|~[A-Z]{1,2}/i.test(raw);
    const tSyntax=/^(?:\s*)(?:SIZE|GAP|BLINE|DENSITY|SPEED|DIRECTION|REFERENCE|OFFSET|SET|CLS|TEXT|BARCODE|QRCODE|DMATRIX|PRINT|GAPDETECT|BLINEDETECT|AUTODETECT|SELFTEST)\b/im.test(raw);

    if((zActions.length||zSyntax)&&!(tActions.length||tSyntax))return {brand:'Zebra',language:'ZPL / SGD 類 Zebra 指令',confidence:zActions.length?'高':'中',actions:zActions,note:'這類指令通常適用 Zebra 支援 ZPL 的印表機；單靠通用 ZPL 無法可靠判斷確切機型。'};
    if((tActions.length||tSyntax)&&!(zActions.length||zSyntax))return {brand:'TSC',language:'TSPL / TSPL2',confidence:tActions.length?'高':'中',actions:tActions,note:'這類指令通常適用 TSC 支援 TSPL/TSPL2 的印表機；單靠通用 TSPL 無法可靠判斷確切機型。'};
    if((zActions.length||zSyntax)&&(tActions.length||tSyntax))return {brand:'混合／需確認',language:'同時偵測到 Zebra 與 TSC 語法',confidence:'低',actions:[...zActions,...tActions],note:'內容可能貼了兩段不同品牌指令，請分開貼上再判讀。'};
    return {brand:'無法確認',language:'未知或尚未收錄',confidence:'低',actions:[],note:'目前沒有足夠特徵可靠判斷。請勿直接送到印表機；可再提供完整指令或來源。'};
  }

  function renderResult(result,raw){
    const actionHtml=result.actions.length?result.actions.map(x=>`<div class="eca-action"><b>${esc(x.title)}</b><span>${esc(x.desc)}</span></div>`).join(''):'<div class="eca-empty">沒有解析到已核對的設定項目。</div>';
    return `<div class="eca-summary"><div><small>品牌</small><b>${esc(result.brand)}</b></div><div><small>指令語言</small><b>${esc(result.language)}</b></div><div><small>判斷信心</small><b>${esc(result.confidence||'—')}</b></div></div><div class="eca-actions-list">${actionHtml}</div><div class="eca-note">${esc(result.note)}</div><details class="eca-raw"><summary>原始指令</summary><pre>${esc(raw)}</pre></details>`;
  }

  function analyze(){
    const input=byId('ecaInput'),out=byId('ecaResult');
    if(!input||!out)return;
    const raw=input.value||'';
    out.innerHTML=renderResult(detect(raw),raw);
  }
  window.engineerAnalyzeCommand=analyze;

  function injectStyle(){
    if(byId('ecaStyle'))return;
    const s=document.createElement('style');s.id='ecaStyle';s.textContent=`.eca-box{margin:12px 0 16px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;padding:14px}.eca-head h3{margin:0 0 4px}.eca-head p{margin:0;color:#64748b;font-size:12px}.eca-input{width:100%;min-height:92px;margin-top:10px;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;resize:vertical}.eca-buttons{display:flex;gap:8px;margin-top:8px}.eca-buttons button{border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer}.eca-primary{background:#0f172a;color:#fff}.eca-secondary{background:#e2e8f0;color:#0f172a}.eca-result{margin-top:10px}.eca-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.eca-summary>div{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:9px}.eca-summary small{display:block;color:#64748b}.eca-summary b{display:block;margin-top:2px}.eca-action{display:flex;gap:8px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #eef2f7}.eca-action b{min-width:110px}.eca-action span{color:#334155}.eca-note,.eca-empty{margin-top:9px;padding:9px 10px;border-radius:9px;background:#fffbeb;color:#92400e;font-size:12px;line-height:1.5}.eca-raw{margin-top:8px}.eca-raw pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#0f172a;color:#f8fafc;padding:10px;border-radius:9px}@media(max-width:720px){.eca-summary{grid-template-columns:1fr}.eca-action{display:block}.eca-action b{display:block;margin-bottom:3px}}`;document.head.appendChild(s);
  }

  function inject(){
    const center=byId('engineerCommandCenter');
    if(!center||byId('engineerCommandAnalyzer'))return false;
    injectStyle();
    const box=document.createElement('div');
    box.id='engineerCommandAnalyzer';box.className='eca-box';
    box.innerHTML=`<div class="eca-head"><h3>🔎 反向指令辨識</h3><p>把客戶／同事給你的指令貼進來，辨識品牌、指令語言與用途。無法確認的機型不會硬猜。</p></div><textarea id="ecaInput" class="eca-input" spellcheck="false" placeholder="例如：^XA^MTT^JUS^XZ 或 SET TEAR ON"></textarea><div class="eca-buttons"><button type="button" class="eca-primary" onclick="engineerAnalyzeCommand()">辨識這段指令</button><button type="button" class="eca-secondary" id="ecaClear">清除</button></div><div id="ecaResult" class="eca-result"></div>`;
    const anchor=center.querySelector('.ecc-title');
    if(anchor)anchor.insertAdjacentElement('afterend',box);else center.prepend(box);
    byId('ecaClear')?.addEventListener('click',()=>{byId('ecaInput').value='';byId('ecaResult').innerHTML=''});
    byId('ecaInput')?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')analyze()});
    return true;
  }

  function start(){
    if(inject())return;
    let count=0;
    const timer=setInterval(()=>{count++;if(inject()||count>=80)clearInterval(timer)},125);
  }

  try{
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
    else start();
  }catch(error){console.warn(`[萬里工程師工具] ${FEATURE} 初始化失敗`,error)}
})();