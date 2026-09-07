'use strict';

// v3.3：讓維修資料庫可接受「ZT610 Ribbon Sensor 校正」這類多關鍵詞搜尋，
// 不要求整句完全連續出現在文章中。
(function(){
  if(typeof window.renderKB!=='function'||typeof window.REPAIR_KB==='undefined')return;
  window.renderKB=function(filters={}){
    const box=$('tab-kb');if(!box||!window.REPAIR_KB)return;
    const cur=(typeof currentProduct!=='undefined'&&currentProduct&&currentProduct.m!=='未指定機型')?currentProduct.m:'';
    const q=(filters.q??$('kbSearch')?.value??'').trim().toLowerCase();
    const br=filters.brand??$('kbBrand')?.value??'全部';
    const cat=filters.cat??$('kbCat')?.value??'全部';
    const only=filters.modelOnly??$('kbModelOnly')?.checked??false;
    const brands=['全部',...new Set(REPAIR_KB.map(a=>a.brand))];
    const cats=['全部',...new Set(REPAIR_KB.map(a=>a.category))];
    const tokens=q.split(/[\s,，、/／|｜]+/).map(x=>x.trim()).filter(x=>x.length>=2);
    const scored=REPAIR_KB.map(a=>{
      const title=(a.title||'').toLowerCase(),category=(a.category||'').toLowerCase(),models=(a.models||[]).join(' ').toLowerCase();
      const hay=[a.title,a.brand,a.category,a.summary,...(a.models||[]),...(a.keyFacts||[]),...(a.engineering||[]),...(a.verify||[])].join(' ').toLowerCase();
      let score=0;
      if(!q)score=1;
      else if(tokens.length){
        tokens.forEach(t=>{if(hay.includes(t))score+=1;if(title.includes(t))score+=4;if(models.includes(t))score+=5;if(category.includes(t))score+=2});
      }else if(hay.includes(q))score=1;
      return {a,score};
    }).filter(x=>(!q||x.score>0)&&(br==='全部'||x.a.brand===br)&&(cat==='全部'||x.a.category===cat)&&(!only||!cur||x.a.models.includes(cur)||x.a.models.includes('ALL')))
      .sort((x,y)=>y.score-x.score||x.a.title.localeCompare(y.a.title));
    const list=scored.map(x=>x.a);
    box.innerHTML=`<div class="kb-head"><span class="badge">v3.3 維修資料庫</span><h1>原廠資料＋現場案例｜深度維修知識庫</h1><div class="small">目前 ${REPAIR_KB.length} 套深度主題。支援多關鍵詞搜尋，例如「ZT610 Ribbon Sensor」、「TH240 Cutter」。</div></div><div class="kb-filter"><input id="kbSearch" placeholder="搜尋：ZT610 Ribbon Sensor、Cutter、TPH、IP…" value="${kbEsc(filters.q??q)}"><select id="kbBrand">${brands.map(x=>`<option ${x===br?'selected':''}>${kbEsc(x)}</option>`).join('')}</select><select id="kbCat">${cats.map(x=>`<option ${x===cat?'selected':''}>${kbEsc(x)}</option>`).join('')}</select><label class="kb-check"><input id="kbModelOnly" type="checkbox" ${only?'checked':''} ${cur?'':'disabled'}> 只看目前機型${cur?`（${kbEsc(cur)}）`:''}</label></div><div class="kb-count">找到 <b>${list.length}</b> 筆${q?'（依關鍵詞相關度排序）':''}</div><div class="kb-grid">${list.map(kbCard).join('')||'<div class="kb-empty">找不到符合的維修資料，請縮短關鍵詞或改用故障名稱。</div>'}</div><div id="kbDetail"></div>`;
    ['kbSearch','kbBrand','kbCat','kbModelOnly'].forEach(id=>{const el=$(id);if(el)el.addEventListener(id==='kbSearch'?'input':'change',()=>window.renderKB())});
    box.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>openKBArticle(b.dataset.kb));
  };
  // 同步全域識別字，讓其他舊程式仍呼叫到新版。
  try{renderKB=window.renderKB}catch(e){}
})();
