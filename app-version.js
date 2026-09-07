'use strict';

// 全站唯一版本來源。版本號、更新時間與時區只在此維護；其他模組一律讀取 window.APP_BUILD。
window.APP_BUILD=Object.freeze({
  version:'v4.0',
  updated:'2026/09/07 13:24',
  timezone:'Asia/Taipei',
  schema:1
});

window.getAppVersion=function(){
  return window.APP_BUILD?.version||'版本未載入';
};
