'use strict';

// 2026-09-07 第三批擴充：Honeywell / Datamax、GoDEX、TOSHIBA、SATO。
// 以原廠支援頁與原廠文件為主；鏡像來源明確標 B 級，不把網路經驗當成原廠標準值。

addRepairKB({
  id:'honeywell-pm45-media-sensor',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],category:'感應器／校正',
  title:'PM45｜Gap / Black Mark Sensor、Label Taken Sensor、跳標與 Media Out',severity:'高價值',sources:['honeywell_pm45','honeywell_pm45_cal'],
  summary:'PM45 的 Gap Sensor 是 transmissive、Black Mark Sensor 是 reflective；原廠文件提供可調式 Sensor 位置與 Calibration Wizard。遇到換紙後跳標、抓不到 Gap/Black Mark、剝紙模式取標後不續印，先從 Sensor 位置與對應校正開始。',
  keyFacts:['Label Gap Sensor 透過標籤間隙判斷走紙；Black Mark Sensor 讀取連續紙上的黑標。','Sensor 上的藍色 LED 可協助工程師判斷實際偵測位置。','Label Taken Sensor / Dispenser 安裝後，原廠建議先做 Label Taken Sensor Calibration。'],
  engineering:['不要一開始就改 Sensor 數值；先確認實體 Sensor 是否對準 Gap/Mark。','換環境、換耗材或拆裝 Label Taken 模組後，重新校正比直接換 Sensor 更合理。','校正仍失敗時，再斷電查 Sensor 線束、接頭與感應輸入。'],
  verify:['FEED 每次一張','Gap/Black Mark 定位穩定','剝紙模式取走標籤後能繼續列印','連續 50 張無跳標或 Media Out 誤報'],
  flow:[
    ['確認 Media Type 與實體標記','先分 Gap、Black Mark、Continuous；確認客戶紙材沒有把預印刷當成 Mark。',['正確','設定/紙材辨識錯誤，已修正'],'先把紙材類型講清楚。'],
    ['確認 Sensor 位置','打開 Media Cover，用藍色 LED 協助把 Sensor 對到 Gap 或 Black Mark。',['位置正確','位置已修正'],'Gap 與 Black Mark 的偵測原理不同。'],
    ['執行 Calibration Wizard','依 PM45 Calibration Wizard 對目前紙材重新校正。',['成功','仍失敗'],'換紙後優先做。'],
    ['Label Taken 模組分流','若有 Peel/Dispenser，另外做 Label Taken Sensor Calibration。',['不適用','校正成功','仍異常'],'取標 Sensor 與 Media Sensor 是不同問題。'],
    ['耗材/清潔交叉','清 Sensor、Platen，換一卷已知正常紙材再測。',['恢復正常','仍異常'],'排除透明底紙、髒污與預印刷干擾。'],
    ['硬體收斂','斷電查 Sensor、線束、接頭；必要時以正常件交叉。',['Sensor/線束方向高','主板輸入方向高','已修復'],'主板最後。']]
});

addRepairKB({
  id:'honeywell-px940-narrow-cal',brand:'Honeywell (Datamax/Intermec)',models:['PX940'],category:'感應器／校正',
  title:'PX940｜窄標籤 Media Calibration 失敗、LSS 對位、Black Mark',severity:'高價值',sources:['honeywell_px940','honeywell_px940_faq'],
  summary:'Honeywell 官方特別說明 PX940 窄標籤校正失敗時，要確認 rear LSS 與 front LSS 都位於標籤下方且兩者對齊；PX940 的 Black Mark 支援位置在紙材下方。',
  keyFacts:['窄標籤：rear LSS 與 front LSS 都要真正落在標籤下方。','兩顆 LSS 藍色 LED 若不在同一直線，需解鎖前模組並調整 Sensor wheel 對齊。','PX940 支援校正後回拉 Media 的模式，但 wax ribbon 可能因回拉產生 smudge。','Black Mark 僅支援位於 Media 下方。'],
  engineering:['客戶說「窄標一直校正失敗」時，不要只重做 Calibration，先看 LSS 幾何位置。','有 wax ribbon 且使用 calibration retraction 時，若出現擦糊要回頭檢討 retraction 模式。'],
  verify:['窄標校正可完成','FEED 一次一張','Black Mark 定位穩定','校正後無 ribbon smudge'],
  flow:[
    ['確認紙寬與 Sensor 覆蓋','看 rear/front LSS 是否都在實際標籤下方。',['都在標籤下方','其中一顆偏出'],'窄紙最常在這裡出問題。'],
    ['確認兩顆 LSS 對齊','比較前後 Sensor 的藍色 LED 是否同一直線。',['對齊','未對齊，已調整'],'先幾何對位再校正。'],
    ['Black Mark 分流','若是黑標紙，確認 Mark 位於紙材下方。',['正確','紙材規格不符','非 Black Mark'],'PX940 官方限制。'],
    ['重新 Media Calibration','LSS 對位後重新校正。',['成功','仍失敗'],'仍失敗才往耗材/硬體。'],
    ['檢查 Retract 模式與 Ribbon','若用 fast/slow with retraction，觀察 wax ribbon 是否擦糊。',['正常','有 smudge','未使用 retraction'],'必要時停用回拉模式比較。'],
    ['硬體收斂','Sensor 對位與正常耗材都排除後，再查 LSS 模組、線束與主板。',['LSS/線束方向高','主板方向高','已修復'],'記錄前後 Sensor 行為。']]
});

addRepairKB({
  id:'honeywell-px940-touch-ui',brand:'Honeywell (Datamax/Intermec)',models:['PX940'],category:'面板／韌體／網頁',
  title:'PX940｜觸控螢幕沒反應、畫面可亮但不能操作',severity:'實用',sources:['honeywell_px940_faq'],
  summary:'PX940 官方 FAQ 提供由 Printer Internal Web Page 啟動 Screen Calibration 的方式。若觸控偏移或無法正常點選，先區分「顯示正常但 Touch 校正問題」與「整個 UI / 主板卡死」。',
  keyFacts:['官方路徑：Printer internal webpage → Services → Screen Calibration。','能透過網頁進入機器代表 LAN/主控仍有一定功能，故障優先落在 Touch calibration / Panel path。'],
  engineering:['先用 Web UI 嘗試 Screen Calibration，避免直接拆面板。','若 Web UI 也完全無法存取，再回頭查開機狀態、LAN、韌體與主板。'],
  verify:['觸控四角/邊緣可準確點選','重開機後校正仍保留','Web UI 與本機面板皆正常'],
  flow:[
    ['確認顯示狀態','畫面有顯示只是 Touch 不準，還是整台 UI 卡死。',['有畫面，Touch 不準/不動','整個 UI 卡死'],'先分支。'],
    ['確認網頁是否可進','從同網段瀏覽器進 Printer internal webpage。',['可進','不可進'],'可進表示主控/網路至少部分正常。'],
    ['執行 Screen Calibration','Services → Screen Calibration。',['恢復正常','仍無法操作'],'官方處理。'],
    ['Power Cycle / Firmware 分流','觸控校正無效時，記錄 Firmware 與重開機結果。',['重開後正常','仍異常'],'避免無記錄更新韌體。'],
    ['硬體檢查','斷電後查 Panel/Touch 線材、接頭與面板模組。',['找到異常','外觀正常'],'最後才升高主板嫌疑。']]
});

addRepairKB({
  id:'datamax-iclass-calibration',brand:'Honeywell (Datamax/Intermec)',models:['I-4212e','I-4310e','I-4606e'],category:'感應器／校正',
  title:'I-Class Mark II｜Quick / Empty / Standard / Advanced Media Calibration',severity:'舊機高價值',sources:['honeywell_iclass','datamax_iclass_op','datamax_iclass_maint'],
  summary:'I-Class Mark II 有分 Quick、Empty、Standard、Advanced Entry Calibration。Quick 適合日常換紙微調；Standard 會取 Empty、Gap/Mark、Paper 三組樣本；Advanced Entry 應留給 Standard 仍無法處理的特殊紙材。',
  keyFacts:['Quick Calibration：Media loaded、Sensor position/type 已正確時，按住 FEED 至少送出一張完整標籤。','Empty Calibration：移除 Media，Pause + Feed 同時按下，用來校正 Out of Stock。','Standard Calibration 需要 Empty、Gap/Notch/Hole/Mark、Paper 三組樣本。','Advanced Entry 只建議在 Standard Calibration 失敗的特殊媒體使用。'],
  engineering:['預印刷紙材取樣時，Sensor 上方不要放文字、圖形或邊框。','小 notch / reflective mark 需確認 Media 直線離開 Printer，否則取樣不穩。','WARNING LOW BACKING 在某些透明底紙校正時可能仍代表校正成功。'],
  verify:['CALIBRATION COMPLETE','FEED 每次一張','Check Supplies 不再出現','換電/重開後仍能抓到 TOF'],
  flow:[
    ['確認 Sensor Type / Sensor Position','Die-cut、Notched、Reflective 對應 Sensor 位置要正確。',['正確','已修正'],'先排錯誤 Sensor Type。'],
    ['Quick Calibration','按住 FEED 至至少一張完整 Label 輸出。',['Calibration Complete','Calibration Failed'],'失敗再升級。'],
    ['Empty Calibration','移除 Media，Pause + Feed 做 Out-of-Stock 基準。',['完成','無法完成'],'確認機器 idle。'],
    ['Standard Calibration','依序取 Empty、Gap/Mark、Paper 三組讀值。',['Calibration Complete','仍失敗'],'預印刷紙取樣區要乾淨。'],
    ['Advanced Entry','只有 Standard 失敗的特殊耗材才使用。',['成功','仍失敗','不需使用'],'避免平常任意手動改 Level。'],
    ['硬體收斂','清 Media Sensor、查滑座/線束/接頭，再交叉 Sensor。',['Sensor/線束異常','主板方向高','已修復'],'先把 calibration 層排完。']]
});

addRepairKB({
  id:'datamax-iclass-check-supplies-drive',brand:'Honeywell (Datamax/Intermec)',models:['I-4212e','I-4310e','I-4606e'],category:'走紙／馬達／供電',
  title:'I-Class Mark II｜Check Supplies、FEED 不走、Drive Motor / Gear / PSU / Main PCB',severity:'深度維修',sources:['datamax_iclass_maint'],
  summary:'I-Class Mark II 維修手冊對 Check Supplies 有很實用的分流：按 FEED 後若 Media 會動，優先查 loading、calibration、Sensor position/type、Sensor 清潔、Leveling Cam、Maximum Label Length；若 Media 完全不動，則聽 Drive Motor 是否運轉，再切成傳動機構與 Motor/PSU/Main PCB。',
  keyFacts:['Media 會動 ≠ 馬達問題，先回 Sensor / Calibration / Label Length。','Motor 有聲但紙不動：提高 Drive train、Gear、Roller 鬆脫/磨耗嫌疑。','Motor 完全沒動作：維修手冊把 Drive Motor、Power Supply PCB、Main Logic PCB 列為後續方向。'],
  engineering:['這套流程適合客戶白話「機器亮著但紙完全不走」。','進 PSU/Main PCB 前，要先確認機構沒有卡死以及 Motor/線束沒有開路。'],
  verify:['FEED 穩定走紙','無 Check Supplies','馬達無異音','連續列印不失步'],
  flow:[
    ['按 FEED 觀察紙是否動','先不要拆，觀察最基本反應。',['Media 會動','Media 完全不動'],'兩條路。'],
    ['Media 會動：回查 Sensor/Calibration','重新裝紙、校正、Sensor position/type、清潔。',['已修復','仍異常','不適用'],'再看 Maximum Label Length / Leveling Cam。'],
    ['Media 不動：聽 Drive Motor','按 FEED 時聽是否有 Motor 聲。',['Motor 有運轉聲','Motor 完全沒聲'],'用聲音先切機構與電路。'],
    ['Motor 有聲：查傳動','Gear、Drive train、Platen/Roller 是否鬆脫、打滑或磨耗。',['找到傳動異常','傳動正常'],'不要先換主板。'],
    ['Motor 沒聲：查 Motor/供電','斷電檢查 Motor connector/線束；依維修資料確認 PSU 供電。',['Motor/線束方向高','PSU 方向高','供電正常'],'帶電量測依維修規範。'],
    ['Main PCB 最後判斷','Motor/線束/PSU 均正常仍不驅動，再提高 Main Logic PCB。',['主板方向高','找到其他原因','已修復'],'保留量測與交叉結果。']]
});

addRepairKB({
  id:'godex-zx1000i-media-cal',brand:'GoDEX',models:['ZX1200i+','ZX1300i+','ZX1600i+'],category:'感應器／校正',
  title:'ZX1200i+/ZX1300i+/ZX1600i+｜紙張校正、可調式 Media Sensor、一直吐紙',severity:'實用',sources:['godex_zx1000i'],
  summary:'GoDEX 官方把 ZX1000i+ 系列定位為工業型大量列印機，提供全幅域可調的紙張偵測器，官方產品頁也直接提供紙張校正影片。遇到跳標、一直出紙、抓不到 Gap/Mark，先確認 Sensor 位置與紙張校正。',
  keyFacts:['ZX1000i+ 系列具全幅域可調 Media Sensor。','官方產品頁提供 ZX1200i+/ZX1300i+/ZX1600i+ 紙張校正影片。','203/300/600 dpi 共用家族機構概念，但列印參數不可直接跨 dpi 套用。'],
  engineering:['Sensor 可調代表「位置錯」本身就是重要故障原因。','若正常紙材也無法校正，再進 Sensor/線束/主板；不要只反覆按校正。'],
  verify:['FEED 一次一張','連續 50 張不跳標','重開機後定位穩定'],
  flow:[
    ['確認 Media 類型','Gap / Black Mark / Continuous 與 Driver 設定一致。',['正確','已修正'],'先排設定。'],
    ['確認可調 Sensor 位置','讓實際 Gap/Mark 通過感應範圍。',['位置正確','位置已修正'],'ZX1000i+ 為全幅域可調。'],
    ['依官方校正流程做紙張校正','使用目前實際客戶耗材。',['成功','仍失敗'],'不要用別卷紙校完再換回。'],
    ['清潔 Sensor / Platen','清紙屑、殘膠、粉塵。',['恢復正常','仍異常'],'清潔後再校正一次。'],
    ['正常耗材交叉','換已知正常 Gap 紙比較。',['正常耗材可校正','兩種都失敗'],'切開耗材與機器問題。'],
    ['硬體收斂','斷電查 Sensor、線束、接頭與供電。',['Sensor/線束方向高','主板方向高','已修復'],'主板最後。']]
});

addRepairKB({
  id:'godex-g500-dual-sensor-net',brand:'GoDEX',models:['G500+','G530+','G500','G530'],category:'感應器／網路／桌上型',
  title:'G500/G500+ 系列｜雙 Sensor、抓不到標籤、NetSetting、網路印不到',severity:'實用',sources:['godex_g500'],
  summary:'G500+ 系列資料顯示具雙 Sensor 紙張偵測架構，並提供 Ethernet NetSetting 工具。現場要把「抓不到紙」與「電腦網路印不到」分成兩套問題處理。',
  keyFacts:['雙 Sensor 架構用來提升不同紙材的偵測能力。','NetSetting / Ethernet 工具用於網路設定，不應用重做 Media Calibration 來處理 IP 問題。'],
  engineering:['先印本機測試/FEED；本機定位正常而網路不印，優先回 Windows Port/IP。','本機連 FEED 都抓不準才走 Sensor/Calibration。'],
  verify:['FEED 定位正常','IP 可 Ping','Windows Test Page 可印','實際軟體列印正常'],
  flow:[
    ['先做本機 FEED / Test','不經電腦確認機器本身。',['本機正常','本機也跳標/抓不到'],'先切問題。'],
    ['本機異常：查 Media Sensor','確認紙材、Sensor 路徑、清潔並重新校正。',['已修復','仍異常','不適用'],'雙 Sensor 都要留意。'],
    ['網路異常：印/查目前 IP','先確認 Link 與 IP。',['有 IP','無 IP/Link'],'先處理網路層。'],
    ['使用 NetSetting / Ethernet 工具','核對 IP/Subnet/Gateway 與 DHCP/Static。',['正常','已修正'],'設定後再 Ping。'],
    ['Windows Port','Ping 正常後核對 Standard TCP/IP Port / Queue。',['已修復','仍不印'],'不要直接換主板。'],
    ['硬體收斂','Link 不起或所有電腦都無法辨識時，再查 RJ45/介面板/主板。',['介面方向高','已修復'],'先排線材與交換器。']]
});

addRepairKB({
  id:'toshiba-bex4-threshold-sensor',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T'],category:'感應器／Threshold',
  title:'B-EX4T 系列｜Threshold、Reflective / Transmissive Sensor、Paper Jam / 跳標',severity:'高價值',sources:['toshiba_bex4'],
  summary:'B-EX4T1 文件對 Sensor Threshold 很完整：Printer 用 Print Area 與 Gap/Black Mark 的電壓差判斷起印位置；預印刷太深會干擾，Threshold 不合適可能造成 Paper Jam。若 Threshold 後仍異常，可進 Sensor Adjust 註冊 REFLECT / TRANS / PE 的基準。',
  keyFacts:['REFLECT：將 Tag paper 的 print area 放在 reflective sensor 上，註冊 print area level。','TRANS：移除部分標籤，讓 backing paper 位於 transmissive sensor 上，註冊 label gap level。','PE REFL./TRANS：移除 Media，註冊 no-media level。','Threshold 目標是讓 Peak 與 Baseline 之間有可辨識界線。'],
  engineering:['預印刷深色區不能剛好通過 Sensor，否則可能被誤判成黑標/Gap。','不要拿別種紙材的 Threshold 直接套客戶紙。','Sensor Adjust 後仍無電壓差，再進 Sensor/線束。'],
  verify:['無 Paper Jam 誤報','FEED 一次一張','預印刷區通過時不誤判','連續 50 張定位穩定'],
  flow:[
    ['確認 Sensor Mode','Gap 用 Transmissive；Black Mark 用 Reflective。',['正確','已修正'],'先選對模式。'],
    ['檢查預印刷/黑色區域','確認 Sensor 路徑沒有被圖案干擾。',['沒有干擾','有干擾，已移位/調整'],'預印刷是典型干擾源。'],
    ['執行 Threshold Setting','觀察 Peak / Baseline / Threshold 結果。',['OK','仍失敗'],'先做 Threshold。'],
    ['REFLECT / TRANS Sensor Adjust','依紙材註冊 print area 或 backing/gap level。',['完成','無法取得有效差異'],'依文件流程。'],
    ['PE Sensor Adjust','移除 Media，註冊 no-media level。',['完成','異常'],'建立 Paper Empty 基準。'],
    ['硬體收斂','仍讀值異常時查 Sensor、線束、接頭與 Sensor PCB。',['Sensor/線束方向高','主板方向高','已修復'],'留存調整前後電壓/結果。']]
});

addRepairKB({
  id:'toshiba-bex4-ribbon-sensor',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T'],category:'碳帶／感應器',
  title:'B-EX4T 系列｜Ribbon End 誤報、Ribbon Sensor Level、明明有碳帶卻停機',severity:'深度維修',sources:['toshiba_bex4'],
  summary:'B-EX4T1 Sensor Adjust Menu 明確包含 RIBBON，作用是把 Ribbon 的電壓基準註冊到 Ribbon End Sensor。遇到「碳帶明明還有卻 Ribbon End」時，先確認 Ribbon 路徑與 Sensor 基準，再查硬體。',
  keyFacts:['System Mode → SENSOR ADJUST 內含 RIBBON 項目。','RIBBON 項目用於註冊 Ribbon End Sensor 的 Ribbon voltage level。','同一台機器若換不同透明度/背材的 Ribbon 後才出錯，應先檢查偵測條件與基準。'],
  engineering:['先排 Ribbon 安裝與 Print Mode，再做 Sensor 基準；不要第一步就換主板。','若註冊過程讀值固定或完全不變，才提高 Ribbon Sensor / 線束嫌疑。'],
  verify:['有 Ribbon 時不誤報 End','真正 Ribbon End 能被偵測','重開機後狀態正常','連續列印穩定'],
  flow:[
    ['確認 Print Mode / Ribbon 安裝','熱轉印模式、碳帶路徑與張力正確。',['正確','已修正'],'先排耗材安裝。'],
    ['觀察故障時機','換 Ribbon 才發生，還是任何 Ribbon 都發生。',['換特定 Ribbon 才發生','所有 Ribbon 都發生'],'有助判斷耗材/硬體。'],
    ['進 SENSOR ADJUST → RIBBON','依該機型操作規範註冊 Ribbon level。',['完成且正常','無法取得有效讀值'],'記錄結果。'],
    ['正常 Ribbon 交叉','使用已知正常碳帶比較。',['正常 Ribbon 可用','仍誤報'],'切耗材因素。'],
    ['斷電查 Ribbon Sensor / 線束','接頭、線材、污染、機構遮擋。',['找到異常','外觀正常'],'不要帶電插拔。'],
    ['主板輸入最後判斷','正常 Sensor/線束交叉後仍異常才提高主板方向。',['主板方向高','已修復'],'保留量測。']]
});

addRepairKB({
  id:'toshiba-ba410-maintenance',brand:'TOSHIBA',models:['BA410T','BA420T'],category:'保養／Cutter／Driver',
  title:'BA410T/BA420T｜Printhead / Platen / Sensor 清潔、Cutter、TPCL Driver',severity:'保養高頻',sources:['toshiba_ba410'],
  summary:'Toshiba TEC 官方下載頁持續提供 BA410T/BA420T 的 TPCL Driver、Setting Tool 與 Manual；Owner Manual 將 Printhead/Platen/Sensors、Cutter、Strip Module 清潔與 Error Troubleshooting 分開。現場問題先把耗材路徑/清潔與 PC Driver 層切開。',
  keyFacts:['TPCL Driver 版本更新前，官方提醒先匯出既有紙張/Driver 設定，再移除舊版。','同一台 PC 上不建議混用不同版本 TPCL Driver。','設定工具可用於 BA410T/BA420T，但部分版本依 Firmware 版本有條件。'],
  engineering:['列印品質差先清 Head/Platen/Sensor；Windows 不印先查 TPCL Driver/Port。','Cutter 問題先斷電清殘膠/紙屑，再查模組；不要把 Cutter 卡住當成主板故障。'],
  verify:['本機 FEED/Test 正常','Windows Test Page 正常','連續列印品質穩定','Cutter/Strip 實際循環正常'],
  flow:[
    ['先分硬體或電腦端','本機 FEED/Test 是否正常。',['本機正常','本機也異常'],'本機正常先查 Driver/Port。'],
    ['清潔 Head / Platen / Sensor','依 Manual 清潔。',['恢復正常','仍異常'],'不要用尖銳工具。'],
    ['Cutter/Strip 分流','若是出紙/切刀問題，清殘膠與紙屑後再測。',['正常','仍卡/不動','不適用'],'斷電處理。'],
    ['TPCL Driver','核對 Driver 版本與 Port；升級前備份紙張設定。',['已修復','仍異常'],'避免不同版本混裝。'],
    ['Setting Tool / Firmware 檢查','確認工具與目前 Firmware 相容。',['正常','需升級/調整'],'記錄原版本。'],
    ['硬體收斂','本機仍異常才往 Sensor、Motor、介面板/主板。',['找到硬體異常','已修復'],'先做交叉測試。']]
});

addRepairKB({
  id:'sato-cl4nx-ribbon-near-end',brand:'SATO',models:['CL4NX Plus'],category:'碳帶／感應器',
  title:'CL4NX Plus｜Ribbon Near End、碳帶快用完警告、Ribbon Sensor',severity:'實用',sources:['sato_clnx_ribbon'],
  summary:'CL4NX Plus 的 Ribbon Near End 是由 Ribbon Supply Spindle 內的 Sensor 偵測；原廠說明剩餘量約低於 15 m 時可能出現 Near End，但這只是參考，會受 Ribbon 厚度與 Sensor reading 影響。Near End 是警告，不會直接停止列印。',
  keyFacts:['Near End 偵測條件約為剩餘 Ribbon 低於 15 m / 直徑約 36 mm，但僅供參考。','偵測時機會因 Ribbon thickness 與 Sensor reading 改變。','啟用 Ribbon Near End 時只顯示 Warning，Printing 不停止。'],
  engineering:['客戶說「有警告但還能印」要先判斷是不是 Near End 而非 Ribbon End。','若新 Ribbon 一裝上就 Near End，才查 Ribbon 規格、Supply spindle Sensor、髒污或線路。'],
  verify:['新 Ribbon 不誤報 Near End','接近尾端才出現警告','警告狀態不影響正常列印'],
  flow:[
    ['確認訊息是 Near End 還是 Ribbon End','兩者影響不同。',['Near End','Ribbon End','其他'],'Near End 不會直接停印。'],
    ['確認 Printing Mode','只有 Use Ribbon 模式才會出現相關設定。',['正確','已修正'],'先排模式。'],
    ['換新 Ribbon 交叉','新 Ribbon 是否仍立即 Near End。',['新 Ribbon 正常','新 Ribbon 仍誤報'],'切耗材與 Sensor。'],
    ['檢查 Supply Spindle / Sensor','清潔並確認 Ribbon 安裝/Spindle 狀態。',['恢復正常','仍誤報'],'不要任意改未知門檻。'],
    ['硬體收斂','斷電查 Ribbon Sensor 線束/接頭，再交叉 Sensor。',['Sensor/線束方向高','主板方向高','已修復'],'主板最後。']]
});

addRepairKB({
  id:'sato-cl4nx-stop-cut-offset',brand:'SATO',models:['CL4NX Plus'],category:'位置／Cutter',
  title:'CL4NX Plus｜停止位置 / Cut Position 偏掉、每張切的位置不對',severity:'實用',sources:['sato_clnx_offset','sato_clnx_cal'],
  summary:'SATO 官方對 Print Stop / Cut Position Shift 的排查順序很明確：先確認 Media/Ribbon loading、Sensor Type、Media stop position (Offset)，再清 Platen roller 與 Media Sensor。不要一看到切歪就直接調 Cutter 機構。',
  keyFacts:['Media / Ribbon loading 錯誤會造成 stop/cut position 偏移。','Sensor Type 必須與實際 Media 相容。','Offset 設定直接影響 stop position。','Platen / Media Sensor 污染也是官方列出的原因。'],
  engineering:['固定偏移優先 Offset；越印越偏優先 Calibration / Media Type / Sensor。','清潔與校正後仍每次固定同量偏移，再調 Offset；不要同時改多個參數。'],
  verify:['每張 Cut 位置一致','FEED 停位一致','連續 50 張無累積漂移','重開機後設定保留'],
  flow:[
    ['判斷偏移型態','每張固定偏同樣距離，還是越印越偏。',['固定偏移','累積漂移'],'先切 Offset 與 Calibration。'],
    ['確認 Media/Ribbon Loading','走紙路徑、導紙與 Ribbon 正確。',['正確','已修正'],'官方第一層。'],
    ['確認 Sensor Type','Gap / I-Mark 對應正確。',['正確','已修正'],'錯 Sensor Type 會定位錯。'],
    ['固定偏移：調 Offset','小幅調整 Media stop / Cut position。',['改善','無改善'],'一次只改一個變數。'],
    ['累積漂移：重新 Calibration','重新做 Gap/I-Mark calibration。',['改善','仍異常'],'再查 Sensor。'],
    ['清潔 Platen / Media Sensor','清潔後再做連續測試。',['已修復','仍異常'],'最後才查 Cutter 機構。']]
});
