'use strict';

// 「直接搜尋型號」也支援省略連字號/空白：P4 65、ZT61、220X、TTP244 等。
(function(){
  if(typeof search==='undefined'||typeof matches==='undefined'||typeof PRODUCTS==='undefined')return;
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  search.addEventListener('input',()=>{
    const raw=search.value.trim();
    const q=norm(raw);
    if(!q){matches.style.display='none';return;}
    const found=PRODUCTS.map(p=>{
      const mn=norm(p.m),bn=norm(p.b),sn=norm(p.s);
      let score=0;
      if(mn===q)score=100;
      else if(mn.startsWith(q))score=80-Math.min(20,mn.length-q.length);
      else if(mn.includes(q))score=55;
      else if((bn+sn+mn).includes(q))score=20;
      return {p,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.p.m.length-b.p.m.length||a.p.m.localeCompare(b.p.m)).slice(0,15).map(x=>x.p);
    matches.innerHTML=found.map(p=>`<div class="match" data-fuzzy-model="${PRODUCTS.indexOf(p)}"><b>${esc(p.m)}｜${esc(p.b)}</b><span>${esc(p.t)}・${esc(p.s)}・${esc(p.status)}</span></div>`).join('')||'<div class="match"><span>找不到型號。</span></div>';
    matches.style.display='block';
    matches.querySelectorAll('[data-fuzzy-model]').forEach(el=>el.onclick=()=>selectProduct(PRODUCTS[+el.dataset.fuzzyModel]));
  });
})();
