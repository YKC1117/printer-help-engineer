'use strict';

// 2026-09-07 第二批擴充：以原廠文件為主，補常見舊機／桌上型／跨品牌故障。

addRepairKB({
  id:'zebra-zt510-sensor-cal',brand:'Zebra',models:['ZT510'],category:'感應器／校正',
  title:'ZT510｜Paper Out、Ribbon Out、跳標、Sensor Calibration',severity:'高價值',sources:['zebra_zt510','zebra_jg','zebra_cal'],
  summary:'ZT510 的 Ribbon/Media 問題先從 Print Method、Media Type、Sensor Type 與位置開始，再做 Media/Ribbon Calibration。原廠提供 Transmissive / Reflective Sensor 選擇，黑標紙通常使用 Reflective，其餘常見 Gap 類耗材多用 Transmissive。',
  keyFacts:['Home → Sensors 可查看 Sensor Type；Reflective 常用於 Black Mark，Transmissive 常用於其他媒體。','Media/Ribbon Cal 是正式的校正流程，不應直接以更換 Sensor 取代。','Ribbon 必須至少與 Media 同寬，過窄會讓 Printhead 無保護並增加磨耗。'],
  engineering:['遇到「明明有紙/碳帶卻報錯」時，先印 Sensor Profile 或觀察讀值，再決定是否進硬體。','校正仍失敗才往 Sensor 清潔、位置、線束、接頭與輸入電路收斂。'],
  verify:['FEED 每次一張','50 張連續列印無跳標','Paper/Ribbon Out 不再誤報','重開機後仍正常'],
  flow:[
    ['確認 Print Method / Media Type','先確認 Thermal Transfer/Direct Thermal 與 Gap/Mark/Continuous。',['正確','設定錯誤，已修正'],'Driver 可能覆蓋機器端設定。'],
    ['確認 Sensor Type','Black Mark 優先確認 Reflective；一般 Gap 依耗材確認 Transmissive。',['正確','Sensor Type 錯誤，已修正'],'不要只做 Calibration 卻忽略 Sensor Type。'],
    ['確認 Sensor 位置與清潔','檢查紙屑、殘膠、黑標／Gap 是否真正通過感應區。',['正常','已清潔／重定位'],'特殊缺口紙需特別注意位置。'],
    ['執行 Media/Ribbon Calibration','依原廠流程完成，不中途跳步。',['成功','仍失敗'],'先記錄校正前後症狀。'],
    ['印 Sensor Profile／觀察讀值','比較 Label/Gap/Ribbon 的變化是否清楚。',['波形正常','變化很小／固定'],'固定值提高 Sensor/線路嫌疑。'],
    ['硬體收斂','斷電查 Sensor、線束、接頭；必要時用正常 Sensor 交叉。',['找到 Sensor/線束異常','主板輸入方向高','已修復'],'主板放最後。']]
});

addRepairKB({
  id:'zebra-zt510-quality-mech',brand:'Zebra',models:['ZT510'],category:'列印品質／機構',
  title:'ZT510｜列印太淡、單側淡、皺碳、Printhead / Platen',severity:'常見',sources:['zebra_zt510'],
  summary:'ZT510 品質問題不要只加 Darkness。原廠說明較慢速度通常能提升品質；工程上應固定耗材與速度後，再查 Printhead 清潔、Platen、壓力與 Ribbon 路徑。',
  keyFacts:['較慢 Print Speed 通常能改善品質。','Ribbon 要與 Media 同寬或更寬。','單側淡與皺碳應優先懷疑壓力平衡、走紙平行與 Platen，而非無限增加 Darkness。'],
  engineering:['固定同位置白線：先清 Printhead，再用測試圖確認是否為固定 dot failure。','皺碳伴隨紙偏時，先處理走紙/壓力，不要只換碳帶。'],
  verify:['測試圖無固定缺線','左右濃度一致','連續列印 Ribbon 不皺','條碼掃描穩定'],
  flow:[
    ['建立測試基準','固定同一紙、碳帶、速度、Darkness，印內建測試或固定圖。',['完成','無法建立'],'先排軟體變數。'],
    ['清潔 Printhead / Platen','IPA 正確清潔並看滾輪是否硬化、凹痕、殘膠。',['清潔後正常','仍異常','Platen 異常'],'Platen 異常會造成局部接觸不良。'],
    ['降低速度測試','速度降低後比較濃度與邊緣。',['明顯改善','無改善'],'改善表示熱量/速度匹配方向高。'],
    ['判斷左右差異與皺碳','看單側淡、紙偏、Ribbon wrinkle 是否一起出現。',['單側淡','皺碳／紙偏','平均都淡'],'分流處理。'],
    ['檢查壓力／路徑／軸系','確認壓力平衡、Ribbon path、導紙與 Platen 平行。',['找到機構異常','外觀正常'],'不要用過高壓力補機構問題。'],
    ['Printhead 判斷','固定同位置缺線清潔後仍在，準備交叉或更換 Printhead。',['Printhead 方向高','非 Printhead'],'換頭前先確認線材與主板輸出。']]
});

addRepairKB({
  id:'zebra-zt230-sensor-cal',brand:'Zebra',models:['ZT210','ZT220','ZT230'],category:'感應器／校正',
  title:'ZT210/ZT220/ZT230｜Paper/Ribbon Out、跳標、Manual Calibration',severity:'舊機常見',sources:['zebra_zt230','zebra_jg'],
  summary:'ZT200 舊系列遇到換紙後跳標、影像上下漂、Ribbon Out、Media Out，原廠支援頁明確建議重新校正 Ribbon/Media Sensor；Reflective Sensor 位置不對也會造成偵測錯誤。',
  keyFacts:['更換 Media 尺寸/種類後、跳標、垂直漂移、Ribbon Out、Media Out 都是重新校正的典型時機。','Reflective Sensor 可移動，Black Mark 必須真正經過偵測位置。','先做校正與清潔，不要一看到 Paper Out 就換 Sensor。'],
  engineering:['舊機常見紙屑、殘膠、Sensor 滑座位置跑掉。','若 Profile 幾乎沒有變化，再進 Sensor/線束/主板輸入。'],
  verify:['FEED 一次一張','50 張無累積漂移','換紙後可重新校正成功','無誤報 Ribbon/Media Out'],
  flow:[
    ['確認耗材與安裝','紙、碳帶、Media Type、Print Method 正確。',['正確','已修正'],'先排人為。'],
    ['確認 Reflective Sensor 位置','Black Mark/特殊紙確認感應位置。',['位置正確','位置已修正'],'黑標沒有經過 Sensor 就一定難校正。'],
    ['清潔 Media / Ribbon Sensor','清除灰塵、紙屑、碳粉與殘膠。',['完成','清潔後正常'],'清完再校正。'],
    ['Manual Calibration','依原廠 ZT200 流程執行。',['成功','仍失敗'],'失敗時記錄停在哪一步。'],
    ['印 Sensor Profile','看 gap/mark/ribbon 是否有明顯變化。',['正常','變化弱／固定'],'正常則回查設定/耗材。'],
    ['硬體檢查','斷電查 Sensor、線束與接頭，必要時交叉正常件。',['Sensor/線束異常','主板方向高','已修復'],'主板最後。']]
});

addRepairKB({
  id:'zebra-zd421-zd621-cal',brand:'Zebra',models:['ZD421','ZD621'],category:'感應器／校正',
  title:'ZD421/ZD621｜SmartCal、Manual Calibration、跳標、Media Out',severity:'高頻',sources:['zebra_zd421','zebra_zd421_cal','zebra_jg'],
  summary:'ZD421/ZD621 先用 SmartCal；若遇到特殊耗材、跳標、影像漂移、Media Out 或 SmartCal 失敗，再進 Manual Calibration 與 Sensor Profile。',
  keyFacts:['SmartCal：Ready 狀態下按住 PAUSE + CANCEL 約 2 秒，機器會送出數張媒體並自動量測。','Manual Calibration 可調整 Media 與 Ribbon Sensor sensitivity。','Sensor Profile 適合判斷 gap 偵測錯誤、預印刷干擾與 Ribbon 偵測問題。'],
  engineering:['同批同規格耗材通常不需每卷重做完整校正，FEED 一兩次可同步。','Sensor 值不建議任意手動亂改；原廠也提醒 Label Sensor sensitivity 通常由 Calibration 設定。'],
  verify:['SmartCal / Manual Cal 正常完成','FEED 一次一張','Profile 的 gap 間距與實體標籤一致','無 Media Out 誤報'],
  flow:[
    ['確認 Media Type / Sensor 位置','Gap/Black Mark/Continuous 與可移動 Sensor 位置正確。',['正確','已修正'],'先看實際耗材。'],
    ['執行 SmartCal','Ready → PAUSE + CANCEL 約 2 秒。',['成功','失敗／仍跳標'],'正常先不用深入。'],
    ['Manual Calibration','SmartCal 不夠時使用 Manual Calibration。',['成功','仍失敗'],'特殊耗材更適合手動校正。'],
    ['印 Sensor Profile','看 MEDIA/WEB/OUT 與 gap spike。',['正常','波形不清／間距不對'],'不清先清潔與重定位。'],
    ['清潔與耗材交叉','換已知正常標籤、清 Sensor/Platen。',['正常','仍異常'],'排除透明底紙、預印刷等因素。'],
    ['硬體收斂','斷電查 Sensor/線束/接頭，必要時交叉 Sensor。',['Sensor/線束異常','主板輸入方向高','已修復'],'不要先改未知 Sensor 值。']]
});

addRepairKB({
  id:'zebra-zd421-zd621-usb',brand:'Zebra',models:['ZD421','ZD621'],category:'USB／Driver／連線',
  title:'ZD421/ZD621｜USB 插了沒反應、Unknown Device、送印沒動作',severity:'高頻',sources:['zebra_zd421'],
  summary:'Zebra 官方特別提醒：若先把 USB 接上電腦、再安裝 Driver，Windows 可能把機器列成 Unknown/Unspecified Device。排查要先分「Printer 自測正常」與「電腦端辨識/Driver/Port」。',
  keyFacts:['先裝建議 Driver，再接 USB 是官方建議流程。','Printer 本機測試正常但 Windows 不印，優先查 Driver、Port、Queue，而不是拆機。','USB 無法辨識要先換線、換 Port、另一台電腦交叉。'],
  engineering:['裝置管理員若連 USB 裝置都不出現，再進 USB socket/board 路徑。','有辨識但列印失敗與完全無辨識是兩種故障。'],
  verify:['Windows 正確辨識型號','Test Page 正常','BarTender/實際軟體可印','重插 USB 後仍正常'],
  flow:[
    ['印 Printer 自測／Config','不經電腦確認 Printer 本身能印。',['正常','本機也不能印'],'本機異常先走硬體/品質流程。'],
    ['查看裝置管理員','是正確型號、Unknown Device、或完全沒裝置。',['正確辨識','Unknown/Unspecified','完全沒反應'],'三條路不同。'],
    ['換 USB 線／Port／電腦','使用已知正常線與另一台電腦。',['恢復正常','仍異常'],'先排外部。'],
    ['重裝 Zebra Driver / Setup Utilities','移除錯誤裝置後依官方順序安裝。',['正常','仍異常'],'避免 Windows 錯誤綁定。'],
    ['核對 Printer Port / Queue','確認工作沒有卡住或送到錯的 Port。',['找到軟體問題','仍無法列印'],'有辨識卻不印常在這裡。'],
    ['硬體 USB 路徑','完全無辨識且交叉線/電腦皆失敗，再查 USB socket、接點與主板。',['USB 介面異常','其他原因','已修復'],'斷電後再拆查。']]
});

addRepairKB({
  id:'tsc-te-series-field',brand:'TSC',models:['TE200','TE210','TE300','TE310'],category:'校正／碳帶／連線／Cutter',
  title:'TSC TE200/210/300/310｜校正、碳帶不回收、LAN、Cutter',severity:'常見',sources:['tsc_te'],
  summary:'TE 系列是常見桌上型熱轉印機。TE210/TE310 具 Ethernet/RS-232/USB/USB Host，TSC Console 可做 Calibration；官方 FAQ 也提供 Ribbon Rewind Spindle 不轉與 Ethernet 初步處理方向。',
  keyFacts:['TSC Console：選 Printer → Functions → Printer Configuration → Calibration。','Ethernet 問題先確認網路線與 Link 燈。','Ribbon rewind spindle 不轉，官方先建議重開機並確認 rewind spindle 裝法與方向。','TE 系列 Cutter 可支援 Full Cut / Partial Cut（依型號/選配）。'],
  engineering:['校正失敗先查 Sensor/紙材/位置，再進 Sensor 硬體。','Cutter 完全不動與會動但卡住需分流。'],
  verify:['FEED 正常一張','碳帶回收穩定','LAN 可持續 Ping/列印','Cutter 連續 30 次正常'],
  flow:[
    ['判斷主要症狀','校正/紙張、Ribbon rewind、LAN、Cutter。',['校正／跳標','碳帶不回收','LAN 不通','Cutter'],'先分流。'],
    ['校正路徑','用 TSC Console 執行 Calibration，並確認紙材 Sensor 類型。',['成功','仍失敗','非此症狀'],'失敗再清 Sensor。'],
    ['Ribbon rewind 路徑','重開機並重新確認 rewind spindle 的安裝與方向。',['正常','仍不轉','非此症狀'],'再查 Clutch/Gear/Motor。'],
    ['LAN 路徑','確認 RJ45 Link 燈、IP、Ping、Windows Port。',['正常','Link 不亮','Link 亮但 Ping 不通','Ping 通但不印'],'從 Layer 1 往上查。'],
    ['Cutter 路徑','確認 Cut Mode/Command，再分完全不動與會動卡住。',['設定問題','完全不動','會動但卡'],'卡住先斷電清紙屑/殘膠。'],
    ['硬體收斂','依分流查 Sensor、Rewind、NIC/Cable、Cutter Motor/Home Sensor。',['找到故障點','主板方向高','已修復'],'先模組再主板。']]
});

addRepairKB({
  id:'tsc-ttp247-quality-sensor',brand:'TSC',models:['TTP-247','TTP-345'],category:'校正／列印品質',
  title:'TSC TTP-247/TTP-345｜跳標、定位不準、印太淡、固定白線',severity:'舊機常見',sources:['tsc_ttp'],
  summary:'TTP-247/345 是常見 4 吋桌上型。維修時先用 Printer 自測切開電腦端問題，再依紙材類型、Sensor、Calibration、Printhead/Platen 的順序收斂。',
  keyFacts:['TTP-247 為 203 dpi，TTP-345 為 300 dpi；同一 BarTender 檔案換解析度機型時需注意尺寸/點數差異。','Gap/Black Mark/Notch 等紙材要使用正確 Sensor 判讀。','固定同位置白線清潔後仍存在時，提高 Printhead dot failure 嫌疑。'],
  engineering:['定位累積漂移偏 Calibration/Sensor；固定整體偏移再查 Driver/Label Offset。','列印淡先用速度/Darkness/耗材建立基準，不要直接判 Printhead 壞。'],
  verify:['連續 50 張定位穩定','條碼可讀','無固定白線','重開機後設定保留'],
  flow:[
    ['印自測標籤','先看機器本身能否正常走紙與列印。',['正常','自測也異常'],'正常先查 Driver/檔案。'],
    ['確認紙材與 Sensor','Gap/Black Mark/Notch/Continuous 選擇與 Sensor 位置。',['正確','已修正'],'特殊紙先看這裡。'],
    ['執行 Calibration','重新建立 label length / gap 判讀。',['成功','仍跳標'],'仍失敗再清 Sensor。'],
    ['清 Printhead / Sensor / Platen','清除碳粉、紙屑與殘膠。',['清潔後正常','仍異常'],'清潔後重跑測試。'],
    ['品質分流','太淡、固定白線、單側淡。',['整體太淡','固定白線','單側淡'],'分別查 Darkness/Speed、Printhead、Platen/壓力。'],
    ['硬體收斂','Sensor/線束、Printhead/排線、Platen/機構。',['找到故障點','主板方向高','已修復'],'主板最後。']]
});

addRepairKB({
  id:'argox-os214ex-cal',brand:'Argox',models:['OS-214EX Pro'],category:'感應器／校正',
  title:'Argox OS-214EX Pro｜換紙後抓不到標籤、一直跑紙、Calibration',severity:'高頻',sources:['argox_os214'],
  summary:'OS-214EX Pro 原廠手冊明確要求更換 Media 時要做 Calibration，否則 Label Sensor 可能無法正確偵測。其開機 FEED 校正流程會自動送紙並列印 Configuration Profile。',
  keyFacts:['原廠：更換 Media 時應重新 Calibration。','關機 → 按住 FEED 再開機，直到馬達動作；校正後會列印 Configuration Profile。','PPLB 模擬模式可能在 Configuration 後進入 Dump Mode；按 FEED 或重開機退出。'],
  engineering:['客戶說「一直印亂碼」時要先確認是否誤進 Dump Mode，不一定是主板。','校正後仍抓不到紙再查 Reflective Sensor、線束與耗材反射差異。'],
  verify:['FEED 一次一張','Config Profile 正常','換紙後重新校正成功','無持續 Dump 亂碼'],
  flow:[
    ['確認紙張安裝','Media 放正、上蓋關妥。',['正確','已修正'],'先排安裝。'],
    ['執行開機 FEED Calibration','關機，按住 FEED 開機至馬達啟動。',['成功並印 Config','失敗'],'照原廠時機放開 FEED。'],
    ['確認是否進 Dump Mode','若持續把接收字元以十六進位/文字方式印出，先退出 Dump。',['正常模式','Dump Mode，已退出'],'PPLB 特別注意。'],
    ['換已知正常耗材','排除透明底紙、黑色預印刷、反射差異。',['正常','仍失敗'],'先排耗材。'],
    ['清潔／檢查 Sensor','清潔感應區與走紙路徑。',['正常','讀值仍異常'],'再進線束。'],
    ['硬體收斂','斷電查 Reflective Sensor、線束、接頭與板端輸入。',['Sensor/線束異常','主板方向高','已修復'],'不要用單次案例電壓當標準值。']]
});

addRepairKB({
  id:'argox-cpex-cal-dump',brand:'Argox',models:['CP-2140EX','CP-3140EX'],category:'校正／Dump Mode／Cutter',
  title:'Argox CP-2140EX/CP-3140EX｜Calibration、亂碼 Dump、Cutter',severity:'常見',sources:['argox_cp'],
  summary:'CP-EX 原廠手冊提供開機 FEED 的 Media Calibration + Configuration 流程；PPLB 語言在列印 Config 後會進 Dump Mode，可用來工程除錯，但客戶現場常誤以為「一直印亂碼」。',
  keyFacts:['關機 → 按住 FEED 開機直到 Motor 啟動，可執行 Media Calibration 並列印 Self-test/Configuration。','PPLB 下可能進 Dump Mode；按 FEED 或重新開機可回正常。','Cutter 問題先排 Cut 設定/Command，再查機構。'],
  engineering:['若 Calibration 正常但電腦送印不正常，先查 Driver/Emulation/Port。','亂碼先確認 Dump Mode 和 Printer Language，不要先換主板。'],
  verify:['Config Label 正常','一般列印不再輸出 Dump 字元','FEED 正常','Cutter 連續動作正常'],
  flow:[
    ['先印 Calibration / Config','按原廠開機 FEED 流程。',['正常','校正失敗'],'正常可證明基本走紙/列印。'],
    ['判斷是否 Dump Mode','看輸出是否像接收資料＋Hex。',['不是 Dump','是 Dump，已退出'],'PPLB 特別常見。'],
    ['確認 Printer Language / Driver','PPLA/PPLB/PPLZ 與 Driver/軟體設定需一致。',['正確','已修正'],'語言不一致會造成異常輸出。'],
    ['Cutter 分流','不切、完全不動、會動但卡。',['不需 Cutter','設定問題','完全不動','會動但卡'],'先軟體再機構。'],
    ['清 Sensor / Cutter path','清紙屑、殘膠並確認耗材。',['正常','仍異常'],'斷電處理 Cutter。'],
    ['硬體收斂','Sensor/線束、Cutter Motor/Gear/Home、主板輸入。',['找到故障點','主板方向高','已修復'],'按症狀分模組。']]
});

addRepairKB({
  id:'sato-cl4nx-sensor-quality',brand:'SATO',models:['CL4NX Plus'],category:'感應器／列印品質',
  title:'SATO CL4NX Plus｜Gap/I-Mark Calibration、單側淡、印不出來',severity:'進階',sources:['sato_clnx_cal','sato_clnx_quality'],
  summary:'CL4NX Plus 原廠可針對 Gap / I-Mark 做 Auto-calibration，也能手動設定 Sensor level。列印單側淡時，原廠優先要求檢查 Head Pressure Balance、耗材安裝與 Printhead/Media Sensor 清潔。',
  keyFacts:['Settings → Printing → Advanced → Calibrate 可調 Media Sensor。','Auto-calibration 可自動調整 Sensor level；也有 Gap / I-Mark Level 與 Slice Level。','單側淡：Head Pressure Balance、Media/Ribbon loading、Printhead/Sensor cleanliness 是原廠優先項。','Media 有走但不印：原廠也要求確認 Media/Ribbon、Printhead/Sensor 清潔與 Printhead 安裝。'],
  engineering:['手動 Level/Slice 不應在沒有基準時亂改；先 Auto Calibration 與清潔。','固定單側淡先回到壓力平衡與機構，不要只加 Darkness。'],
  verify:['Auto Calibration 成功','50 張定位穩定','左右濃度一致','Test Print 正常'],
  flow:[
    ['確認 Sensor 類型','依 Media 選 Gap 或 I-Mark。',['正確','已修正'],'類型先對。'],
    ['執行 Auto-calibration','Settings → Printing → Advanced → Calibrate。',['成功','仍失敗'],'先自動再手動。'],
    ['清 Printhead / Media Sensor','清除殘膠、灰塵與標籤碎屑。',['清潔後正常','仍異常'],'原廠優先項。'],
    ['品質分流','單側淡、局部淡、Media 走但沒印。',['單側淡','局部淡','走紙不印'],'分別查 Head Pressure Balance、清潔/耗材、Printhead 安裝。'],
    ['檢查 Media/Ribbon loading','確認走紙與 Ribbon 路徑。',['正確','已修正'],'裝法錯誤會同時影響 Sensor 與品質。'],
    ['進階 Sensor / Printhead','必要時再查 Level/Slice、Head connector/安裝與硬體。',['Sensor 方向高','Printhead/壓力方向高','已修復'],'記錄修改前數值。']]
});
