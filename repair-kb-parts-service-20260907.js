'use strict';

// 零件／拆裝／換件判斷層：不硬填未核對料號、Pin、電壓或扭力。
// 真正下單前，以該機序號、DPI、選配與原廠 Parts/Service Manual 核對。
(function(){
  const C={
    printhead:{
      cat:'零件／Printhead／換件判斷',name:'Printhead／印字頭更換條件',sev:'高價值',
      summary:'印字頭不能因為「印很淡」就直接更換。先固定耗材、速度、Darkness，清潔 Printhead/Platen，再判斷固定缺線、接點、Head Cable 與驅動。只有缺陷固定且交叉後仍跟著 Printhead，才進入換頭。',
      facts:['固定同位置缺線比整體偏淡更支持 Printhead element 問題。','換頭前先確認 Head Cable、接頭、Platen 與壓力，避免新頭裝上仍有同一症狀。','料號需依機型、DPI、硬體版本與序號核對，不能只看外觀。'],
      eng:['拆印字頭前斷電並等熱端冷卻；避免手指碰觸列印線。','若懷疑驅動異常，先依 Service Manual 檢查線束與輸出，避免故障主板損壞新 Printhead。','更換後先以低到中等 Darkness 做基準測試，再逐步調整。'],
      verify:['內建測試圖無固定白線','左右濃度一致','條碼掃描穩定','連印 100 張品質一致'],
      flow:[['建立基準圖','固定紙、碳帶、速度與 Darkness，印 Self Test 或固定測試圖。',['完成','無法建立'],'先排軟體變數。'],['清潔與外觀檢查','清 Printhead / Platen，檢查刮傷、沾膠、燒痕與壓力。',['清潔後正常','仍固定缺線','整體偏淡'],'整體偏淡先別換頭。'],['檢查 Head Cable／接頭','斷電檢查插頭是否歪斜、氧化、鬆脫或線材受壓。',['正常','線材/接頭異常'],'線材異常先修。'],['交叉判斷','若有已知正常 Printhead/Head Cable，依維修規範交叉。',['缺陷跟著 Printhead','缺陷不跟著 Printhead','無法交叉'],'不跟著頭就回查驅動/機構。'],['核對料號並更換','依序號、DPI、版本與原廠 Parts List 核對。',['更換完成','料號待確認'],'不要只憑系列名稱下料。']]},
    platen:{
      cat:'零件／Platen／走紙',name:'Platen／滾輪更換條件',sev:'高頻',
      summary:'Platen 硬化、凹痕、偏磨、殘膠或表面失去摩擦力，會造成打滑、偏移、局部淡、皺碳與定位不穩。先清潔與目視，再用手感與連續列印確認，不要把所有走紙問題都判成 Motor。',
      facts:['局部凹痕常會對應固定位置的印字或走紙異常。','表面油污/殘膠與真正橡膠硬化要分開，先清潔再判定。','更換 Platen 後仍偏紙，要回查導紙、壓力、軸承與平行度。'],
      eng:['斷電拆裝，記錄齒輪、軸套、E-ring/固定件方向。','裝回後確認左右軸承/卡扣完全到位，避免新滾輪偏心。','寬幅工業機更要檢查整根平行與壓力分布。'],
      verify:['手動轉動順暢無卡點','FEED 不打滑','50~100 張定位無累積偏移','左右列印濃度正常'],
      flow:[['清潔與目視','清掉殘膠/粉塵，看表面是否龜裂、硬化、凹槽或偏磨。',['正常','明顯老化/損傷','清潔後恢復'],'清潔後恢復不需換件。'],['手動轉動檢查','斷電後轉動 Platen，看偏心、阻力與軸承鬆動。',['正常','偏心/卡滯/鬆動'],'記錄異常位置。'],['連續列印比對','看是否固定打滑、偏移、局部淡或皺碳。',['症狀與 Platen 對應','無明確對應'],'無對應先查其他機構。'],['核對零件版本','依機型、寬度、DPI/硬體版本與序號核對 Platen Assy。',['已確認','待確認'],'外型相似不代表通用。'],['更換後校正','裝回後做 Calibration/定位與品質測試。',['正常','仍異常'],'仍異常回查壓力、Sensor、Drive。']]},
    sensor:{
      cat:'零件／Sensor／線束',name:'Sensor／感應器更換條件',sev:'高價值',
      summary:'Sensor 不應因一次 Calibration 失敗就更換。先確認 Media Type、Sensor 位置、髒污、校正流程與讀值變化；只有訊號固定、完全無變化、線束正常且交叉測試支持，才把 Sensor 列為主要故障件。',
      facts:['Gap、Black Mark、Ribbon、Head Open、Peel/Label Taken 是不同 Sensor，不可混為一個。','Sensor 值固定或遮擋/放開都無變化，比單純跳標更支持硬體異常。','Pin 定義與正常電壓必須查該機 Service Manual，不能沿用其他型號數值。'],
      eng:['先斷電再插拔 Sensor 與線束。','量測前先確認接頭腳位與 GND/供電定義；不明時不要帶電亂探針。','若有正常機交叉，先換線束/模組再判主板輸入。'],
      verify:['遮擋/放開時讀值有合理變化','Calibration 可完成','50 張無誤報','重開機後仍正常'],
      flow:[['設定/位置/清潔','確認耗材模式、Sensor 位置與清潔。',['正確','已修正'],'先排最常見。'],['執行校正','用該機原廠 Auto/Manual Calibration。',['成功','仍失敗'],'失敗再看讀值。'],['觀察讀值變化','遮擋/放開或讓 Gap/Mark/Ribbon 通過，觀察 Sensor Profile/診斷值。',['變化正常','固定/幾乎無變化'],'固定才進硬體。'],['斷電查線束／接頭','檢查折傷、氧化、鬆脫與端子退 Pin。',['線束異常','正常'],'線束先於主板。'],['交叉 Sensor／主板收斂','正常 Sensor 交叉後仍同樣，再查 Mainboard input。',['Sensor 故障','主板輸入方向高','已修復'],'保留測試結果。']]},
    cutter:{
      cat:'零件／Cutter／模組',name:'Cutter 模組更換條件',sev:'高',
      summary:'Cutter Error 要先分「設定未啟用」、「刀具被殘膠/紙屑卡住」、「Motor 有動但 Home 不回」、「完全無驅動」。只有清潔、復位、線束與 Sensor/Motor 分流後仍失敗，才考慮整組 Cutter Assy。',
      facts:['會動但回不到 Home，Home Sensor/機構卡滯優先。','完全不動要先確認 Print Mode/Cut command，再查 Cutter 線束與供電。','整組 Cutter 更換前應先判斷 Motor、Sensor、刀片機構是否可單獨維修。'],
      eng:['Cutter 區域先斷電，避免手指進入刀口。','不要用手硬推卡死刀片造成齒輪或刀座二次損壞。','料號需核對 Full Cut/Partial Cut、機型與選配版本。'],
      verify:['連續切 50 次無卡刀','切位一致','開關機後 Home 正常','無異音/過熱'],
      flow:[['確認設定與命令','確認 Cutter 已安裝、Print Mode/Driver/命令真的要求切紙。',['正確','設定錯誤'],'設定錯先修正。'],['斷電清潔刀區','移除紙屑、殘膠、異物，看刀片與滑軌。',['清潔後正常','仍卡滯','外觀正常'],'勿硬推。'],['觀察動作型態','上電測試：完全不動、動一下、來回但不回 Home。',['完全不動','動一下卡住','Home 異常'],'分流 Motor/機構/Sensor。'],['檢查線束／Home Sensor／Motor','依 Service Manual 做接頭與模組測試。',['找到子件故障','整組模組方向高'],'不明 Pin 不帶電亂量。'],['核對 Cutter Assy 並更換','確認 Full/Partial Cut 與版本。',['完成','料號待確認'],'更換後做連續切測試。']]},
    drive:{
      cat:'零件／Motor／Gear／Drive',name:'Drive Motor／Gear／皮帶更換條件',sev:'高',
      summary:'FEED 不走或有異音時，先把「Motor 沒驅動」與「Motor 有轉但 Gear/Belt/Clutch/Platen 沒帶動」分開。很多舊機其實是齒輪裂、皮帶鬆、軸承卡或回捲阻力，不一定是 Motor。',
      facts:['有馬達聲但紙不動，機械傳動優先於 Mainboard。','齒輪裂紋常在負載時才打滑，空轉看起來可能正常。','Motor 電阻、驅動波形與額定電壓只能依該機 Service Manual。'],
      eng:['斷電後手動轉動整個 Drive Train，找卡點與週期性阻力。','在拆 Gear/Belt 前拍照記錄齒位、墊片與張力位置。','先處理卡滯再換 Motor，否則新 Motor 可能再次過載。'],
      verify:['FEED 低速/高速都正常','50~100 張無失步','無週期性喀聲','Motor/Gear 不異常發熱'],
      flow:[['排除錯誤狀態','Head Open/Media Out/Cutter Error 等先解除。',['已解除','仍有錯誤'],'錯誤可能禁止 Motor。'],['聽/看 Motor 與 Gear','判斷完全不動、Motor 有聲、Gear 打滑或週期異音。',['完全不動','Motor有動','Gear/皮帶異常'],'先分電與機械。'],['斷電手轉 Drive Train','找 Platen、Gear、Belt、Clutch、Rewinder 卡滯。',['順暢','有卡點/鬆脫/裂紋'],'卡滯先修。'],['檢查 Motor 線束／驅動','依 Service Manual 或正常件交叉。',['Motor/線束異常','Driver/Mainboard方向高','正常'],'主板最後。'],['換件後負載測試','更換 Gear/Belt/Motor 後連續列印。',['通過','仍異常'],'仍異常回查負載與驅動。']]},
    power:{
      cat:'零件／PSU／Mainboard',name:'PSU／Mainboard 更換條件',sev:'高風險',
      summary:'完全不開機、反覆重啟或帶負載掉電時，不要直接換 Mainboard。先確認 AC 輸入、PSU、短路負載與外接模組；PSU 在正確測點正常而主板仍無啟動，才把 Mainboard 提高到主要嫌疑。',
      facts:['「面板黑」不等於「整台沒電」，先看風扇、LED、網路 Link、初始化聲。','PSU 空載正常、接某模組就掉壓，應先查該負載/線束。','Rail 電壓與測點完全依 Service Manual，不跨型號套數值。'],
      eng:['帶電量測只由熟悉低壓/市電安全的工程人員執行。','斷電等待電容放電後才插拔 PSU/Mainboard 接頭。','換 Mainboard 前記錄序號、設定、韌體、網路參數與選配。'],
      verify:['冷開機 5 次正常','連印 30 分鐘不重啟','所有選配逐一接回正常','網路/USB/RTC/設定保存正常'],
      flow:[['判斷是否真的無電','看 LED、風扇、Link、初始化。',['完全無上電','部分上電'],'部分上電優先查面板/主板支路。'],['確認 AC 與 PSU','依原廠安全程序確認輸入與 DC Rail。',['正常','PSU異常','不穩/掉壓'],'不猜電壓。'],['隔離外接負載','斷電後逐一隔離 Cutter/Peeler/Rewinder/I-O/外接板。',['隔離後正常','仍異常'],'隔離後正常先修負載。'],['Mainboard 前置確認','PSU/負載/線束正常，仍無啟動或持續重啟。',['主板方向高','發現其他原因'],'保留量測。'],['換板後設定恢復','核對板號/版本，恢復必要設定與韌體。',['驗證通過','仍異常'],'仍異常回查 PSU/負載/面板。']]}
  };

  const F=[
    {id:'zt600',brand:'Zebra',label:'ZT610 / ZT620',models:['ZT610','ZT620'],sources:['zebra_zt600','zebra_zt600_tw'],parts:['printhead','platen','sensor','cutter','drive','power']},
    {id:'xi4',brand:'Zebra',label:'110Xi4 / 220Xi4',models:['110Xi4','220Xi4'],sources:['zebra_xi4','zebra_110'],parts:['printhead','platen','sensor','drive','power']},
    {id:'zt400',brand:'Zebra',label:'ZT411 / ZT421',models:['ZT411','ZT421'],sources:['zebra_zt400'],parts:['printhead','platen','sensor','cutter']},
    {id:'tsc-th',brand:'TSC',label:'TH240 / TH340',models:['TH240','TH340'],sources:['tsc_th240','tsc_th_product'],parts:['printhead','platen','sensor','cutter']},
    {id:'tsc-mh',brand:'TSC',label:'MH241 / MH341 / MH641 / MH640',models:['MH241','MH341','MH641','MH640'],sources:['tsc_mh241','tsc_mh_product'],parts:['printhead','platen','sensor','drive']},
    {id:'argox-p4',brand:'Argox',label:'P4-650',models:['P4-650'],sources:['argox_p4','argox_p4_product'],parts:['printhead','platen','sensor','drive']},
    {id:'honeywell-pm45',brand:'Honeywell (Datamax/Intermec)',label:'PM45',models:['PM45'],sources:['honeywell_pm45','honeywell_pm45_cal'],parts:['printhead','platen','sensor','cutter']},
    {id:'datamax-iclass',brand:'Honeywell (Datamax/Intermec)',label:'I-Class Mark II',models:['I-4212e','I-4310e','I-4606e'],sources:['honeywell_iclass','datamax_iclass_maint'],parts:['printhead','platen','sensor','drive','power']},
    {id:'sato-cl4nx',brand:'SATO',label:'CL4NX Plus',models:['CL4NX Plus'],sources:['sato_clnx_hw','sato_clnx_errors'],parts:['printhead','platen','sensor','cutter']},
    {id:'toshiba-bex',brand:'TOSHIBA',label:'B-EX4 / B-EX6',models:['B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T'],sources:['toshiba_bex4','toshiba_manuals'],parts:['printhead','platen','sensor','drive']},
    {id:'godex-zx',brand:'GoDEX',label:'ZX400i+ / ZX1000i+',models:['ZX420i+','ZX430i+','ZX1200i+','ZX1300i+','ZX1600i+'],sources:['godex_zx400i','godex_zx1000i'],parts:['printhead','platen','sensor','drive']}
  ];

  for(const f of F){
    for(const p of f.parts){
      const t=C[p];
      addRepairKB({
        id:`parts-${f.id}-${p}`,
        brand:f.brand,
        models:f.models,
        category:t.cat,
        title:`${f.label}｜${t.name}`,
        severity:t.sev,
        sources:f.sources,
        summary:t.summary,
        keyFacts:t.facts,
        engineering:[...t.eng,`此篇套用於 ${f.label}；拆裝細節、螺絲位置、零件編號與量測點仍以該型號 Service/Parts Manual 為準。`],
        verify:t.verify,
        flow:t.flow
      });
    }
  }
})();
