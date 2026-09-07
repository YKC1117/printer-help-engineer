'use strict';

// v3.3 performance patch：維修資料庫搜尋不再每打一個字就整頁重建。
(function(){
  if(typeof window.renderKB!=='function'||typeof window.REPAIR_KB==='undefined')return;

  let searchIndex=[];
  let indexedLength=-1;
  let searchTimer=null;

  function ensureIndex(){
    if(indexedLength===REPAIR_KB.length)return;
    searchIndex=REPAIR_KB.map(a=>({
      a,
      title:(a.title||'').toLowerCase(),
      category:(a.category||'').toLowerCase(),
      models:(a.models||[]).join(' ').toLowerCase(),
      hay:[a.title,a.brand,a.category,a.summary,...(a.models||[]),...(a.keyFacts||[]),...(a.engineering||[]),...(a.verify||[])].join(' ').toLowerCase()
    }));
    indexedLength=REPAIR_KB.length;
  }

  function currentModel(){
    return (typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
  }

  function scoreList(q,br,cat,only,cur){
    ensureIndex();
    const tokens=q.split(/[\s,，、/／|｜]+/).map(x=>x.trim()).filter(x=>x.length>=2);
    return searchIndex.map(x=>{
      let score=0;
      if(!q)score=1;
      else if(tokens.length){
        for(const t of tokens){
          if(x.hay.includes(t))score+=1;
          if(x.title.includes(t))score+=4;
          if(x.models.includes(t))score+=6;
          if(x.category.includes(t))score+=2;
        }
      }else if(x.hay.includes(q))score=1;
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
    box.innerHTML=`<div class="kb-head"><span class="badge">v3.3 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。搜尋已改為輕量模式，支援多關鍵詞。</div></div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：ZT610 Ribbon Sensor、Cutter、TPH、IP…"><select id="kbBrand">${brands.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${cur?'':'disabled'}> <span id="kbModelOnlyText">只看目前機型${cur?`（${kbEsc(cur)}）`:''}</span></label></div><div class="kb-count" id="kbCount"></div><div class="kb-grid" id="kbGrid"></div><div id="kbDetail"></div>`;

    const input=$('kbSearch');
    input.addEventListener('input',()=>{
      clearTimeout(searchTimer);
      searchTimer=setTimeout(()=>refreshResults(true),180);
    });
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        clearTimeout(searchTimer);
        refreshResults(true);
      }
    });
    $('kbBrand').addEventListener('change',()=>refreshResults(true));
    $('kbCat').addEventListener('change',()=>refreshResults(true));
    $('kbModelOnly').addEventListener('change',()=>refreshResults(true));
  }

  function refreshModelState(){
    const cur=currentModel(),check=$('kbModelOnly'),txt=$('kbModelOnlyText');
    if(!check)return;
    check.disabled=!cur;
    if(!cur)check.checked=false;
    if(txt)txt.textContent=`只看目前機型${cur?`（${cur}）`:''}`;
  }

  function refreshResults(clearDetail=false){
    const grid=$('kbGrid'),count=$('kbCount');
    if(!grid||!count)return;
    const q=($('kbSearch')?.value||'').trim().toLowerCase();
    const br=$('kbBrand')?.value||'全部';
    const cat=$('kbCat')?.value||'全部';
    const only=!!$('kbModelOnly')?.checked;
    const cur=currentModel();
    const scored=scoreList(q,br,cat,only,cur);
    const list=scored.map(x=>x.a);
    count.innerHTML=`找到 <b>${list.length}</b> 筆${q?'（依關鍵詞相關度排序）':''}`;
    grid.innerHTML=list.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料，請縮短關鍵詞或改用故障名稱。</div>';
    grid.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>openKBArticle(b.dataset.kb));
    if(clearDetail){const d=$('kbDetail');if(d)d.innerHTML=''}
  }

  window.renderKB=function(filters={}){
    buildShell();
    refreshModelState();
    if(filters.q!==undefined&&$('kbSearch'))$('kbSearch').value=filters.q;
    if(filters.brand!==undefined&&$('kbBrand'))$('kbBrand').value=filters.brand;
    if(filters.cat!==undefined&&$('kbCat'))$('kbCat').value=filters.cat;
    if(filters.modelOnly!==undefined&&$('kbModelOnly')&&!$('kbModelOnly').disabled)$('kbModelOnly').checked=!!filters.modelOnly;
    refreshResults(false);
  };

  // 讓舊程式呼叫 renderKB 時也走新版。
  try{renderKB=window.renderKB}catch(e){}
})();
