'use strict';

// Service-level 維修層：只放可被原廠文件或既有 A/B 級來源支撐的內容。
// 精確 Pin、電壓、扭力、保險絲規格若無該機 Service Manual，明確禁止猜測。

const SERVICE_LEVEL_ARTICLES=[
{
 id:'svc-zebra-zt600-cutter-module',brand:'Zebra',models:['ZT610','ZT620'],category:'Service｜Cutter／拆裝',severity:'高',
 title:'ZT610/ZT620｜Cutter 模組卡刀、清潔、拆裝與換件前判斷',sources:['zebra_zt600','zebra_zt600_tw'],
 summary:'ZT600 Cutter 問題先分「設定未進 Cutter Mode」、「刀片髒污／標籤膠造成阻力」、「刀片停在錯誤位置」、「馬達／Home Sensor／模組本體」；原廠維護章節明確要求 Cutter 清潔與拆裝只由熟悉人員操作。',
 keyFacts:['先斷電再碰刀片與模組。','刀片未完全露出時，原廠維護流程包含移除 Cutter mounting screw、滑動模組後再進一步處理。','會動但卡住與完全不動是不同故障路徑。'],
 engineering:['先確認 Print Mode / Driver 沒有把 Cutter 關掉。','清除殘膠、紙屑與卡紙後再測，避免把機械阻力誤判成馬達壞。','完全不動才進 Cutter Motor、Home/Position Sensor、線束與主板驅動；精確 Pin 依 Service Manual。'],
 verify:['連續切 50 張正常','Full/Partial Cut 依設定正確','無 Cutter Error','刀片回 Home 穩定'],
 flow:[['確認 Cutter Mode/命令','面板與 Driver/標籤軟體都確認切刀模式。',['正確','設定錯誤已修正'],'先排設定。'],['斷電檢查刀路','清除殘膠、紙屑、卡標，確認刀片是否可依原廠方式安全處理。',['乾淨正常','有卡料/膠','刀片位置異常'],'不可徒手硬扳。'],['單次切刀測試','觀察完全不動、抖動、動到一半、回不到 Home。',['完全不動','動到一半','回 Home 失敗','正常'],'分流。'],['模組隔離與接頭','斷電確認 Cutter 模組接頭、線束、固定與機構阻力。',['線束/接頭異常','模組機構異常','外觀正常'],'先模組後主板。'],['換件前驗證','可行時以正常 Cutter 模組交叉；仍不動再提高 Mainboard Driver 嫌疑。',['Cutter 模組故障','主板驅動方向高','已修復'],'保留交叉結果。']]},
{
 id:'svc-zebra-zt600-sensor-profile',brand:'Zebra',models:['ZT610','ZT620'],category:'Service｜Sensor／量測',severity:'高',
 title:'ZT610/ZT620｜Sensor Profile 進階判讀：Paper/Ribbon Out 不亂換 Sensor',sources:['zebra_zt600','zebra_jg','zebra_cal'],
 summary:'遇到 Paper Out、Ribbon Out、跳標、校正失敗時，先利用 Calibration 與 Sensor Profile 判斷訊號是否真的能區分 Label/Gap/Mark/Ribbon，再決定是否拆 Sensor。',
 keyFacts:['波形有明顯變化但仍報錯，優先回查 Media Type、Print Method、Threshold/Calibration 與 Driver 覆蓋。','訊號長時間固定或變化極小，才提高 Sensor、線束或輸入電路嫌疑。','同一卷紙換另一台正常，可快速切掉耗材因素。'],
 engineering:['清潔與位置修正先於換 Sensor。','斷電插拔 Sensor/線束；精確測點與電壓只依 Service Manual。','可用已知正常 Sensor 交叉時，先交叉再判主板。'],
 verify:['Profile 可清楚分辨標籤與間隙/黑標','50 張無跳標','重開機不誤報 Paper/Ribbon Out','換卷後可重新校正'],
 flow:[['建立正常耗材基準','同一紙材在已知正常機器或使用已知正常耗材。',['完成','無法交叉'],'至少先確認紙材規格。'],['執行 Calibration','完整跑 Media/Ribbon Calibration。',['成功','失敗'],'失敗記錄階段。'],['取得 Sensor Profile','比較 Label/Gap/Mark/Ribbon 的峰谷是否清楚。',['波形正常','波形弱','固定值'],'固定值再進硬體。'],['斷電檢查 Sensor/線束','清潔、位置、接頭、折傷、氧化。',['發現異常','正常'],'不要帶電插拔。'],['交叉 Sensor/主板收斂','若有正常件交叉，分 Sensor 與輸入電路。',['Sensor 故障','線束故障','主板輸入方向高','已修復'],'不要以單一電壓猜全系列。']]},
{
 id:'svc-zebra-xi4-ribbon-hw',brand:'Zebra',models:['110Xi4','220Xi4'],category:'Service｜Ribbon Sensor／線路',severity:'高',
 title:'110Xi4/220Xi4｜Ribbon Out 硬體層：Sensor、線束、接頭、Main Logic 收斂',sources:['zebra_xi4','zebra_110','zebra_jg'],
 summary:'Xi4 舊機若已確認 Thermal Transfer、碳帶安裝、清潔與校正仍固定 Ribbon Out，應進入 Sensor 訊號、線束與 Main Logic 輸入的交叉排查。',
 keyFacts:['Xi4 年代久，接頭氧化、線束折損、Sensor 老化都比直接主板故障更常見。','拔除 Sensor 後行為改變可當隔離資訊，但不能直接當成原廠標準判定。','單一現場測得的電壓/數值不可當全系列規格。'],
 engineering:['保留現場案例讀值作比較紀錄，但標註「案例值」而非標準值。','斷電後做 continuity 與接頭檢查；帶電測點只依 Service Manual。','換 Sensor 前先確認線束，換主板前先交叉 Sensor。'],
 verify:['Ribbon Out 不再誤報','FEED 正常','Thermal Transfer 連續 100 張穩定','重啟後設定仍正確'],
 flow:[['確認不是設定/校正','Thermal Transfer、Ribbon path、Sensor 清潔、Calibration 都已完成。',['已完成','尚未'],'未完成先回前段。'],['觀察 Sensor 訊號','碳帶在/不在時讀值或 Profile 是否有變化。',['有變化','固定/幾乎不變'],'固定值提高硬體嫌疑。'],['斷電檢查線束/接頭','插座鬆動、氧化、折傷、夾傷、接點。',['找到異常','正常'],'先處理線路。'],['Sensor 交叉','可行時換正常 Sensor 驗證。',['Sensor 故障','仍異常'],'仍異常才往輸入電路。'],['Main Logic 收斂','依維修手冊確認輸入路徑/測點，不猜 Pin。',['主板方向高','找到其他原因'],'記錄量測。']]},
{
 id:'svc-zebra-xi4-drive',brand:'Zebra',models:['110Xi4','220Xi4'],category:'Service｜Motor／Gear／Drive',severity:'高',
 title:'110Xi4/220Xi4｜FEED 不走：Drive Motor、Gear、Platen、線束與 Driver 排查',sources:['zebra_xi4','zebra_110'],
 summary:'Xi4 按 FEED 不走時，先解除錯誤狀態，再分「Motor 無聲」、「Motor 有聲但傳動不走」、「走一下卡住」。老機先查 Gear/Belt/Platen/軸承與線束，再判 Motor 或 Main Logic Driver。',
 keyFacts:['有馬達聲但紙不動時，機構傳動優先於主板。','Platen 殘膠、軸承卡滯、齒輪磨耗會造成失步或異音。','精確 Motor 線圈阻值/驅動波形必須依對應 Service Manual。'],
 engineering:['斷電手轉機構確認阻力。','移除非必要 Rewind/Cutter 負載後測試，可辨識附加機構拖累。','正常 Motor 交叉比直接換主板更可靠。'],
 verify:['FEED 低速/高速正常','100 張不失步','無異音與過熱','定位無累積漂移'],
 flow:[['解除所有錯誤','Head Open、Paper/Ribbon Out、Cutter Error 先清除。',['已解除','仍有錯誤'],'錯誤狀態可能禁止 FEED。'],['按 FEED 聽/看反應','Motor 無聲、有聲不走、抖動、卡住。',['無聲','有聲不走','抖動/卡住'],'分流。'],['斷電檢查 Gear/Platen','齒輪、皮帶、Platen、軸承、殘膠、卡紙。',['機構異常','正常'],'有機構問題先修。'],['Motor/線束交叉','檢查接頭與線束，必要時正常 Motor 交叉。',['Motor/線束故障','仍異常'],'不要先換板。'],['Driver/Main Logic 收斂','依 Service Manual 量測驅動。',['主板方向高','找到其他原因'],'保留紀錄。']]},
{
 id:'svc-zebra-xi4-headline',brand:'Zebra',models:['110Xi4','220Xi4'],category:'Service｜Printhead／Cable',severity:'高頻',
 title:'110Xi4/220Xi4｜固定白線：Printhead 壞點、Head Cable、驅動輸出換件前確認',sources:['zebra_xi4'],
 summary:'固定同位置白線在清潔、換耗材後仍存在，Printhead 壞點嫌疑高；但換頭前仍需確認 Head Cable、接頭與 Platen，避免新頭裝上後問題仍在。',
 keyFacts:['固定位置缺線與隨機模糊不同。','Platen 凹痕可造成接觸不良，Head Cable 接觸不良也可能呈現固定/區段缺失。','Printhead 為高價零件，換件前至少做清潔、測試圖、Cable/Platen 檢查。'],
 engineering:['斷電拆裝 Printhead/Head Cable。','檢查接頭是否歪 Pin、氧化、壓傷。','若換正常 Head 後仍同位置異常，再往 Driver/Main Logic。'],
 verify:['整寬測試圖無固定缺線','條碼可掃','左右濃度一致','100 張品質穩定'],
 flow:[['印固定測試圖','用 Printer 內建測試圖排除軟體。',['固定缺線','非固定'],'非固定走品質流程。'],['清潔 Head/Platen','正確清潔並檢查 Platen 凹痕。',['恢復正常','仍固定缺線','Platen 異常'],'Platen 異常先換。'],['斷電檢查 Head Cable','重插、檢查接點與折傷。',['線材異常','正常'],'避免帶電。'],['正常 Head 交叉','若可取得正常件。',['Head 故障','仍同位置異常'],'仍異常才看 Driver。'],['Main Logic/Head Driver 收斂','依手冊確認輸出與保護電路。',['主板方向高','已修復'],'不要讓可疑電路燒新頭。']]},
{
 id:'svc-tsc-th240-cutter',brand:'TSC',models:['TH240','TH340'],category:'Service｜Cutter／Option',severity:'高頻',
 title:'TH240/TH340｜Guillotine Cutter Full/Partial Cut：設定、卡刀與模組驗證',sources:['tsc_th240','tsc_th_product'],
 summary:'TH 系列支援 Guillotine Cutter Full Cut / Partial Cut。Cutter 問題先確認 Cutter Mode 與對應設定，再做機械清潔、單次動作與模組接頭檢查。',
 keyFacts:['原廠流程要求安裝 Cutter 後做 Media Calibration，再設定 Cutter Mode。','Full Cut / Partial Cut 是不同設定，不要把設定錯誤當刀具故障。','刀具機械區域先斷電清潔。'],
 engineering:['會切但位置不對：先查紙張尺寸、Calibration、Cut Offset。','完全不動：再查 Cutter 接頭、Motor/Position Sensor、Option board/主板。','精確電路測點依維修資料。'],
 verify:['Full/Partial Cut 依設定正確','50 張連切無卡刀','切位穩定','無 Cutter Error'],
 flow:[['確認 Cutter Mode','Printer / Driver /標籤軟體一致。',['正確','已修正'],'先排設定。'],['重新 Media Calibration','依當前紙材重新校正。',['成功','失敗'],'切位問題常與定位有關。'],['斷電清 Cutter path','紙屑、膠、卡標。',['清潔後正常','仍異常'],'不可硬扳刀片。'],['單次動作判斷','完全不動、動一半、回位失敗。',['完全不動','動一半','回位失敗'],'分 Motor/機構/Sensor。'],['模組/接頭收斂','查線束與模組，必要時交叉正常 Cutter。',['模組故障','主板方向高','已修復'],'主板最後。']]},
{
 id:'svc-tsc-th240-sensor',brand:'TSC',models:['TH240','TH340'],category:'Service｜Sensor／Diagnostic',severity:'高',
 title:'TH240/TH340｜Sensor Intensity、Media Calibration 與誤判硬體層',sources:['tsc_th240'],
 summary:'TH 系列先使用內建 Sensor 設定/校正與 Diagnostic，而不是直接手改未知閾值；若同一紙材反覆校正失敗，再進 Sensor 清潔、位置、線束與主板輸入。',
 keyFacts:['Cutter/換紙後都應確認當前 Media Calibration。','透明底紙、Black Mark、預印刷會影響偵測。','讀值固定與不同紙材都無反應，才有較強硬體指向。'],
 engineering:['使用 TSC 工具/面板查看 Sensor 狀態時，先記錄原值再調整。','斷電查 Sensor 線束與接頭。','精確 ADC/電壓標準依 Service Manual，不使用網路單機案例值。'],
 verify:['FEED 一次一張','50 張無跳標','不同模式設定可正常校正','重開機後穩定'],
 flow:[['確認紙材類型','Gap/Black Mark/Continuous 與 Sensor 位置。',['正確','已修正'],'先排耗材。'],['執行 Media Calibration','使用原廠流程。',['成功','失敗'],'記錄失敗位置。'],['查看 Sensor 狀態/強度','比較 Label 與 Gap/Mark 變化。',['變化正常','變化弱/固定'],'固定才進硬體。'],['清潔/重定位/交叉紙材','排除髒污與透明底紙。',['恢復','仍異常'],'已知正常紙材很重要。'],['Sensor/線束/主板收斂','斷電查線路，必要時正常 Sensor 交叉。',['Sensor/線束故障','主板輸入方向高','已修復'],'不猜數值。']]},
{
 id:'svc-tsc-mh241-tphcare',brand:'TSC',models:['MH241','MH341','MH641','MH640'],category:'Service｜TPH Care／Printhead',severity:'高價值',
 title:'MH241/MH341/MH641｜TPH Care 壞點判讀與 Printhead 換件前確認',sources:['tsc_mh241','tsc_mh_product'],
 summary:'MH241 系列原廠 TPH Care 可檢視 Printhead 各點健康狀態；正常 Profile 應平整，Unhealthy TPH dot number 為 0 代表未偵測到壞點，尖峰則提示潛在壞點。',
 keyFacts:['TPH Care 預設可能是停用狀態，需在支援機型啟用。','原廠可列印 TPH 測試圖並取得 TPH Care profile。','固定白線若與 TPH Care 尖峰位置一致，Printhead 故障證據明顯增加。'],
 engineering:['仍要先清潔 Printhead/Platen，排除污點與機械接觸不良。','換頭前檢查 Head Cable 與接頭。','更換後重新跑測試圖與 TPH Care。'],
 verify:['Unhealthy TPH dot = 0 或符合新頭正常狀態','測試圖無固定缺線','條碼掃描穩定','100 張連印正常'],
 flow:[['清潔並印測試圖','先確認是否固定缺線。',['固定缺線','非固定'],'非固定走一般品質。'],['啟用/讀取 TPH Care','Get TPH care profile。',['平整/0','有尖峰/壞點'],'尖峰位置記錄。'],['檢查 Platen/Head Cable','斷電檢查接頭與滾輪。',['異常已修','正常'],'避免誤換頭。'],['Printhead 交叉/更換','有條件時以正常件驗證。',['Head 故障','仍異常'],'仍異常查驅動。'],['修復後重跑 TPH Care','確認 Profile/測試圖。',['正常','仍有異常'],'保留紀錄。']]},
{
 id:'svc-argox-p4650-white',brand:'Argox',models:['P4-650'],category:'Service｜高濃度／白碳帶',severity:'高價值',
 title:'P4-650｜白色碳帶不清楚、濃度拉高又破碳：工程驗證流程',sources:['argox_p4','argox_p4_product'],
 summary:'P4-650 600 dpi 使用白色/特殊樹脂碳帶時，不能直接套用 Zebra 的 Darkness 數值。應固定速度、紙材、碳帶與測試圖，逐步找最低可接受熱量，並檢查壓力、Platen、Printhead 與碳帶匹配。',
 keyFacts:['不同品牌 Darkness 數值不可直接對照。','當提高熱量已出現碳帶破損，代表不能再用「繼續加 Darkness」當主要解法。','白色樹脂碳帶對紙材表面、速度與壓力更敏感。'],
 engineering:['固定 2 ips 或已知低速做基準，避免速度變數。','清 Head/Platen，確認壓力機構與碳帶路徑。','若同一耗材在另一台機器表現顯著較好，才進 Head/壓力/驅動差異。'],
 verify:['白字/條碼清晰','碳帶不破不皺','連印 50 張一致','無需使用危險高熱量維持品質'],
 flow:[['固定耗材與測試圖','同一紙/白碳帶/圖案/速度。',['完成','無法固定'],'先建立基準。'],['低速逐級調 Darkness','每次只增加一小級並觀察。',['找到穩定區','仍太淡','開始破碳'],'破碳立即停止上調。'],['清潔 Head/Platen','確認接觸面。',['改善','無改善','Platen 異常'],'Platen 異常先處理。'],['檢查壓力與碳帶路徑','看單側淡、皺碳、偏移。',['機構異常','正常'],'桌機壓力調整能力依機型結構。'],['Head/驅動收斂','固定同位置缺陷或同耗材交叉差異明顯，再查 Head/Cable/Driver。',['Head方向高','機構方向高','耗材匹配問題','已修復'],'不以他牌 Darkness 當規格。']]},
{
 id:'svc-argox-p4-cal',brand:'Argox',models:['P4-250','P4-350','P4-650'],category:'Service｜Calibration／Sensor',severity:'高頻',
 title:'Argox P4 Series｜Transmissive/Reflective Sensor 校正失敗的硬體收斂',sources:['argox_p4','argox_p4_product'],
 summary:'P4 Series 支援 Transmissive / Reflective Sensor；更換紙材或定位異常時先校正。若已知正常耗材也無法校正，再進 Sensor 位置、清潔、線束與主板輸入。',
 keyFacts:['Gap/Black Mark 要選對 Sensor 類型。','校正前先確認紙材實際通過 Sensor 偵測區。','Sensor 讀值固定比一次校正失敗更值得進硬體。'],
 engineering:['使用 Printer Tool/面板前先記錄原設定。','斷電查 Sensor 接頭與線束。','若無官方測點，不填自創電壓。'],
 verify:['FEED 一次一張','50 張定位穩定','重開後不跳標','換同規格紙可快速重新校正'],
 flow:[['選對 Sensor 類型','Transmissive/Reflective 與 Gap/Mark 對應。',['正確','已修正'],'先排設定。'],['確認 Sensor 位置與清潔','紙材實際經過感應區。',['正常','已修正'],'清潔再校。'],['完整校正','依 P4 User Manual。',['成功','失敗'],'記錄。'],['換正常紙材交叉','排除透明底紙/預印刷。',['恢復','仍異常'],'耗材因素先切掉。'],['Sensor/線束/主板收斂','斷電檢查並交叉正常 Sensor。',['Sensor/線束故障','主板輸入方向高','已修復'],'不猜 Pin。']]},
{
 id:'svc-honeywell-pm45-labeltaken',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],category:'Service｜Peel／Label Taken Sensor',severity:'高價值',
 title:'PM45｜Peel 模式取標後不續印：Label Taken Sensor 校正與硬體隔離',sources:['honeywell_pm45','honeywell_pm45_cal'],
 summary:'PM45 安裝 Dispenser/Peel 後，取標後不續印要先確認 Label Taken Sensor Calibration，而不是直接判主板或 Rewinder。',
 keyFacts:['Label Taken Sensor 與 Media Gap/Black Mark Sensor 是不同偵測功能。','拆裝 Dispenser 或環境變化後應重新做 Label Taken Sensor Calibration。','取標 Sensor 被膠、紙屑遮蔽會讓機器一直以為標籤仍在出口。'],
 engineering:['先暫時改回 Tear-Off 驗證 Print Engine 本體正常。','清潔/重新校正後仍固定狀態，再查 Sensor、線束、接頭。','精確 Pin/電壓依維修手冊。'],
 verify:['Peel 模式每取一張即續印','Tear-Off 也正常','50 張 Peel 無停滯','重開後穩定'],
 flow:[['切 Tear-Off 測試','確認 Print Engine 本身正常。',['正常','本體也異常'],'本體異常走其他流程。'],['清潔 Label Taken Sensor','移除膠/紙屑。',['正常','仍異常'],'再校正。'],['做 Label Taken Calibration','依原廠流程。',['成功','失敗'],'失敗才進硬體。'],['斷電查 Sensor/線束','接頭與線束。',['異常已修','正常'],'避免帶電插拔。'],['交叉 Sensor/控制板','正常 Sensor 可用時交叉。',['Sensor故障','控制輸入方向高','已修復'],'主板最後。']]},
{
 id:'svc-sato-cl4nx-cutter',brand:'SATO',models:['CL4NX Plus'],category:'Service｜Cutter／Error Code',severity:'高',
 title:'SATO CL4NX Plus｜Cutter Error：刀路、Home/Position、Offset 與模組換件前判斷',sources:['sato_clnx_errors','sato_clnx_offset','sato_clnx_hw'],
 summary:'CL4NX Plus 出現 Cutter Error 時先清刀路與耗材，再確認 Cut Position/Offset 與 Sensor；完全不動或回不到 Home 才進模組、線束與控制板。',
 keyFacts:['切位偏移不等於 Cutter Motor 故障。','殘膠與卡標會造成 Home 回位失敗。','SATO 原廠錯誤碼可直接分 Cutter/Media/Ribbon/Head 等路徑。'],
 engineering:['先將錯誤碼與發生時機記錄。','斷電處理刀具與模組。','正常 Cutter 模組交叉後仍失敗才提高控制板嫌疑。'],
 verify:['50 張連切正常','Cut Position 穩定','無 Cutter Error','重開後正常'],
 flow:[['記錄 Error Code/時機','開機即錯、切到一半、回位失敗。',['完成','不明'],'先重現。'],['清 Cutter path','斷電清紙屑/膠/卡標。',['恢復','仍異常'],'先排機械阻力。'],['確認 Offset/Media Calibration','定位與切位設定。',['正確','已修正'],'偏移先處理設定。'],['檢查模組/Sensor/線束','Home/Position、接頭、固定。',['模組異常','線束/Sensor異常','外觀正常'],'再決定交叉。'],['交叉模組/控制板收斂','正常 Cutter 模組驗證。',['Cutter故障','控制板方向高','已修復'],'主板最後。']]}
];
SERVICE_LEVEL_ARTICLES.forEach(x=>addRepairKB(x));
