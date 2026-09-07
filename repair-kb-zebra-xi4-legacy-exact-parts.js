'use strict';

(function(){
  addRepairKB({
    id:'oem-140xi4-printhead-pn',brand:'Zebra',models:['140Xi4'],
    title:'【A｜原廠料號】140Xi4 Printhead 203 dpi',category:'原廠料號／Printhead',severity:'A｜原廠料號',evidence:'oem-parts',
    summary:'Zebra 官方 Industrial Printer Printhead Accessories Guide 直接列出 140Xi4 Genuine Zebra Printhead 203 dpi 料號；下料前仍需由實機 DPI、S/N 與舊件標籤再確認。',
    keyFacts:['140Xi4 203 dpi Genuine Zebra Printhead：P1004234。','該原廠 Guide 在 140Xi4 欄位未列 300 dpi Printhead；不要因其他 Xi4 有 300 dpi 就自行跨型號套料。','140Xi4 已停產，Zebra 官方支援頁仍保留文件/維修資源。'],
    engineering:['固定白線先清 Printhead 並排除 Head Cable/接點、Platen 與壓力問題，不因看到 P/N 就直接換頭。','舊機採購要核對舊件標籤與是否存在後續 superseded part。','換頭後從合理 Darkness/速度重新建立品質基準。'],
    verify:['實機 DPI 已確認 203 dpi','P1004234 與舊件/原廠資料吻合','測試圖無固定缺線','客戶實際耗材連印與條碼掃描正常'],
    flow:[['確認完整機型與 DPI','由設定頁/銘牌確認 140Xi4、203 dpi。',['確認','不確定'],'不確定不下料。'],['排除非 Head 原因','清潔、Head Cable、Platen、壓力與固定缺線交叉。',['Head方向高','其他原因'],'其他原因先修。'],['核對原廠 P/N','140Xi4 203 dpi = P1004234。',['吻合','不吻合'],'不吻合停止採購。'],['更換後建立品質基準','合理 Darkness/速度印測試圖。',['正常','異常'],'異常回 Cable/Platen/Driver。'],['長測','客戶耗材連續列印並掃描條碼。',['通過','失敗'],'失敗不結案。']],
    sources:['zebra_xi4_printhead_guide','zebra_140_support']
  });

  addRepairKB({
    id:'oem-170xi4-printhead-pn',brand:'Zebra',models:['170Xi4'],
    title:'【A｜原廠料號】170Xi4 Printhead 203 / 300 dpi',category:'原廠料號／Printhead',severity:'A｜原廠料號',evidence:'oem-parts',
    summary:'Zebra 官方 Industrial Printer Printhead Accessories Guide 直接列出 170Xi4 203 / 300 dpi Genuine Zebra Printhead 料號，可安全作為料號核對起點。',
    keyFacts:['170Xi4 203 dpi Genuine Zebra Printhead：P1004236。','170Xi4 300 dpi Genuine Zebra Printhead：P1004237。','同一 170Xi4 因 DPI 不同就是不同 Printhead P/N，不能只報「170Xi4 印字頭」。','Zebra 官方支援頁標示 170Xi4 已停產，替代方向為 ZT620。'],
    engineering:['先從設定頁/實機資訊確認 203 或 300 dpi。','固定缺線先清潔並查 Head Cable、Platen 與壓力，避免誤換昂貴 Printhead。','舊機零件正式採購仍要核對 S/N、舊件標籤與最新替代料號。'],
    verify:['DPI 與 P/N 完全對應','換頭後無固定缺線','左右濃度一致','客戶實際耗材長測穩定'],
    flow:[['確認 DPI','分 203 / 300 dpi。',['203 dpi','300 dpi','不確定'],'不確定先查設定頁。'],['排 Head 外部因素','清潔、Cable、Platen、壓力。',['Head方向高','找到其他原因'],'其他原因先修。'],['核對料號','203=P1004236；300=P1004237。',['吻合','不吻合'],'不吻合不安裝。'],['更換與測試','依原廠程序換頭，回合理 Darkness/速度。',['正常','異常'],'異常回 Cable/Driver/機構。'],['長測與掃描','連印、冷熱機、條碼掃描。',['通過','失敗'],'通過才交機。']],
    sources:['zebra_xi4_printhead_guide','zebra_170_support']
  });
})();
