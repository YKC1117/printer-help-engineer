'use strict';

// 工程師工作流程層：保養、拆裝後校正、板件更換、交叉測試、零件採購、結案驗證。
// 不硬填沒有原廠依據的固定保養時數、扭力、Pin 或電壓；精確規格仍以該機 Service/Parts Manual 為準。
(function(){
  const WF={
    pm:{
      category:'保養／PM／預防維護',title:'預防保養週期建立／清潔／磨耗件巡檢',severity:'例行',
      summary:'不要用一個固定月份套所有客戶。依紙塵、膠材、列印量、環境與原廠建議建立 PM 週期，並把 Printhead、Platen、Sensor、Cutter/Peel、Gear/Belt、風道與連接器列為固定巡檢項。',
      keyFacts:['高紙塵、膠材與高印量環境需要比乾淨辦公環境更密集的巡檢。','若原廠沒有明確固定時數，不自行宣稱一個通用更換週期。','保養紀錄要能回溯：日期、Counter/里程、耗材、清潔項目、磨耗件狀態。'],
      engineering:['先印基準測試圖再清潔，保留前後差異。','清潔液、工具與潤滑位置依原廠規範，避免在不該上油的地方加油。','發現 Platen 硬化、Head 固定缺線、Gear 裂紋等要轉成維修，不只記「已保養」。'],
      verify:['保養前後測試圖已保存','FEED/定位正常','無 Paper/Ribbon/Cutter 誤報','PM 日期與下次巡檢條件已記錄'],
      flow:[['記錄目前狀態','印設定頁/測試圖，記錄 Counter、錯誤與客戶耗材。',['完成','無法取得'],'先留下基準。'],['清潔固定區域','Printhead、Platen、Media/Ribbon Sensor、紙路、Cutter/Peel 可及區域。',['完成','發現異常'],'異常轉維修項。'],['巡檢磨耗件','看 Platen、Gear/Belt、Bearing/Bushing、Latch、Rewind/Clutch 與線束。',['正常','需更換/追蹤'],'不要只看外觀乾淨。'],['重新校正與測試','依耗材做 Calibration，印基準圖。',['通過','異常'],'異常回故障流程。'],['建立下次 PM 條件','依原廠建議、使用量與現場污染程度設定下次檢查。',['已記錄','待客戶確認'],'不要捏造固定週期。']]},
    postcal:{
      category:'拆裝後／校正／定位',title:'拆裝 Printhead／Platen／Sensor 後重新校正與定位',severity:'必要',
      summary:'拆過 Printhead、Platen、Media Sensor、Cutter 或主要走紙機構後，不應只確認「會印」。必須重新建立 Sensor、定位、壓力與品質基準，避免交機後才出現跳標或累積偏移。',
      keyFacts:['拆裝後固定偏移與累積偏移要分開判斷。','換 Platen/Head 後應重新檢查左右濃度與走紙平行。','Sensor 有移動或換件後至少要重新做對應 Calibration。'],
      engineering:['先確認所有卡扣、E-ring、軸套、接頭與線束回到原位。','先低速/低負載測，再回到客戶實際速度與耗材。','若需要 Pressure/Offset 調整，一次改一項並留下原始值。'],
      verify:['FEED 一次一張','50~100 張無累積漂移','左右濃度一致','Cut/Peel/Backfeed 定位正常'],
      flow:[['機構復原檢查','確認軸、齒輪、卡扣、線束、Head Lock/壓力機構都到位。',['完成','發現未復原'],'先修裝配。'],['Sensor/Media Calibration','依目前 Gap/Mark/Continuous 與 Ribbon 狀態重新校正。',['成功','失敗'],'失敗回 Sensor 流程。'],['列印品質基準','印固定測試圖，看固定白線、左右深淺與模糊。',['正常','異常'],'異常回 Head/Platen/壓力。'],['定位與選配測試','測 Tear-off/Cut/Peel/Backfeed，確認固定與累積偏移。',['正常','異常'],'一次只調一個 Offset。'],['客戶實際耗材長測','用客戶紙/碳帶連印。',['通過','仍異常'],'通過才交機。']]},
    board:{
      category:'板件更換／初始化／設定',title:'Mainboard／Interface Board／PSU 更換後初始化與復原',severity:'高風險',
      summary:'換板後不能只看能否開機。要核對機型/DPI/選配、韌體、序號相關設定、網路與列印模式，再做 Calibration 與完整功能測試。部分設定可能儲存在板件本身，更換後會回預設。',
      keyFacts:['板件料號相同外觀不代表所有 DPI/選配/韌體都可直接互換。','網路 IP、Print Method、Media Type、Darkness、速度、語言/命令模式可能需要復原。','不確定序號寫入或工廠參數程序時，不自行亂寫 Service 參數。'],
      engineering:['拆板前先備份/拍照設定頁、Network Config 與選配狀態。','ESD 防護、斷電與放電後再拆接板件。','更換後若有 Service 初始化步驟，只依原廠 Service Manual 執行。'],
      verify:['冷開機 5 次正常','設定斷電後仍保存','USB/LAN/選配正常','Calibration + 實際列印通過'],
      flow:[['更換前備份','保存設定頁、IP、韌體、DPI、選配與客戶關鍵參數。',['完成','無法讀取'],'能留多少留多少。'],['核對替換板','核對機型、Revision、DPI/選配相容性與料號。',['確認','不確定'],'不確定先停止下料/上電。'],['安裝與最小開機','先只接必要模組測試能否穩定開機。',['正常','異常'],'異常先檢查接線與相容性。'],['復原設定/韌體','依原廠程序復原必要設定、網路與 Firmware。',['完成','需 Service 程序'],'不要猜工廠參數。'],['完整驗證','做 Calibration、Self Test、USB/LAN、Cutter/Peel 等實機測試。',['通過','仍異常'],'不通過不要交機。']]},
    cross:{
      category:'交叉測試／診斷紀錄',title:'已知正常件交叉測試／A-B Swap 紀錄方法',severity:'高價值',
      summary:'交叉測試的價值在於「故障是否跟著零件移動」。每次只換一個變因，記錄原機/正常機、零件序號或標記與結果，避免同時換三樣最後不知道真正故障件。',
      keyFacts:['故障跟著零件移動，比單次量測更能支持換件結論。','一次只改一項，否則 A-B Swap 失去診斷價值。','Printhead、PSU、Mainboard 等高風險件交叉前要先確認相容性，避免正常件被故障負載損壞。'],
      engineering:['先確認零件 Revision、DPI、電氣與機構相容。','用貼紙或紀錄標示 A 機/A 件/B 機/B 件。','若懷疑短路負載，先不要拿正常主板硬試。'],
      verify:['交叉前後症狀有紀錄','一次只更動一項','故障是否跟件移動已判定','恢復原配置後結果可重現'],
      flow:[['定義唯一變因','先寫下本次只要交叉哪個零件/線束/模組。',['完成','變因太多'],'縮小到一項。'],['確認相容與風險','Revision、DPI、供電、接口與可能短路風險。',['可交叉','不可/不確定'],'不確定不要硬換。'],['執行 A-B Swap','只交換指定元件，其他設定/耗材維持不變。',['完成','無法執行'],'記錄原因。'],['比較故障是否移動','看故障跟零件、跟機器或消失。',['跟零件','留在原機','結果不穩定'],'結果不穩定再縮條件。'],['恢復與複驗','恢復原件或替換件，再重現一次。',['結論確認','仍不確定'],'不確定就不要直接報換件。']]},
    procurement:{
      category:'零件採購／料號核對',title:'零件料號採購前核對／避免買錯版本',severity:'高價值',
      summary:'下單前至少核對完整型號、序號、DPI、機構寬度、硬體 Revision、選配與原廠 Parts List。Printhead、Mainboard、Cutter、Platen、PSU 外觀相近也可能不通用。',
      keyFacts:['完整 Model + S/N 通常比只報「ZT610」更安全。','Printhead 要特別核對 DPI；Cutter 要核對 Full/Partial Cut 與機型選配。','舊機料號可能有替代號/Superseded Part，應確認替代關係而非只找同字串。'],
      engineering:['拍零件標籤、接頭、安裝位置與整機銘牌。','若原廠 Parts List 有 serial break/revision 條件，要以實機序號為準。','二手/拆機件要記錄來源與已知功能，不能當全新正常件基準。'],
      verify:['Model/SN/DPI 已記錄','現有件料號/照片已保存','新舊料號替代關係已確認','到貨前有相容性判斷依據'],
      flow:[['收集整機資料','Model、S/N、DPI、寬度、韌體/硬體版本與選配。',['完成','資料不足'],'資料不足先不要下單。'],['收集舊件資料','拍料號、Revision、接頭、安裝方向與外觀。',['完成','無標籤'],'無標籤就靠 Parts List + S/N 核。'],['查 Parts/Service 文件','確認原廠料號、替代號與 serial break。',['確認','待確認'],'不只看購物網站名稱。'],['核對功能選配','Cutter/Peel/Rewind/Network/DPI 等。',['相容','不相容/不確定'],'不確定先詢原廠/供應商。'],['建立採購紀錄','保存料號、來源、價格、到貨測試需求。',['完成','待補'],'方便日後同機型快速叫料。']]},
    closeout:{
      category:'完修驗證／交機',title:'維修完成後完整驗證／避免「修好一項壞另一項」',severity:'必要',
      summary:'完修不能只確認原故障消失。至少做冷開機、FEED、Self Test、客戶耗材、實際連線與已拆選配功能，並確認設定斷電後保存。',
      keyFacts:['修 Cutter 也要確認走紙與定位；修 Mainboard 也要確認 USB/LAN/選配。','使用客戶實際紙與碳帶測試，比只印內建設定頁更接近交機風險。','間歇故障要拉長測試時間，不因連印 3 張正常就結案。'],
      engineering:['依故障類型設定壓力測試：連印、連切、反覆開關機、重插 USB/LAN。','記錄「原故障、故障件、處置、驗證結果」，日後可回查。','若還有未解警告或暫時性處置，要明確寫在維修紀錄。'],
      verify:['原故障不再出現','所有被拆/換模組功能正常','設定斷電保存','客戶實際工作流程測試通過'],
      flow:[['重現原故障測項','用最接近原故障的條件測試。',['通過','仍會發生'],'仍發生不可結案。'],['基本功能回歸','冷開機、FEED、Self Test、Sensor/Calibration。',['通過','異常'],'修復回歸問題。'],['連線/選配回歸','USB/LAN、Cutter/Peel/Rewind 等依實機選配測。',['通過','異常'],'拆過的都要測。'],['客戶耗材長測','實際紙/碳帶/速度/檔案連續測試。',['通過','異常'],'間歇問題延長測。'],['保存完修紀錄','故障原因、換件、設定、測試張數/次數與未解事項。',['完成','待補'],'紀錄是下次維修資料。']]},
    intake:{
      category:'收機／基準／維修前',title:'收機前基準紀錄／避免拆完才發現原始狀態不清楚',severity:'建議',
      summary:'收到故障機先不要急著拆。先拍外觀、耗材路徑、接線、錯誤畫面，印設定頁/Network Config（若可），並記錄客戶說法與可重現步驟。',
      keyFacts:['客戶說「不能印」可能是連線、耗材、Sensor、硬體或檔案，不先重現很容易修錯方向。','拆前照片能避免線束走向、墊片、壓力位置與選配接頭裝錯。','若機器完全無法上電，也要記錄 AC/PSU 初始狀態。'],
      engineering:['先保存現況再 Factory Reset；不要一開始就把證據洗掉。','記錄客戶耗材品牌/尺寸/碳帶與實際列印檔案。','有異味、燒焦、進水或撞擊先提高安全等級，避免直接上電。'],
      verify:['故障可重現或已明確記錄不可重現','拆前照片齊全','設定/網路資訊已備份','客戶耗材與需求已記錄'],
      flow:[['客戶描述轉成可測條件','記錄何時發生、頻率、最近換過什麼。',['完成','資訊不足'],'不足也先記未知。'],['外觀與安全檢查','撞擊、進水、燒焦、裸線、異物。',['安全可上電','需先斷電處理'],'安全優先。'],['保存設定與畫面','拍錯誤畫面、耗材路徑、接線，能印就印設定頁。',['完成','機器無法操作'],'無法操作也拍現況。'],['重現故障','用客戶耗材/檔案或最接近條件。',['可重現','暫時無法重現'],'無法重現就做壓力測試。'],['再開始拆解','定義第一個最小排查方向。',['進入維修','需更多資訊'],'避免盲拆。']]}
  };

  const families=[
    {id:'zebra-zt600',brand:'Zebra',label:'ZT610 / ZT620',models:['ZT610','ZT620'],sources:['zebra_zt600','zebra_zt600_tw']},
    {id:'zebra-xi4',brand:'Zebra',label:'110Xi4 / 220Xi4',models:['110Xi4','220Xi4'],sources:['zebra_xi4','zebra_110']},
    {id:'zebra-zt400',brand:'Zebra',label:'ZT411 / ZT421',models:['ZT411','ZT421'],sources:['zebra_zt400']},
    {id:'tsc-industrial',brand:'TSC',label:'MH / MB 工業系列',models:['MH241','MH341','MH641','MH640','MB240T','MB340T'],sources:['tsc_mh241','tsc_mh_product','tsc_mb']},
    {id:'tsc-desktop',brand:'TSC',label:'TH / TE / TTP / TX 桌上系列',models:['TH240','TH340','TE200','TE210','TE300','TE310','TTP-247','TTP-345','TTP-244 PRO','TX610'],sources:['tsc_th240','tsc_th_product','tsc_te','tsc_ttp','tsc_tx']},
    {id:'argox-main',brand:'Argox',label:'P4 / iX4 Pro / CP-CX',models:['P4-650','P4-250 Pro','P4-350 Pro','iX4-200 Pro','iX4-240 Pro','iX4-250 Pro','CP-2140EX','CP-3140EX','CX-2140 Pro','CX-3140 Pro'],sources:['argox_p4','argox_p4_product','argox_p4pro','argox_ix4pro','argox_cp']},
    {id:'honeywell-pm-px',brand:'Honeywell (Datamax/Intermec)',label:'PM45 / PX940',models:['PM45','PX940'],sources:['honeywell_pm45','honeywell_px940','honeywell_px940_faq']},
    {id:'datamax-industrial',brand:'Honeywell (Datamax/Intermec)',label:'I-Class / H-Class / M-Class',models:['I-4212e','I-4310e','I-4606e','H-4212X','H-4310X','H-4606X','M-4206','M-4210','M-4308'],sources:['honeywell_iclass','datamax_iclass_op','datamax_iclass_maint','datamax_hclass','datamax_mclass']},
    {id:'sato-clnx',brand:'SATO',label:'CL4NX Plus',models:['CL4NX Plus'],sources:['sato_clnx_cal','sato_clnx_quality','sato_clnx_hw']},
    {id:'godex-zx',brand:'GoDEX',label:'ZX 工業系列',models:['ZX420i+','ZX430i+','ZX1200i+','ZX1300i+','ZX1600i+','GX4200i','GX4300i','GX4600i'],sources:['godex_zx400i','godex_zx1000i','godex_family']},
    {id:'toshiba-bex',brand:'TOSHIBA',label:'B-EX / BA 系列',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T','BA410T','BA420T'],sources:['toshiba_bex4','toshiba_ba410','toshiba_manuals']}
  ];

  for(const f of families){
    for(const [k,w] of Object.entries(WF)){
      addRepairKB({
        id:`wf-${f.id}-${k}`,brand:f.brand,models:f.models,category:w.category,
        title:`${f.label}｜${w.title}`,severity:w.severity,sources:f.sources,
        summary:w.summary,keyFacts:w.keyFacts,engineering:w.engineering,verify:w.verify,flow:w.flow
      });
    }
  }
})();
