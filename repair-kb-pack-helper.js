'use strict';

// 大量擴充共用模板：讓每個機型家族都至少具備完整工程排查入口。
// 原則：不把單一機器量測值當成全系列標準；精確電壓、Pin 定義、拆裝扭力仍以 Service Manual 為準。
(function(){
  const T={
    power:{
      category:'開機／電源／主板',
      title:'完全沒反應／開不了機／面板黑屏',
      severity:'高',
      summary:'遇到整台無反應，不直接判定主板。先把 AC 輸入、電源線、開關、PSU 輸出、短路負載與主板上電狀態分開，避免換錯板。',
      keyFacts:['「完全不亮」與「面板不亮但機器其實有上電」要分開。','PSU 無輸出前先確認 AC 輸入與保險／開關路徑；PSU 有輸出仍無開機才往主板、面板與負載查。','特定 DC Rail、Pin 與保險絲規格必須以該機 Service Manual 為準。'],
      engineering:['斷電後先做目視與短路檢查，再帶電量測；不要邊插拔板卡邊上電。','可拆的 Cutter、Peeler、Rewinder、I/O 等外接模組可逐一隔離，以找出拉低電源的負載。','若 PSU 空載正常、接某模組即掉壓，優先查該模組或線束，不要先換主板。'],
      verify:['冷開機 5 次正常','外接模組逐一接回仍能啟動','連續列印 30 分鐘無重啟／掉電','記錄最終故障件與量測結果'],
      flow:[['確認 AC 端','插座、電源線、主開關與外觀保險路徑是否正常。',['正常','AC 端異常'],'先排最前端。'],['確認是否真的完全無上電','風扇、LED、網路燈、馬達初始化是否任何一項有反應。',['完全無上電','部分有反應'],'部分有反應要轉主板/面板支路。'],['檢查 PSU 輸出','依 Service Manual 在正確測點量 DC Rail。',['供電正常','無輸出','掉壓／不穩'],'不要猜標準電壓。'],['隔離負載','斷電後移除非必要 Cutter/Peeler/Rewinder/I-O/外接板再測。',['隔離後正常','仍無法開機'],'隔離後正常表示負載或線束優先。'],['主板／面板收斂','PSU 與負載正常仍無開機，再查 Main Logic、面板、上電訊號與線束。',['主板方向高','面板/線束方向高','找到其他原因'],'主板最後。']]},
    feed:{
      category:'走紙／馬達／機構',
      title:'FEED 不走／紙不動／馬達沒反應',
      severity:'高',
      summary:'按 FEED 不走紙時，先分為「機器被錯誤狀態禁止動作」、「馬達有動但機構不轉」與「馬達完全沒有驅動」三類，再決定查 Sensor、Gear、Motor 或 Mainboard Driver。',
      keyFacts:['先解除 Head Open、Media/Ribbon、Cutter 等錯誤，再判斷 Motor。','聽得到馬達聲但紙不動，Gear、Belt、Platen、Clutch 與卡料優先；完全沒聲音才往 Motor/Driver/供電查。','過緊的 Media Guide、Rewinder 或殘膠也可能讓馬達看起來像故障。'],
      engineering:['手動轉動機構前先斷電，確認是否有異常阻力。','Motor 電阻、驅動波形與接頭 Pin 必須依該機維修資料。','主板結論前先做已知正常 Motor/線束交叉，若可行。'],
      verify:['FEED 每按一次正常走一張','低速與高速都不失步','連印 50 張無卡紙／異音','機構無過熱'],
      flow:[['解除目前錯誤','確認不是 Head Open、Paper/Ribbon Out、Cutter Error 等狀態阻止 FEED。',['已解除','仍有錯誤'],'先處理前置錯誤。'],['聽／看馬達反應','按 FEED 時判斷馬達是否有聲音、抖動或齒輪動作。',['完全沒動','有聲但紙不動','有動但卡'],'三路分流。'],['斷電檢查機構阻力','檢查 Platen、Gear、Belt、Clutch、Rewinder、殘膠與卡料。',['機構正常','有卡滯／破損'],'有卡滯先修機構。'],['檢查 Motor／線束','接頭鬆脫、線束折傷、Motor 交叉或依手冊量測。',['Motor/線束異常','正常'],'不要直接換主板。'],['Mainboard Driver 收斂','機構、Motor、線束、供電都正常但無驅動，才提高 Driver/Mainboard 嫌疑。',['主板方向高','找到其他原因'],'保留量測記錄。']]},
    sensor:{
      category:'感應器／校正',
      title:'Paper Out／Ribbon Out／跳標／校正失敗',
      severity:'高頻',
      summary:'「明明有紙/碳帶卻報錯」先查 Media Type、Print Method、Sensor 位置、髒污與校正，再看 Sensor Profile/讀值；只有訊號固定或交叉測試失敗才進線束與主板輸入。',
      keyFacts:['Gap、Black Mark、Continuous 使用的偵測方式不同，Sensor 位置錯就可能永遠校不準。','換紙材、透明底紙、厚底紙、預印刷、特殊缺口都可能需要重新校正。','Sensor 值固定／幾乎無變化，比單純一次校正失敗更支持硬體方向。'],
      engineering:['先用已知正常耗材交叉，能快速切掉耗材干擾。','可列 Sensor Profile 的機型先看波形，不要只憑錯誤訊息換 Sensor。','斷電插拔 Sensor/線束；帶電量測只依維修手冊。'],
      verify:['FEED 一次一張','50 張無跳標','重開機後設定仍正確','Paper/Ribbon Out 不再誤報'],
      flow:[['確認耗材設定','Gap/Mark/Continuous、Direct/Thermal Transfer 與實際耗材一致。',['正確','已修正'],'Driver 也可能覆蓋。'],['確認 Sensor 位置／清潔','Gap/Mark 必須真正經過感應區，清除紙屑、碳粉、殘膠。',['正常','已修正'],'先清再校。'],['重新校正','依原廠 Auto/Manual Calibration 完整執行。',['成功','仍失敗'],'記錄校正在哪一步失敗。'],['觀察 Sensor Profile／讀值','比較 Label/Gap/Mark/Ribbon 經過時是否有明顯變化。',['變化正常','變化很小／固定'],'固定值提高硬體嫌疑。'],['硬體收斂','斷電查 Sensor、線束、接頭；必要時交叉正常 Sensor。',['Sensor/線束異常','主板輸入方向高','已修復'],'主板最後。']]},
    quality:{
      category:'列印品質／印字頭／Platen',
      title:'太淡／固定白線／單側淡／條碼掃不到',
      severity:'高頻',
      summary:'品質問題先固定紙、碳帶、速度與 Darkness，再用內建測試或固定測試圖切開 Printer 與軟體。固定同位置缺線、單側淡、整體太淡代表不同故障方向。',
      keyFacts:['固定同位置白線：清潔後仍存在，Printhead element 或線材嫌疑上升。','單側淡：壓力、Platen 平整度、Printhead 安裝與走紙平行優先。','整體太淡：先查耗材匹配、速度、Darkness、壓力與 Print Method，不要一味加熱。'],
      engineering:['Darkness 過高會增加 Printhead 磨耗，也可能造成 Ribbon 熔斷。','Platen 硬化、凹痕、殘膠會造成局部接觸不良。','換 Printhead 前先確認 Head Cable、接頭與驅動輸出，避免新頭被電路故障損壞。'],
      verify:['測試圖無固定缺線','左右濃度一致','條碼掃描穩定','連印 100 張品質一致'],
      flow:[['建立固定測試條件','同一紙、碳帶、速度、Darkness，使用 Printer Self Test/固定測試圖。',['完成','無法建立'],'先排軟體變數。'],['清潔 Printhead / Platen','依原廠方式清潔，檢查滾輪凹痕、硬化與殘膠。',['清潔後正常','仍異常','Platen 異常'],'先處理明顯機構。'],['判斷缺陷型態','固定白線、單側淡、整體淡、模糊／拖墨。',['固定白線','單側淡','整體淡','模糊／拖墨'],'不同方向。'],['調整速度／Darkness／壓力','一次只改一項，使用最低有效熱量與壓力。',['改善','無改善'],'保留基準。'],['硬體收斂','固定缺線查 Head/Head Cable；單側查壓力/Platen；整體異常再查供電/驅動。',['Printhead方向高','機構方向高','驅動方向高','已修復'],'換件前交叉。']]},
    comms:{
      category:'USB／LAN／Driver／列印命令',
      title:'電腦按列印沒反應／USB或網路抓不到',
      severity:'高頻',
      summary:'先用 Printer 自我測試確認機器本體，再把 USB/LAN、Driver、Windows Port、Queue、BarTender/標籤軟體與印表機硬體分開。',
      keyFacts:['本機 Self Test 正常，代表 Print Engine 基本可工作；此時電腦端優先。','USB 完全無辨識、有辨識但不能印、LAN Ping 不通、Ping 通但不能印是四種不同故障。','不要把舊 DHCP IP、錯 Port 或卡住的 Queue 誤判為網卡故障。'],
      engineering:['USB 先換線/Port/電腦；LAN 先看 Link、IP、Ping、Port。','有網頁介面或設定工具可連，但 Windows 不印，優先查 Driver/Queue/Protocol。','所有電腦與線材交叉都無法辨識，才往接口板、USB PHY、NIC/主板查。'],
      verify:['Windows/系統可穩定辨識','Test Page 正常','實際 BarTender/業務軟體正常','重開機／重插線後仍正常'],
      flow:[['Printer 本機 Self Test','不經電腦印設定頁/測試頁。',['正常','本機也異常'],'本機異常先修 Printer。'],['判斷連線類型','USB、LAN、Serial 或其他。',['USB','LAN','其他'],'分流。'],['做最小交叉','USB 換線/Port/PC；LAN 查 Link/IP/Ping。',['連線恢復','仍異常','Ping 通但不能印'],'記錄結果。'],['Driver／Port／Queue','確認正確 Driver、實際 Port、Queue 無卡住。',['正常','已修正'],'Ping 通但不印多半先看這裡。'],['硬體接口收斂','所有軟體、線材、電腦交叉都排除後，查接口板/網卡/Mainboard。',['接口硬體方向高','找到其他原因'],'避免太早拆機。']]},
    cutter:{
      category:'切刀／剝紙／回捲',
      title:'切刀不動／切一半卡住／剝紙回捲異常',
      severity:'維修',
      summary:'先確認機器真的有安裝對應選配、Driver/Printer Mode 正確，再分為完全不動、會動但卡、切不斷與 Home/Taken Sensor 異常。',
      keyFacts:['會動但卡住多先查紙屑、背膠、刀片、Gear/Home；完全不動才優先查接頭、供電與 Driver。','剝紙/回捲還要分 Taken Sensor、Rewinder、Clutch/Torque 與底紙路徑。','清 Cutter 前先斷電，潤滑方式只依該機原廠維護規範。'],
      engineering:['背膠累積是 Cutter 常見高阻力來源。','不要用不明潤滑油噴整個機構。','模組交叉正常而主機仍不驅動，再查 Mainboard/Option Driver。'],
      verify:['連續 30 次 Cut Cycle 正常','不同標籤長度皆能切','無殘膠卡刀／異音','Peel/Taken/回捲動作穩定'],
      flow:[['確認 Mode／選配','Cutter/Peel/Rewind 模組存在且 Driver/Printer Mode 正確。',['正確','設定錯誤已修正','未安裝該模組'],'先排設定。'],['判斷動作','完全不動、會動但卡、切不斷、回原點失敗。',['完全不動','會動但卡','切不斷','Home異常'],'分流。'],['斷電清理機構','移除紙屑、背膠、liner，檢查 Gear/刀片/回捲軸。',['清理後正常','仍異常','發現破損'],'先機械。'],['檢查 Sensor／Motor／接頭','Home/Taken Sensor、Motor、線束、Option Connector。',['模組異常','正常'],'可交叉模組最好。'],['主板驅動收斂','模組與線束正常但主機完全不驅動，再查 Option Driver/Mainboard。',['主板方向高','已修復'],'主板最後。']]},
    ribbon:{
      category:'碳帶／皺碳／回收軸',
      title:'碳帶皺／碳帶斷／回收軸不轉／印一印破帶',
      severity:'常見',
      summary:'碳帶問題要同時看 Loading、方向、寬度、張力、回收軸、Platen、左右壓力、速度與 Darkness；「皺」和「熔斷」不要混成同一故障。',
      keyFacts:['Ribbon 應與 Media 相容且通常至少覆蓋列印區/印字頭接觸區。','皺碳常與走紙不平行、壓力不均、Ribbon path 或張力相關。','熔斷則要優先查 Darkness 太高、速度太慢、耗材不匹配與局部摩擦。'],
      engineering:['先用正常 Ribbon/Media 交叉，最快排除耗材批次。','回收軸不轉要分軸心打滑、Clutch/Torque、Gear/Belt/Motor 與驅動。','不要用過高 Printhead Pressure 硬壓掉皺碳。'],
      verify:['連續 100 張 Ribbon 不皺不斷','回收整齊不鬆垮','左右列印一致','高低速皆穩定'],
      flow:[['確認 Ribbon Loading／方向','依機型路徑確認供應軸、回收軸、墨面與寬度。',['正確','已修正'],'先排裝錯。'],['判斷故障型態','皺、斷／熔、回收不轉、鬆帶。',['皺碳','熔斷','回收不轉','鬆帶'],'分流。'],['固定速度／Darkness 測試','降低熱量或調整速度，看是否立即改善。',['改善','無改善'],'熔斷改善代表熱量方向高。'],['檢查路徑與機構','Platen、壓力、Guide、Ribbon spindle、Clutch/Torque、Gear/Belt。',['發現異常','外觀正常'],'皺碳與回收異常多看這裡。'],['驅動收斂','機構與耗材正常但回收完全無驅動，再查 Motor/線束/Mainboard。',['Motor/線束方向高','主板方向高','已修復'],'依手冊量測。']]}
  };

  window.addRepairPack=function(cfg){
    const issues=cfg.issues||Object.keys(T);
    issues.forEach(type=>{
      const t=T[type];
      if(!t)return;
      const id=`bulk-${cfg.id}-${type}`;
      if(window.REPAIR_KB?.some(x=>x.id===id))return;
      const extra=(cfg.notes&&cfg.notes[type])||cfg.note||'';
      addRepairKB({
        id,brand:cfg.brand,models:cfg.models,category:t.category,
        title:`${cfg.label}｜${t.title}`,severity:t.severity,sources:cfg.sources||[],
        summary:`${t.summary}${extra?` ${extra}`:''}`,
        keyFacts:[...t.keyFacts,...(cfg.keyFacts?.[type]||[])],
        engineering:[...t.engineering,...(cfg.engineering?.[type]||[])],
        verify:[...t.verify],
        flow:t.flow.map(x=>[x[0],x[1],[...x[2]],x[3]||''])
      });
    });
  };
})();
