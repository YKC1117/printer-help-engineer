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

  function evidenceType(a){
    if(a.evidence==='oem-parts')return 'A｜原廠料號';
    if(a.evidence==='verified-b-parts')return 'B｜雙來源料號';
    if(String(a.evidence||'').startsWith('internal-field'))return '內部實機案例';
    if(a.evidence==='workflow-sop')return '工程 SOP';
    if((a.sources||[]).length)return '有來源資料';
    return '通用工程基線';
  }

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
      evidenceType:evidenceType(a),
      sourceCount:(a.sources||[]).length,
      hay:[a.title,a.brand,a.category,a.summary,a.evidence,a.evidenceNote,...(a.models||[]),...(a.keyFacts||[]),...(a.engineering||[]),...(a.verify||[])].join(' ').toLowerCase()
    }));
    indexedLength=REPAIR_KB.length;
  }

  function currentModel(){
    return (typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
  }

  function scoreList(q,br,cat,ev,only,cur){
    ensureIndex();
    const tokens=q.split(/[\s,，、/／|｜]+/).map(x=>x.trim()).filter(x=>x.length>=2);
    const qn=norm(q);
    const wantsCase=/案例|實測|field|case/.test(q);
    const wantsSop=/sop|保養|交機|完修|換件|收機|交叉測試/.test(q);
    const wantsParts=/料號|part\s*number|parts?|p\/n|pn|printhead|platen|cutter|主板|電源|psu|sensor|motor|belt/.test(q);
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
        if(wantsParts&&x.evidence==='oem-parts')score+=12;
        if(wantsParts&&x.evidence==='verified-b-parts')score+=9;
        if(x.sourceCount)score+=1;
      }
      if(cur&&x.a.models.includes(cur))score+=4;
      return {a:x.a,score,evidenceType:x.evidenceType};
    }).filter(x=>(!q||x.score>0)
      &&(br==='全部'||x.a.brand===br)
      &&(cat==='全部'||x.a.category===cat)
      &&(ev==='全部'||x.evidenceType===ev)
      &&(!only||!cur||x.a.models.includes(cur)||x.a.models.includes('ALL')))
      .sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
  }

  function buildShell(){
    const box=$('tab-kb');
    if(!box||$('kbSearch'))return;
    const brands=['全部',...new Set(REPAIR_KB.map(a=>a.brand))];
    const cats=['全部',...new Set(REPAIR_KB.map(a=>a.category))];
    const evidence=['全部','A｜原廠料號','B｜雙來源料號','內部實機案例','工程 SOP','有來源資料','通用工程基線'];
    const cur=currentModel();
    const ec=window.KB_HEALTH?.evidenceCount||{};
    const composition=Object.keys(ec).length?`A原廠料號 ${ec['A原廠料號']||ec['原廠料號']||0}｜B雙來源料號 ${ec['B雙來源料號']||0}｜內部實機案例 ${ec['內部實機案例']||0}｜工程 SOP ${ec['工程SOP']||0}｜有來源資料 ${ec['有來源資料']||0}｜通用基線 ${ec['通用工程基線']||0}`:'';
    box.innerHTML=`<div class="kb-head"><span class="badge">v3.3 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。精確料號分為 A 原廠與 B 雙來源；搜尋時 A 級優先，B 級仍需下料前實機核對。</div>${composition?`<div class="small" style="margin-top:5px;font-weight:800">資料組成：${kbEsc(composition)}</div>`:''}</div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：110X Ribbon Sensor、ZT61 Printhead 料號、MH241 Platen、1015…"><select id="kbBrand">${brands.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><select id="kbEvidence" title="資料等級">${evidence.map(x=>`<option>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${cur?'':'disabled'}> <span id="kbModelOnlyText">只看目前機型${cur?`（${kbEsc(cur)}）`:''}</span></label></div><div class="kb-count" id="kbCount"></div><div class="kb-grid" id="kbGrid"></div><div id="kbMoreWrap"></div><div id="kbDetail"></div>`;

    const input=$('kbSearch');
    input.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{visibleLimit=PAGE_SIZE;refreshResults(true)},180)});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(searchTimer);visibleLimit=PAGE_SIZE;refreshResults(true)}});
    ['kbBrand','kbCat','kbEvidence','kbModelOnly'].forEach(id=>$(id)?.addEventListener('change',()=>{visibleLimit=PAGE_SIZE;refreshResults(true)}));
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
    const ev=$('kbEvidence')?.value||'全部';
    const only=!!$('kbModelOnly')?.checked;
    const cur=currentModel();
    const scored=scoreList(q,br,cat,ev,only,cur);
    const fullList=scored.map(x=>x.a);
    const shown=fullList.slice(0,visibleLimit);
    count.innerHTML=`找到 <b>${fullList.length}</b> 筆${q?'（依機型／片語／證據相關度排序）':''}${ev!=='全部'?`｜${kbEsc(ev)}`:''}${fullList.length>shown.length?`｜目前顯示 ${shown.length} 筆`:''}`;
    grid.innerHTML=shown.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料，請縮短關鍵詞、改故障名稱或調整資料等級。</div>';
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
    buildShell();refreshModelState();visibleLimit=PAGE_SIZE;
    if(filters.q!==undefined&&$('kbSearch'))$('kbSearch').value=filters.q;
    if(filters.brand!==undefined&&$('kbBrand'))$('kbBrand').value=filters.brand;
    if(filters.cat!==undefined&&$('kbCat'))$('kbCat').value=filters.cat;
    if(filters.evidence!==undefined&&$('kbEvidence'))$('kbEvidence').value=filters.evidence;
    if(filters.modelOnly!==undefined&&$('kbModelOnly')&&!$('kbModelOnly').disabled)$('kbModelOnly').checked=!!filters.modelOnly;
    refreshResults(false);
  };
  try{renderKB=window.renderKB}catch(e){}
})();
