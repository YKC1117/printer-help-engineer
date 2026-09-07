'use strict';

if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'pm_schedule',icon:'🧹',title:'這台多久要保養／PM 怎麼排',issue:'預防保養週期建立',keywords:['多久要保養','保養週期','多久清一次','pm多久一次','預防保養','定期保養','要多久保養一次'],hint:'依原廠建議、列印量、紙塵/膠材與現場環境建立 PM，不硬套同一個月份。',kb:'預防保養 PM 清潔 磨耗件'},
    {id:'after_repair_cal',icon:'🎯',title:'拆完要校正什麼／換頭換滾輪後怎麼測',issue:'拆裝後重新校正與定位',keywords:['拆完要校正什麼','換頭後要做什麼','換滾輪後怎麼測','換sensor後要校正嗎','拆裝後測試','維修後校正','換印字頭後校正'],hint:'Sensor、Printhead、Platen 或走紙機構拆裝後，要重新做 Calibration、定位與品質基準。',kb:'拆裝後 Calibration 定位 Printhead Platen Sensor'},
    {id:'board_replace',icon:'🧠',title:'換主板後要設定什麼／換板怎麼初始化',issue:'板件更換後初始化',keywords:['換主板後要設定什麼','換板後怎麼設定','換主板怎麼初始化','換網路板後設定','換psu後測什麼','換板後ip不見','更換主板流程'],hint:'先備份設定，再核對 DPI/選配/韌體，換板後復原網路、模式、Calibration 與完整功能。',kb:'Mainboard Interface Board 初始化 設定復原 Firmware'},
    {id:'ab_swap',icon:'🔁',title:'怎麼交叉測試／正常件怎麼比',issue:'A-B Swap 交叉測試',keywords:['怎麼交叉測試','正常件交叉','ab swap','換一顆正常的測','拿另一台來比','交叉零件','正常機互換'],hint:'一次只交換一個變因，確認故障是否跟著零件移動，並先核對相容性。',kb:'交叉測試 A-B Swap 正常件 故障跟件'},
    {id:'part_order',icon:'📦',title:'料號怎麼核對／零件怎麼下單才不會錯',issue:'零件採購料號核對',keywords:['料號怎麼核對','零件怎麼買','怎麼確認料號','下單怕買錯','印字頭料號','主板料號','cutter料號','零件相不相容'],hint:'至少收 Model、S/N、DPI、Revision、選配與舊件標籤，再查 Parts List/替代料號。',kb:'零件採購 料號 S/N DPI Revision Parts List'},
    {id:'repair_finish',icon:'✅',title:'修好後要測什麼／交機前檢查',issue:'維修完成完整驗證',keywords:['修好後要測什麼','交機前測試','維修完成檢查','完修測試','修完怎麼驗證','可以交機了嗎','結案前檢查'],hint:'不要只看原故障消失；冷開機、FEED、Self Test、客戶耗材、USB/LAN、選配與設定保存都要回歸。',kb:'完修驗證 交機 回歸測試 客戶耗材'},
    {id:'before_disassembly',icon:'📸',title:'收機先做什麼／拆機前要記錄什麼',issue:'維修前基準紀錄',keywords:['收機先做什麼','拆機前要做什麼','維修前檢查','拆之前要記錄','先拍什麼','客戶送修怎麼檢查','收機流程'],hint:'先保存錯誤畫面、設定頁、Network Config、耗材路徑、接線與可重現條件，再拆。',kb:'收機 基準 拆前照片 設定頁 故障重現'}
  );
}
