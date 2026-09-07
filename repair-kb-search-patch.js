'use strict';

// v3.3 大資料庫搜尋：完整索引全部資料，分批顯示；提高精確機型、完整片語與證據型內容的排序品質。
(function(){
  if(typeof window.renderKB!=='function'||typeof window.REPAIR_KB==='undefined')return;

  let searchIndex=[];
  let indexedLength=-1;
  let searchTimer=null;
  let visibleLimit=60;
  const PAGE_SIZE=60;

  const norm=s=>String(s||'').toLowerCase().replace(/[\s_\-–—/／()（）\[\]【】]+/g,'');

  function ensureIndex(){
    if(indexedLength===REPAIR_KB.length)return;
    searchIndex=REPAIR_KB.map(a=>({
      a,
      title:(a.title||'').toLowerCase(),
      titleN:norm(a.title),
      category:(a.category||'').toLowerCase(),
      models:(a.models||[]).join(' ').toLowerCase(),
      modelNorms:(a.models||[]).map(norm),
      evidence:(a.evidence||'').toLowerCase(),
      sourceCount:(a.sources||[]).length,
      hay:[a.title,a.brand,a.category,a.summary,a.evidence,a.evidenceNote,...(a.models||[]),...(a.keyFacts||[]),...(a.engineering||[]),...(a.verify||[])].join(' ').toLowerCase()
    }));
    indexedLength=REPAIR_KB.length;
  }

  function currentModel(){
    return (typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
  }

  function scoreList(q,br,cat,only,cur){
    ensureIndex();
    const tokens=q.split(/[\s,，、/／|｜]+/).map(x=>x.trim()).filter(x=>x.length>=2);
    const qn=norm(q);
    const wantsCase=/案例|實測|field|case/.test(q);
    const wantsSop=/sop|保養|交機|完修|換件|料號|收機|交叉測試/.test(q);
    return searchIndex.map(x=>{
      let score=0;
      if(!q)score=1;
      else {
        if(qn&&x.titleN.includes(qn))score+=12;
        for(const t of tokens){
          const tn=norm(t);
          if(x.hay.includes(t))score+=1;
          if(x.title.includes(t))score+=5;
          if(x.category.includes(t))score+=2;
          for(const mn of x.modelNorms){
            if(!tn)continue;
            if(mn===tn)score+=24;
            else if(mn.startsWith(tn))score+=14;
            else if(mn.includes(tn))score+=8;
          }
        }
        if(wantsCase&&x.evidence.startsWith('internal-field'))score+=8;
        if(wantsSop&&x.evidence==='workflow-sop')score+=6;
        if(x.sourceCount)score+=1;
      }
      // 已選機型時，即使沒有勾「只看目前機型」，同機型文章優先。
      if(cur&&x.a.models.includes(cur))score+=4;
      return {a:x.a,score};
    }).filter(x=>(!q||x.score>0)
      &&(br==='全部'||x.a.brand===br)
      &&(cat==='全部'||x.a.category===cat)
      &&(!only||!cur||x.a.models.includes(cur)||x.a.models.includes('ALL')))
      .sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
  }

  function buildShell(){
    const box=$('tab-kb');
    if(!box||$('kbSearch'))return;
    const brands=['全部',...new Set(REPAIR_KB.map(a=>a.brand))];
    const cats=['全部',...new Set(REPAIR_KB.map(a=>a.category))];
    const cur=currentModel();
    box.innerHTML=`<div class="kb-head"><span class="badge">v3.3 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。完整資料全部可搜尋；精確機型、完整故障片語與實機案例會優先排序。</div></div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：110X Ribbon Sensor、ZT61 Cutter、1015、印一印重開…"><select id="kbBrand">${brands.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${cur?'':'disabled'}> <span id="kbModelOnlyText">只看目前機型${cur?`（${kbEsc(cur)}）`:''}</span></label></div><div class="kb-count" id="kbCount"></div><div class="kb-grid" id="kbGrid"></div><div id="kbMoreWrap"></div><div id="kbDetail"></div>`;

    const input=$('kbSearch');
    input.addEventListener('input',()=>{
      clearTimeout(searchTimer);
      searchTimer=setTimeout(()=>{visibleLimit=PAGE_SIZE;refreshResults(true)},180);
    });
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        clearTimeout(searchTimer);
        visibleLimit=PAGE_SIZE;
        refreshResults(true);
      }
    });
    $('kbBrand').addEventListener('change',()=>{visibleLimit=PAGE_SIZE;refreshResults(true)});
    $('kbCat').addEventListener('change',()=>{visibleLimit=PAGE_SIZE;refreshResults(true)});
    $('kbModelOnly').addEventListener('change',()=>{visibleLimit=PAGE_SIZE;refreshResults(true)});
  }

  function refreshModelState(){
    const cur=currentModel(),check=$('kbModelOnly'),txt=$('kbModelOnlyText');
    if(!check)return;
    check.disabled=!cur;
    if(!cur)check.checked=false;
    if(txt)txt.textContent=`只看目前機型${cur?`（${cur}）`:''}`;
  }

  function refreshResults(clearDetail=false){
    const grid=$('kbGrid'),count=$('kbCount'),more=$('kbMoreWrap');
    if(!grid||!count)return;
    const q=($('kbSearch')?.value||'').trim().toLowerCase();
    const br=$('kbBrand')?.value||'全部';
    const cat=$('kbCat')?.value||'全部';
    const only=!!$('kbModelOnly')?.checked;
    const cur=currentModel();
    const scored=scoreList(q,br,cat,only,cur);
    const fullList=scored.map(x=>x.a);
    const shown=fullList.slice(0,visibleLimit);
    count.innerHTML=`找到 <b>${fullList.length}</b> 筆${q?'（依機型／片語／證據相關度排序）':''}${fullList.length>shown.length?`｜目前顯示 ${shown.length} 筆`:''}`;
    grid.innerHTML=shown.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料，請縮短關鍵詞或改用故障名稱。</div>';
    grid.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>openKBArticle(b.dataset.kb));
    if(more){
      if(fullList.length>shown.length){
        const remain=fullList.length-shown.length;
        more.innerHTML=`<div style="text-align:center;margin:14px 0"><button id="kbMoreBtn" class="btn secondary" type="button">顯示更多（還有 ${remain} 筆）</button></div>`;
        $('kbMoreBtn').onclick=()=>{visibleLimit+=PAGE_SIZE;refreshResults(false)};
      }else more.innerHTML='';
    }
    if(clearDetail){const d=$('kbDetail');if(d)d.innerHTML=''}
  }

  window.renderKB=function(filters={}){
    buildShell();
    refreshModelState();
    visibleLimit=PAGE_SIZE;
    if(filters.q!==undefined&&$('kbSearch'))$('kbSearch').value=filters.q;
    if(filters.brand!==undefined&&$('kbBrand'))$('kbBrand').value=filters.brand;
    if(filters.cat!==undefined&&$('kbCat'))$('kbCat').value=filters.cat;
    if(filters.modelOnly!==undefined&&$('kbModelOnly')&&!$('kbModelOnly').disabled)$('kbModelOnly').checked=!!filters.modelOnly;
    refreshResults(false);
  };

  try{renderKB=window.renderKB}catch(e){}
})();
