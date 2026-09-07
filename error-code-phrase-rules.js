'use strict';

// 錯誤碼／面板訊息口語搜尋補強。
(function(){
  if(typeof CUSTOMER_PHRASE_RULES==='undefined')return;
  const extra=[
    {id:'sato1007',icon:'🔓',title:'SATO 1007 Head Open',issue:'Head Open／印字頭開啟',keywords:['1007','sato 1007','head open 1007','印字頭開啟1007'],hint:'CL4NX Plus 先確認 Head Lock，再查 Head Open Sensor/觸發機構。',kb:'1007 Head Open Sensor'},
    {id:'sato1008',icon:'📄',title:'SATO 1008 Out of Paper',issue:'Out of Paper／有紙卻報缺紙',keywords:['1008','sato 1008','out of paper 1008','缺紙1008'],hint:'先確認紙材、Media Sensor Level、Jam 與 Calibration。',kb:'1008 Out of Paper Media Sensor'},
    {id:'sato1009',icon:'🎞️',title:'SATO 1009 Ribbon End',issue:'Ribbon End／碳帶未用完卻報錯',keywords:['1009','sato 1009','ribbon end 1009','碳帶1009'],hint:'先查 Ribbon 路徑、Supply/Take-up 軸與 Ribbon Sensor。',kb:'1009 Ribbon End Sensor'},
    {id:'sato1010',icon:'📏',title:'SATO 1010 Media Error',issue:'Media Error／校正定位異常',keywords:['1010','sato 1010','media error 1010'],hint:'先確認 Gap/I-Mark Sensor Type、位置與 Calibration。',kb:'1010 Media Error Calibration'},
    {id:'sato1012',icon:'🖨️',title:'SATO 1012 Head Error',issue:'Head Error／Printhead 壞點',keywords:['1012','sato 1012','head error 1012','印字頭1012'],hint:'固定壞點清潔後仍存在，Printhead 方向高。',kb:'1012 Head Error Printhead'},
    {id:'sato1013',icon:'💾',title:'SATO 1013 USB R/W Error',issue:'USB R/W Error',keywords:['1013','sato 1013','usb r/w error','usb rw error'],hint:'先換正常 USB 儲存裝置交叉，再查 Printer USB Host。',kb:'1013 USB R/W Error'},
    {id:'sato1014',icon:'💾',title:'SATO 1014 USB Memory Full',issue:'USB Memory Full',keywords:['1014','sato 1014','usb memory full'],hint:'先確認 USB 儲存空間與檔案，再判 Printer。',kb:'1014 USB Memory Full'},
    {id:'sato1015',icon:'✂️',title:'SATO 1015 Cutter Error',issue:'Cutter Error／刀片未回位',keywords:['1015','sato 1015','cutter error 1015','切刀1015'],hint:'先斷電清 Jam，再依官方方式讓 Cutter 回 Home。',kb:'1015 Cutter Error'},
    {id:'sato1016',icon:'✂️',title:'SATO 1016 Cutter Cover Open',issue:'Cutter Cover Open',keywords:['1016','sato 1016','cutter cover open'],hint:'先確認 Cutter Cover 卡榫與 Cover Sensor。',kb:'1016 Cutter Cover Open'},
    {id:'sato1017',icon:'⌨️',title:'SATO 1017 SBPL Command Error',issue:'SBPL Command Error',keywords:['1017','sato 1017','sbpl command error'],hint:'若只有特定工作出錯，優先查 SBPL 資料/Driver/Emulation。',kb:'1017 SBPL Command Error'},
    {id:'zebra_headopen_alert',icon:'🔓',title:'Zebra PRINTHEAD OPEN',issue:'Printhead Open／Head Open',keywords:['printhead open','head open zebra','zebra head open','印字頭開啟'],hint:'關到底仍報錯時查 Head Open Sensor、觸發片與線束。',kb:'ZT610 ZT620 PRINTHEAD OPEN'},
    {id:'zebra_mediaout_alert',icon:'📄',title:'Zebra MEDIA OUT',issue:'Media Out／紙張用盡',keywords:['media out','zebra media out','紙張用盡 media out'],hint:'先查 Media Type、Sensor 位置與 Calibration。',kb:'ZT610 ZT620 MEDIA OUT'},
    {id:'zebra_ribbonin_alert',icon:'🎞️',title:'Zebra RIBBON IN',issue:'Ribbon In／熱感模式偵測到碳帶',keywords:['ribbon in','zebra ribbon in','direct thermal ribbon'],hint:'先確認 Direct Thermal / Thermal Transfer 與實際耗材。',kb:'ZT610 ZT620 RIBBON IN'},
    {id:'zebra_headtemp_alert',icon:'🌡️',title:'Zebra Head Temperature Alert',issue:'Printhead Over/Under Temperature',keywords:['head over temp','printhead over temp','head under temp','printhead under temp','頭過熱','印字頭低溫'],hint:'真過熱先降溫；高低溫訊息反覆切換要查 Head Cable/Thermistor。',kb:'ZT610 ZT620 printhead temperature'},
    {id:'tsc_take_label_alert',icon:'🏷️',title:'TSC Take Label',issue:'Take Label／剝紙後不續印',keywords:['take label','tsc take label','取標後不印','剝紙後不續印'],hint:'先確認 Peel Mode，再查 Peel Sensor 與模組接頭。',kb:'TSC Take Label Peel Sensor'}
  ];
  const ids=new Set(CUSTOMER_PHRASE_RULES.map(x=>x.id));
  extra.forEach(x=>{if(!ids.has(x.id))CUSTOMER_PHRASE_RULES.push(x)});
})();
