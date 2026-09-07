'use strict';

(function(){
  addRepairKB({
    id:'zebra-zq511-zq521-battery-power',brand:'Zebra',models:['ZQ511','ZQ521'],
    title:'ZQ511 / ZQ521｜電池、充電、負載重啟與接點排查',category:'行動式／電池／供電',severity:'A｜原廠',evidence:'source-backed',
    summary:'ZQ511/ZQ521 是電池供電行動機。遇到不開機、充不進電、印到一半重啟，先把 Battery、Charger/Cradle、接點與列印負載分開，不因為面板黑或重啟就直接判 Mainboard。',
    keyFacts:['Zebra 官方 ZQ500 Series User Guide 將 Battery、Battery Eliminator、AC Adapter、Vehicle Cradle 等列為獨立供電/充電配置。','行動機在重負載列印時出現重啟，應先用已知正常且充足電量的相容電池/供電方式交叉。','接點污染、電池未正確就位、充電配件或電池本體問題，都應在主板之前排除。'],
    engineering:['記錄問題發生在冷機開機、充電、FEED 還是實際列印負載。','先目視與清潔可及接點，不以金屬工具短接電池端子。','有相容正常電池時做 A/B Swap，一次只換一個供電變因。','若正常電池/供電配置仍在相同負載重啟，再進 PSU/Power Path/Mainboard 服務層。'],
    verify:['冷開機多次正常','充電狀態穩定','連續列印不重啟','更換/恢復原供電配置後結果可重現'],
    flow:[['重現供電症狀','分完全不開機、充電異常、待機正常但列印重啟。',['已分類','無法重現'],'先把條件固定。'],['檢查電池與接點','電池是否到位、接點是否污染/損傷。',['正常','已修正'],'修正後複測。'],['交叉供電來源','使用已知正常相容 Battery/Adapter/Cradle（依實機配置）。',['恢復','仍異常'],'恢復表示供電配件方向高。'],['加入列印負載','由 FEED 到連續列印逐步增加負載。',['穩定','負載才重啟'],'負載才重啟往 Power Path。'],['硬體收斂','外部供電均排除後，再依 Service 文件查內部 Power/Mainboard。',['已收斂','需送深度維修'],'不猜 Rail/Pin。']],
    sources:['zebra_zq500_support','zebra_zq500_ug']
  });

  addRepairKB({
    id:'zebra-zq511-zq521-media-quality',brand:'Zebra',models:['ZQ511','ZQ521'],
    title:'ZQ511 / ZQ521｜Gap / Black Mark、走紙、Printhead / Platen 品質排查',category:'行動式／Media／列印品質',severity:'A｜原廠',evidence:'source-backed',
    summary:'跳標、走紙不停、印字淡或固定白線，先確認 ZQ500 Series 的 Media Type 與 Sensor 條件，再把污染、耗材與 Printhead/Platen 分開。',
    keyFacts:['原廠規格與 User Guide 對 ZQ511/ZQ521 列有 Black Mark / Gap media sensing；RFID 版本的媒體條件需另依 RFID 文件。','原廠支援頁提供 Loading Media、Printhead Cleaning、Platen Cleaning 等維護資源。','固定同位置缺印較支持 Printhead/接觸路徑；週期性淡或打滑則要看 Platen/紙路。'],
    engineering:['先列印 Configuration Report/固定測試圖，避免 App 版面造成假象。','以客戶原耗材確認 Gap/Mark 是否真的通過 Sensor 區域。','清潔後仍固定缺線，再進 Printhead/Cable；不要用過高 Darkness 掩蓋壞點。'],
    verify:['FEED 一次一張','50 張無跳標或累積偏移','固定測試圖品質一致','條碼可掃描'],
    flow:[['確認耗材型態','Gap / Black Mark / Continuous / RFID 變體。',['正確','已修正'],'設定先對。'],['確認 Sensor/紙路','標記實際通過感應位置，紙路無卡滯。',['正常','已修正'],'再測。'],['清潔 Head/Platen','依 Zebra 支援方式處理。',['改善','無改善'],'無改善再分零件。'],['固定測試圖判型','看固定白線、週期淡、整體淡。',['固定缺線','週期/打滑','整體淡'],'依症狀分 Head/Platen/設定。'],['長測','客戶耗材連續列印。',['通過','仍異常'],'保留樣張進深度維修。']],
    sources:['zebra_zq500_support','zebra_zq500_ug','zebra_zq500_spec']
  });

  addRepairKB({
    id:'zebra-qln420-battery-power',brand:'Zebra',models:['QLn420'],
    title:'QLn420｜舊機電池、充電與列印負載重啟排查',category:'行動式舊機／電池／供電',severity:'A｜原廠舊機',evidence:'source-backed',
    summary:'QLn420 已停產，電池老化與充電環境是老機常見前置變因。完全不開機或列印負載才重啟時，先交叉 Battery/Charger/接點，再往內部板件。',
    keyFacts:['Zebra 官方仍保留 QLn420 Support & Downloads，包含電池/充電與操作維護資源。','舊電池可在待機看似正常，但在列印負載下掉壓；A/B 電池交叉比只看電量圖示更有判斷力。','電池與充電配件未排除前，不應直接以「老機」為由判 Mainboard。'],
    engineering:['先保存 Configuration Label 與故障條件。','有正常相容電池時一次只替換 Battery；若使用 Cradle/Adapter，再分開交叉。','檢查接點污染、鬆動與機構就位，不短接端子做未知測試。'],
    verify:['冷開機正常','充電正常','連印不重啟','回原電池/供電後差異可重現'],
    flow:[['分類症狀','不開機、充不進、負載重啟。',['已分類','無法重現'],'固定條件。'],['檢查電池/接點','外觀、就位、污染。',['正常','已修正'],'修正後重測。'],['正常電池交叉','使用已知正常相容 Battery。',['恢復','仍異常'],'恢復即電池方向高。'],['充電配件交叉','若有 Cradle/Adapter，逐一排除。',['正常','配件異常'],'不要同時換多項。'],['內部供電收斂','外部供電均正常仍失敗才進服務層。',['需深度維修','已修復'],'精確測點依原廠文件。']],
    sources:['zebra_qln420_support']
  });

  addRepairKB({
    id:'zebra-qln420-connectivity',brand:'Zebra',models:['QLn420'],
    title:'QLn420｜本機會印但 Bluetooth / Wi-Fi / USB 不出紙：外部連線分流',category:'行動式舊機／通訊／Driver',severity:'A｜原廠舊機',evidence:'source-backed',
    summary:'QLn420 本機 Configuration Label 正常但客戶端不能印時，把 Driver、Queue、連線與資料語言放在主板之前，避免把外部配置問題當硬體故障。',
    keyFacts:['Zebra 官方 QLn420 支援頁仍提供 Drivers、Zebra Setup Utilities 與文件。','本機 Configuration Label 正常是切開 Print Engine 與外部連線的重要基準。','換手機/電腦、系統更新、Driver/Port 變更都應列為近期變因。'],
    engineering:['先在同一印表機上固定一種已知可控的連線方式，再逐一比較 Bluetooth/Wi-Fi/USB。','清 Queue、確認 Driver/Port/語言前不要 Factory Reset。','若只有單一主機失敗，優先主機端；多主機同樣失敗才提高 Printer Interface/Firmware 嫌疑。'],
    verify:['本機測試正常','至少一種標準連線可穩定列印','客戶原連線恢復','重開機/重新配對後仍正常'],
    flow:[['列印 Configuration Label','確認 Print Engine 本身。',['正常','本機異常'],'本機異常另走硬體。'],['確認近期變更','主機、OS、Driver、AP、配對、App。',['有變更','無變更'],'有變更先回復/比對。'],['換正常主機/連線交叉','一次只換主機或連線方式。',['恢復','仍失敗'],'恢復即外部方向高。'],['核對 Driver/Queue/設定','Setup Utilities 與對應 Driver。',['已修正','均正常'],'均正常再進 Printer Interface。'],['重開與連續驗證','多次連線/列印。',['通過','仍異常'],'保留 log/config 送深度維修。']],
    sources:['zebra_qln420_support']
  });

  addRepairKB({
    id:'zebra-zr658-zr668-firmware-driver',brand:'Zebra',models:['ZR658','ZR668'],
    title:'ZR658 / ZR668｜Link-OS Firmware、Driver、CPCL / ZPL 不相容排查',category:'行動式／Firmware／Driver',severity:'A｜原廠',evidence:'source-backed',
    summary:'ZR658/ZR668 出現連得上但不列印、更新後異常或資料語言不對時，先核對 Link-OS branch、Driver 與 CPCL/ZPL，再判 Radio/Mainboard。',
    keyFacts:['Zebra 官方 Link-OS Release Notes 將 ZR658/ZR668 列為支援機型，並指出其對應 Link-OS branch。','官方 Windows Driver release notes對 ZR658/ZR668 列有 CPCL / ZPL 支援。','Firmware/Driver/語言不匹配可造成「有連線、沒輸出」而不是硬體斷線。'],
    engineering:['先保存目前 Firmware、Driver version、語言與可重現檔案。','不要為了測試直接升到未知相容版本；先依 Zebra 官方支援版本做比較。','若同一資料在另一台正常機可印，保留 A/B 條件再收斂。'],
    verify:['Firmware/Driver 組合確認','CPCL/ZPL 測試正常','重開後設定保留','客戶實際工作內容連續列印'],
    flow:[['保存版本資訊','記 ZR658/ZR668、Firmware、Driver、語言。',['完成','無法讀取'],'先不要重置。'],['本機/遠端分流','本機測試與遠端工作是否都失敗。',['僅遠端失敗','本機也異常'],'僅遠端先軟體。'],['核對 CPCL/ZPL','確認 App/Driver 送出的語言與印表機支援。',['正確','已修正'],'修正後測。'],['核對官方版本','依 Link-OS/Driver release notes 比對相容性。',['合理','需升降版評估'],'依官方程序處理。'],['長測','相同工作檔連續列印。',['通過','仍異常'],'仍異常再進 Interface/Radio。']],
    sources:['zebra_linkos_zr']
  });

  addRepairKB({
    id:'zebra-zr658-zr668-bluetooth',brand:'Zebra',models:['ZR658','ZR668'],
    title:'ZR658 / ZR668｜Bluetooth 可配對但不穩／距離短：SGD 設定與環境交叉',category:'行動式／Bluetooth／SGD',severity:'A｜原廠',evidence:'source-backed',
    summary:'ZR658/ZR668 的 Zebra SGD 文件明確支援 Bluetooth power class 設定。遇到距離、穩定性或配對問題，先讀取設定與交叉主機/環境，不直接改未知 Radio 參數。',
    keyFacts:['Zebra 官方 SGD bluetooth.power_class 文件直接列出 ZR658/ZR668。','Bluetooth 問題需分「無法配對」「配對後不能印」「距離/穩定性差」，三種不是同一故障。','環境干擾、主機端設定與印表機 Radio/Firmware 都可能造成表面相似症狀。'],
    engineering:['先讀回既有 SGD 設定並保存，不盲改 power class。','用第二台已知正常手機/電腦、近距離與乾淨環境交叉。','配對成功但不出紙時先回 Driver/CPCL/ZPL，不把資料層問題當 Radio。'],
    verify:['可正常配對','近距離連續列印穩定','客戶實際距離/環境可工作','重啟/重新配對後仍正常'],
    flow:[['分類 Bluetooth 症狀','配不到、配得到不印、距離/穩定性差。',['已分類','不明'],'先固定症狀。'],['保存 SGD 設定','讀回 Bluetooth power class 等已知官方參數。',['完成','無法讀取'],'不盲改。'],['交叉主機與距離','第二主機、近距離、降低環境干擾。',['改善','無差異'],'改善即環境/主機方向。'],['配對與列印分流','若能配對但不印，核對 Driver/CPCL/ZPL。',['資料層問題','Radio方向仍高'],'分清層級。'],['重啟與長測','多次配對/連續列印。',['通過','仍不穩'],'仍不穩再查 Firmware/Radio 服務層。']],
    sources:['zebra_zr_bt','zebra_linkos_zr']
  });
})();
