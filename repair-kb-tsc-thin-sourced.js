'use strict';

(function(){
  addRepairKB({
    id:'tsc-alpha3r-battery-power',brand:'TSC',models:['Alpha-3R'],
    title:'Alpha-3R｜電池、充電、接點與負載重啟排查',category:'行動式／電池／供電',severity:'A｜原廠',evidence:'source-backed',
    summary:'Alpha-3R 是電池式行動熱感印表機。完全不開機、充電異常或列印負載才重啟時，先分 Battery / Charger / 接點與 Print Engine，不直接判主板。',
    keyFacts:['TSC Alpha Series 官方產品資料列出 Alpha-3R 的電池與充電相關配件/選項，可作為供電交叉的基準。','待機正常不代表電池在列印負載下仍穩定；已知正常相容電池的 A/B Swap 比只看電量圖示更有判斷力。','外部供電與接點未排除前，不應先拆板或猜內部 Rail。'],
    engineering:['先記錄故障發生在開機、FEED、充電還是連續列印。','檢查電池就位與可及接點污染，不短接端子。','有正常相容 Battery / Charger 時一次只換一個變因。','外部供電都正常仍重啟，再依該機 Service 資料進 Power/Mainboard。'],
    verify:['冷開機多次正常','充電穩定','連續列印不重啟','回原電池後差異可重現'],
    flow:[['分類供電症狀','不開機、充電異常、負載才重啟。',['完成','無法重現'],'固定條件。'],['檢查電池/接點','就位、污染、外觀。',['正常','已修正'],'修正後重測。'],['正常電池交叉','使用已知正常相容電池。',['恢復','仍異常'],'恢復即 Battery 方向高。'],['充電配件交叉','依實機配置比較 Charger/Adapter。',['正常','配件異常'],'一次只換一項。'],['內部供電收斂','外部供電排除後才進板件。',['需深度維修','已修復'],'精確 Pin/電壓依原廠 Service 文件。']],
    sources:['tsc_alpha']
  });

  addRepairKB({
    id:'tsc-alpha3r-media-connectivity',brand:'TSC',models:['Alpha-3R'],
    title:'Alpha-3R｜走紙／列印品質與 USB / Wireless 外部連線分流',category:'行動式／Media／連線',severity:'A｜原廠',evidence:'source-backed',
    summary:'Alpha-3R 若本機能正常走紙/列印，但電腦或行動裝置不能印，先分 Driver/Interface；若本機也異常，再回紙路、感應與 Printhead/Platen。',
    keyFacts:['TSC Alpha Series 官方資料將 Alpha-3R 定位為 Direct Thermal 行動印表機並提供多種介面配置；實際介面依機器選配確認。','「連不上」與「連上但不出紙」要分開，後者還可能是 Driver、Queue、資料格式。','列印品質先固定耗材與測試內容，再分整體淡、固定缺線與週期性打滑。'],
    engineering:['先做不依賴客戶 App 的本機/標準測試，切開 Print Engine 與外部連線。','紙路異常先清潔可及 Sensor/Platen/Head 區域並確認耗材安裝。','只有單一主機失敗時優先主機端；多主機同樣失敗才提高 Printer Interface/Firmware 嫌疑。'],
    verify:['本機測試穩定','FEED/定位正常','固定測試圖品質一致','客戶實際連線方式可連續列印'],
    flow:[['先分本機/外部','本機測試是否正常。',['本機正常','本機異常'],'本機正常優先連線。'],['本機異常查紙路','耗材、Sensor、Platen、Printhead 清潔。',['改善','無改善'],'無改善進硬體。'],['外部異常換主機交叉','第二主機/線材/連線方式。',['恢復','仍失敗'],'恢復即外部方向。'],['核對 Driver/設定','依 TSC 官方支援工具/Driver 與實機介面。',['已修正','正常'],'正常再查 Interface/Firmware。'],['長測','實際工作內容連續列印。',['通過','仍異常'],'保留條件進深度維修。']],
    sources:['tsc_alpha']
  });

  addRepairKB({
    id:'tsc-da210-da220-media-sensor',brand:'TSC',models:['DA210','DA220'],
    title:'DA210 / DA220｜Direct Thermal、Gap / Black Mark / Notch 感應與吐紙排查',category:'桌上型／Direct Thermal／Sensor',severity:'A｜原廠',evidence:'source-backed',
    summary:'DA210/DA220 是 Direct Thermal 桌上型，跳標、一直吐紙或找不到標籤時，先確認耗材感應類型與 Sensor 條件，不要往 Ribbon 系統查。',
    keyFacts:['TSC DA Series 官方資料明確為 Direct Thermal；DA210/DA220 不使用 Thermal Transfer Ribbon。','官方 DA Series 規格支援 Gap、Black Mark 與 Notch 類型的媒體感應。','吐紙不停最先確認 Media Type / Sensor、紙材標記與裝紙，再做對應 Calibration。'],
    engineering:['如果現場有人以「Ribbon Out」思路處理 DA210/220，先回機型基礎：這是 Direct Thermal。','以客戶原紙確認 Gap/Mark/Notch 實際通過 Sensor 區域。','清潔 Sensor/紙路後做 Calibration；仍讀不到再查 Sensor/線束/輸入。'],
    verify:['FEED 一次一張','重新開機不持續吐紙','50 張無跳標','客戶實際耗材定位正常'],
    flow:[['確認 Direct Thermal','排除錯誤的 Ribbon/TT 設定思路。',['確認','設定需修正'],'先回正確模式。'],['確認 Media Type','Gap / Black Mark / Notch。',['正確','已修正'],'修正後測。'],['檢查紙路/Sensor','標記位置、污染、卡紙。',['正常','已清潔/修正'],'再校正。'],['執行 Calibration','依實際耗材重新建立感應基準。',['成功','失敗'],'失敗進 Sensor/線束。'],['長測','連續 FEED/列印。',['通過','仍異常'],'保留測試結果。']],
    sources:['tsc_da']
  });

  addRepairKB({
    id:'tsc-da210-da220-connectivity-cutter',brand:'TSC',models:['DA210','DA220'],
    title:'DA210 / DA220｜USB / Ethernet、Cutter 選配與「按列印沒反應」分流',category:'桌上型／連線／Cutter',severity:'A｜原廠',evidence:'source-backed',
    summary:'DA210/DA220 本機走紙正常但電腦列印沒反應時，先查 Driver/Port/Queue；有 Cutter 的機器則把「主機能印」與「Cutter 不切」拆開，避免整台誤判。',
    keyFacts:['TSC DA Series 官方資料顯示 DA210/DA220 的介面配置存在差異，正式排查以實機接口為準。','DA Series 可搭配 Full / Partial Cutter 選配；沒有 Cutter 的機器不能因軟體設 Cut Mode 就期待硬體動作。','本機 FEED/測試正常但 Windows/應用不印，優先外部 Driver/Port/Queue。'],
    engineering:['先確認實機是否真的裝 Cutter、Ethernet 等 Option。','USB 先換已知正常線/Port；Network 先分 Link/IP/Ping/Port。','Cutter 問題先切回 Tear-off/一般列印確認 Print Engine，再查 Cutter Jam/Home/線束。'],
    verify:['本機與 Windows/實際 App 都能列印','USB/LAN 依實機配置穩定','有 Cutter 時連續切位正常','重開後 Port/設定保存'],
    flow:[['確認實機 Option','USB/LAN/Cutter 是否真的存在。',['已確認','與設定不符'],'先修設定/需求。'],['本機列印分流','FEED/自測是否正常。',['正常','異常'],'異常先本機。'],['外部連線排查','USB 線/Port 或 LAN Link/IP/Ping/Queue。',['已修正','仍異常'],'仍異常再 Driver/Firmware。'],['Cutter 單獨分流','有 Cutter 才測 Cut Mode、卡紙、Home。',['正常','Cutter 異常','未安裝'],'不要混成主機故障。'],['完整回歸','實際 App 連印/切紙。',['通過','失敗'],'失敗保留是哪一層。']],
    sources:['tsc_da']
  });
})();
