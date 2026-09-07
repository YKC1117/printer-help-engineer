'use strict';

// 工程師工作流程層：保養、拆裝後校正、板件更換、A/B 交叉、料號核對、完修驗證、收機基準。
// 不寫死跨機型共用週期/扭力/Pin/電壓；精確值仍以該機 Service/Parts Manual 為準。
(function(){
  const W={
    pm:{
      title:'預防保養／PM：Printhead、Platen、Sensor、Cutter、Drive 巡檢',
      category:'SOP／預防保養',severity:'SOP',
      summary:'保養頻率應依列印量、粉塵、膠材、環境與故障紀錄決定，不用一個固定月份套全部機台。每次 PM 固定檢 Printhead、Platen、Sensor、Cutter、Gear/Belt、線束與耗材路徑。',
      keyFacts:['保養週期以使用量與污染程度為主，不把所有機型寫死成同一週期。','Printhead/Platen 的清潔與磨耗紀錄可用來判斷是否需要提早更換。','Cutter、Peel、Rewind 等選配只在實機有安裝時納入。'],
      engineering:['先記錄 Counter/使用狀態與客戶紙材，再開始清潔。','避免未經原廠允許的油脂或溶劑進入 Sensor/Printhead/Cutter。','PM 完成後一定做 Calibration、Self Test 與實際耗材驗證。'],
      verify:['外觀與走紙路徑乾淨','FEED/Calibration 正常','測試圖品質一致','選配功能與通訊正常'],
      flow:[['記錄基準','記錄機型、S/N、Counter、紙材、碳帶、錯誤紀錄與選配。',['完成','資料不足'],'先建立可追蹤基準。'],['清潔耗材路徑','Printhead、Platen、Media/Ribbon Sensor、導紙、Peel/Cutter 區域依原廠方式清潔。',['完成','發現磨耗/損傷'],'異常先記錄再處理。'],['檢查機構','看 Gear/Belt/Bearing/Clutch/Platen 是否裂、鬆、偏磨、打滑。',['正常','有異常'],'有異常轉零件級排查。'],['重新校正','依實際 Gap/Mark/Continuous 與 Ribbon 狀態做校正。',['成功','失敗'],'失敗轉 Sensor/耗材。'],['完修驗證','Self Test、實際標籤、通訊、選配、斷電重開。',['通過','未通過'],'未通過不結案。']]},
    post:{
      title:'拆裝／換件後校正：Printhead、Platen、Sensor、Cutter',
      category:'SOP／拆裝後校正',severity:'SOP',
      summary:'換件後不能只確認「會動」。Printhead/Platen/Sensor/Cutter 會影響定位、濃度、壓力、回退與切位，應重新建立基準並做連續列印驗證。',
      keyFacts:['Printhead 或 Platen 更換後，先用低至中等熱量建立品質基準。','Sensor 被拆動或更換後，重新確認位置並 Calibration。','Cutter/Peel/Rewind 拆裝後要驗證 Home、Backfeed、Cut/Peel Offset。'],
      engineering:['裝回前確認線束沒有夾傷、接頭沒有退 Pin。','每次只調一個 Offset/Pressure 變數，保留可回復的基準。','不同 DPI/硬體版零件不可只靠外觀判斷相容。'],
      verify:['冷開機正常','Calibration 成功','50~100 張定位穩定','品質/切位/剝紙正常'],
      flow:[['外觀復核','確認螺絲、卡扣、接頭、線束、軸套、E-ring/齒輪方向。',['正常','需重裝'],'先消除裝配錯誤。'],['建立原廠基準','恢復合理速度/Darkness/Pressure/Offset，不沿用為補償舊故障而設的極端值。',['完成','需查手冊'],'先有基準。'],['執行 Calibration','依實際紙材與列印模式重新校正。',['成功','失敗'],'失敗先查 Sensor/紙材。'],['測試功能','Self Test、FEED、列印、Cutter/Peel/Rewind。',['正常','異常'],'異常回到對應模組。'],['連續與重開驗證','連印、冷/熱機、斷電重開後再測。',['通過','未通過'],'未通過不可交機。']]},
    board:{
      title:'Mainboard／Interface Board／PSU 更換後初始化與復原',
      category:'SOP／板件更換',severity:'高',
      summary:'板件更換不是裝上就算完成。換前先備份可讀設定，核對 DPI/Revision/選配；換後需確認 Firmware、語言/地區、Media/Ribbon、IP、Port、感應器、Offset 與選配模組。',
      keyFacts:['同系列主板也可能因 DPI、Revision、Firmware 或選配不同而不能直接互換。','網路板/主板更換後最容易遺漏 IP、DHCP/Static、RAW/LPR 等設定。','PSU 更換後要做負載測試，不只量空載。'],
      engineering:['可讀舊板時先保存 Configuration/Network Config。','主板更換前先確認外部模組沒有短路，避免新板再次損壞。','Firmware 升級/降級必須依原廠相容性與復原流程。'],
      verify:['Cold boot 正常','設定斷電保存','USB/LAN/Serial 正常','滿載列印與選配正常'],
      flow:[['換前備份','保存 Configuration、Network、Media、Darkness/Speed、Offset、選配。',['完成','舊板無法讀取'],'無法讀取就以客戶現場設定重建。'],['核對板件','Model/SN/DPI/Revision/Firmware/Option connector 是否相符。',['確認','不確定'],'不確定先停下料/上電。'],['安全裝回','斷電、ESD、檢查線束方向與外部模組短路。',['完成','發現異常'],'先修外部異常。'],['初始化與復原','確認 Firmware、基本參數、IP/Port、Sensor、Print Method、選配。',['完成','需原廠程序'],'依該機文件。'],['負載驗證','連印、Cutter/Peel/Rewind、通訊、斷電保存。',['通過','失敗'],'失敗依功能分流。']]},
    ab:{
      title:'A-B Swap 交叉測試：Sensor、線束、Motor、Printhead、板件',
      category:'SOP／交叉測試',severity:'高價值',
      summary:'A-B 交叉測試的核心是一個變因一次換一個，記錄故障是否跟著零件移動。可大幅降低「猜 Sensor、猜主板、猜 Motor」造成的誤換。',
      keyFacts:['交換前要先確認兩台機型、DPI、Revision、選配與零件相容。','一次換一個變因；同時換 Sensor+線束就失去診斷價值。','若懷疑外部短路，不要把正常主板直接接到未知負載。'],
      engineering:['每次交換記 A機/B機、舊件/正常件、交換前後症狀。','高價板件先用線束/負載隔離，再考慮交叉。','交叉完成要把零件恢復並標示，避免後續混料。'],
      verify:['故障跟著零件→零件方向高','故障留在原機→線束/主板/機構方向','交換結果有紀錄','正常件未被二次損壞'],
      flow:[['確認相容性','核對 Model/DPI/Revision/Connector/Option。',['相容','不相容/不確定'],'不確定不要交換。'],['建立交換前基準','兩台各跑相同測試並記錄症狀。',['完成','無法建立'],'仍記可觀察現象。'],['只交換一件','Sensor/線束/Motor/Head/板件一次只換一個。',['完成','發現安全風險'],'有風險停止。'],['比較結果','故障是否跟著零件移動。',['跟著零件','留在原機','兩邊都異常'],'依結果收斂。'],['恢復與標示','裝回、標記測試件、保存結果。',['完成','待處理'],'避免零件混淆。']]},
    part:{
      title:'零件採購／料號核對：Model、S/N、DPI、Revision、選配',
      category:'SOP／零件採購',severity:'高價值',
      summary:'正式下料前至少核對 Model、Serial Number、DPI、Hardware Revision、選配與舊件標籤/照片。不要只用「看起來一樣」或系列名採購 Printhead、Mainboard、Cutter、Platen。',
      keyFacts:['Printhead 常因 DPI 不同而料號不同。','Mainboard/Interface/Cutter 可能依 Revision、地區、選配而不同。','Superseded/Replacement P/N 要確認是原廠替代鏈，不自行猜相容。'],
      engineering:['拍舊件正反面、標籤、接頭與安裝方向。','記錄機器 S/N 與完整型號，不只寫 ZT610/P4。','若 Parts List 與舊件標籤不同，查替代料號/ECN 或向原廠/代理確認。'],
      verify:['料號與 DPI/Revision/Option 一致','新件接頭/機構吻合','換後功能全測','保留舊件與採購紀錄'],
      flow:[['收集機器資料','Model、S/N、DPI、Hardware/Firmware、選配。',['完成','缺資料'],'缺資料先補。'],['拍舊件','P/N、Revision、條碼、接頭、安裝方向。',['完成','標籤缺失'],'標籤缺失改查 Parts List。'],['核對 Parts List','確認原料號、替代料號與適用序號範圍。',['確認','有衝突/不確定'],'衝突先問原廠/代理。'],['到貨比對','外觀、接頭、Revision、DPI/規格。',['吻合','不吻合'],'不吻合不上機。'],['更換驗證','依換件 SOP 完整測試。',['通過','失敗'],'保留差異證據。']]},
    close:{
      title:'維修完成／交機驗證：冷機、連印、通訊、選配、保存設定',
      category:'SOP／完修驗證',severity:'結案',
      summary:'「當下能印一張」不足以結案。完修至少要測冷開機、FEED/Calibration、自我測試、實際耗材、連續列印、USB/LAN、選配與斷電保存。',
      keyFacts:['間歇故障需靠連續負載與冷/熱機測試才容易抓出。','設定/網路問題要斷電重開後再驗證。','客戶特殊紙/碳帶應用，最後一定用客戶實際耗材測。'],
      engineering:['保留修前/修後 Self Test 或照片。','記錄更換零件、設定變更與最終測試條件。','若只是暫時恢復、根因未明，不能標為完全修復。'],
      verify:['冷開機 3~5 次正常','50~100 張連印穩定','實際耗材品質/定位正常','通訊與選配正常','斷電後設定保存'],
      flow:[['冷開機','斷電等待後重開多次，看是否卡 Logo/報錯。',['正常','異常'],'異常不結案。'],['基本機構','FEED、Calibration、Self Test。',['正常','異常'],'回對應模組。'],['實際列印','客戶紙/碳帶、實際速度/濃度、連印。',['通過','失敗'],'保留失敗樣張。'],['通訊/選配','USB/LAN/Serial、Cutter/Peel/Rewind。',['通過','失敗'],'逐項處理。'],['斷電保存','關機重開再檢查設定/IP/Offset。',['通過','失敗'],'設定未保存需處理。']]},
    intake:{
      title:'收機／拆機前基準：先重現故障、保存設定、拍耗材路徑',
      category:'SOP／收機基準',severity:'高價值',
      summary:'收到故障機先建立基準再拆。拍面板錯誤、耗材路徑、接線，印 Configuration/Network Config，記錄紙/碳帶與客戶描述；避免一收到就 Reset 導致原始證據消失。',
      keyFacts:['客戶說「不能印」可能是 Printer、Driver、Port、BarTender 或耗材問題，先重現才知道。','Factory Reset 會清掉重要設定證據，不應當第一步。','間歇問題要記觸發條件：冷機、熱機、連印、切刀、網路等。'],
      engineering:['收到機器先拍照記錄接頭、紙路、碳帶方向與選配。','能印設定頁就先保存 Configuration/Network/Sensor 資訊。','拆機前標示螺絲、線束與模組，避免人為新增故障。'],
      verify:['原始症狀已重現/描述清楚','設定與照片已保存','測試耗材/線材已記錄','拆機前基準完整'],
      flow:[['記錄客戶描述','什麼情境、何時開始、是否間歇、最近是否換耗材/電腦/設定。',['完成','資訊不足'],'不足仍保留原話。'],['拍外觀/接線/耗材','包含錯誤畫面、紙路、Ribbon、USB/LAN、選配。',['完成','無法拍'],'至少文字記錄。'],['重現故障','用客戶原條件先測，再用已知正常條件交叉。',['已重現','無法重現'],'無法重現轉間歇測試。'],['保存設定','Configuration/Network/Sensor/Profile 能讀就先保存。',['完成','機器無法輸出'],'不能輸出就記面板狀態。'],['再開始拆機','先由外到內、一次一變因。',['開始','暫停'],'保留基準。']]}
  };

  const F=[
    {id:'zt600',brand:'Zebra',label:'ZT610 / ZT620',models:['ZT610','ZT620'],sources:['zebra_zt600','zebra_cal']},
    {id:'xi4',brand:'Zebra',label:'110Xi4 / 220Xi4',models:['110Xi4','220Xi4'],sources:['zebra_xi4','zebra_110']},
    {id:'zt400',brand:'Zebra',label:'ZT411 / ZT421',models:['ZT411','ZT421'],sources:['zebra_zt400','zebra_cal']},
    {id:'tsc-mh',brand:'TSC',label:'MH241 / MH341 / MH641 / MH640',models:['MH241','MH341','MH641','MH640'],sources:['tsc_mh241','tsc_mh_product']},
    {id:'tsc-th',brand:'TSC',label:'TH240 / TH340',models:['TH240','TH340'],sources:['tsc_th240','tsc_th_product']},
    {id:'argox-p4',brand:'Argox',label:'P4 / P4 Pro',models:['P4-650','P4-250 Pro','P4-350 Pro','P4-650 Pro'],sources:['argox_p4','argox_p4pro']},
    {id:'argox-ix4',brand:'Argox',label:'iX4 Pro',models:['iX4-200 Pro','iX4-240 Pro','iX4-250 Pro','iX4-350 Pro'],sources:['argox_ix4pro','argox_manuals']},
    {id:'honeywell-pm45',brand:'Honeywell (Datamax/Intermec)',label:'PM45',models:['PM45'],sources:['honeywell_pm45']},
    {id:'datamax-iclass',brand:'Honeywell (Datamax/Intermec)',label:'I-Class Mark II',models:['I-4212e','I-4310e','I-4606e'],sources:['honeywell_iclass','datamax_iclass_maint']},
    {id:'sato-cl4nx',brand:'SATO',label:'CL4NX Plus',models:['CL4NX Plus'],sources:['sato_clnx_errors','sato_clnx_hw']},
    {id:'godex-industrial',brand:'GoDEX',label:'GoDEX Industrial',models:['GX4200i','GX4300i','GX4600i','ZX420i+','ZX430i+','ZX1200i+','ZX1300i+','ZX1600i+'],sources:['godex_family','godex_zx1000i','godex_zx400i']},
    {id:'toshiba-bex',brand:'TOSHIBA',label:'B-EX Series',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T'],sources:['toshiba_bex4','toshiba_manuals']}
  ];

  for(const f of F){
    for(const [k,w] of Object.entries(W)){
      addRepairKB({
        id:`workflow-${f.id}-${k}`,
        brand:f.brand,models:f.models,
        title:`${f.label}｜${w.title}`,
        category:w.category,severity:w.severity,
        summary:w.summary,
        keyFacts:[...w.keyFacts,`本篇套用於 ${f.label}；精確選單、扭力、Pin、電壓、料號仍以該機文件為準。`],
        engineering:w.engineering,
        verify:w.verify,
        flow:w.flow,
        sources:f.sources,
        evidence:'workflow-sop'
      });
    }
  }
})();
