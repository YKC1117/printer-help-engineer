import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'bundle-manifest.json'),'utf8'));
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});

const all=[...(manifest.css||[]),...(manifest.data||[]),...(manifest.app||[])];
const dup=all.filter((x,i)=>all.indexOf(x)!==i);
if(dup.length)throw new Error(`bundle-manifest 有重複檔案：${[...new Set(dup)].join(', ')}`);
for(const file of all){
  const p=path.join(root,file);
  if(!fs.existsSync(p))throw new Error(`找不到 bundle source：${file}`);
}

function joinJs(files,label){
  const body=files.map(file=>{
    const src=fs.readFileSync(path.join(root,file),'utf8').trim();
    return `\n/* ===== SOURCE: ${file} ===== */\n${src}\n;`;
  }).join('\n');
  return `/* 萬里資訊工程師工具｜AUTO-GENERATED ${label}\n * 請勿直接編輯 dist 檔案；修改原始 JS 後由 GitHub Actions 自動重建。\n */\n${body}\n`;
}
function joinCss(files){
  return `/* 萬里資訊工程師工具｜AUTO-GENERATED CSS BUNDLE\n * 請勿直接編輯 dist 檔案。\n */\n`+files.map(file=>`\n/* ===== SOURCE: ${file} ===== */\n${fs.readFileSync(path.join(root,file),'utf8').trim()}\n`).join('\n');
}
function sha256(text){return crypto.createHash('sha256').update(text).digest('hex')}

const data=joinJs(manifest.data,'REPAIR DATA BUNDLE');
const app=joinJs(manifest.app,'ENGINEER APP BUNDLE');
const css=joinCss(manifest.css);
fs.writeFileSync(path.join(dist,'repair-data.bundle.js'),data);
fs.writeFileSync(path.join(dist,'engineer-app.bundle.js'),app);
fs.writeFileSync(path.join(dist,'engineer.bundle.css'),css);

const meta={
  schema:1,
  generatedAt:new Date().toISOString(),
  sourceCounts:{css:manifest.css.length,data:manifest.data.length,app:manifest.app.length,total:all.length},
  bundles:{
    'repair-data.bundle.js':{sha256:sha256(data),bytes:Buffer.byteLength(data)},
    'engineer-app.bundle.js':{sha256:sha256(app),bytes:Buffer.byteLength(app)},
    'engineer.bundle.css':{sha256:sha256(css),bytes:Buffer.byteLength(css)}
  }
};
fs.writeFileSync(path.join(dist,'bundle-meta.json'),JSON.stringify(meta,null,2)+'\n');
console.log(`Bundle 完成：CSS ${manifest.css.length}、Data ${manifest.data.length}、App ${manifest.app.length}，總來源 ${all.length}`);
