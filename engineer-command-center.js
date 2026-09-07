'use strict';

// 工程師遠端設定指令中心：只產生/複製已核對的印表機設定指令與 TCP 9100 傳送器。
(function(){
  const byId=id=>document.getElementById(id);
  const h=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const notify=t=>typeof toast==='function'?toast(t):alert(t);

  const commands=[
    ['Zebra','校正／儲存','強制耗材校正','~JC','重新量測標籤長度與 Media／Ribbon Sensor。','normal','依機型更新校正值'],
    ['Zebra','校正／儲存','儲存目前設定','^XA^JUS^XZ','保存目前可寫入的設定。','normal','會保存'],
    ['Zebra','校正／儲存','叫回上次設定','^XA^JUR^XZ','重新載入上次已保存設定。','caution','讀取已保存值'],
    ['Zebra','列印模式','熱轉印','^XA^MTT^JUS^XZ','Print Method 改為 Thermal Transfer。','normal','會保存'],
    ['Zebra','列印模式','熱感應','^XA^MTD^JUS^XZ','Print Method 改為 Direct Thermal。','normal','會保存'],
    ['Zebra','列印模式','Tear-off','^XA^MMT^JUS^XZ','切換撕紙模式。','normal','會保存'],
    ['Zebra','列印模式','Peel-off','^XA^MMP^JUS^XZ','只在已安裝剝紙器時使用。','caution','會保存'],
    ['Zebra','列印模式','Cutter','^XA^MMC^JUS^XZ','只在已安裝 Cutter 時使用。','caution','會保存'],
    ['Zebra','列印模式','Rewind','^XA^MMR^JUS^XZ','限支援回捲的機型／選配。','caution','會保存'],
    ['Zebra','Sensor','Sensor Auto','^XA^MNA^JUS^XZ','Media Sensor Select 回到 Auto-Detect。','normal','會保存'],
    ['Zebra','位置','水平／垂直位移歸零','^XA^LS0^LT0^JUS^XZ','Left Position 與 Label Top 歸零。','normal','會保存'],
    ['TSC','校正／Sensor','Gap 自動校正','GAPDETECT\r\n','自動偵測紙張與 Gap。','normal','更新校正值'],
    ['TSC','校正／Sensor','Black Mark 自動校正','BLINEDETECT\r\n','自動偵測紙張與黑標。','normal','更新校正值'],
    ['TSC','方向／位置','DIRECTION 0','DIRECTION 0\r\n','列印方向設為 0。','normal','會保存'],
    ['TSC','方向／位置','DIRECTION 1','DIRECTION 1\r\n','列印方向設為 1。','normal','會保存'],
    ['TSC','方向／位置','Mirror ON','DIRECTION 0,1\r\n','開啟鏡像；解除可用 DIRECTION 0,0。','caution','會保存'],
    ['TSC','出紙／選配','Tear ON','SET TEAR ON\r\n','開啟 Tear 模式。TSPL2。','normal','會保存'],
    ['TSC','出紙／選配','Tear OFF','SET TEAR OFF\r\n','關閉 Tear 模式。TSPL2。','normal','會保存'],
    ['TSC','出紙／選配','Peel ON','SET PEEL ON\r\n','需有剝紙器／Sensor。','caution','會保存'],
    ['TSC','出紙／選配','Peel OFF','SET PEEL OFF\r\n','關閉 Peel。','normal','會保存'],
    ['TSC','出紙／選配','Cutter OFF','SET CUTTER OFF\r\n','關閉切刀。','normal','會保存'],
    ['TSC','出紙／選配','每張切一刀','SET CUTTER 1\r\n','每 1 張切一次；需已安裝 Cutter。','caution','會保存'],
    ['TSC','出紙／選配','工作結束再切','SET CUTTER BATCH\r\n','整批工作結束後切刀。','caution','會保存'],
    ['TSC','出紙／選配','Rewind ON','SET REWIND ON\r\n','限支援 Rewind 的機型／選配。','caution','會保存'],
    ['TSC','出紙／選配','Rewind OFF','SET REWIND OFF\r\n','關閉 Rewind。','normal','會保存'],
    ['TSC','網路｜高風險','DHCP','NET DHCP\r\n','改用 DHCP；印表機會重新啟動，IP 可能改變。','danger','會重啟／可能斷線'],
    ['TSC','網路｜高風險','RAW Port 9100','NET PORT 9100\r\n','設定 Ethernet RAW Port；印表機會重新啟動。','danger','會重啟／可能斷線']
  ];

  function validHost(v){const s=String(v||'').trim();return /^[a-zA-Z0-9.-]{1,253}$/.test(s)?s:''}
  function to64(s){return btoa(unescape(encodeURIComponent(String(s))))}
  function copyRaw(cmd){if(typeof copyText==='function')copyText(cmd);else navigator.clipboard?.writeText(cmd)}
  function makePS(cmd){
    const ip=validHost(byId('eccIp')?.value);if(!ip){notify('先輸入印表機 IP');return''}
    const port=Math.max(1,Math.min(65535,Number(byId('eccPort')?.value)||9100));
    return `$ip='${ip}';$port=${port};$b=[Convert]::FromBase64String('${to64(cmd)}');$tcp=[Net.Sockets.TcpClient]::new($ip,$port);$s=$tcp.GetStream();$s.Write($b,0,$b.Length);$s.Dispose();$tcp.Dispose()`;
  }
  function copyPS(cmd){const s=makePS(cmd);if(s)copyRaw(s)}
  window.eccCopyRaw=copyRaw;window.eccCopyPS=copyPS;

  function card(x){
    const [brand,group,title,cmd,desc,risk,save]=x;
    const label=risk==='danger'?'高風險':risk==='caution'?'注意':'一般';
    return `<article class="ecc-card ${risk}"><div class="ecc-card-head"><div><span class="ecc-brand">${h(brand)}｜${h(group)}</span><h4>${h(title)}</h4></div><span class="ecc-risk">${label}</span></div><p>${h(desc)}</p><code>${h(cmd.replace(/\r?\n/g,' ↵ '))}</code><div class="ecc-meta">${h(save)}</div><div class="ecc-actions"><button type="button" onclick='eccCopyRaw(${JSON.stringify(cmd)})'>複製原始指令</button><button type="button" onclick='eccCopyPS(${JSON.stringify(cmd)})'>PowerShell 9100</button></div></article>`;
  }

  function buildZebra(){
    const dark=String(byId('eccZDark')?.value||'').trim(),speed=String(byId('eccZSpeed')?.value||'').trim();
    const width=String(byId('eccZWidth')?.value||'').trim(),length=String(byId('eccZLength')?.value||'').trim();
    const method=byId('eccZMethod')?.value||'',mode=byId('eccZMode')?.value||'';const host=[],z=[];
    if(dark!==''){const n=Number(dark);if(!Number.isFinite(n)||n<0||n>30){notify('Zebra 濃度請輸入 0～30');return}host.push(`~SD${dark}`)}
    if(method)z.push(`^MT${method}`);if(mode)z.push(`^MM${mode}`);
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0||n>14){notify('速度請輸入 >0 且 ≤14 IPS，仍須確認機型上限');return}z.push(`^PR${speed}`)}
    if(width!==''){const n=Math.round(Number(width));if(!Number.isFinite(n)||n<2){notify('Print Width 請輸入 dots');return}z.push(`^PW${n}`)}
    if(length!==''){const n=Math.round(Number(length));if(!Number.isFinite(n)||n<1){notify('Label Length 請輸入 dots');return}z.push(`^LL${n}`)}
    if(!host.length&&!z.length){notify('至少選一個 Zebra 設定');return}
    const cmd=host.join('\n')+(host.length&&z.length?'\n':'')+(z.length?`^XA${z.join('')}^JUS^XZ`:'');
    byId('eccZOut').textContent=cmd;return cmd;
  }
  function buildTsc(){
    const density=String(byId('eccTDensity')?.value||'').trim(),speed=String(byId('eccTSpeed')?.value||'').trim();
    const direction=byId('eccTDir')?.value||'',tear=byId('eccTTear')?.value||'',offset=String(byId('eccTOffset')?.value||'').trim();const lines=[];
    if(density!==''){const n=Number(density);if(!Number.isInteger(n)||n<0||n>15){notify('TSC DENSITY 請輸入 0～15 整數');return}lines.push(`DENSITY ${n}`)}
    if(speed!==''){const n=Number(speed);if(!Number.isFinite(n)||n<=0){notify('TSC SPEED 請輸入正數並確認機型支援範圍');return}lines.push(`SPEED ${speed}`)}
    if(direction)lines.push(`DIRECTION ${direction}`);if(tear)lines.push(`SET TEAR ${tear}`);
    if(offset!==''){const n=Number(offset);if(!Number.isFinite(n)||n<-25.4||n>25.4){notify('OFFSET 請限制在 -25.4～25.4 mm');return}lines.push(`OFFSET ${offset} mm`)}
    if(!lines.length){notify('至少選一個 TSC 設定');return}
    const cmd=lines.join('\r\n')+'\r\n';byId('eccTOut').textContent=cmd;return cmd;
  }
  function buildStaticIp(){
    const ip=validHost(byId('eccTIp')?.value),mask=validHost(byId('eccTMask')?.value),gw=validHost(byId('eccTGw')?.value);
    if(!ip||!mask||!gw){notify('請完整輸入 IP／Mask／Gateway');return}
    const cmd=`NET IP "${ip}","${mask}","${gw}"\r\n`;byId('eccTNetOut').textContent=cmd;return cmd;
  }
  window.eccBuildZebra=(raw=true,ps=false)=>{const c=buildZebra();if(c&&raw)(ps?copyPS(c):copyRaw(c))};
  window.eccBuildTsc=(raw=true,ps=false)=>{const c=buildTsc();if(c&&raw)(ps?copyPS(c):copyRaw(c))};
  window.eccBuildStaticIp=(raw=true,ps=false)=>{const c=buildStaticIp();if(c&&raw)(ps?copyPS(c):copyRaw(c))};

  function html(){
    const version=h(window.APP_BUILD?.version||'');
    return `<section id="engineerCommandCenter" class="ecc-section"><div class="ecc-title"><div><span class="et-kicker">${version}｜遠端設定</span><h2>遠端設定指令中心</h2><p>遠端進客戶電腦時，可複製 Zebra ZPL／TSC TSPL；如果客戶電腦可連到印表機 IP，也能直接產生 PowerShell TCP 9100 傳送器。</p></div></div>
    <div class="ecc-send"><label>印表機 IP<input id="eccIp" autocomplete="off" placeholder="例如 192.168.1.100"></label><label>RAW Port<input id="eccPort" type="number" value="9100" min="1" max="65535"></label><div><b>PowerShell 9100</b><span>網站只產生指令，不會直接連客戶設備。把產生的 PowerShell 貼到客戶 Windows 執行，才會從該電腦送到印表機。</span></div></div>
    <details class="ecc-builder" open><summary>Zebra｜快速組合設定</summary><div class="ecc-fields"><label>列印方式<select id="eccZMethod"><option value="">不修改</option><option value="T">熱轉印</option><option value="D">熱感應</option></select></label><label>出紙模式<select id="eccZMode"><option value="">不修改</option><option value="T">Tear-off</option><option value="P">Peel-off</option><option value="C">Cutter</option><option value="R">Rewind</option></select></label><label>濃度 0～30<input id="eccZDark" type="number" min="0" max="30" step="0.1" placeholder="15"></label><label>速度 IPS<input id="eccZSpeed" type="number" min="0.1" max="14" step="0.1" placeholder="4"></label><label>Print Width dots<input id="eccZWidth" type="number" min="2" step="1" placeholder="選填"></label><label>Label Length dots<input id="eccZLength" type="number" min="1" step="1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildZebra(true,false)">產生＋複製 ZPL</button><button onclick="eccBuildZebra(true,true)">產生 PowerShell</button></div><pre id="eccZOut">尚未產生</pre><div class="ecc-note">濃度使用 ~SD；速度 ^PR 的可用上限依機型而異。Peel／Cutter／Rewind 只有安裝對應硬體才使用。</div></details>
    <details class="ecc-builder" open><summary>TSC｜快速組合設定</summary><div class="ecc-fields"><label>DENSITY 0～15<input id="eccTDensity" type="number" min="0" max="15" step="1" placeholder="8"></label><label>SPEED<input id="eccTSpeed" type="number" min="0.1" step="0.1" placeholder="4"></label><label>DIRECTION<select id="eccTDir"><option value="">不修改</option><option value="0">0</option><option value="1">1</option><option value="0,1">0 + Mirror</option><option value="0,0">0 + Mirror OFF</option></select></label><label>TEAR<select id="eccTTear"><option value="">不修改</option><option value="ON">ON</option><option value="OFF">OFF</option></select></label><label>OFFSET mm<input id="eccTOffset" type="number" min="-25.4" max="25.4" step="0.1" placeholder="選填"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildTsc(true,false)">產生＋複製 TSPL</button><button onclick="eccBuildTsc(true,true)">產生 PowerShell</button></div><pre id="eccTOut">尚未產生</pre></details>
    <details class="ecc-builder danger"><summary>TSC｜網路設定（高風險）</summary><div class="ecc-danger-box"><b>⚠️ 遠端注意</b><span>NET DHCP／NET IP／NET PORT 會讓印表機重新啟動；改 IP 後可能立刻斷線。先記錄原 IP、Mask、Gateway。</span></div><div class="ecc-fields"><label>新 IP<input id="eccTIp" placeholder="192.168.1.100"></label><label>Subnet Mask<input id="eccTMask" placeholder="255.255.255.0"></label><label>Gateway<input id="eccTGw" placeholder="192.168.1.1"></label></div><div class="ecc-gen-actions"><button onclick="eccBuildStaticIp(true,false)">產生＋複製 NET IP</button><button onclick="eccBuildStaticIp(true,true)">產生 PowerShell</button></div><pre id="eccTNetOut">尚未產生</pre></details>
    <div class="ecc-heading"><h3>Zebra｜已核對常用指令</h3><span>ZPL Programming Guide</span></div><div class="ecc-grid">${commands.filter(x=>x[0]==='Zebra').map(card).join('')}</div>
    <div class="ecc-heading"><h3>TSC｜已核對常用指令</h3><span>TSPL／TSPL2 Programming Manual</span></div><div class="ecc-grid">${commands.filter(x=>x[0]==='TSC').map(card).join('')}</div>
    <div class="ecc-source">先正式上 Zebra 與 TSC。其他品牌只在找到並核對原廠 Programming Guide 後加入，不用猜指令。</div></section>`;
  }

  function inject(){const box=byId('tab-tools');if(!box||byId('engineerCommandCenter'))return;const first=box.querySelector('.et-section');if(first)first.insertAdjacentHTML('afterend',html());else box.insertAdjacentHTML('beforeend',html())}
  function render(){if(typeof window.renderEngineerToolsPlus==='function')window.renderEngineerToolsPlus();inject()}
  window.renderEngineerCommandCenter=render;window.renderTools=render;try{renderTools=window.renderTools}catch(e){}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0),{once:true});else setTimeout(render,0);
})();
