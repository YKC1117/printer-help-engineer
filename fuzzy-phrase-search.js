'use strict';

// v3.3 patch: 客戶描述快速查支援「型號只打一部分」＋更白話的說法。
// 例：220X -> 220Xi4、ZT61 -> ZT610、TH24 -> TH240、P4 65 -> P4-650。

function fuzzyModelNorm(s){
  return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
}

function fuzzyModelHit(text){
  if(typeof PRODUCTS==='undefined') return {model:null,token:''};
  const raw=String(text||'').toLowerCase();
  const chunks=raw.match(/[a-z0-9]+/g)||[];
  const candidates=[];
  const add=v=>{v=fuzzyModelNorm(v);if(v.length>=3&&!candidates.includes(v))candidates.push(v)};

  chunks.forEach(add);
  for(let i=0;i<chunks.length-1;i++) add(chunks[i]+chunks[i+1]);
  for(let i=0;i<chunks.length-2;i++) add(chunks[i]+chunks[i+1]+chunks[i+2]);

  let best=null;
  for(const p of PRODUCTS){
    const m=fuzzyModelNorm(p.m);
    let score=0,token='';
    for(const c of candidates){
      let s=0;
      if(c===m) s=1000+c.length;
      else if(m.startsWith(c)) s=700+c.length*8;
      else if(m.includes(c)) s=430+c.length*5;
      else if(c.startsWith(m)) s=350+m.length*4;
      if(s>score){score=s;token=c}
    }
    if(score && (!best || score>best.score || (score===best.score && m.length<best.norm.length))){
      best={model:p,score,token,norm:m};
    }
  }
  return best?{model:best.model,token:best.token}:{model:null,token:''};
}

// 覆寫舊版「一定要輸入完整型號」的辨識方式。
detectPhraseModel=function(text){
  return fuzzyModelHit(text).model;
};

// 讓部分型號字串不會干擾後面的症狀判讀。
phraseResults=function(q){
  const n=phraseNorm(q),hit=fuzzyModelHit(q),model=hit.model;
  let cleaned=n;
  if(hit.token) cleaned=cleaned.replace(hit.token,'');
  if(model) cleaned=cleaned.replace(phraseNorm(model.m),'');

  let list=CUSTOMER_PHRASE_RULES
    .map(r=>({r,score:phraseRuleScore(r,cleaned||n)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score);

  if(/沒反應|無反應|沒動作|不會動|沒動靜/.test(cleaned||n) && list.length<4){
    for(const id of ['power','print','feed','cutter','panel']){
      const r=CUSTOMER_PHRASE_RULES.find(x=>x.id===id);
      if(r&&!list.some(x=>x.r.id===id)) list.push({r,score:22});
    }
  }
  return {model,list:list.slice(0,6)};
};

// 擴充工程現場常見白話說法。
const FUZZY_PHRASE_ALIASES={
  power:['整台沒動靜','完全沒動靜','按開關沒反應','按電源都沒動','開不起來','機器開不起來','整台死掉','完全不會亮'],
  print:['按了不印','按列印沒動作','電腦有送但沒印','傳過去沒印','送過去沒反應','機器有亮但不印','按列印機器沒動','電腦按了機器不動'],
  feed:['按feed不會動','按feed不會跑','按出紙沒反應','按出紙不會動','按走紙沒動作','紙完全不動','馬達沒動','按鍵有按但不走紙'],
  paperout:['有裝紙還顯示沒紙','紙明明還有','紙還有卻報錯','裝了紙還是紅燈','一直偵測不到標籤'],
  ribbonout:['碳帶明明還有','碳帶還有卻報錯','裝了碳帶還是報錯','有碳帶還一直紅燈','碳帶偵測不到'],
  calibration:['一直送紙','紙一直跑出來','一按就一直出紙','標籤一直跳','抓不到標籤間隙','每次都多跑好幾張'],
  light:['印出來很淺','顏色很淺','印不深','條碼很淡','印出來掃不太到','字糊糊的','印出來不漂亮'],
  blank:['有出紙可是沒印','紙會跑但沒字','印出來白白的','完全印不到東西','只有走紙沒有印'],
  white_line:['固定少一條','每張都同一個地方沒印','一直有白白一條','條碼固定缺一條','某一區都印不到'],
  offset:['位置一直跑','印的位置不對','每張越跑越遠','標籤位置跑掉','內容越印越歪'],
  tracking:['紙一直跑一邊','紙都往一邊走','標籤越跑越歪','走紙會斜掉','紙一直吃單邊'],
  ribbon_wrinkle:['碳帶一直皺掉','碳帶會皺','碳帶一直裂','碳帶一直斷','印一印碳帶就破'],
  cutter:['刀不會動','刀沒有動作','切刀完全沒動','有切但切不斷','切一半卡住','每次都卡刀'],
  usb:['插usb完全沒反應','插上去電腦沒看到','電腦抓不到usb','換usb孔也沒反應'],
  lan:['網路找不到機器','電腦ping不到','ip一直變','突然網路印不到','昨天可以今天不行'],
  jam:['紙卡在裡面','標籤黏在滾輪','紙拉不出來','標籤一直黏住','出紙卡卡的'],
  noise:['機器一直叫','裡面有卡卡聲','轉的時候很吵','走紙聲音怪怪的','馬達一直叫'],
  panel:['畫面有亮但不能按','面板亮著沒反應','按什麼都沒用','停在logo','開機一直卡畫面'],
  heat:['印沒多久就停','印幾張就停','印一陣子休息一下又可以','機器很熱就不印'],
  peel:['剝標不會回收','底紙不會捲','回捲軸不動','剝一張後就卡住']
};
for(const [id,words] of Object.entries(FUZZY_PHRASE_ALIASES)){
  const rule=CUSTOMER_PHRASE_RULES.find(r=>r.id===id);
  if(rule) for(const w of words) if(!rule.keywords.includes(w)) rule.keywords.push(w);
}

function fuzzyPhraseUiHint(){
  const wrap=document.querySelector('.phrase-search');
  if(!wrap)return;
  const small=wrap.querySelector('.phrase-label small');
  if(small) small.textContent='型號不用打完整：220X、ZT61、TH24、P4 65 都可以；後面直接接客戶白話描述';
  const input=document.getElementById('customerPhraseSearch');
  if(input) input.placeholder='例如：220X 紙一直偏、ZT61 碳帶還有卻報錯、TH24 切刀不動…';
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(fuzzyPhraseUiHint,100));
