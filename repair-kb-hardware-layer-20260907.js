'use strict';

// 2026-09-07 硬體層擴充：線束／接頭、Clutch／Rewinder、Interface、Firmware／NVRAM、軸承／傳動。
// 精確 Pin、電壓、阻值、扭力與零件料號，只在已核對 Service/Parts Manual 時採用；否則明確要求回原廠文件確認。
(function(){
  const TOPICS={
    harness:{
      category:'線束／接頭／間歇故障',name:'線束／接頭間歇故障與退 Pin',severity:'高價值',
      summary:'症狀會隨開蓋、晃線、溫度或震動出現/消失時，線束與接頭優先級很高。先做目視、拉力、彎折與固定點檢查，再依原廠圖面量導通；不要用單次正常讀值就排除間歇斷路。',
      keyFacts:['端子退 Pin、插頭未完全扣入、線材在鉸鏈/金屬邊緣被磨破，是常見間歇故障來源。','導通測試要在斷電下進行；帶電量測必須先確認腳位定義。','晃線測試若能穩定重現症狀，比直接換 Sensor/Mainboard 更有診斷價值。'],
      engineering:['拆接頭前拍照並標記方向。','用低力道檢查每個端子是否後退，不要用探針把端子撐鬆。','若線束跨越活動機構，檢查彎折半徑、夾壓與摩擦點。'],
      verify:['晃線/開關蓋不再重現','連印 100 張無間歇報錯','重開機 5 次正常','線束固定點完整'],
      flow:[['重現條件','記錄是開蓋、晃線、升溫、震動或特定角度才發作。',['可重現','無法重現'],'能重現就保留條件。'],['斷電目視接頭','查退 Pin、氧化、鬆脫、折痕、夾傷與磨破。',['找到異常','外觀正常'],'先修明顯問題。'],['斷電導通/晃線測試','依原廠線路圖量對應線段，測試時輕微彎折線束。',['間歇開路','導通穩定','腳位不明'],'腳位不明時停止並查手冊。'],['模組交叉','若可行，用正常線束/模組交叉，確認問題是否跟著線束。',['跟著線束','不跟線束','無法交叉'],'不跟線束再往端點模組查。'],['固定與耐久驗證','修復/更換線束後恢復原固定點並做連續測試。',['通過','仍異常'],'仍異常回查 Sensor/Driver/Mainboard。']]},
    rewind:{
      category:'碳帶回收／Clutch／Spindle',name:'Ribbon Rewind／Clutch／回收軸打滑',severity:'高頻',
      summary:'碳帶回收鬆、軸不轉、碳帶越印越垂或皺時，先分穿帶錯誤、回收軸空轉、Clutch 打滑、Gear/Belt 傳動與驅動控制，不把所有問題都當 Ribbon Sensor。',
      keyFacts:['空載會轉、帶碳帶後打滑，常指向 Clutch/摩擦件/軸套而非電控。','回收張力過大也會造成斷碳、皺碳與 Printhead 負載。','不同機型回收結構差異很大，彈簧、摩擦片與預壓位置要依該機手冊。'],
      engineering:['斷電拆 Spindle/Clutch 前拍照記錄墊片、E-ring、彈簧方向。','不要用油潤滑原本設計為乾式摩擦的 Clutch。','裝回後先用低速與低熱量驗證張力，再做高速測試。'],
      verify:['回收卷緊度均勻','低速/高速不皺碳','連印 100 張不斷碳','回收軸無異音/過熱'],
      flow:[['確認穿帶','依機器圖示重新穿碳帶，確認供應/回收方向。',['正確','已修正'],'先排安裝。'],['觀察空載與負載','看回收軸空載會不會轉、帶碳帶後是否打滑。',['空載也不轉','負載才打滑','轉動正常'],'分電控與 Clutch。'],['斷電查傳動','檢查 Gear、Belt、Clutch、軸套、彈簧與單向機構。',['磨損/裂損','外觀正常'],'找到磨損就核對料號。'],['檢查驅動/線束','若完全無動作，再查 Motor/線束/驅動訊號。',['驅動異常','驅動正常'],'依 Service Manual。'],['換件後張力驗證','更換 Clutch/Spindle/Gear 後以低速再高速測。',['通過','仍鬆/過緊'],'仍異常回查壓力與碳帶路徑。']]},
    interface:{
      category:'Interface／USB／LAN／通訊板',name:'USB/LAN Interface／通訊板硬體隔離',severity:'高價值',
      summary:'USB/LAN 間歇失聯時，先把 Driver、Port、線材、IP/Queue 與 Printer 本體切開；只有跨電腦、跨線材仍失敗，且本機 Self Test 正常時，才提高 Interface/NIC/Mainboard 嫌疑。',
      keyFacts:['USB「完全不枚舉」與「有裝置但不能印」不是同一故障。','LAN 有 Link 但 Ping 不通，要先查 IP/VLAN/Port；Link 都沒有才優先看 PHY/網路介面/線材。','外接 Print Server/Option Board 應先隔離，避免把選配板故障誤判主板。'],
      engineering:['先保留 Network Config/設定頁作為基準。','USB/LAN Port 有機械鬆動、焊點裂或插座變形時，先處理介面機構。','量 PHY/USB 訊號需要合適設備與手冊，不用一般三用電表硬判高速訊號。'],
      verify:['跨兩台電腦都穩定','USB 重插/網路重連正常','連續列印 100 工作無中斷','重開機後 IP/Port 正常'],
      flow:[['Printer Self Test','先確認不經電腦可以正常列印。',['正常','本體異常'],'本體異常先修 Printer。'],['最小連線交叉','換 USB 線/Port/電腦或 LAN 線/交換器 Port。',['交叉後正常','仍失敗'],'交叉正常即外部問題。'],['觀察枚舉/Link/IP','USB 看裝置管理員；LAN 看 Link、IP、Ping。',['USB不枚舉','LAN無Link','有連線但不能印'],'三路分流。'],['隔離選配介面','若有 Print Server/I-O/Option Board，依規範斷電隔離。',['隔離後正常','仍異常','不適用'],'隔離後正常就鎖定選配板。'],['Interface/Mainboard 收斂','外部皆正常仍失聯，再依 Service Manual 查 Connector/Interface/Mainboard。',['介面方向高','主板方向高','找到其他原因'],'主板最後。']]},
    firmware:{
      category:'Firmware／NVRAM／設定保存',name:'Firmware／NVRAM／設定存不住或開機卡住',severity:'高價值',
      summary:'設定每次重開就恢復、更新後異常、卡 Logo 或偶發重啟，要先排 Driver 覆蓋、未 Save/Apply、外接模組與耗材狀態，再處理 Firmware/NVRAM。重刷韌體前先備份設定，避免把硬體問題掩蓋。',
      keyFacts:['設定被 Windows Driver/標籤軟體覆蓋很常見，單機重開測試可切開。','Firmware 更新中斷可能造成無法開機，需依原廠 Recovery 方法。','NVRAM/Flash 的清除、初始化與重刷流程依品牌不同，不能用通用按鍵亂試。'],
      engineering:['升級前保存 Config/Network/Calibration 參數與目前 Firmware 版本。','使用原廠 Firmware 與工具，確認機型/版本相符。','若機器會隨震動或升溫重啟，先查 PSU/線束，不要只重刷 Firmware。'],
      verify:['冷開機 5 次正常','設定重開後仍保留','Self Test 與實際工作正常','Firmware/設定版本已記錄'],
      flow:[['切開外部覆蓋','拔 USB/LAN，單機改一個安全設定並 Save，再重開。',['設定保留','仍消失'],'保留表示外部覆蓋。'],['記錄版本/設定','列印 Config 或匯出設定，記錄 Firmware。',['完成','無法讀取'],'先留證據。'],['隔離外接模組','移除非必要 Option/USB Host/介面裝置後重開。',['恢復正常','仍異常'],'隔離後正常查選配/供電。'],['執行原廠 Firmware/Recovery','只依該機官方流程更新或恢復。',['成功','失敗/卡住'],'失敗不要反覆斷電重刷。'],['NVRAM/Mainboard 收斂','Firmware 正常仍存不住或卡開機，再查 Flash/NVRAM/Mainboard。',['NVRAM方向高','主板方向高','已修復'],'保留設定與版本紀錄。']]},
    bearing:{
      category:'軸承／軸套／傳動平行',name:'Bearing／Bushing／軸承軸套磨損與偏心',severity:'中高',
      summary:'週期性異音、Platen 偏心、紙張左右跑、齒輪吃偏或特定轉角阻力變大時，要查 Bearing/Bushing/軸套，不只看 Motor。寬幅機尤其要注意左右支撐與平行。',
      keyFacts:['手轉一圈中某個角度特別緊或鬆，可能是偏心、軸承損傷或軸彎。','軸承鬆旷會讓齒輪嚙合與壓力隨旋轉改變。','只換 Gear 不處理鬆旷軸承，新的 Gear 可能很快再次磨損。'],
      engineering:['斷電卸除張力後再判斷軸承阻力。','拆軸前記錄 Spacer、Washer、E-ring 與左右方向。','裝回後要檢查軸向間隙與平行度，不只確認能轉。'],
      verify:['手轉全圈阻力均勻','無徑向/軸向異常鬆旷','連印 100 張不偏紙','齒輪聲均勻'],
      flow:[['空載手轉','斷電、卸紙/碳帶後轉 Platen/Drive 軸一整圈。',['均勻','有卡點','有鬆旷'],'卡點/鬆旷進機構。'],['檢查左右支撐','看 Bearing/Bushing、固定座、軸套有無磨耗粉、裂紋、偏磨。',['找到磨損','外觀正常'],'磨損要一起查軸。'],['查齒輪嚙合/平行','觀察 Gear mesh、Belt 對線與 Platen 平行。',['偏斜','正常'],'偏斜先修支撐。'],['核對零件並更換','依 Parts List 核對 Bearing/Bushing/shaft。',['完成','料號待確認'],'勿只靠尺寸猜。'],['負載驗證','裝回紙/碳帶後低速、高速連印。',['通過','仍異常'],'仍異常回查壓力/Drive。']]},
    headopen:{
      category:'Head Open／上蓋／安全感應',name:'Head Open Sensor／Latch／上蓋誤報',severity:'高頻',
      summary:'上蓋已關卻顯示 Head Open，先檢查 Latch/壓頭機構是否真的到底，再看磁鐵、微動開關/霍爾 Sensor、線束與主板輸入。壓住上蓋才正常通常很有機械對位價值。',
      keyFacts:['Latch 沒扣到底會讓 Sensor 正常但永遠讀不到「關閉」。','壓住某個位置才消警報，優先看機構公差/感應距離與線束，不直接換板。','Sensor 類型與正常讀值依機型而異。'],
      engineering:['先斷電檢查 Latch、彈簧、磁鐵/觸發片是否鬆脫。','若是微動開關，檢查作動點與機械行程；若是霍爾/光學，確認對位與遮片。','帶電讀值前先查 Service Manual。'],
      verify:['正常關蓋一次即 Ready','輕晃上蓋不誤報','連印 100 張無 Head Open','開蓋時能正確停止'],
      flow:[['機械閉合檢查','確認 Printhead/Latch/上蓋確實扣到底。',['正常','未到底/鬆動'],'先修機構。'],['手壓/晃動測試','輕壓上蓋或頭座，看警報是否跟著變。',['會跟著變','完全不變'],'跟著變偏機構/線束。'],['斷電查 Sensor/觸發件','檢查磁鐵、遮片、微動開關、Sensor 與線束。',['找到異常','外觀正常'],'修明顯異常。'],['讀值/交叉','依手冊看 Head Open input 或交叉正常 Sensor。',['Sensor方向高','主板輸入方向高','正常'],'主板最後。'],['關蓋安全驗證','反覆開關蓋並連續列印。',['通過','仍誤報'],'仍誤報回查機構公差。']]},
    peel:{
      category:'Peel／Label Taken／Rewinder',name:'Peel Sensor／Label Taken／底紙回捲異常',severity:'中高',
      summary:'剝紙模式「剝一張就停」、取走標籤不續印或底紙不回捲時，要分 Label Taken Sensor、Print Mode、底紙路徑、Rewinder/Clutch 與模組線束。',
      keyFacts:['Peel 模式通常會等待 Label Taken Sensor 狀態，不一定是機器當機。','底紙拉得過緊/過鬆都會影響 Peel Sensor 與定位。','新增/拆裝 Dispenser 後通常需要重新設定或校正。'],
      engineering:['先確認普通 Tear-off 模式能正常連印，再進 Peel 模式。','Sensor 表面、反射片與底紙路徑先清潔。','Rewinder/Clutch 拆裝規則依機型，先拍照記錄。'],
      verify:['取走標籤後自動續印','底紙回捲張力正常','50 張剝紙不中斷','切回 Tear-off 也正常'],
      flow:[['切回普通模式','先用 Tear-off/Normal 確認本體走紙正常。',['正常','本體也異常'],'本體異常先修其他問題。'],['確認 Peel 設定/路徑','Print Mode、底紙穿法、回捲方向是否正確。',['正確','已修正'],'先排設定。'],['測 Label Taken Sensor','遮擋/移開標籤，觀察狀態是否改變。',['有變化','無變化'],'無變化進 Sensor/線束。'],['檢查 Rewinder/Clutch','看底紙回收是否打滑、過緊、完全不轉。',['正常','Clutch/傳動異常'],'修傳動。'],['模組/線束收斂','Sensor、Rewinder、線束交叉後再判 Interface/Mainboard。',['模組故障','主板方向高','已修復'],'主板最後。']]},
    psuload:{
      category:'PSU／負載／間歇重啟',name:'PSU 負載掉壓／使用中突然重啟',severity:'高',
      summary:'只有列印、切刀動作或高速走紙時才重啟，不能只看待機電壓。要分 PSU 負載能力、短路/過載模組、Motor/Cutter 峰值負載、接頭接觸不良與 Mainboard。',
      keyFacts:['待機正常不代表負載時 PSU 正常。','某選配模組接上才重啟，優先查該模組/線束而非直接換 PSU。','精確 Rail 與允許紋波需 Service Manual/PSU 規格及合適儀器。'],
      engineering:['帶電量測需防止探針滑脫短路。','一般三用電表可看平均 DC，但不能可靠判斷高速瞬態/紋波。','隔離 Cutter/Peeler/Rewinder/I-O 後可降低負載並幫助定位。'],
      verify:['待機/列印/切刀都不重啟','冷機熱機皆正常','連印 30 分鐘','外接模組逐一接回正常'],
      flow:[['記錄觸發負載','是列印加熱、馬達加速、切刀或開機時重啟。',['已確認','不固定'],'固定觸發最有價值。'],['隔離非必要模組','斷電移除 Cutter/Peeler/Rewinder/I-O 再測。',['隔離後正常','仍重啟'],'正常表示模組/負載方向高。'],['檢查 PSU/接頭','依手冊量正確 Rail，並檢查燒痕、鬆接、氧化。',['掉壓/不穩','穩定'],'掉壓再分 PSU 與過載。'],['交叉 PSU/負載','可行時以正常 PSU 或已知正常負載交叉。',['PSU方向高','負載方向高','主板方向高'],'避免只憑一次電壓。'],['長時間驗證','全部接回後做熱機與高負載測試。',['通過','仍重啟'],'仍異常查 Mainboard/熱故障。']]}
  };

  const PACKS=[
    {id:'zebra-zt600-hw',brand:'Zebra',label:'ZT610 / ZT620',models:['ZT610','ZT620'],sources:['zebra_zt600','zebra_zt600_tw'],topics:['harness','rewind','interface','firmware','bearing','headopen','peel','psuload']},
    {id:'zebra-xi4-hw',brand:'Zebra',label:'110Xi4 / 220Xi4',models:['110Xi4','220Xi4'],sources:['zebra_xi4','zebra_110'],topics:['harness','rewind','interface','bearing','headopen','psuload']},
    {id:'zebra-zt400-hw',brand:'Zebra',label:'ZT411 / ZT421',models:['ZT411','ZT421'],sources:['zebra_zt400'],topics:['harness','rewind','firmware','bearing','headopen','peel']},
    {id:'tsc-mh-hw',brand:'TSC',label:'MH241 / MH341 / MH641 / MH640',models:['MH241','MH341','MH641','MH640'],sources:['tsc_mh241','tsc_mh_product'],topics:['harness','rewind','interface','firmware','bearing','peel','psuload']},
    {id:'tsc-thte-hw',brand:'TSC',label:'TH240 / TH340 / TE200 / TE210 / TE300 / TE310',models:['TH240','TH340','TE200','TE210','TE300','TE310'],sources:['tsc_th240','tsc_th_product','tsc_te'],topics:['harness','rewind','interface','firmware','headopen']},
    {id:'argox-p4-hw',brand:'Argox',label:'P4 / P4 Pro',models:['P4-650'],sources:['argox_p4','argox_p4_product','argox_p4pro'],topics:['harness','rewind','interface','firmware','bearing','headopen','psuload']},
    {id:'argox-ix4-hw',brand:'Argox',label:'iX4 Pro',models:['iX4-200 Pro','iX4-250 Pro','iX4-300 Pro'],sources:['argox_ix4pro','argox_manuals'],topics:['harness','rewind','interface','firmware','bearing','peel','psuload']},
    {id:'honeywell-pm45-hw',brand:'Honeywell (Datamax/Intermec)',label:'PM45',models:['PM45'],sources:['honeywell_pm45','honeywell_pm45_cal'],topics:['harness','rewind','interface','firmware','headopen','peel','psuload']},
    {id:'honeywell-px940-hw',brand:'Honeywell (Datamax/Intermec)',label:'PX940',models:['PX940'],sources:['honeywell_px940','honeywell_px940_faq'],topics:['harness','rewind','interface','firmware','bearing','headopen','peel']},
    {id:'datamax-iclass-hw',brand:'Honeywell (Datamax/Intermec)',label:'I-Class Mark II',models:['I-4212e','I-4310e','I-4606e'],sources:['honeywell_iclass','datamax_iclass_op','datamax_iclass_maint'],topics:['harness','rewind','interface','bearing','headopen','psuload']},
    {id:'sato-cl4nx-hw',brand:'SATO',label:'CL4NX Plus',models:['CL4NX Plus'],sources:['sato_clnx_hw','sato_clnx_errors','sato_clnx_cal'],topics:['harness','rewind','interface','firmware','bearing','headopen','peel','psuload']},
    {id:'godex-zx-hw',brand:'GoDEX',label:'ZX400i+ / ZX1000i+',models:['ZX420i+','ZX430i+','ZX1200i+','ZX1300i+','ZX1600i+'],sources:['godex_zx400i','godex_zx1000i','godex_family'],topics:['harness','rewind','interface','firmware','bearing','headopen']},
    {id:'toshiba-bex-hw',brand:'TOSHIBA',label:'B-EX Series',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T'],sources:['toshiba_bex4','toshiba_manuals'],topics:['harness','rewind','interface','firmware','bearing','headopen','peel','psuload']}
  ];

  for(const p of PACKS){
    for(const key of p.topics){
      const t=TOPICS[key];
      addRepairKB({
        id:`${p.id}-${key}`,
        brand:p.brand,models:p.models,category:t.category,
        title:`${p.label}｜${t.name}`,severity:t.severity,sources:p.sources,
        summary:t.summary,
        keyFacts:[...t.keyFacts,`適用機型：${p.models.join(' / ')}。`],
        engineering:t.engineering,
        verify:t.verify,
        flow:t.flow
      });
    }
  }
})();
