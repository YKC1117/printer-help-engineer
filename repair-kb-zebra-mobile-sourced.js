'use strict';

(function(){
  addRepairKB({
    id:'zebra-zq511-zq521-source-baseline',brand:'Zebra',models:['ZQ511','ZQ521'],
    title:'ZQ511 / ZQ521｜原廠來源化：Configuration Report、Media Sensor、Printhead／Platen 基準',
    category:'行動式／原廠診斷',severity:'A｜原廠',evidence:'source-backed',
    summary:'ZQ511/ZQ521 是 203 dpi Direct Thermal 行動機。先用原廠 Configuration Report / 自我測試切開「印表機本體」與「手機/電腦/無線連線」問題，再依 Media Sensor、Printhead、Platen 與電池供電方向排查。',
    keyFacts:['原廠 User Guide 提供不連電腦即可列印 Configuration Report 的功能，可先確認印表機自身是否能正常列印。','ZQ511/ZQ521 為 203 dpi Direct Thermal；一般機型支援固定中央位置的 Black Mark / Gap sensing，RFID 變體的感應條件不同，不可直接混用。','原廠支援頁提供 Printhead Cleaning、Platen Cleaning、Media 識別與裝紙等維護資源。'],
    engineering:['完全不印先嘗試本機 Configuration Report；本機正常才往 Driver、Bluetooth/Wi-Fi、App/資料格式查。','跳標/定位異常先確認耗材是 Gap 或 Black Mark、Sensor 實際能讀到標記，再清潔與重做基準。','固定白線先清 Printhead；週期性淡/打滑再查 Platen 表面與耗材接觸。','電池型設備遇到負載重啟，先以已知正常且充足電量的電池/供電條件交叉，不直接判主板。'],
    verify:['Configuration Report 可正常列印','FEED/定位穩定','測試圖無固定缺線','實際 Bluetooth/Wi-Fi/USB 使用方式可連續工作'],
    flow:[['先做本機測試','依原廠方式列印 Configuration Report，確認不依賴外部電腦也能列印。',['本機正常','本機也異常'],'本機正常優先查外部連線；本機異常進硬體。'],['確認耗材感應方式','分 Gap / Black Mark；RFID 變體另外依其原廠媒體規則。',['正確','已修正'],'先消除耗材設定錯誤。'],['清潔 Head/Platen/Sensor 區域','依 Zebra 維護方式清潔可及列印與走紙區域。',['改善','無改善'],'固定缺線/打滑再進零件層。'],['供電交叉','確認電池狀態與接點，必要時用已知正常供電條件比較。',['正常','供電相關'],'先排電池/接點。'],['回到實際連線','Bluetooth/Wi-Fi/USB 與客戶應用連續測試。',['通過','仍異常'],'外部連線問題另查 Driver/Network/App。']],
    sources:['zebra_zq500_support','zebra_zq500_ug','zebra_zq500_spec']
  });

  addRepairKB({
    id:'zebra-qln420-source-baseline',brand:'Zebra',models:['QLn420'],
    title:'QLn420｜原廠舊機支援：本機測試、Media、Printhead／Platen 與連線基準',
    category:'行動式舊機／原廠支援',severity:'A｜原廠舊機',evidence:'source-backed',
    summary:'QLn420 已停產，但 Zebra 官方仍保留支援頁、文件與 How-to 資源。維修先做本機測試、裝紙/Media、Printhead/Platen 清潔，再分成硬體、電池或無線/Driver 問題。',
    keyFacts:['Zebra 官方 QLn420 支援頁明確標示已停售並保留舊機資源。','官方支援內容包含 Configuration Label、Printhead Cleaning、Platen Cleaning、Loading Media 與 Zebra Setup Utilities 等操作。','舊行動機若本機測試正常但應用程式不能印，應先查外部連線/設定，不先拆機。'],
    engineering:['先保存 Configuration Label，包含韌體/設定資訊，避免先重置把現場條件抹掉。','紙路問題先排裝紙、耗材、Platen 污染與 Sensor，再考慮 Motor/Board。','電池/充電問題與列印品質問題分開處理，避免把供電不穩造成的重啟誤判成韌體。'],
    verify:['本機 Configuration Label 正常','Media FEED 穩定','Printhead/Platen 清潔後品質正常','實際連線與充電情境可穩定工作'],
    flow:[['列印本機 Configuration Label','先確認印表機自身列印與基本設定。',['正常','無法列印'],'正常轉外部連線；無法列印留在本機。'],['檢查 Media/紙路','裝紙、感應、紙屑、Platen。',['正常','已修正'],'先處理耗材/紙路。'],['清潔 Printhead/Platen','依原廠 How-to。',['改善','無改善'],'無改善再查磨耗/線束。'],['檢查電池與供電','充電狀態、接點與已知正常電池交叉。',['正常','供電異常'],'供電異常先修。'],['測實際連線','Setup Utilities / Bluetooth / Wi-Fi / USB 依客戶配置。',['通過','失敗'],'外部配置另查。']],
    sources:['zebra_qln420_support']
  });

  addRepairKB({
    id:'zebra-zr658-zr668-source-baseline',brand:'Zebra',models:['ZR658','ZR668'],
    title:'ZR658 / ZR668｜Zebra 官方 Link-OS／Bluetooth 來源化診斷基準',
    category:'行動式／Link-OS／無線',severity:'A｜原廠',evidence:'source-backed',
    summary:'Zebra 官方 Link-OS Release Notes 與 SGD 文件明確列出 ZR658/ZR668。這篇先建立可確認的 Firmware / Bluetooth / Driver 診斷基準；沒有原廠 Service Manual 依據的硬體 Pin、Rail 或零件值不延伸猜測。',
    keyFacts:['Zebra Link-OS 6.x 官方 Release Notes 將 ZR658/ZR668 列為支援機型並有獨立 OS branch。','Zebra SGD bluetooth.power_class / bluetooth.le.power_class 文件直接列出 ZR658/ZR668，可用於確認無線設定能力。','Zebra 官方 Windows Driver release notes亦列 ZR658/ZR668 的 CPCL / ZPL 支援。'],
    engineering:['遇到「能連但不能印」先確認語言/Driver/Queue 與 Firmware，不先判 Bluetooth 模組壞。','無線間歇問題先保存目前 Link-OS/Firmware 與設定，再做已知正常主機/連線方式交叉。','若問題進入電池、Printhead、Sensor、Mainboard 等硬體層，目前僅把通用流程當隔離方法；精確測點需該機原廠 Service 文件。'],
    verify:['Firmware/Driver 型號辨識正確','Bluetooth 設定可讀回','CPCL/ZPL 對應工作正常','實際工作距離與連續列印穩定'],
    flow:[['確認型號與 Firmware','保存 ZR658/ZR668、Link-OS/Firmware 與連線設定。',['已保存','無法讀取'],'先不要重置。'],['分連線與列印引擎','若可本機列印但遠端不印，優先外部連線。',['外部連線方向','本機也異常'],'本機異常另查硬體。'],['核對 Driver/語言','確認 ZR658/ZR668 對應 Driver 與 CPCL/ZPL 工作方式。',['正確','已修正'],'先排軟體。'],['核對 Bluetooth 設定','依 Zebra SGD 文件讀取/比較 Bluetooth power class 等設定，不盲改未知參數。',['正常','設定異常'],'設定異常恢復合理基準。'],['交叉主機與實際列印','用已知正常主機/應用連續測試。',['通過','仍異常'],'仍異常再往 Radio/Firmware/硬體送修層收斂。']],
    sources:['zebra_linkos_zr','zebra_zr_bt']
  });
})();
