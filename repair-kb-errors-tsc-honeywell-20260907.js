'use strict';

// TSC / Honeywell / Datamax 錯誤訊息與現場狀態分流。

addRepairKB({
  id:'tsc-industrial-no-ribbon',brand:'TSC',models:['MH241','MH341','MH641','MH640','MB240T','MB340T','TH240','TH340','TE200','TE210','TE300','TE310'],category:'錯誤碼／警報',
  title:'TSC｜No Ribbon／Ribbon Empty／明明有碳帶仍報錯',severity:'高頻',sources:['tsc_mh241','tsc_th240','tsc_te'],
  summary:'TSC 類型機種出現 No Ribbon/Ribbon Empty 時，先確認 Ribbon 是否用完或裝法錯誤，再進 Ribbon Sensor、校正與回收軸機構。',
  keyFacts:['Ribbon 裝法錯誤與真正用完都會報錯。','回收軸不轉會讓 Ribbon 偵測問題反覆出現。','不同型號 Sensor 路徑不同，精確位置看該機手冊。'],
  engineering:['先用正常 Ribbon 交叉，不先改未知 Sensor 值。'],
  verify:['有 Ribbon 時不誤報','Ribbon End 時可正確停機','連印 100 張正常'],
  flow:[['確認 Ribbon 狀態/安裝','Ribbon 是否用完、方向與路徑正確。',['正確','已重裝/更換'],'先排耗材。'],['確認回收軸','列印時 Take-up 是否正常轉動。',['正常','不轉/打滑'],'不轉先修機構。'],['執行 Sensor Calibration','依該機 Menu/TSC Console 校正。',['成功','失敗'],'失敗進硬體。'],['清潔/檢查 Ribbon Sensor','清灰塵、碳粉、接頭。',['正常','已修復'],'再測。'],['Sensor/線束/板端','依 Service Manual 收斂。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'tsc-industrial-no-paper',brand:'TSC',models:['MH241','MH341','MH641','MH640','MB240T','MB340T','TH240','TH340','TE200','TE210','TE300','TE310','TTP-247','TTP-345','TTP-244 PRO'],category:'錯誤碼／警報',
  title:'TSC｜No Paper／Out of Paper／有紙卻報缺紙',severity:'高頻',sources:['tsc_mh241','tsc_th240','tsc_te','tsc_ttp'],
  summary:'TSC 官方類型故障常見原因為沒有 Label、安裝錯誤，以及 Gap/Black Mark Sensor 未校正。先確認 Sensor Type/位置再 Calibration。',
  keyFacts:['Gap/Black Mark Sensor 未校正可造成 No Paper。','特殊底紙先換正常紙交叉。','有紙但完全沒有 Sensor 變化才往硬體收斂。'],
  engineering:['清潔 Sensor 後再校正，避免髒污影響基準。'],
  verify:['FEED 一次一張','50 張無缺紙誤報','重開機仍正常'],
  flow:[['確認 Label 安裝','紙張路徑、Media Guide 與尺寸。',['正常','已修正'],'先排裝法。'],['確認 Gap/Black Mark 模式','Sensor Type 與紙材一致。',['正確','已修正'],'設定錯會失敗。'],['清潔 Sensor','移除紙屑/殘膠。',['完成','清後正常'],'再校正。'],['Calibration','使用面板/TSC Console。',['成功','失敗'],'失敗換紙交叉。'],['硬體收斂','查 Sensor/線束/板端。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'tsc-industrial-paper-jam',brand:'TSC',models:['MH241','MH341','MH641','MH640','MB240T','MB340T','TH240','TH340','TE200','TE210','TE300','TE310','TTP-247','TTP-345','TTP-244 PRO'],category:'錯誤碼／警報',
  title:'TSC｜Paper Jam／紙卡住／定位一直錯',severity:'高頻',sources:['tsc_mh241','tsc_th240','tsc_ttp'],
  summary:'Paper Jam 不一定真的是紙物理卡死；Sensor 設定/校正與 Label Size 不正確也可能讓 Printer 判斷走紙失敗。',
  keyFacts:['先斷電看是否真有卡料。','Label Size 錯誤可造成走紙長度不合理。','Gap/Black Mark Sensor 位置不對也會像 Jam。'],
  engineering:['殘膠纏 Platen/Peel/Cutter 區域時先處理機構。'],
  verify:['FEED 正常','連印 100 張無 Jam','走紙無異音'],
  flow:[['斷電檢查走紙路徑','找卡紙、黏標、殘膠。',['無物理 Jam','已清除'],'清除後再測。'],['檢查 Label Size','Driver/Printer 尺寸一致。',['正確','已修正'],'尺寸錯先修。'],['確認 Sensor Type/位置','Gap/Black Mark 對準。',['正常','已修正'],'再校正。'],['重新 Calibration','完成 Sensor Calibration。',['成功','失敗'],'失敗進硬體。'],['機構/Sensor 收斂','Platen、Guide、Sensor、Motor/Drive。',['找到異常','板端方向高'],'最後。']]
});

addRepairKB({
  id:'tsc-industrial-take-label',brand:'TSC',models:['MH241','MH341','MH641','MH640','MB240T','MB340T'],category:'錯誤碼／警報',
  title:'TSC｜Take Label／剝紙模式一直停著不續印',severity:'常見',sources:['tsc_mh241','tsc_mh_product','tsc_mb'],
  summary:'Take Label 通常代表 Peel-off 模式正在等待已剝出的標籤被取走。若取走後仍不續印，應查 Peel Sensor、模組接頭與 Print Mode。',
  keyFacts:['有 Peel-off 功能時 Take Label 可能是正常等待狀態。','沒有剝紙模組卻啟用 Peel Mode，先修設定。','取走 Label 後狀態不變，才偏 Peel Sensor/線束。'],
  engineering:['清潔 Peel Sensor 並確認觸發區沒有殘膠。'],
  verify:['取標後自動續印','連續剝紙 50 張正常','重開機模式保留'],
  flow:[['確認是否真的需要 Peel Mode','客戶是否有裝剝紙模組。',['有','沒有'],'沒有就改正 Print Mode。'],['取走已剝標籤','確認不是正常等待。',['續印','不續印'],'不續印查 Sensor。'],['清潔 Peel Sensor','清殘膠與紙屑。',['正常','仍異常'],'再查接頭。'],['檢查模組接頭/線束','斷電檢查。',['正常','已修復'],'再測。'],['Sensor/板端收斂','依 Service Manual。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'tsc-industrial-cutter-error',brand:'TSC',models:['MH241','MH341','MH641','MH640','MB240T','MB340T','TH240','TH340','TTP-247','TTP-345'],category:'錯誤碼／警報',
  title:'TSC｜Cutter Error／Cutter Jam／刀片無法回位',severity:'高',sources:['tsc_mh241','tsc_th240','tsc_ttp'],
  summary:'TSC 類型 Cutter Jam 先清除卡標籤與殘膠，確認 Cutter 真的有安裝與設定，再依該型號控制方式讓刀片回到正確位置；持續失敗再查 Cutter PCB/Motor/Sensor。',
  keyFacts:['沒有 Cutter 卻設定 Cutter mode 也可能造成異常。','標籤過厚或黏膠容易讓刀片卡滯。','部分舊機手冊明確把 Cutter PCB 列為持續故障方向。'],
  engineering:['斷電處理 Cutter，避免割傷。','不要用手硬推刀片。'],
  verify:['連切 100 張','重開機 Cutter 初始化正常','切位一致'],
  flow:[['確認 Cutter 模組/模式','機器真的有 Cutter，Driver/Print Mode 正確。',['正確','已修正'],'先排設定。'],['斷電清除 Jam/殘膠','清 Cutter Path。',['完成','無異物'],'再測。'],['確認刀片可回 Home','依該型號原廠方式回位。',['成功','失敗'],'失敗進硬體。'],['Motor/Sensor/線束','依 Service Manual 交叉。',['異常','正常'],'正常再查板。'],['Cutter PCB/主板收斂','板端最後。',['Cutter PCB方向高','主板方向高','其他'],'記錄。']]
});

addRepairKB({
  id:'honeywell-pm45-media-alert',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],category:'錯誤碼／警報',
  title:'PM45｜Media 偵測異常／Gap、Black Mark、Label Taken 分流',severity:'高頻',sources:['honeywell_pm45','honeywell_pm45_cal'],
  summary:'PM45 的 Gap Sensor、Black Mark Sensor 與 Label Taken Sensor 是不同功能。遇到 Media 類錯誤要先確認目前 Print Mode 與 Sensor 類型，再分校正與硬體。',
  keyFacts:['Gap 為 transmissive、Black Mark 為 reflective。','Label Taken Sensor 是剝紙/取標用途，不等於 Media Sensor。','Sensor 位置與目前耗材要先對準。'],
  engineering:['先校正正確 Sensor，再查線束。'],
  verify:['FEED 一次一張','Peel 模式取標後續印','50 張無誤報'],
  flow:[['辨識錯誤情境','是 Gap/Black Mark 還是 Label Taken。',['Gap/Mark','Label Taken'],'先分 Sensor。'],['確認 Sensor 位置/模式','對準實際 Gap/Mark。',['正確','已修正'],'再校正。'],['執行對應 Calibration','Media 或 Label Taken Calibration。',['成功','失敗'],'失敗進清潔。'],['清潔/換正常耗材','排除污染與紙材。',['正常','仍異常'],'仍異常偏硬體。'],['Sensor/線束收斂','依 User/Service Guide。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'honeywell-px940-narrow-media-cal',brand:'Honeywell (Datamax/Intermec)',models:['PX940'],category:'錯誤碼／警報',
  title:'PX940｜窄標籤 Calibration 失敗／前後 LSS 沒對齊',severity:'高價值',sources:['honeywell_px940','honeywell_px940_faq'],
  summary:'PX940 窄標籤校正時，前後 Label Stop Sensor/LSS 對位特別重要。若一個 Sensor 沒有落在媒體路徑上，校正可能失敗或定位異常。',
  keyFacts:['先確認兩個 LSS 都能看到實際媒體。','窄標籤尤其容易因 Sensor 位置造成失敗。','校正成功前不要急著調 Offset。'],
  engineering:['先拍照記錄 Sensor 原位置再調整。'],
  verify:['Calibration 成功','FEED 一次一張','連印定位穩定'],
  flow:[['確認 Label 寬度/路徑','紙材是否太窄且偏離 Sensor。',['正常','需要重定位'],'重定位。'],['對齊前後 LSS','兩個 Sensor 對準媒體偵測區。',['完成','無法對齊'],'無法對齊查安裝。'],['重新 Calibration','執行原廠校正。',['成功','失敗'],'失敗再查紙材。'],['正常紙材交叉','排除透明/特殊底紙。',['正常','仍失敗'],'仍失敗偏 Sensor。'],['LSS/線束收斂','依 Service Manual。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'datamax-iclass-check-supplies',brand:'Honeywell (Datamax/Intermec)',models:['I-4212e','I-4310e','I-4606e'],category:'錯誤碼／警報',
  title:'I-Class Mark II｜CHECK SUPPLIES／Media-Ribbon Sensor Calibration',severity:'舊機常見',sources:['honeywell_iclass','datamax_iclass_op','datamax_iclass_maint'],
  summary:'I-Class Mark II 類型出現 Check Supplies 時，先確認 Media/Ribbon 安裝與 Sensor Calibration，再依 Standard/Advanced Calibration 流程排除特殊耗材。',
  keyFacts:['舊機 Sensor 髒污與耗材變更很常見。','先做正常 Calibration，再進 Advanced Entry。','訊號不變才進 Sensor/線束/主板。'],
  engineering:['保留校正前後數值與症狀。'],
  verify:['FEED 正常','連印 50 張無 Check Supplies','重新開機正常'],
  flow:[['確認 Supplies 安裝','Media/Ribbon 路徑正確。',['正常','已重裝'],'先排耗材。'],['清潔 Sensor','清灰塵/紙屑。',['完成','正常'],'再校正。'],['Standard Calibration','依 Operator Manual。',['成功','失敗'],'失敗進 Advanced。'],['Advanced Entry Calibration','特殊耗材再使用。',['成功','失敗'],'失敗偏硬體。'],['Sensor/線束/板端','依 Maintenance Manual。',['Sensor方向高','主板方向高'],'最後。']]
});
