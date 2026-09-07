'use strict';

// 舊批次資料曾以不存在的「iX4-300 Pro」代表 300 dpi iX4 Pro。
// Argox 官方 iX4 Pro 系列實際型號為 iX4-200/240/250/350 Pro；此處在正式資料層修正，避免把錯型號放進搜尋與統計。
(function(){
  const targetIds=new Set([
    'svc-argox-ix4-cutter',
    'argox-ix4-hw-harness',
    'argox-ix4-hw-rewind',
    'argox-ix4-hw-interface',
    'argox-ix4-hw-firmware',
    'argox-ix4-hw-bearing',
    'argox-ix4-hw-peel',
    'argox-ix4-hw-psuload'
  ]);
  const officialModels=['iX4-200 Pro','iX4-240 Pro','iX4-250 Pro','iX4-350 Pro'];
  for(const article of REPAIR_KB){
    if(!targetIds.has(article.id))continue;
    article.models=[...officialModels];
    article.modelCorrection='2026-09-07：移除不存在的 iX4-300 Pro，改為官方 iX4 Pro 型號集合';
  }
})();
