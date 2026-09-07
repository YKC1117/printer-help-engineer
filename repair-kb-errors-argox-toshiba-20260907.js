'use strict';

// Argox P4 / Toshiba B-EX4T1 官方錯誤狀態與工程分流。

addRepairKB({
  id:'argox-p4-paper-jam-media-out',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜Paper Jam／Media Out／Paper End',severity:'高頻',sources:['argox_p4'],
  summary:'P4 系列狀態燈可指出 Paper Jam、Media Out 與 Paper End。排查先從實際卡紙、Media 安裝、Sensor Type/位置與 Calibration 開始。',
  keyFacts:['Amber 類狀態可能代表 Paper Jam、Media Out 或 Paper End。','先分真卡紙與 Sensor/校正誤判。','換紙後重新校正比直接換 Sensor 更合理。'],
  engineering:['特殊底紙先用正常耗材交叉。'],
  verify:['FEED 一次一張','連印 50 張無 Jam/Media Out','重開機正常'],
  flow:[['斷電檢查走紙路徑','確認是否有真 Jam、殘膠或黏標。',['無 Jam','已清除'],'再測。'],['確認 Media 安裝/Guide','紙張路徑與 Guide 不過緊。',['正常','已修正'],'再測。'],['確認 Sensor Type/位置','Gap/Black Mark 與耗材一致。',['正確','已修正'],'再校正。'],['執行 Calibration','依 P4 手冊流程。',['成功','失敗'],'失敗換耗材交叉。'],['Sensor/線束收斂','依 Service 資料查 Sensor。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'argox-p4-ribbon-end-error',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜Ribbon End／Ribbon Error／碳帶誤報',severity:'高頻',sources:['argox_p4'],
  summary:'P4 熱轉印機型的 Amber 狀態可表示 Ribbon End 或 Ribbon Error。先確認 Ribbon 是否用完、裝法與回收軸，再查 Ribbon Sensor。',
  keyFacts:['Ribbon End 與 Ribbon Error 要先分耗材用完或路徑異常。','回收軸不轉/打滑可能讓錯誤持續。','高 Darkness 造成破碳時不要誤判 Ribbon Sensor。'],
  engineering:['先用正常 Ribbon 交叉。'],
  verify:['有 Ribbon 不誤報','連印 100 張回收穩定','真正用完時正確停機'],
  flow:[['確認 Ribbon 是否用完/破裂','看實際 Ribbon 狀態。',['正常','已更換'],'先排耗材。'],['確認 Ribbon 路徑/墨面','裝法與張力正確。',['正確','已重裝'],'再測。'],['確認 Take-up 軸','列印時是否穩定轉動。',['正常','打滑/不轉'],'先修機構。'],['Calibration/清潔 Sensor','依手冊校正並清潔。',['正常','仍異常'],'進硬體。'],['Sensor/線束收斂','斷電查 Sensor/接頭。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'argox-p4-hw-error',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜H/W Error／Printhead、RS-232、Cutter、RTC 分流',severity:'高',sources:['argox_p4'],
  summary:'P4 手冊把 H/W Error 範圍列到 Printhead broken、RS-232 communication error、Cutter error，以及 RTC battery low。工程師第一步不是換主板，而是先依當下功能分流。',
  keyFacts:['同一 H/W Error 可能對應完全不同模組。','有 Cutter 才查 Cutter；RS-232 未使用時不要被通信分支誤導。','RTC 電池低與列印引擎故障不同。'],
  engineering:['先記錄錯誤發生時正在做的功能。'],
  verify:['原功能可重現並修復','Self Test 正常','重開機無 H/W Error'],
  flow:[['確認錯誤發生情境','開機、自測、RS-232、切刀、RTC 哪一類。',['Printhead','RS-232','Cutter','RTC/其他'],'先分流。'],['做模組最小測試','只測該模組，不帶其他功能。',['正常','失敗'],'失敗才深入。'],['檢查線束/接頭','斷電檢查相關模組。',['正常','已修復'],'再測。'],['交叉模組','可行時用正常 Head/Cutter/線材。',['模組方向高','仍異常'],'仍異常進板端。'],['主板收斂','依 Service Manual。',['板端方向高','其他'],'記錄。']]
});

addRepairKB({
  id:'argox-p4-command-error',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜Command Error／只有特定標籤工作會紅燈',severity:'中',sources:['argox_p4'],
  summary:'P4 手冊將 Command Error 與指令/資料存取異常、EEPROM backup 讀寫問題等列在一起。若只在特定格式出現，先保存工作並用最小格式交叉。',
  keyFacts:['只有特定工作錯時資料端優先。','Self Test 正常可先排除基本 Print Engine。','所有合法最小格式都錯才提高韌體/EEPROM/板端方向。'],
  engineering:['保留原始 PPLA/PPLB/PPLZ/Driver 輸出資料。'],
  verify:['Self Test 正常','最小格式正常','原工作修正後可連印'],
  flow:[['Self Test','Printer 本機先測。',['正常','異常'],'異常走 Printer 硬體。'],['最小列印格式','只送基本文字/條碼。',['正常','失敗'],'正常偏原工作。'],['更換 Driver/語言模式交叉','確認 Printer language 與資料一致。',['正常','仍錯'],'仍錯進韌體。'],['Factory/設定備份後重置','依原廠流程。',['恢復','仍錯'],'持續才查 EEPROM/板端。'],['板端收斂','依維修資料。',['EEPROM/主板方向高','其他'],'最後。']]
});

addRepairKB({
  id:'argox-p4-top-cover-open',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜Top Cover Open／蓋子關了仍報開啟',severity:'常見',sources:['argox_p4'],
  summary:'P4 狀態可表示列印模組/Top Cover 在開機或列印期間開啟。若確實關閉仍持續，查 Cover/Head Open 觸發機構、Sensor 與線束。',
  keyFacts:['先確認 Print Module 真正鎖到底。','狀態不隨開關變化時才偏 Sensor。'],
  engineering:['不要用外力壓蓋子當永久解法。'],
  verify:['開關 Cover 20 次正常','列印中不誤報'],
  flow:[['重新關閉 Print Module/Cover','確認卡榫與鎖點。',['正常','仍錯'],'仍錯查觸發。'],['觀察開關狀態變化','手動開/關。',['會變','不變'],'不變偏 Sensor。'],['檢查觸發片/Sensor','清潔與固定。',['正常','已修復'],'再測。'],['線束交叉','斷電檢查。',['異常','正常'],'正常才板端。'],['板端收斂','依 Service Manual。',['板端方向高','其他'],'最後。']]
});

addRepairKB({
  id:'argox-p4-tph-high-temp',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'錯誤碼／警報',
  title:'Argox P4｜TPH High Temperature／印一陣子停機',severity:'高',sources:['argox_p4'],
  summary:'P4 狀態燈可表示 TPH high temperature。先降低 Darkness/速度與列印負載，確認通風；冷機立即報高溫才往 Head Sensor/線束/板端收斂。',
  keyFacts:['高 Darkness 與高負載會增加 Head 溫度。','冷機即報過熱比正常列印後才報更偏感測/線路。','白碳帶案例中不要靠無限制提高濃度補品質。'],
  engineering:['讓 Printhead 冷卻後再碰觸/拆裝。'],
  verify:['冷機/熱機均正常','連印 30 分鐘不過熱','品質仍符合需求'],
  flow:[['判斷發生時機','冷機立刻報還是長時間列印後。',['冷機即報','負載後才報'],'前者偏感測。'],['降低 Darkness/速度','減少熱負載。',['恢復','仍過熱'],'仍過熱檢查散熱。'],['檢查通風/Head 清潔','確保散熱與接觸正常。',['正常','已改善'],'再測。'],['檢查 Head Cable/Sensor','斷電檢查。',['異常','正常'],'正常才板端。'],['板端收斂','依維修資料查溫度輸入。',['板端方向高','其他'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-head-open',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜HEAD OPEN／關閉後仍報 Printhead Open',severity:'高頻',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'B-EX4 手冊說明 Online 時 Head Assembly 開啟，或在 Head Open 狀態嘗試 Feed/Print 會報 HEAD OPEN。若關閉後仍報錯，再進 Head Open Sensor/機構。',
  keyFacts:['先關閉 Head Assembly，再按 RESTART。','確實關閉仍報錯才是 Sensor/觸發方向。'],
  engineering:['斷電檢查 Head Open Sensor/線束。'],
  verify:['開關 Head 20 次狀態正確','RESTART 後可正常列印'],
  flow:[['重新關閉 Head Assembly','確認鎖點與壓力機構。',['正常','仍報錯'],'仍錯查 Sensor。'],['按 RESTART','依手冊清除狀態。',['恢復','仍錯'],'進硬體。'],['檢查觸發機構/Sensor','清潔/固定。',['正常','已修復'],'再測。'],['檢查線束','斷電查接頭。',['正常','異常'],'修復再測。'],['板端收斂','依 Service Manual。',['板端方向高','其他'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-paper-jam',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜PAPER JAM／不一定真的卡紙',severity:'高頻',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'B-EX4 官方列出的 Paper Jam 原因包含實際卡紙、裝紙錯誤、選錯 Media Sensor、Black Mark Sensor 未對準、Media Size 與程式設定不符，以及 Sensor Calibration 不正確。',
  keyFacts:['Paper Jam 可能是尺寸/Sensor 設定，不只是真卡紙。','Black Mark Sensor 必須實際對準黑標。','Media Size 與軟體不一致會讓走紙判斷錯誤。'],
  engineering:['先排設定再判 Motor/Drive。'],
  verify:['RESTART 後正常','FEED 一次一張','100 張無 Jam'],
  flow:[['斷電清除實際 Jam','清 Platen 與走紙路徑。',['無 Jam','已清除'],'再測。'],['確認 Media Sensor 類型/位置','Gap/Black Mark 對準。',['正確','已修正'],'再測。'],['確認 Media Size','Printer/Driver/程式尺寸一致。',['正確','已修正'],'再校正。'],['Threshold/Calibration','依手冊設定 Sensor threshold。',['成功','失敗'],'失敗進硬體。'],['Sensor/Motor 收斂','查 Sensor/Drive。',['Sensor方向高','Motor/Drive方向高','其他'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-no-paper',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜NO PAPER／有紙仍報缺紙',severity:'高頻',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'官方列出 Media 用完、裝紙不正確、Sensor Position 錯誤、Sensor 未針對目前 Media Calibration，以及 Media Slack。',
  keyFacts:['紙張鬆弛也會造成問題。','Sensor Position 與 Calibration 都要檢查。','先按 RESTART 前把根因處理掉。'],
  engineering:['特殊紙材用正常紙交叉。'],
  verify:['FEED 正常','50 張無 NO PAPER','重開機正常'],
  flow:[['確認 Media/Slack','補紙並收緊鬆弛。',['正常','已修正'],'再測。'],['確認裝紙/Guide','路徑正確。',['正確','已重裝'],'再測。'],['確認 Sensor Position','對準 Gap/Mark。',['正確','已調整'],'再校正。'],['Threshold/Calibration','依手冊設定。',['成功','失敗'],'失敗查 Sensor。'],['Sensor/線束收斂','依 Service Manual。',['Sensor方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-ribbon-error',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜RIBBON ERROR／NO RIBBON',severity:'高頻',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'官方將 RIBBON ERROR 原因列為 Ribbon 未正確送入、未安裝、Ribbon Sensor 問題；NO RIBBON 則是 Ribbon 已用完。先把裝法與耗材狀態切開。',
  keyFacts:['NO RIBBON 先換新 Ribbon。','RIBBON ERROR 有可能是 Sensor。','裝法/走帶不正確先修，不要直接換 Sensor。'],
  engineering:['確認 Supply/Take-up 軸是否正常轉動。'],
  verify:['連印 100 張無 Ribbon Error','Ribbon End 時正確停機'],
  flow:[['確認 Ribbon 是否用完','實際檢查。',['正常','已更換'],'再測。'],['重裝 Ribbon','依手冊正確路徑。',['正常','仍錯'],'仍錯查機構。'],['確認軸系轉動','Supply/Take-up 是否順暢。',['正常','異常'],'異常先修。'],['檢查 Ribbon Sensor','清潔/接頭。',['正常','已修復'],'再測。'],['線束/板端收斂','依 Service Manual。',['Sensor/線束方向高','板端方向高'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-rewind-full',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜REWIND FULL／內部回捲器已滿',severity:'常見',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'官方定義 REWIND FULL 為 Built-in Rewinder Unit 已滿。先移除底紙並按 RESTART；若空了仍報錯，再查 Rewinder Sensor/觸發機構。',
  keyFacts:['先清掉 Rewinder 上的 backing paper。','空捲仍報錯才偏 Sensor/機構。'],
  engineering:['確認底紙沒有繞錯路徑造成 Sensor 長時間被遮蔽。'],
  verify:['回捲正常','清空後 RESTART 可恢復','連續回捲穩定'],
  flow:[['清空 Rewinder','移除 backing paper。',['完成','原本未滿'],'再 RESTART。'],['按 RESTART','清除狀態。',['正常','仍錯'],'仍錯查 Sensor。'],['確認底紙路徑','是否遮住 Sensor/卡住。',['正常','已修正'],'再測。'],['檢查 Rewinder Sensor/線束','斷電。',['異常','正常'],'正常才板端。'],['板端收斂','依 Service Manual。',['板端方向高','其他'],'最後。']]
});

addRepairKB({
  id:'toshiba-bex4-head-temp-head-error-power',brand:'TOSHIBA',models:['B-EX4T1','B-EX4T2','B-EX4T3'],category:'錯誤碼／警報',
  title:'TOSHIBA B-EX4｜EXCESS HEAD TEMP／HEAD ERROR／POWER FAILURE',severity:'高',sources:['toshiba_bex4','toshiba_manuals'],
  summary:'官方將 EXCESS HEAD TEMP、HEAD ERROR、POWER FAILURE 分成不同路徑：過熱先冷卻；Head Error 直接指向 Printhead 問題；Power Failure 則先查供電品質與共用大負載插座。',
  keyFacts:['過熱先讓 Printer 冷卻約數分鐘並降低負載。','HEAD ERROR 需確認 Printhead/線材後再更換。','POWER FAILURE 先查 AC 電源品質，不先換 PSU/主板。'],
  engineering:['換 Head 前檢查 Head Cable。','供電問題可用獨立插座交叉。'],
  verify:['連印 30 分鐘無過熱','Head Test 正常','冷開機 5 次無 Power Failure'],
  flow:[['確認實際訊息','EXCESS HEAD TEMP、HEAD ERROR 或 POWER FAILURE。',['TEMP','HEAD ERROR','POWER FAILURE'],'三路分流。'],['TEMP 路徑','冷卻、降低 Darkness/速度、檢查散熱。',['正常','仍過熱'],'仍過熱查 Head Sensor/板端。'],['HEAD ERROR 路徑','清潔、檢查 Head Cable，必要時交叉 Head。',['Head方向高','仍異常'],'仍異常查驅動。'],['POWER 路徑','確認 AC 額定、獨立插座、電源線。',['正常','供電異常'],'先修外部供電。'],['板端收斂','只有外部/模組都正常才查 PSU/Mainboard。',['PSU方向高','主板方向高','其他'],'記錄。']]
});
