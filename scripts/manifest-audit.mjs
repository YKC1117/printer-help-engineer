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

const problems=[];
if(untracked.length)problems.push(`根目錄有未納入 Bundle Manifest 的資產：${untracked.join(', ')}`);
if(missing.length)problems.push(`Manifest 指向不存在檔案：${[...new Set(missing)].join(', ')}`);
if(duplicates.length)problems.push(`Manifest 重複：${[...new Set(duplicates)].join(', ')}`);
if(wrongGroup.length)problems.push(`Manifest 分組副檔名異常：${wrongGroup.join(', ')}`);

const report={schema:1,rootAssets:rootAssets.length,tracked:tracked.length,untracked,missing,duplicates:[...new Set(duplicates)],wrongGroup,ok:problems.length===0};
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist','manifest-audit.json'),JSON.stringify(report,null,2)+'\n');

if(problems.length)throw new Error(`Bundle Manifest Audit 失敗：\n- ${problems.join('\n- ')}`);
console.log(`Manifest Audit OK｜root assets ${rootAssets.length}｜tracked ${tracked.length}`);
