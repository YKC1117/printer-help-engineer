import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
  schema:2,
  generatedAt:new Date().toISOString(),
  buildId,
  sourceCounts:{standalone:standalone.length,css:manifest.css.length,data:manifest.data.length,app:manifest.app.length,total:all.length},
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
console.log(`Bundle 完成：buildId ${buildId}｜Standalone ${standalone.length}、CSS ${manifest.css.length}、Data ${manifest.data.length}、App ${manifest.app.length}，總來源 ${all.length}`);
