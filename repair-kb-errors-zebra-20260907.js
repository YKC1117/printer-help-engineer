'use strict';

// Zebra ZT600 官方警報／錯誤訊息層。
// 來源以 ZT610/ZT620 User Guide 為主；精確 Pin、電壓與板級量測仍以 Service Manual 為準。

addRepairKB({
  id:'zebra-zt600-alert-head-open',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜PRINTHEAD OPEN／印字頭已關仍報 Head Open',severity:'高頻',sources:['zebra_zt600'],
  summary:'官方將原因分成印字頭未完全關閉，以及 Printhead Open Sensor 未正常工作。工程上應先確認機構真的鎖到底，再查感應器、觸發機構、線束與主板輸入。',
  keyFacts:['關閉印字頭後仍報錯，不代表一定是主板。','先確認鎖定機構是否真的讓 Sensor 進入已關閉狀態。','Sensor/線束交叉後仍固定錯誤，才提高主板輸入嫌疑。'],
  engineering:['斷電檢查 Sensor、觸發片與線束，不帶電插拔接頭。','若機構有鬆動或鎖扣不到位，先修機構再判 Sensor。'],
  verify:['開關印字頭 20 次狀態都正確','列印中不再誤報 Head Open','重開機後正常'],
  flow:[['確認印字頭鎖定','重新開啟後確實關到底，確認鎖扣與壓力機構沒有卡住。',['正常','機構未鎖到底'],'機構問題先修。'],['觀察錯誤是否隨開關改變','開啟/關閉印字頭時狀態是否有切換。',['有切換','完全不變'],'完全不變提高 Sensor/線束嫌疑。'],['斷電檢查 Sensor/觸發片','清潔並確認 Sensor 固定、觸發位置與接頭。',['正常','已修復'],'不要硬折觸發片。'],['交叉線束/Sensor','可行時使用正常件交叉。',['Sensor/線束異常','仍異常'],'仍異常再往板端。'],['主板輸入收斂','依 Service Manual 查 Sensor input 與板端。',['主板方向高','其他原因'],'記錄結果。']]
});

addRepairKB({
  id:'zebra-zt600-alert-media-out',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜MEDIA OUT／明明有紙卻報紙張用盡',severity:'高頻',sources:['zebra_zt600','zebra_jg','zebra_cal'],
  summary:'官方列出的典型原因包括未裝紙、裝紙錯誤、Media Sensor 對位錯誤，以及 Non-Continuous/Continuous 設定不符。先修紙材與 Sensor 設定，再校正。',
  keyFacts:['缺口／孔洞紙必須讓 transmissive Sensor 對準實際缺口。','連續紙卻設成非連續紙會造成錯誤判讀。','Sensor Profile 能協助判斷 gap/mark 是否真的被看到。'],
  engineering:['先換一卷已知正常標籤交叉。','Profile 幾乎無波形變化才提高 Sensor/線束嫌疑。'],
  verify:['FEED 一次一張','50 張無 Media Out','重開機後仍能抓到標籤'],
  flow:[['確認紙張裝法與 Media Type','Gap/Mark/Continuous 與實際紙材一致。',['正確','已修正'],'先排設定。'],['確認 Sensor 位置','特殊缺口/孔洞/黑標必須通過 Sensor。',['正確','已重新定位'],'位置錯會一直校不準。'],['清潔 Sensor/走紙路徑','清紙屑、殘膠與預印刷干擾。',['完成','清潔後正常'],'完成後再校正。'],['重新 Calibration','依原廠 Media/Ribbon Calibration。',['成功','失敗'],'失敗印 Sensor Profile。'],['Sensor Profile/硬體收斂','比較 Label/Gap/Mark 變化，必要時查 Sensor/線束。',['波形正常','Sensor/線束方向高'],'主板最後。']]
});

addRepairKB({
  id:'zebra-zt600-alert-ribbon-out',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜RIBBON OUT／碳帶明明還有卻報用盡',severity:'高頻',sources:['zebra_zt600','zebra_jg','zebra_cal'],
  summary:'官方指出 Thermal Transfer 模式下，碳帶未裝、裝法不正確、Ribbon Sensor 未偵測、Media 擋住感應區或未針對目前紙碳帶校正，都可能造成 Ribbon Out。',
  keyFacts:['先確認 Print Method 是 Thermal Transfer。','Ribbon 在印字頭下方應沿正確路徑回到機器後側。','官方建議先重新 Calibration，而不是直接換 Ribbon Sensor。'],
  engineering:['若 Sensor Profile 的 RIBBON 線固定不變，再查 Sensor/線束。','現場單機讀值不能當成所有 ZT600 的標準電壓。'],
  verify:['裝碳帶後不再誤報','碳帶用完時能正確報警','連印 100 張正常'],
  flow:[['確認 Print Method','Thermal Transfer/Direct Thermal 是否與耗材一致。',['正確','已修正'],'設定錯誤很常見。'],['確認碳帶路徑','碳帶寬度、墨面與感應區路徑正確。',['正常','已重裝'],'先重裝。'],['執行 Calibration','針對目前紙＋碳帶重新校正。',['成功','仍報錯'],'仍報錯進 Profile。'],['印 Sensor Profile','觀察 RIBBON 讀值是否隨有/無碳帶變化。',['有變化','固定／變化極小'],'固定值提高硬體嫌疑。'],['Sensor/線束/板端','斷電查接頭並交叉正常 Sensor。',['Sensor/線束異常','主板方向高','已修復'],'板端最後。']]
});

addRepairKB({
  id:'zebra-zt600-alert-ribbon-in',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜RIBBON IN／Direct Thermal 卻偵測到碳帶',severity:'常見',sources:['zebra_zt600'],
  summary:'官方說明 Direct Thermal 模式不需要 Ribbon；若裝有 Ribbon 會顯示警示。若沒有 Ribbon 仍持續顯示，應重新校正並檢查 Ribbon Sensor。',
  keyFacts:['Direct Thermal 有裝 Ribbon 時警示不一定代表硬體故障。','若實際要熱轉印，應改回 Thermal Transfer。','無 Ribbon 仍警示，才需要往 Calibration/Sensor 深入。'],
  engineering:['先確認客戶實際耗材，不要只看 Driver 名稱。'],
  verify:['Direct Thermal 無 Ribbon 時無警示','Thermal Transfer 可正常辨識 Ribbon'],
  flow:[['確認耗材','實際使用熱感紙還是碳帶＋標籤。',['Direct Thermal','Thermal Transfer'],'決定設定。'],['確認 Print Method','模式與耗材一致。',['正確','已修正'],'先修設定。'],['移除不必要 Ribbon','Direct Thermal 移除碳帶。',['正常','仍警示'],'仍警示校正。'],['重新 Calibration','校正 Ribbon/Media Sensor。',['正常','仍異常'],'再查 Sensor。'],['硬體收斂','查 Ribbon Sensor/線束。',['已修復','主板方向高'],'板端最後。']]
});

addRepairKB({
  id:'zebra-zt600-alert-head-temp',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜PRINTHEAD OVER TEMP／UNDER TEMP／溫度訊息反覆切換',severity:'高',sources:['zebra_zt600'],
  summary:'官方指出 Over Temperature 會暫停列印直到降溫；若高低溫訊息反覆切換，Printhead data cable 接觸或 Printhead thermistor 故障是重要方向。',
  keyFacts:['真正過熱時先讓印字頭降溫，降低 Darkness/速度負載。','高低溫訊息反覆切換時，官方特別指出 Head data cable 與 thermistor。','Printhead 很燙時不要立即觸碰。'],
  engineering:['關機冷卻後再斷電檢查 Head cable。','若更換 Head，換前先確認板端與線束，避免新頭再次受損。'],
  verify:['冷機與熱機均無錯誤','連續列印 30 分鐘不中斷','溫度訊息不再反覆'],
  flow:[['判斷真過熱或假訊息','觀察是否高負載列印後發生，或冷機立即報錯。',['高負載後','冷機即報／高低溫切換'],'後者偏 Sensor/線路。'],['降低負載並冷卻','降低 Darkness/速度並改善散熱。',['恢復正常','仍異常'],'持續異常查線路。'],['斷電檢查 Head cable','確認 Data/Power cable 插接與損傷。',['正常','已修復'],'重新測。'],['交叉 Printhead','可行時正常頭交叉。',['Head/thermistor方向高','仍異常'],'仍異常進板端。'],['主板收斂','依 Service Manual 查溫度輸入/驅動。',['主板方向高','其他'],'記錄量測。']]
});

addRepairKB({
  id:'zebra-zt600-alert-cutter',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜CUTTER ERROR／刀片停在走紙路徑',severity:'高',sources:['zebra_zt600'],
  summary:'官方對 Cutter Error 的核心處置是斷電、拔電源、檢查刀片路徑與碎屑並依規範清潔 Cutter Module。工程層再分卡料、Home/位置感應、Motor/傳動與 Cutter Board。',
  keyFacts:['刀片銳利，先斷電再清理。','不要在卡刀時用手硬推刀片。','清潔後仍無法回 Home 才進 Motor/Sensor/Board。'],
  engineering:['先確認標籤厚度、黏膠與 Cut mode 適合。','拆 Cutter 模組前拍照記錄線束與安裝位置。'],
  verify:['連切 100 張無卡刀','冷開機 Cutter 初始化正常','切位一致'],
  flow:[['斷電檢查 Cutter Path','移除碎紙、殘膠與纏繞標籤。',['已清除','無異物'],'安全第一。'],['手動機構檢查','依維修程序確認刀片/傳動是否卡滯。',['順暢','卡滯'],'卡滯先修機構。'],['確認 Home/Position Sensor','檢查 Sensor、觸發位置與線束。',['正常','異常'],'Sensor 異常先處理。'],['Motor/驅動交叉','依 Service Manual 測 Cutter Motor/Board。',['Motor/Board方向高','正常'],'避免猜 Pin。'],['修復後耐久測試','連續切標。',['通過','仍卡'],'仍卡回查耗材/機構。']]
});

addRepairKB({
  id:'zebra-zt600-alert-memory',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜OUT OF MEMORY／格式或物件載入失敗',severity:'中',sources:['zebra_zt600'],
  summary:'官方建議釋放記憶體、縮小不必要的 Print Width，並確認資料沒有被送往不存在或不可用的裝置。若問題只出現在特定標籤格式，先查格式資源而不是換主板。',
  keyFacts:['特定標籤才發生，優先查圖檔、字型、格式大小與 Print Width。','設定 Print Width 遠大於實際標籤會浪費記憶體。','所有格式都持續 Out of Memory 才提高韌體/記憶體硬體方向。'],
  engineering:['保存有問題的 ZPL/格式作為重現案例。'],
  verify:['原問題標籤可連印','重開機後仍正常','不同格式均可印'],
  flow:[['確認是否只有特定格式','用簡單 Self Test/小格式交叉。',['只有特定格式','全部都發生'],'只有特定格式偏資料。'],['縮減格式資源','降低不必要 Print Width、圖片/字型與下載物件。',['恢復正常','仍異常'],'保留原檔。'],['確認儲存裝置/目的地','資料是否指向未安裝或不可用裝置。',['正常','已修正'],'再測。'],['清理暫存/重新啟動','安全清理與重開。',['正常','仍異常'],'持續異常進韌體/硬體。'],['韌體/主板收斂','依原廠支援流程處理。',['已修復','主板方向高'],'不要先換板。']]
});

addRepairKB({
  id:'zebra-zt600-alert-head-element',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜PRINTHEAD ELEMENT OUT／固定壞點／Head Error',severity:'高',sources:['zebra_zt600'],
  summary:'官方指出 Printhead element 不再工作時，若壞點位置影響列印就需要更換 Printhead。工程上換頭前仍應先清潔並用固定測試圖確認缺線位置是否固定。',
  keyFacts:['固定同一位置白線是重要特徵。','清潔後仍固定缺線，Head element 嫌疑大幅提高。','換 Head 前檢查 Head cable 與接頭。'],
  engineering:['條碼區壞點不能只靠提高 Darkness 掩蓋。','更換後必須用條碼掃描器驗證。'],
  verify:['測試圖無固定缺線','條碼可穩定掃描','連印 100 張一致'],
  flow:[['印固定測試圖','確認缺線是否固定在相同 X 位置。',['固定','不固定'],'不固定查耗材/Platen。'],['清潔 Printhead/Platen','IPA 清潔並重測。',['恢復','仍固定'],'仍固定進硬體。'],['檢查 Head cable','斷電檢查接頭與折損。',['正常','已修復'],'再測。'],['更換/交叉 Printhead','使用正確規格正常件。',['恢復','仍異常'],'仍異常查驅動。'],['板端驅動收斂','依 Service Manual 查 Head Driver。',['主板方向高','其他'],'記錄。']]
});

addRepairKB({
  id:'zebra-zt600-alert-network-lights',brand:'Zebra',models:['ZT610','ZT620'],category:'錯誤碼／警報',
  title:'ZT610/ZT620｜NETWORK 指示燈判讀／Link 有無與網路錯誤',severity:'常見',sources:['zebra_zt600'],
  summary:'官方指示燈可先判斷 Ethernet Link 與網路錯誤：無 Link、10/100 Base-T Link、或 Network Error。工程師可先利用燈號切開線材/交換器與 Printer IP/Port 問題。',
  keyFacts:['Network 燈不亮先查實體 Link。','有 Link 但 Ping 不通，再查 IP/Subnet/DHCP。','Ping 通但不能印，優先查 Windows Port/Queue/Protocol。'],
  engineering:['不要看到「網路印不到」就直接換網卡。'],
  verify:['Link 穩定','Ping 連續無丟包','Windows/BarTender 可正常列印'],
  flow:[['看 Network 燈與交換器 Link','確認是否建立實體連線。',['有 Link','無 Link'],'無 Link 換線/Port。'],['印 Network Config','確認 IP/Subnet/Gateway。',['正確','已修正'],'避免舊 DHCP IP。'],['Ping 測試','從同網段電腦連續 Ping。',['正常','不通／丟包'],'不通查網路設定。'],['Windows Port/Queue','Ping 通但不印時查 Standard TCP/IP Port。',['正常','已修正'],'清卡住 Queue。'],['硬體收斂','跨線材/交換器/電腦仍 Link 異常，再查 NIC/主板。',['NIC方向高','已修復'],'最後才硬體。']]
});
