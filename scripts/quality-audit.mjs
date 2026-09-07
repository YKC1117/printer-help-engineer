import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const bundlePath=path.join(root,'dist','repair-data.bundle.js');
if(!fs.existsSync(bundlePath))throw new Error('找不到 dist/repair-data.bundle.js，請先執行 build-bundles.mjs');

const quiet={log(){},info(){},warn(){},error(){}};
const fakeElement=()=>({style:{},appendChild(){},insertAdjacentElement(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return[]},scrollIntoView(){}});
const sandbox={
  console:quiet,setTimeout(){return 0},clearTimeout(){},
  location:{protocol:'file:',href:'file:///index.html'},navigator:{},
  document:{readyState:'loading',addEventListener(){},getElementById(){return null},createElement:fakeElement,body:{firstChild:null,insertBefore(){},appendChild(){}},querySelector(){return null},querySelectorAll(){return[]}}
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
const context=vm.createContext(sandbox);
new vm.Script(fs.readFileSync(bundlePath,'utf8'),{filename:'repair-data.bundle.js'}).runInContext(context,{timeout:15000});

const kb=Array.isArray(context.REPAIR_KB)?context.REPAIR_KB:[];
const sources=context.KB_SOURCES||{};
const products=vm.runInContext('typeof PRODUCTS!=="undefined" ? PRODUCTS : []',context);
const errors=[];
const warnings=[];
const advisories=[];
const ids=new Map();
const topics=new Map();
const knownModels=new Set(products.map(p=>p.m));

for(const [i,a] of kb.entries()){
  const pos=i+1,tag=a?.id||`#${pos}`;
  if(!a||typeof a!=='object'){errors.push(`#${pos} 不是物件`);continue;}
  if(!a.id)errors.push(`#${pos} 缺 id`);
  else if(ids.has(a.id))errors.push(`重複 id：${a.id}（#${ids.get(a.id)} / #${pos}）`);
  else ids.set(a.id,pos);
  if(!a.brand)warnings.push(`${tag} 缺 brand`);
  if(!a.title)warnings.push(`${tag} 缺 title`);
  if(!a.category)warnings.push(`${tag} 缺 category`);
  if(!a.summary)warnings.push(`${tag} 缺 summary`);
  if(!Array.isArray(a.keyFacts)||!a.keyFacts.length)warnings.push(`${tag} 缺 keyFacts`);
  if(!Array.isArray(a.engineering)||!a.engineering.length)warnings.push(`${tag} 缺 engineering`);
  if(!Array.isArray(a.verify)||!a.verify.length)warnings.push(`${tag} 缺 verify`);

  if(!Array.isArray(a.models)||!a.models.length)warnings.push(`${tag} 缺 models`);
  else for(const m of a.models){if(m!=='ALL'&&!knownModels.has(m))warnings.push(`${tag} 機型不在 catalog：${m}`);}

  if(!Array.isArray(a.flow)||!a.flow.length)warnings.push(`${tag} 缺 flow`);
  else a.flow.forEach((s,si)=>{
    if(!Array.isArray(s)||s.length<3)errors.push(`${tag} flow 第 ${si+1} 步格式錯誤`);
    else{
      if(typeof s[0]!=='string'||!s[0].trim())errors.push(`${tag} flow 第 ${si+1} 步沒有標題`);
      if(typeof s[1]!=='string'||!s[1].trim())warnings.push(`${tag} flow 第 ${si+1} 步沒有說明`);
      if(!Array.isArray(s[2])||!s[2].length)warnings.push(`${tag} flow 第 ${si+1} 步沒有結果選項`);
    }
  });

  const src=[...new Set(Array.isArray(a.sources)?a.sources:[])];
  for(const s of src)if(!sources[s])errors.push(`${tag} 使用不存在來源：${s}`);
  const ev=String(a.evidence||'');
  if(ev==='oem-parts'&&!src.length)errors.push(`${tag} A 原廠料號沒有來源`);
  if(ev==='verified-b-parts'){
    if(src.length<2)errors.push(`${tag} B 雙來源料號少於 2 個來源`);
    if(a.verification!=='dual-source')errors.push(`${tag} B 雙來源料號缺 verification=dual-source`);
    if(!a.evidenceNote)warnings.push(`${tag} B 雙來源料號缺 evidenceNote`);
  }
  if(ev.startsWith('internal-field')&&!a.evidenceNote)warnings.push(`${tag} 內部案例缺 evidenceNote`);

  const topicKey=[a.brand,(a.models||[]).slice().sort().join('|'),a.title].join('::');
  if(a.title&&topics.has(topicKey))warnings.push(`疑似完全重複主題：${a.title}（#${topics.get(topicKey)} / #${pos}）`);
  else if(a.title)topics.set(topicKey,pos);
}

const modelCoverage={};
for(const p of products){
  const list=kb.filter(a=>(a.models||[]).includes(p.m));
  modelCoverage[p.m]={
    brand:p.b,
    status:p.status||'',
    total:list.length,
    sourced:list.filter(a=>(a.sources||[]).length).length,
    aParts:list.filter(a=>a.evidence==='oem-parts').length,
    bParts:list.filter(a=>a.evidence==='verified-b-parts').length,
    internal:list.filter(a=>String(a.evidence||'').startsWith('internal-field')).length,
    sop:list.filter(a=>a.evidence==='workflow-sop'||/SOP|保養|交機|收機|交叉測試|零件採購/.test(a.category||'')).length
  };
}
const thinModels=Object.entries(modelCoverage).filter(([,x])=>x.total<3).map(([m,x])=>({model:m,...x})).sort((a,b)=>a.total-b.total||a.model.localeCompare(b.model));
const noSourced=Object.entries(modelCoverage).filter(([,x])=>x.sourced===0).map(([m,x])=>({model:m,...x}));
if(thinModels.length)advisories.push(`${thinModels.length} 個型號專屬資料少於 3 篇`);
if(noSourced.length)advisories.push(`${noSourced.length} 個型號沒有來源化專屬文章`);

const sourceLevels={};
for(const s of Object.values(sources))sourceLevels[s.level||'未標示']=(sourceLevels[s.level||'未標示']||0)+1;
const report={
  schema:1,
  generatedAt:new Date().toISOString(),
  summary:{entries:kb.length,sources:Object.keys(sources).length,catalogModels:products.length,errors:errors.length,warnings:warnings.length,advisories:advisories.length,thinModels:thinModels.length,noSourcedModels:noSourced.length},
  errors,warnings,advisories,thinModels,noSourcedModels:noSourced,modelCoverage,sourceLevels
};
fs.writeFileSync(path.join(root,'dist','kb-quality.json'),JSON.stringify(report,null,2)+'\n');

if(errors.length||warnings.length){
  const lines=[...errors.map(x=>`ERROR: ${x}`),...warnings.map(x=>`WARNING: ${x}`)];
  throw new Error(`KB Deep Audit 未通過：${errors.length} errors / ${warnings.length} warnings\n${lines.slice(0,50).join('\n')}`);
}
console.log(`KB Deep Audit OK｜${kb.length} entries｜${products.length} models｜thin ${thinModels.length}｜no-sourced ${noSourced.length}`);
