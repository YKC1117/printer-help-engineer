'use strict';

// 私人 GitHub 共用案例庫（人工確認後才加入）。
// 重要：此檔只保存去識別化維修知識，不保存客戶名稱、完整序號、電話、地址或其他客戶識別資料。
// 新案例由工程師本機產生 submission packet，經人工確認後再由維護者加入此陣列。
(function(){
  const CASES=[
    // 範例格式（正式資料請由提交包轉入，不要直接複製客戶個資）：
    // {
    //   caseId:'case-20260907-zt610-xxxxxxxx',
    //   confirmedAt:'2026-09-07',
    //   brand:'Zebra',model:'ZT610',symptom:'Ribbon Out',
    //   rootCause:'Ribbon Sensor 本體異常',
    //   action:'更換 Ribbon Sensor 並重新校正',
    //   parts:'P/N 依實機序號核對',
    //   verify:'已通過連續列印／冷熱機',
    //   sharedNote:'碳帶存在仍持續 Ribbon Out；Sensor 讀值遮擋前後無合理變化。',
    //   evidence:['拔除 Sensor 後校正可完成','正常件交叉後故障跟著 Sensor 移動']
    // }
  ];

  window.INTERNAL_CASE_LIBRARY=CASES;

  function cleanList(v){return Array.isArray(v)?v.map(x=>String(x||'').trim()).filter(Boolean):[]}
  function addCase(c){
    if(!c||!c.caseId||!c.model||!c.symptom||!c.rootCause||!c.action)return;
    if(window.REPAIR_KB?.some(x=>x.id===`shared-${c.caseId}`))return;
    const facts=[
      `已確認根因：${c.rootCause}`,
      c.parts?`更換／使用零件：${c.parts}`:'未記錄更換料號；若需採購仍須依 Model / S/N / DPI / Revision 核對。',
      ...cleanList(c.evidence)
    ];
    const engineering=[
      `實際處置：${c.action}`,
      c.sharedNote?`案例關鍵觀察：${c.sharedNote}`:'',
      '此案例為內部已確認實機經驗；不可把單台量測數值直接當成同型號通用規格。'
    ].filter(Boolean);
    const verify=[c.verify||'已完修驗證','同症狀再次遇到時，先重現與交叉驗證，不直接依案例盲換零件。'];
    const flow=[
      ['重現相同症狀',`確認 ${c.model} 是否出現「${c.symptom}」且條件與案例相近。`,['相近','不相近'],'不相近時回一般故障流程。'],
      ['先排除低風險因素','先完成耗材、安裝、設定、Calibration 與可視接頭檢查。',['已排除','找到其他原因'],'不要因命中案例就跳過基礎排查。'],
      ['驗證案例根因',`針對「${c.rootCause}」做讀值、線束或已知正常件交叉。`,['根因被支持','不支持','無法交叉'],'只有被支持才進換件。'],
      ['執行維修',c.action,['完成','未完成'],'料號與拆裝仍依該機 Parts/Service 文件。'],
      ['完修回歸',c.verify||'執行冷開機、連印、實際耗材與相關選配驗證。',['通過','未通過'],'未通過不可直接結案。']
    ];
    addRepairKB({
      id:`shared-${c.caseId}`,
      brand:c.brand||'通用',models:[c.model],
      category:'內部實機案例／已確認',severity:'高價值',
      title:`${c.model}｜${c.symptom} → ${c.rootCause}`,
      summary:`已確認內部案例：${c.symptom} 最終收斂為「${c.rootCause}」，處置為「${c.action}」。`,
      keyFacts:facts,engineering,verify,flow,
      sources:[],evidence:'internal-field',
      evidenceNote:`私人 GitHub 共用案例庫｜${c.confirmedAt||'日期未記錄'}｜已去除客戶名稱與完整序號。`,
      internalCaseId:c.caseId
    });
  }

  CASES.forEach(addCase);
  window.registerSharedInternalCase=addCase;
})();
