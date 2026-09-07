'use strict';

// v4.2 工程師遠端設定指令中心。僅產生/複製原始印表機指令與 Windows PowerShell TCP 9100 傳送器。
(function(){
  const $=id=>document.getElementById(id);
  const E=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const toastSafe=t=>typeof toast==='function'?toast(t):alert(t);

  const COMMANDS=[
    {id:'z-cal',brand:'Zebra',group:'校正／儲存',title:'強制耗材校正',cmd:'~JC',desc:'重新量測標籤長度並調整 Media／Ribbon Sensor。',risk:'normal',save:'依機型校正結果更新'},
    {id:'z-save',brand:'Zebra',group:'校正／儲存',title:'儲存目前設定',cmd:'^XA^JUS^XZ',desc:'將目前可保存的設定寫入印表機。',risk:'normal',save:'會保存'},
    {id:'z-recall',brand:'Zebra',group:'校正／儲存',title:'叫回上次已儲存設定',cmd:'^XA^JUR^XZ',desc:'重新載入上次保存的設定。',risk:'caution',save:'讀取已保存值'},
    {id:'z-tt',brand:'Zebra',group:'列印模式',title:'切成熱轉印',cmd:'^XA^MTT^JUS^XZ',desc:'Print Method = Thermal Transfer，並保存。',risk:'normal',save:'會保存'},
    {id:'z-dt',brand:'Zebra',group:'列印模式',title:'切成熱感應',cmd:'^XA^MTD^JUS^XZ',desc:'Print Method = Direct Thermal，並保存。',risk:'normal',save:'會保存'},
    {id:'z-tear',brand:'Zebra',group:'列印模式',title:'撕紙模式 Tear-off',cmd:'^XA^MMT^JUS^XZ',desc:'切換為 Tear-off。',risk:'normal',save:'會保存'},
    {id:'z-peel',brand:'Zebra',group:'列印模式',title:'剝紙模式 Peel-off',cmd:'^XA^MMP^JUS^XZ',desc:'僅在機器已安裝剝紙器時使用。',risk:'caution',save:'會保存'},
    {id:'z-cut',brand:'Zebra',group:'列印模式',title:'切刀模式 Cutter',cmd:'^XA^MMC^JUS^XZ',desc:'僅在機器已安裝 Cutter 時使用。',risk:'caution',save:'會保存'},
    {id:'z-rewind',brand:'Zebra',group:'列印模式',title:'回捲模式 Rewind',cmd:'^XA^MMR^JUS^XZ',desc:'僅適用支援 Rewind 的機型／選配。',risk:'caution',save:'會保存'},
    {id:'z-auto-sensor',brand:'Zebra',group:'Sensor',title:'Sensor 自動偵測',cmd:'^XA^MNA^JUS^XZ',desc:'Media Tracking / Sensor Select 回到 Auto-Detect。',risk:'normal',save:'會保存'},
    {id:'z-pos-reset',brand:'Zebra',group:'位置',title:'重設水平／垂直位移',cmd:'^XA^LS0^LT0^JUS^XZ',desc:'Left Position 與 Label Top 歸零；適合先排除被改偏移量。',risk:'normal',save:'會保存'},

    {id:'t-gap',brand:'TSC',group:'校正／Sensor',title:'Gap 自動校正',cmd:'GAPDETECT\r\n',desc:'自動偵測紙張與 Gap。',risk:'normal',save:'依機型更新校正值'},
    {id:'t-bline',brand:'TSC',group:'校正／Sensor',title:'Black Mark 自動校正',cmd:'BLINEDETECT\r\n',desc:'自動偵測紙張與黑標。',risk:'normal',save:'依機型更新校正值'},
    {id:'t-dir0',brand:'TSC',group:'方向／位置',title:'列印方向 0',cmd:'DIRECTION 0\r\n',desc:'將列印方向設為 0。',risk:'normal',save:'會保存'},
    {id:'t-dir1',brand:'TSC',group:'方向／位置',title:'列印方向 1',cmd:'DIRECTION 1\r\n',desc:'將列印方向設為 1。',risk:'normal',save:'會保存'},
    {id:'t-mirror',brand:'TSC',group:'方向／位置',title:'鏡像列印',cmd:'DIRECTION 0,1\r\n',desc:'開啟 Mirror。要解除可改回 DIRECTION 0,0。',risk:'caution',save:'會保存'},
    {id:'t-tear-on',brand:'TSC',group:'選配／出紙',title:'Tear ON',cmd:'SET TEAR ON\r\n',desc:'停止位置調整至撕紙位置。TSPL2。',risk:'normal',save:'會保存'},
    {id:'t-tear-off',brand:'TSC',group:'選配／出紙',title:'Tear OFF',cmd:'SET TEAR OFF\r\n',desc:'關閉 Tear 模式。TSPL2。',risk:'normal',save:'會保存'},
    {id:'t-peel-on',brand:'TSC',group:'選配／出紙',title:'Peel ON',cmd:'SET PEEL ON\r\n',desc:'開啟剝紙模式；需有剝紙器／Sensor。',risk:'caution',save:'會保存'},
    {id:'t-peel-off',brand:'TSC',group:'選配／出紙',title:'Peel OFF',cmd:'SET PEEL OFF\r\n',desc:'關閉剝紙模式。',risk:'normal',save:'會保存'},
    {id:'t-cut-off',brand:'TSC',group:'選配／出紙',title:'Cutter OFF',cmd:'SET CUTTER OFF\r\n',desc:'關閉 Cutter。',risk:'normal',save:'會保存'},
    {id:'t-cut-1',brand:'TSC',group:'選配／出紙',title:'每張切一刀',cmd:'SET CUTTER 1\r\n',desc:'每 1 張切一次；必須已安裝 Cutter。',risk:'caution',save:'會保存'},
    {id:'t-cut-batch',brand:'TSC',group:'選配／出紙',title:'工作結束再切',cmd:'SET CUTTER BATCH\r\n',desc:'整批列印工作結束後切刀。',risk:'caution',save:'會保存'},
    {id:'t-rewind-on',brand:'TSC',group:'選配／出紙',title:'Rewind ON',cmd:'SET REWIND ON\r\n',desc:'開啟內部 Rewind；限支援機型／選配。',risk:'caution',save:'會保存'},
    {id:'t-rewind-off',brand:'TSC',group:'選配／出紙',title:'Rewind OFF',cmd:'SET REWIND OFF\r\n',desc:'關閉 Rewind。',risk:'normal',save:'會保存'},
    {id:'t-dhcp',brand:'TSC',group:'網路｜高風險',title:'改成 DHCP',cmd:'NET DHCP\r\n',desc:'改用 DHCP，印表機會重新啟動；IP 可能改變。',risk:'danger',save:'會重啟／可能斷線'},
    {id:'t-port',brand:'TSC',group:'網路｜高風險',title:'RAW Port 改 9100',cmd:'NET PORT 9100\r\n',desc:'設定 Ethernet RAW Port 為 9100，印表機會重新啟動。',risk:'danger',save:'會重啟／可能斷線'}
  ];

  function validHost(v){const s=String(v||'').trim();return /^[a-zA-Z0-9.-]{1,253}$/.test(s)?s:''}
  function utf8b64(s){return btoa(unescape(encodeURIComponent(String(s))))}
  function psSender(cmd){
    const ip=validHost($('eccIp')?.value);if(!ip){toastSafe('先輸入印表機 IP');return''}
    const port=Math.max(1,Math.min(65535,Number($('eccPort')?.value)||9100));
    const b64=utf8b64(cmd);
    return `$ip='${ip}';$port=${port};$b=[Convert]::FromBase64String('${b64}');$tcp=[Net.Sockets.TcpClient]::new($ip,$port);$s=$tcp.GetStream();$s.Write($b,0,$b.Length);$s.Dispose();$tcp.Dispose()`;
  }
  function copyRaw(cmd){if(typeof copyText==='function')copyText(cmd);else navigator.clipboard?.writeText(cmd)}
  function copyPS(cmd){const ps=psSender(cmd);if(ps)copyRaw(ps)}
  window.eccCopyRaw=copyRaw;window.eccCopyPS=copyPS;

  function cmdCard(x){
    const risk=x.risk==='danger'?'高風險':x.risk==='caution'?'注意':'一般';
    return `<article class="ecc-card ${x.risk}"><div class="ecc-card-head"><div><span class="ecc-brand">${E(x.brand)}｜${E(x.group)}</span><h4>${E(x.title)}</h4></div><span class="ecc-risk">${risk}</span></div><p>${E(x.desc)}</p><code>${E(x.cmd.replace(/\r?\n/g,' ↵ '))}</code><div class="ecc-meta">${E(x.save)}</div><div class="ecc-actions"><button type="button" onclick='eccCopyRaw(${JSON.stringify(x.cmd)})'>複製原始指令</button><button type="button" onclick='eccCopyPS(${JSON.stringify(x.cmd)})'>PowerShell 9100</button></div></article>`;
  }

  function zebraGenerator(){
    const darkness=String($('eccZDark')?.value||'').trim();
    const speed=String($('eccZSpeed')?.value||'').trim();
    const width=String($('eccZWidth')?.value||'').trim();
    const length=String($('eccZLength')?.value||'').trim();
    const method=$('eccZMethod')?.value||'';const mode=$('eccZMode')?.value||'';
    const host=[];const z=[];
    if(darkness!==''){const n=Number(darkness);if(!Number.isFinite(n)||n<0||n>30)return toastSafe('Zebra 濃度請輸入 0～30');host.push(`~SD${darkness}`)}
    if(method)z.push(`^MT${method}`);if(mode)z.push(`^MM${mode}`);
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0||n>14)return toastSafe('Zebra 速度請輸入 >0 且 ≤14 IPS，仍須確認機型上限');z.push(`^PR${speed}`)}
    if(width!==''){const n=Math.round(Number(width));if(!Number.isFinite(n)||n<2)return toastSafe('Print Width 請輸入 dots');z.push(`^PW${n}`)}
    if(length!==''){const n=Math.round(Number(length));if(!Number.isFinite(n)||n<1)return toastSafe('Label Length 請輸入 dots');z.push(`^LL${n}`)}
    if(!host.length&&!z.length)return toastSafe('至少選一個 Zebra 設定');
    const cmd=host.join('\n')+(host.length&&z.length?'\n':'')+(z.length?`^XA${z.join('')}^JUS^XZ`:'');
    $('eccZOut').textContent=cmd;return cmd;
  }
  function tscGenerator(){
    const density=String($('eccTDensity')?.value||'').trim();
    const speed=String($('eccTSpeed')?.value||'').trim();
    const direction=$('eccTDir')?.value||'';const tear=$('eccTTear')?.value||'';
    const offset=String($('eccTOffset')?.value||'').trim();
    const lines=[];
    if(density!==''){const n=Number(density);if(!Number.isInteger(n)||n<0||n>15)return toastSafe('TSC DENSITY 請輸入 0～15 整數');lines.push(`DENSITY ${n}`)}
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0)return toastSafe('TSC SPEED 請輸入正數，並確認機型支援範圍');lines.push(`SPEED ${speed}`)}
    if(direction)lines.push(`DIRECTION ${direction}`);if(tear)lines.push(`SET TEAR ${tear}`);
    if(offset!==''){const n=Number(offset);if(!Number.isFinite(n)||n<-25.4||n>25.4)return toastSafe('OFFSET 建議限制在 -25.4～25.4 mm 內');lines.push(`OFFSET ${offset} mm`)}
    if(!lines.length)return toastSafe('至少選一個 TSC 設定');
    const cmd=lines.join('\r\n')+'\r\n';$('eccTOut').textContent=cmd;return cmd;
  }
  window.eccBuildZebra=function(copy=false,ps=false){const c=zebraGenerator();if(typeof c==='string'&&copy)(ps?copyPS(c):copyRaw(c))};
  window.eccBuildTsc=function(copy=false,ps=false){const c=tscGenerator();if(typeof c==='string'&&copy)(ps?copyPS(c):copyRaw(c))};

  function staticIp(){
    const ip=validHost($('eccTIp')?.value),mask=validHost($('eccTMask')?.value),gw=validHost($('eccTGw')?.value);
    if(!ip||!mask||!gw)return toastSafe('請完整輸入 IP／Mask／Gateway');
    const cmd=`NET IP "${ip}","${mask}","${gw}"\r\n`;
    $('eccTNetOut').textContent=cmd;return cmd;
  }
  window.eccBuildStaticIp=function(copy=false,ps=false){const c=staticIp();if(c&&copy)(ps?copyPS(c):copyRaw(c))};

  function centerHtml(){
    return `<section id="engineerCommandCenter" class="ecc-section">
      <div class="ecc-title"><div><span class="et-kicker">v4.2｜遠端設定</span><h2>遠端設定指令中心</h2><p>在客戶電腦遠端操作時，可直接複製原始 Zebra ZPL／TSC TSPL 指令；若電腦可連到印表機 IP，也可產生 PowerShell TCP 9100 傳送器。</p></div></div>
      <div class="ecc-send"><label>印表機 IP<input id="eccIp" inputmode="decimal" autocomplete="off" placeholder="例如 192.168.1.100"></label><label>RAW Port<input id="eccPort" type="number" value="9100" min="1" max="65535"></label><div><b>PowerShell 9100 的概念</b><span>按指令卡的「PowerShell 9100」→ 貼到客戶 Windows PowerShell → 直接傳給同網段印表機。網站本身不會主動連客戶設備。</span></div></div>

      <details class="ecc-builder" open><summary>Zebra｜快速組合設定產生器</summary><div class="ecc-fields"><label>列印方式<select id="eccZMethod"><option value="">不修改</option><option value="T">熱轉印</option><option value="D">熱感應</option></select></label><label>出紙模式<select id="eccZMode"><option value="">不修改</option><option value="T">Tear-off</option><option value="P">Peel-off</option><option value="C">Cutter</option><option value="R">Rewind</option></select></label><label>濃度 0～30<input id="eccZDark" type="number" min="0" max="30" step="0.1" placeholder="例如 15"></label><label>速度 IPS<input id="eccZSpeed" type="number" min="0.1" max="14" step="0.1" placeholder="例如 4"></label><label>Print Width dots<input id="eccZWidth" type="number" min="2" step="1" placeholder="選填"></label><label>Label Length dots<input id="eccZLength" type="number" min="1" step="1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildZebra(true,false)">產生＋複製 ZPL</button><button onclick="eccBuildZebra(true,true)">產生 PowerShell</button></div><pre id="eccZOut">尚未產生</pre><div class="ecc-note">~SD 是直接濃度設定；^PR 速度上限依機型而異。Peel／Cutter／Rewind 只有安裝對應硬體才使用。</div></details>

      <details class="ecc-builder" open><summary>TSC｜快速組合設定產生器</summary><div class="ecc-fields"><label>DENSITY 0～15<input id="eccTDensity" type="number" min="0" max="15" step="1" placeholder="例如 8"></label><label>SPEED<input id="eccTSpeed" type="number" min="0.1" step="0.1" placeholder="例如 4"></label><label>DIRECTION<select id="eccTDir"><option value="">不修改</option><option value="0">0</option><option value="1">1</option><option value="0,1">0 + Mirror</option><option value="0,0">0 + Mirror OFF</option></select></label><label>TEAR<select id="eccTTear"><option value="">不修改</option><option value="ON">ON</option><option value="OFF">OFF</option></select></label><label>OFFSET mm<input id="eccTOffset" type="number" min="-25.4" max="25.4" step="0.1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildTsc(true,false)">產生＋複製 TSPL</button><button onclick="eccBuildTsc(true,true)">產生 PowerShell</button></div><pre id="eccTOut">尚未產生</pre></details>

      <details class="ecc-builder danger"><summary>TSC｜網路設定（高風險）</summary><div class="ecc-danger-box"><b>⚠️ 遠端操作特別注意</b><span>NET DHCP／NET IP／NET PORT 會讓印表機重新啟動。改 IP 後遠端當下很可能找不到機器；一定先確認客戶的 IP、Mask、Gateway，並保留目前設定。</span></div><div class="ecc-fields"><label>新 IP<input id="eccTIp" placeholder="192.168.1.100"></label><label>Subnet Mask<input id="eccTMask" placeholder="255.255.255.0"></label><label>Gateway<input id="eccTGw" placeholder="192.168.1.1"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildStaticIp(true,false)">產生＋複製 NET IP</button><button onclick="eccBuildStaticIp(true,true)">產生 PowerShell</button></div><pre id="eccTNetOut">尚未產生</pre></details>

      <div class="ecc-heading"><h3>Zebra｜已核對常用指令</h3><span>原廠 ZPL Programming Guide</span></div><div class="ecc-grid">${COMMANDS.filter(x=>x.brand==='Zebra').map(cmdCard).join('')}</div>
      <div class="ecc-heading"><h3>TSC｜已核對常用指令</h3><span>原廠 TSPL／TSPL2 Programming Manual</span></div><div class="ecc-grid">${COMMANDS.filter(x=>x.brand==='TSC').map(cmdCard).join('')}</div>
      <div class="ecc-source">目前先放 Zebra 與 TSC：只有核對過原廠 Programming Guide／Programming Manual 的設定才進正式指令中心。Argox／GoDEX／TOSHIBA／SATO／Honeywell 後續依原廠指令文件逐品牌補，不用猜指令。</div>
    </section>`;
  }

  function injectCenter(){
    const box=$('tab-tools');if(!box||$('engineerCommandCenter'))return;
    const first=box.querySelector('.et-section');
    if(first)first.insertAdjacentHTML('afterend',centerHtml());else box.insertAdjacentHTML('beforeend',centerHtml());
  }
  function finalRender(){
    if(typeof window.renderEngineerToolsPlus==='function')window.renderEngineerToolsPlus();
    injectCenter();
  }
  window.renderEngineerCommandCenter=finalRender;
  window.renderTools=finalRender;
  try{renderTools=window.renderTools}catch(e){}

  // app.js 在 bundle 前段可能已先畫出舊工具頁；此模組載入時立即以新版工具箱重新接管。
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(finalRender,0),{once:true});
  else setTimeout(finalRender,0);
})();
