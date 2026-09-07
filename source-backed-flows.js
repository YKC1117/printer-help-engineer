'use strict';

(function(){
  if(typeof MODEL_CASES==='undefined'||!window.REPAIR_KB)return;
  const flow=id=>REPAIR_KB.find(x=>x.id===id)?.flow;
  const put=(brand,models,symptoms,id)=>{const f=flow(id);if(!Array.isArray(f))return;models.forEach(m=>symptoms.forEach(s=>MODEL_CASES[`${brand}|${m}|${s}`]=f));};

  const xi4=['110Xi4','140Xi4','170Xi4','220Xi4'];
  put('Zebra',xi4,['Ribbon Out／色帶用盡','碳帶皺褶／破碳'],'zebra-xi4-ribbon');
  put('Zebra',xi4,['Paper Out／紙張用盡','校正一直吐紙／停不下來'],'zebra-xi4-media');
  put('Zebra',xi4,['列印太淡／不清楚','固定缺線／白線','列印歪斜／左右深淺不一','紙張越走越偏'],'zebra-xi4-quality');

  const zt600=['ZT610','ZT620'];
  put('Zebra',zt600,['Ribbon Out／色帶用盡','碳帶皺褶／破碳'],'zebra-zt600-ribbon');
  put('Zebra',zt600,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'zebra-zt600-media');
  put('Zebra',zt600,['列印太淡／不清楚','固定缺線／白線','列印歪斜／左右深淺不一','紙張越走越偏'],'zebra-zt600-quality');
  put('Zebra',zt600,['切刀不切／卡刀','印字頭過熱／列印一段時間就暫停','開機卡住／面板異常'],'zebra-zt600-alerts');

  const th=['TH240','TH340'];
  put('TSC',th,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'tsc-th240-media');
  put('TSC',th,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'tsc-th240-tph');
  put('TSC',th,['切刀不切／卡刀'],'tsc-th240-cutter');
  put('TSC',th,['無法列印／電腦連不到','網路列印斷線／IP 找不到','USB 無法辨識／USB 列印失敗'],'tsc-network');

  const tscCare=['MH241','MH341','MH641','MB240T','MB340T'];
  put('TSC',tscCare,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'tsc-th240-tph');
  put('TSC',tscCare,['無法列印／電腦連不到','網路列印斷線／IP 找不到','USB 無法辨識／USB 列印失敗'],'tsc-network');

  const p4=['P4-250 Pro','P4-350 Pro','P4-650 Pro','P4-650'];
  put('Argox',p4,['Paper Out／紙張用盡','校正一直吐紙／停不下來','列印位置偏移'],'argox-p4-cal');
  put('Argox',p4,['列印太淡／不清楚','固定缺線／白線','列印空白／完全沒字'],'argox-p4-quality');
  put('Argox',p4,['無法列印／電腦連不到','USB 無法辨識／USB 列印失敗','切刀不切／卡刀'],'argox-p4-errors');

  if(typeof EXTRA_SYMPTOMS!=='undefined'){
    const add=(brand,model,name)=>{const k=`${brand}|${model}`,v=EXTRA_SYMPTOMS[k]||[];if(!v.includes(name))EXTRA_SYMPTOMS[k]=[...v,name];};
    [...xi4,...zt600].forEach(m=>add('Zebra',m,'列印歪斜／左右深淺不一'));
  }
})();
