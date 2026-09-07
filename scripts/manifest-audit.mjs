import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'bundle-manifest.json'),'utf8'));
const tracked=[...(manifest.standalone||[]),...(manifest.css||[]),...(manifest.data||[]),...(manifest.app||[])];
const trackedSet=new Set(tracked);
const rootAssets=fs.readdirSync(root,{withFileTypes:true})
  .filter(x=>x.isFile()&&(x.name.endsWith('.js')||x.name.endsWith('.css')))
  .map(x=>x.name)
  .sort();

const untracked=rootAssets.filter(x=>!trackedSet.has(x));
const missing=tracked.filter(x=>!fs.existsSync(path.join(root,x)));
const duplicates=tracked.filter((x,i)=>tracked.indexOf(x)!==i);
const wrongGroup=[];
for(const f of manifest.css||[])if(!f.endsWith('.css'))wrongGroup.push(`CSS group：${f}`);
for(const f of [...(manifest.standalone||[]),...(manifest.data||[]),...(manifest.app||[])])if(!f.endsWith('.js'))wrongGroup.push(`JS group：${f}`);

// 版本集中管理：app-version.js 必須是 app bundle 第一支，且其他執行層／index 不得硬編版本號或重新指定 APP_BUILD。
const versionSource='app-version.js';
const appFiles=manifest.app||[];
const versionOrderOk=appFiles[0]===versionSource;
const versionSourceExists=fs.existsSync(path.join(root,versionSource));
const versionLiteralHits=[];
const duplicateBuildAssignments=[];
const runtimeVersionTargets=[...appFiles.filter(f=>f!==versionSource),'index.html'];
for(const file of runtimeVersionTargets){
  const p=path.join(root,file);
  if(!fs.existsSync(p))continue;
  const text=fs.readFileSync(p,'utf8');
  const literals=[...new Set(text.match(/\bv\d+\.\d+(?:\.\d+)?\b/g)||[])];
  if(literals.length)versionLiteralHits.push({file,literals});
  if(/(?:window\.)?APP_BUILD\s*=/.test(text))duplicateBuildAssignments.push(file);
}

const problems=[];
if(untracked.length)problems.push(`根目錄有未納入 Bundle Manifest 的資產：${untracked.join(', ')}`);
if(missing.length)problems.push(`Manifest 指向不存在檔案：${[...new Set(missing)].join(', ')}`);
if(duplicates.length)problems.push(`Manifest 重複：${[...new Set(duplicates)].join(', ')}`);
if(wrongGroup.length)problems.push(`Manifest 分組副檔名異常：${wrongGroup.join(', ')}`);
if(!versionSourceExists)problems.push(`缺少中央版本來源：${versionSource}`);
if(!versionOrderOk)problems.push(`${versionSource} 必須是 manifest.app 第一支，確保其他模組讀得到 APP_BUILD`);
if(versionLiteralHits.length)problems.push(`版本號只能寫在 ${versionSource}：${versionLiteralHits.map(x=>`${x.file}=${x.literals.join('/')}`).join(', ')}`);
if(duplicateBuildAssignments.length)problems.push(`APP_BUILD 只能由 ${versionSource} 指定：${duplicateBuildAssignments.join(', ')}`);

const report={
  schema:2,
  rootAssets:rootAssets.length,
  tracked:tracked.length,
  untracked,
  missing,
  duplicates:[...new Set(duplicates)],
  wrongGroup,
  version:{source:versionSource,sourceExists:versionSourceExists,firstInAppBundle:versionOrderOk,literalHits:versionLiteralHits,duplicateAssignments:duplicateBuildAssignments},
  ok:problems.length===0
};
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist','manifest-audit.json'),JSON.stringify(report,null,2)+'\n');

if(problems.length)throw new Error(`Bundle Manifest Audit 失敗：\n- ${problems.join('\n- ')}`);
console.log(`Manifest Audit OK｜root assets ${rootAssets.length}｜tracked ${tracked.length}｜version source ${versionSource}`);
