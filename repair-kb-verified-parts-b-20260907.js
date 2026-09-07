'use strict';

// A 級原廠精確料號 + B 級雙來源交叉確認料號。
// B 級只收同一 P/N 至少兩個獨立來源一致者；正式下料仍需依實機 S/N / DPI / Revision / Option 再核對。
(function(){
  addRepairKB({
    id:'oem-honeywell-pm45-printhead-pn',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],
    title:'【原廠料號】Honeywell PM45 Printhead：203 / 300 / 406 / 600 dpi',category:'原廠料號／Printhead',severity:'A｜原廠',evidence:'oem-parts',
    summary:'Honeywell 原廠 Accessories Guide 明確區分 PM45 四種解析度 Printhead。不同 DPI 不可混用；下料前仍核對完整 PM45 configuration。',
    keyFacts:['203 dpi Printhead：50180236-001。','300 dpi Printhead：50180237-001。','406 dpi Printhead：50180238-001。','600 dpi Printhead：50180234-001。','PM45/PM45c 使用新設計 Printhead，不能直接沿用 PM43/PM43c 舊料號。'],
    engineering:['先由設定頁/機身 configuration 確認 DPI。','固定缺線先清潔並排 Head Cable/接觸，不因單一白線直接換頭。','換頭後由合理低/中 Darkness 建立基準，再回客戶實際耗材。'],
    verify:['DPI 與 P/N 一致','測試圖無固定缺線','條碼可掃描','連續列印品質穩定'],
    flow:[['確認 DPI','讀 Configuration 或完整型號，確認 203/300/406/600 dpi。',['已確認','不確定'],'不確定不下單。'],['排除非 Head 原因','清潔、Head 接頭/線束、Platen 與壓力。',['Head方向高','找到其他原因'],'其他原因先修。'],['核對原廠 P/N','50180236/237/238/234-001。',['吻合','不吻合'],'不吻合停止。'],['更換與完整測試','Self Test＋客戶耗材＋連印。',['通過','異常'],'異常回線束/驅動。']],
    sources:['honeywell_pm45_accessories_exact','honeywell_pm45_pm65_accessories']
  });

  addRepairKB({
    id:'oem-honeywell-pm45-media-options-pn',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],
    title:'【原廠料號】Honeywell PM45 Platen / Cutter / Dispenser / Rewinder',category:'原廠料號／Media Options',severity:'A｜原廠',evidence:'oem-parts',
    summary:'Honeywell 原廠配件指南可直接核對 PM45 Platen、Cutter 與部分 media options；PM45 與 PM45c Cutter 料號不同，不能混買。',
    keyFacts:['PM45 Platen Roller Kit：50180235-001。','PM45 Cutter Kit：50180206-001。','PM45c Cutter Kit 是 50180201-001，與 PM45 不同。','PM45 Label Dispenser：50180196-001，官方註明需搭配 rewinder。','Full Batch Rewinder Kit：50178308-001（PM45 官方產品零件列表亦有列示）。'],
    engineering:['Cutter Error 先排卡紙、殘膠、Home/驅動，不因錯誤碼直接換 Cutter。','Platen 更換前先排殘膠與污染；換後重新 Calibration。','Dispenser/Rewinder 要核對實機選配與機構配置。'],
    verify:['料號與 PM45/PM45c 型別無混用','Platen 走紙正常','Cutter 連續切正常','Peel/Rewind 選配功能正常'],
    flow:[['確認完整機型','先分 PM45 與 PM45c，再看實機選配。',['PM45','不是PM45'],'不是 PM45 不套用本表。'],['確認故障模組','Platen/Cutter/Dispenser/Rewinder。',['已收斂','未收斂'],'未收斂先故障排查。'],['核對原廠料號','依原廠 Accessories Guide。',['吻合','不吻合'],'不吻合停止。'],['換件後回歸','Calibration、Cut/Peel/Rewind、實際耗材。',['通過','失敗'],'失敗回模組排查。']],
    sources:['honeywell_pm45_accessories_exact','honeywell_pm45_pm65_accessories','honeywell_pm45']
  });

  addRepairKB({
    id:'b2-tsc-mh241-printhead-pn',brand:'TSC',models:['MH241','MH341','MH641','MH640'],
    title:'【B級雙來源料號】TSC MH241 / MH341 / MH641 Printhead',category:'B級雙來源料號／Printhead',severity:'B｜雙來源',evidence:'verified-b-parts',
    evidenceNote:'TSC MH241 系列零件表鏡像＋專業零件商資料交叉一致；正式下料仍依實機 DPI、S/N、Revision 確認。',
    summary:'MH241 系列 Printhead 依解析度分開。此組料號已由零件表鏡像與第二獨立零件來源交叉確認，不視為 A 級原廠公開 Parts Catalog。',
    keyFacts:['MH241 / 203 dpi：PH-MH241-0001；部分來源列舊號 PH-MH241-0004。','MH341 / 300 dpi：PH-MH241-0002；部分來源列舊號 PH-MH241-0005。','MH641 / 600 dpi：PH-MH241-0003；B 級來源亦列 MH640/MH641 適用。','同系列外觀相近，但 203/300/600 dpi Printhead 不可混用。'],
    engineering:['一定先讀 DPI，不接受只寫「MH241 系列」就下 Printhead。','固定白線仍先清潔、測 TPH/Test Pattern、查 Head Harness。','若舊件 P/N 與此表不同，先查 superseded/replacement 關係。'],
    verify:['兩個來源料號一致','實機 DPI 已確認','新舊件接頭/Revision 符合','測試圖與連印正常'],
    flow:[['確認機型與 DPI','MH241=203、MH341=300、MH641=600；MH640 需依實機確認。',['確認','不確定'],'不確定不下單。'],['比對舊件標籤','拍 P/N、Revision、接頭。',['一致/可追替代','有衝突'],'有衝突先停。'],['雙來源核對','Parts List mirror + 第二獨立零件來源。',['一致','不一致'],'不一致不得下料。'],['換頭後測試','清潔、Calibration、測試圖、實際耗材。',['通過','異常'],'異常回 Harness/Platen/Driver。']],
    sources:['tsc_mh241_parts_mirror','tsc_mh241_parts_infinite','tsc_mh241_parts_tscdrucker'],verification:'dual-source'
  });

  addRepairKB({
    id:'b2-tsc-mh241-platen-pn',brand:'TSC',models:['MH241','MH341','MH641'],
    title:'【B級雙來源料號】TSC MH241 Series Platen Roller',category:'B級雙來源料號／Platen',severity:'B｜雙來源',evidence:'verified-b-parts',
    evidenceNote:'零件表鏡像與多家專業零件商一致；舊料號與替代料號亦有交叉資料。',
    summary:'MH241 系列 Platen Roller Assembly 目前常用料號為 SP-MH241-0029；舊資料可見 98-0600008-00LF，專業零件來源明確標示已由 SP-MH241-0029 取代。',
    keyFacts:['目前料號：SP-MH241-0029。','舊料號：98-0600008-00LF；多個零件來源標示 Replaced by SP-MH241-0029。','Parts List 將 SP-MH241-0029 列為 PLATEN ROLLER ASSY。'],
    engineering:['先清潔殘膠、油污並檢查偏磨/硬化，避免把污染當磨耗。','換後重新做 Media Calibration。','若是不同世代 MH240/MH241 或特殊變體，仍以舊件與 S/N 做最後確認。'],
    verify:['舊/新料號替代關係已確認','手轉無偏心','FEED 不打滑','連印定位穩定'],
    flow:[['檢查是否真的需換','硬化、凹痕、偏磨、打滑、品質受影響。',['需換','清潔即可'],'清潔即可就不換。'],['核對舊件 P/N','記錄 SP/98 開頭舊號。',['已記錄','看不到'],'看不到就用 S/N+Parts List。'],['雙來源比對','確認 SP-MH241-0029 與替代關係。',['一致','衝突'],'衝突不下單。'],['換後 Calibration','FEED＋定位＋實際耗材。',['通過','失敗'],'失敗查壓力/導紙。']],
    sources:['tsc_mh241_parts_mirror','tsc_mh241_parts_barcodefactory','tsc_mh241_parts_infinite'],verification:'dual-source'
  });

  addRepairKB({
    id:'b2-tsc-mh241-electronics-pn',brand:'TSC',models:['MH241','MH341','MH641'],
    title:'【B級雙來源料號】TSC MH241 Series Main Board / Power Supply',category:'B級雙來源料號／Electronics',severity:'B｜雙來源',evidence:'verified-b-parts',
    evidenceNote:'MH241 系列零件表鏡像與專業零件商交叉確認；板件仍需核對 Revision、Firmware 與實機配置。',
    summary:'零件表列 Main Board Assembly SP-MH241-0023、Power Supply SP-MH241-0025；第二零件來源亦以相同 P/N 列出 MH241 系列配件。',
    keyFacts:['Main Board Assembly：SP-MH241-0023。','Power Supply：SP-MH241-0025。','零件表另列 Stepping Motor Assembly：SP-MH241-0021、Media End Sensor Assembly：SP-MH241-0022；但本篇不把未完成雙來源確認的零件升格為正式精確料號。'],
    engineering:['換 Main Board 前先排外部短路/負載並保存可讀設定。','PSU 空載正常不等於負載正常，要觀察列印/Cutter 時掉壓與重啟。','板件下料前拍舊板 Revision 與接頭位置。'],
    verify:['Main Board/PSU P/N 已雙來源一致','Revision/選配已核對','斷電重開與設定保存正常','滿載列印穩定'],
    flow:[['先收斂故障層','判 PSU 還是 Main Board，而不是直接猜板。',['已收斂','未收斂'],'未收斂先做負載隔離。'],['拍舊板資料','P/N、Revision、Firmware/設定。',['完成','資料不足'],'資料不足先補。'],['雙來源核對','SP-MH241-0023 / SP-MH241-0025。',['一致','衝突'],'衝突不下單。'],['換板後初始化與負載測試','設定、Calibration、USB/LAN、連印。',['通過','異常'],'異常回供電/外部負載。']],
    sources:['tsc_mh241_parts_mirror','tsc_mh241_parts_barcodefactory','tsc_mh241_parts_tscdrucker'],verification:'dual-source'
  });

  addRepairKB({
    id:'b2-tsc-mh241-cutter-pn',brand:'TSC',models:['MH241','MH341','MH641'],
    title:'【B級雙來源料號】TSC MH241 Series Cutter：Regular / Heavy Duty',category:'B級雙來源料號／Cutter',severity:'B｜雙來源',evidence:'verified-b-parts',
    evidenceNote:'MH241 Parts List mirror 與專業條碼零件商資料一致。不同 Cutter 類型不可只看外觀互換。',
    summary:'MH241 系列有多種 Cutter，Regular Guillotine 與 Heavy Duty Guillotine 的 P/N 不同。先確認客戶實機 Cutter 類型，再處理 Cutter Error 或採購。',
    keyFacts:['Regular Cutter（Guillotine）：CUT-MH241-0001。','Heavy Duty Cutter（Guillotine）：CUT-MH241-0004。','Parts List 另列 Rotary / Care Label Cutter 等多種型式；沒有確認實機類型前不要下料。','Peel-Off Kit：PEL-MH241-0001 在 Parts List 與第二來源均有列示，且適用條件需再核對實機。'],
    engineering:['Cutter Error 先清除紙屑/殘膠、確認 Home 與 Print Mode。','Regular 與 Heavy Duty 不應用價格或外觀猜型式。','採購前拍 Cutter 模組標籤與整機 Option。'],
    verify:['Cutter 型別已確認','P/N 雙來源一致','開機 Home 正常','連續切 50 次無卡滯且切位一致'],
    flow:[['辨識 Cutter 型式','Regular / Heavy Duty / Rotary / Care Label。',['已確認','不確定'],'不確定先看模組標籤。'],['排卡滯與設定','清潔＋Print Mode/Home 行為。',['仍故障','已恢復'],'已恢復不換件。'],['雙來源核對','Regular 0001 / Heavy Duty 0004。',['一致','衝突'],'衝突不下單。'],['換件後連續切','至少多次連切看 Home/切位。',['通過','失敗'],'失敗回 Sensor/Motor/Driver。']],
    sources:['tsc_mh241_parts_mirror','tsc_mh241_parts_infinite','tsc_mh241_parts_barcodefactory'],verification:'dual-source'
  });
})();
