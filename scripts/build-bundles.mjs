import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'bundle-manifest.json'),'utf8'));
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});

const standalone=manifest.standalone||[];
const all=[...standalone,...(manifest.css||[]),...(manifest.data||[]),...(manifest.app||[])];
const dup=all.filter((x,i)=>all.indexOf(x)!==i);
if(dup.length)throw new Error(`bundle-manifest 有重複檔案：${[...new Set(dup)].join(', ')}`);
for(const file of all){
  const p=path.join(root,file);
  if(!fs.existsSync(p))throw new Error(`找不到 bundle source：${file}`);
}

const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sha256=text=>crypto.createHash('sha256').update(text).digest('hex');

function joinJs(files,label){
  const body=files.map(file=>{
    const src=read(file).trim();
    return `\n/* ===== SOURCE: ${file} ===== */\n${src}\n;`;
  }).join('\n');
  return `/* 萬里資訊工程師工具｜AUTO-GENERATED ${label}\n * 請勿直接編輯 dist 檔案；修改原始 JS 後由 GitHub Actions 自動重建。\n */\n${body}\n`;
}
function joinCss(files){
  return `/* 萬里資訊工程師工具｜AUTO-GENERATED CSS BUNDLE\n * 請勿直接編輯 dist 檔案。\n */\n`+files.map(file=>`\n/* ===== SOURCE: ${file} ===== */\n${read(file).trim()}\n`).join('\n');
}

const data=joinJs(manifest.data,'REPAIR DATA BUNDLE');
const app=joinJs(manifest.app,'ENGINEER APP BUNDLE');
const css=joinCss(manifest.css);
fs.writeFileSync(path.join(dist,'repair-data.bundle.js'),data);
fs.writeFileSync(path.join(dist,'engineer-app.bundle.js'),app);
fs.writeFileSync(path.join(dist,'engineer.bundle.css'),css);

function validateRepairData(){
  const quietConsole={log(){},info(){},warn(){},error(){}};
  const fakeElement=()=>({style:{},appendChild(){},insertAdjacentElement(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return[]},scrollIntoView(){}});
  const sandbox={
    console:quietConsole,
    setTimeout(){return 0},clearTimeout(){},
    location:{protocol:'file:',href:'file:///index.html'},navigator:{},
    document:{
      readyState:'loading',
      addEventListener(){},
      getElementById(){return null},
      createElement:fakeElement,
      body:{firstChild:null,insertBefore(){},appendChild(){}},
      querySelector(){return null},querySelectorAll(){return[]}
    }
  };
  sandbox.window=sandbox;
  sandbox.globalThis=sandbox;
  const context=vm.createContext(sandbox);
  new vm.Script(data,{filename:'repair-data.bundle.js'}).runInContext(context,{timeout:10000});

  const kb=Array.isArray(context.REPAIR_KB)?context.REPAIR_KB:[];
  const sources=context.KB_SOURCES||{};
  const products=vm.runInContext('typeof PRODUCTS!=="undefined" ? PRODUCTS : []',context);
  if(!kb.length)throw new Error('資料 Bundle 執行後 REPAIR_KB 為空');

  const errors=[];
  const warnings=[];
  const ids=new Set();
  const knownModels=new Set((products||[]).map(p=>String(p.m||'').trim()).filter(Boolean));
  const coveredModels=new Set();
  const brandCount={};
  const categoryCount={};
  const evidenceCount={'A原廠料號':0,'B雙來源料號':0,'內部實機案例':0,'工程SOP':0,'有來源資料':0,'通用工程基線':0};

  for(const [i,x] of kb.entries()){
    const tag=x?.id||`#${i+1}`;
    if(!x?.id)errors.push(`${tag} 缺 id`);
    else if(ids.has(x.id))errors.push(`重複 id：${x.id}`);
    else ids.add(x.id);
    if(x?.brand)brandCount[x.brand]=(brandCount[x.brand]||0)+1;
    if(x?.category)categoryCount[x.category]=(categoryCount[x.category]||0)+1;
    if(!Array.isArray(x?.models)||!x.models.length)warnings.push(`${tag} 沒有 models`);
    else for(const m of x.models){
      if(m!=='ALL'){
        coveredModels.add(m);
        if(knownModels.size&&!knownModels.has(m))warnings.push(`${tag} 機型不在 catalog：${m}`);
      }
    }
    if(!Array.isArray(x?.flow)||!x.flow.length)warnings.push(`${tag} 沒有 flow`);
    const src=[...new Set(Array.isArray(x?.sources)?x.sources:[])];
    for(const s of src)if(!sources[s])errors.push(`${tag} 使用不存在的來源：${s}`);
    const ev=String(x?.evidence||'');
    if(ev==='oem-parts'){
      evidenceCount['A原廠料號']++;
      if(!src.length)errors.push(`${tag} A 原廠料號沒有來源`);
    }else if(ev==='verified-b-parts'){
      evidenceCount['B雙來源料號']++;
      if(src.length<2)errors.push(`${tag} B 雙來源料號少於兩個來源`);
      if(x.verification!=='dual-source')errors.push(`${tag} B 雙來源料號缺 verification=dual-source`);
    }else if(ev.startsWith('internal-field'))evidenceCount['內部實機案例']++;
    else if(ev==='workflow-sop'||/SOP|保養|交機|收機|交叉測試|零件採購/.test(x?.category||''))evidenceCount['工程SOP']++;
    else if(src.length)evidenceCount['有來源資料']++;
    else evidenceCount['通用工程基線']++;
  }

  const uncovered=[...knownModels].filter(m=>!coveredModels.has(m)).sort();
  for(const m of uncovered)warnings.push(`catalog 型號沒有專屬資料：${m}`);

  const stats={
    schema:1,
    entryCount:kb.length,
    sourceCount:Object.keys(sources).length,
    catalogModelCount:knownModels.size,
    directCoveredModelCount:[...coveredModels].filter(m=>knownModels.has(m)).length,
    uncoveredModelCount:uncovered.length,
    uncoveredModels:uncovered,
    evidenceCount,
    brandCount,
    categoryCount,
    validation:{errors:errors.length,warnings:warnings.length,warningSample:warnings.slice(0,50)}
  };
  fs.writeFileSync(path.join(dist,'kb-stats.json'),JSON.stringify(stats,null,2)+'\n');

  if(errors.length)throw new Error(`維修資料驗證失敗（${errors.length} errors）：\n- ${errors.slice(0,30).join('\n- ')}`);
  if(warnings.length)throw new Error(`維修資料嚴格驗證失敗（${warnings.length} warnings）：\n- ${warnings.slice(0,30).join('\n- ')}`);
  return stats;
}
const kbStats=validateRepairData();

// buildId 只取決於正式執行資產內容；任一原始 JS/CSS/asset-guard 改動都會得到新的 cache key。
const buildSeed=all.map(file=>`FILE:${file}\n${read(file)}`).join('\n---\n');
const buildId=sha256(buildSeed).slice(0,12);

function updateIndex(){
  const p=path.join(root,'index.html');
  let html=fs.readFileSync(p,'utf8');
  const headBlock=`<!-- AUTO_BUNDLE_HEAD_START -->\n<script src="asset-guard.js?v=${buildId}"></script>\n<link href="dist/engineer.bundle.css?v=${buildId}" rel="stylesheet"/>\n<!-- AUTO_BUNDLE_HEAD_END -->`;
  const bodyBlock=`<!-- AUTO_BUNDLE_SCRIPTS_START -->\n<script src="dist/repair-data.bundle.js?v=${buildId}" defer></script>\n<script src="dist/engineer-app.bundle.js?v=${buildId}" defer></script>\n<!-- AUTO_BUNDLE_SCRIPTS_END -->`;

  if(html.includes('<!-- AUTO_BUNDLE_HEAD_START -->')){
    html=html.replace(/<!-- AUTO_BUNDLE_HEAD_START -->[\s\S]*?<!-- AUTO_BUNDLE_HEAD_END -->/,headBlock);
  }else{
    const oldHead=/<script src="asset-guard\.js[^\"]*"><\/script>\s*<link href="styles\.css[^\"]*" rel="stylesheet"\/>\s*<link href="enhancements\.css[^\"]*" rel="stylesheet"\/>\s*<link href="repair-kb\.css[^\"]*" rel="stylesheet"\/>\s*<link href="customer-phrase-search\.css[^\"]*" rel="stylesheet"\/>/;
    if(!oldHead.test(html))throw new Error('index.html 找不到舊版 head assets，停止自動改寫');
    html=html.replace(oldHead,headBlock);
  }

  if(html.includes('<!-- AUTO_BUNDLE_SCRIPTS_START -->')){
    html=html.replace(/<!-- AUTO_BUNDLE_SCRIPTS_START -->[\s\S]*?<!-- AUTO_BUNDLE_SCRIPTS_END -->/,bodyBlock);
  }else{
    const oldScripts=/<script src="catalog\.js[^\"]*" defer><\/script>[\s\S]*?<script src="build-meta\.js[^\"]*" defer><\/script>/;
    if(!oldScripts.test(html))throw new Error('index.html 找不到舊版 script 清單，停止自動改寫');
    html=html.replace(oldScripts,bodyBlock);
  }
  fs.writeFileSync(p,html);
}
updateIndex();

const meta={
  schema:3,
  generatedAt:new Date().toISOString(),
  buildId,
  sourceCounts:{standalone:standalone.length,css:manifest.css.length,data:manifest.data.length,app:manifest.app.length,total:all.length},
  kb:{entries:kbStats.entryCount,sources:kbStats.sourceCount,catalogModels:kbStats.catalogModelCount,directCoveredModels:kbStats.directCoveredModelCount,uncoveredModels:kbStats.uncoveredModelCount},
  bundles:{
    'repair-data.bundle.js':{sha256:sha256(data),bytes:Buffer.byteLength(data)},
    'engineer-app.bundle.js':{sha256:sha256(app),bytes:Buffer.byteLength(app)},
    'engineer.bundle.css':{sha256:sha256(css),bytes:Buffer.byteLength(css)}
  },
  indexAssets:{
    guard:`asset-guard.js?v=${buildId}`,
    css:`dist/engineer.bundle.css?v=${buildId}`,
    data:`dist/repair-data.bundle.js?v=${buildId}`,
    app:`dist/engineer-app.bundle.js?v=${buildId}`
  }
};
fs.writeFileSync(path.join(dist,'bundle-meta.json'),JSON.stringify(meta,null,2)+'\n');
console.log(`Bundle 完成：buildId ${buildId}｜資料庫 ${kbStats.entryCount} 筆｜來源 ${kbStats.sourceCount}｜型號覆蓋 ${kbStats.directCoveredModelCount}/${kbStats.catalogModelCount}｜總來源檔 ${all.length}`);
