'use strict';

// 共用案例提交前的第二層個資防呆：本機案件可保留客戶資料，但私人 GitHub 正式案例只收去識別化知識。
(function(){
  if(typeof window.prepareInternalCaseSubmission!=='function')return;
  const old=window.prepareInternalCaseSubmission;

  function privacyProblems(x){
    const s=String(x?.sharedNote||'').trim();
    const bad=[];
    const direct=[['客戶名稱',x?.customer],['完整序號',x?.serial],['工程師姓名',x?.engineer]];
    for(const [label,v] of direct){
      const t=String(v||'').trim();
      if(t.length>=3&&s.includes(t))bad.push(label);
    }
    if(/\b09\d{8}\b/.test(s)||/\b0\d{1,2}[-\s]?\d{6,8}\b/.test(s))bad.push('疑似電話號碼');
    if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(s))bad.push('Email');
    if(/(?:統編|統一編號)[：:\s]*\d{8}/.test(s))bad.push('統一編號');
    return [...new Set(bad)];
  }

  window.prepareInternalCaseSubmission=function(i){
    const list=typeof readCases==='function'?readCases():[];
    const x=list[i];
    if(x){
      const bad=privacyProblems(x);
      if(bad.length){
        alert(`內部案例摘要可能包含不該進 GitHub 的識別資料：\n\n• ${bad.join('\n• ')}\n\n請先修改「內部案例摘要／關鍵觀察」，只保留維修技術內容，再重新儲存案件。`);
        return;
      }
    }
    return old(i);
  };
})();
