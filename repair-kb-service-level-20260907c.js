'use strict';

[
{
 id:'svc-godex-zx1000i-cutter',brand:'GoDEX',models:['ZX1200i+','ZX1300i+','ZX1600i+'],category:'Service｜Cutter／Rewinder',severity:'高',
 title:'GoDEX ZX1000i+｜Cutter/Rewinder 不動、卡住與模組隔離',sources:['godex_zx1000i','godex_family'],
 summary:'ZX1000i+ 選配模組異常先確認列印模式與耗材路徑，再把 Cutter/Rewinder 從 Print Engine 本體隔離；完全不動、動到一半、回位失敗是不同硬體方向。',
 keyFacts:['先確認 Option 已正確啟用。','Rewinder 過緊或底紙路徑錯會讓走紙看似 Motor 故障。','Cutter 卡膠/卡標先斷電清除。'],
 engineering:['先切回 Tear-Off 測 Print Engine。','斷電檢查 Option 接頭與線束。','正常模組交叉後仍失敗才往主板驅動。'],
 verify:['Tear-Off 正常','Option 模式 50 張穩定','無卡刀/回捲停滯','重開後設定保留'],
 flow:[['切回 Tear-Off','確認主機本體。',['正常','本體異常'],'本體異常另走流程。'],['確認 Option 模式/路徑','Cutter/Rewind 設定與耗材路徑。',['正確','已修正'],'先設定。'],['斷電清機構','卡標、殘膠、軸阻力。',['恢復','仍異常'],'再看電氣。'],['檢查模組/線束','接頭與固定。',['異常','正常'],'異常先修。'],['交叉模組/主板收斂','正常件驗證。',['模組故障','主板方向高','已修復'],'不猜 Pin。']]},
{
 id:'svc-godex-g500-sensor',brand:'GoDEX',models:['G500','G530','G500+','G530+'],category:'Service｜Sensor／Calibration',severity:'高頻',
 title:'GoDEX G500/G530｜Gap/Black Mark 校正失敗：Sensor、線束與主板前置判斷',sources:['godex_g500','godex_family'],
 summary:'G500 系列換紙後跳標、一直跑紙或抓不到 Gap/Mark，先做紙材校正、確認 Sensor 位置與清潔；正常耗材仍無變化才進硬體。',
 keyFacts:['Gap 與 Black Mark 不同。','先用正常耗材交叉。','Sensor 固定讀值才提高硬體嫌疑。'],
 engineering:['記錄原設定。','斷電檢查接頭/線束。','沒有原廠測點就不填電壓。'],
 verify:['FEED 一次一張','50 張無跳標','重開正常','換同規格紙可再校正'],
 flow:[['確認 Media Type','Gap/Mark/Continuous。',['正確','已修正'],'先設定。'],['清潔/對位 Sensor','實際經過感應區。',['正常','已修正'],'再校正。'],['執行 Calibration','依原廠。',['成功','失敗'],'失敗記錄。'],['正常耗材交叉','排紙材。',['恢復','仍異常'],'再拆。'],['Sensor/線束/主板收斂','斷電與交叉。',['Sensor/線束故障','主板方向高','已修復'],'不猜數值。']]},
{
 id:'svc-godex-rt700-head',brand:'GoDEX',models:['RT700i+','RT730i+','RT863i+'],category:'Service｜Head／Platen',severity:'高頻',
 title:'GoDEX RT 系列｜固定白線、單側淡、Head/Platen 換件前確認',sources:['godex_rt700','godex_family'],
 summary:'RT 系列桌機品質問題先固定耗材/速度/熱量，清 Head/Platen；固定缺線走 Head/Cable，單側淡走 Platen/壓力/安裝。',
 keyFacts:['固定白線與隨機淡不同。','Platen 凹傷會造成週期性/局部缺印。','換 Head 前檢查 Cable。'],
 engineering:['斷電拆 Head。','同一測試圖比較換件前後。','換新 Head 後回到合理熱量。'],
 verify:['無固定缺線','左右濃度一致','100 張穩定','條碼可掃'],
 flow:[['固定測試圖','排軟體。',['固定缺線','單側淡','其他'],'分流。'],['清 Head/Platen','正確清潔。',['恢復','仍異常'],'再拆。'],['檢查 Platen/Cable','凹痕、接點。',['異常','正常'],'異常先修。'],['交叉/更換 Head','正常件驗證。',['Head故障','仍異常'],'仍異常查 Driver。'],['驗證','100 張。',['正常','仍異常'],'停止反覆換頭。']]},
{
 id:'svc-toshiba-ba410-cutter',brand:'TOSHIBA',models:['BA410T','BA420T'],category:'Service｜Cutter／設定工具',severity:'高頻',
 title:'TOSHIBA BA410T/BA420T｜Cutter 卡刀、切位偏移與 Option 模組排查',sources:['toshiba_ba410','toshiba_manuals'],
 summary:'BA400 系列 Cutter 問題先透過原廠 Setting Tool/Printer 設定確認模式，再處理 Calibration、Cut Position 與機構阻力；完全不動才往模組電氣。',
 keyFacts:['切位偏移先查紙長/Calibration/Offset。','卡刀先斷電清除殘膠與卡標。','Option 模組與 Print Engine 要分開隔離。'],
 engineering:['切回 Tear-Off 測主機。','斷電檢查 Cutter 接頭。','正常模組交叉後再判控制板。'],
 verify:['50 張連切正常','切位穩定','Tear-Off/Cutter 均正常','無 Error'],
 flow:[['確認 Cutter Mode','Setting Tool/Printer。',['正確','已修正'],'先設定。'],['Calibration/Offset','依紙材重校。',['正常','仍偏'],'偏移再看設定。'],['斷電清刀路','膠/卡標。',['恢復','仍異常'],'再硬體。'],['模組/線束','接頭與機構。',['異常','正常'],'先模組。'],['交叉/控制板收斂','正常 Cutter 模組驗證。',['模組故障','控制板方向高','已修復'],'不猜 Pin。']]},
{
 id:'svc-sato-cl4nx-sensor',brand:'SATO',models:['CL4NX Plus'],category:'Service｜Sensor／Calibration',severity:'高',
 title:'SATO CL4NX Plus｜Gap/I-Mark Calibration、Sensor 清潔與硬體收斂',sources:['sato_clnx_cal','sato_clnx_hw','sato_clnx_errors'],
 summary:'CL4NX Plus 使用 Gap/I-Mark 時，先依原廠 Sensor Calibration 做基準；錯誤仍存在才查 Sensor 清潔、位置、線束與控制輸入。',
 keyFacts:['Gap 與 I-Mark 需選對 Sensor。','原廠有明確 Sensor Calibration 流程。','錯誤碼可幫助分 Media/Ribbon/Head/Cutter。'],
 engineering:['先記錄 Error Code。','斷電檢查 Sensor/線束。','不以其他品牌 Threshold 代入。'],
 verify:['FEED 一次一張','50 張無跳標','I-Mark/Gap 定位正常','重開正常'],
 flow:[['確認 Sensor Type','Gap/I-Mark。',['正確','已修正'],'先設定。'],['執行 Sensor Calibration','依原廠。',['成功','失敗'],'記錄。'],['清潔/對位 Sensor','污物/位置。',['恢復','仍異常'],'再拆。'],['正常耗材交叉','排紙材。',['恢復','仍異常'],'再硬體。'],['Sensor/線束/控制板收斂','斷電與交叉。',['Sensor/線束故障','控制板方向高','已修復'],'主板最後。']]},
{
 id:'svc-sato-cl4nx-ribbon',brand:'SATO',models:['CL4NX Plus'],category:'Service｜Ribbon Sensor',severity:'高',
 title:'SATO CL4NX Plus｜Ribbon Near End / Ribbon End 誤報：Sensor 與線束排查',sources:['sato_clnx_ribbon','sato_clnx_errors','sato_clnx_hw'],
 summary:'Ribbon Near End/End 誤報先確認 Ribbon 裝法、Sensor 設定與清潔；固定誤報或無法感知有/無 Ribbon 時才查 Sensor/線束。',
 keyFacts:['Near End 與 End 是不同狀態。','Ribbon Sensor 污染或安裝路徑錯會誤判。','先排耗材與設定再換 Sensor。'],
 engineering:['記錄錯誤碼/狀態。','斷電查 Sensor/線束。','正常 Ribbon 交叉。'],
 verify:['Near End/End 可正確觸發','100 張無誤報','重開正常','Thermal Transfer 品質正常'],
 flow:[['確認 Print Method/Ribbon','設定與路徑。',['正確','已修正'],'先耗材。'],['清 Sensor','依原廠。',['恢復','仍異常'],'再觀察。'],['有/無 Ribbon 狀態比較','是否有變化。',['正常','固定'],'固定進硬體。'],['斷電查線束','接點/折傷。',['異常已修','正常'],'再交叉。'],['Sensor/控制板收斂','正常件驗證。',['Sensor故障','控制板方向高','已修復'],'主板最後。']]},
{
 id:'svc-honeywell-pm45-power',brand:'Honeywell (Datamax/Intermec)',models:['PM45'],category:'Service｜Power／Mainboard',severity:'高',
 title:'Honeywell PM45｜完全不開機／反覆重啟：PSU、外接模組與 Mainboard 隔離',sources:['honeywell_pm45'],
 summary:'PM45 完全不開機或反覆重啟時，先確認 AC/PSU 與是否有短路負載，再隔離 Cutter/Peeler/外接 I/O；最小配置仍失敗才往 Mainboard/Panel。',
 keyFacts:['反覆重啟常和掉壓/短路負載不同於完全無電。','Option 模組可造成供電被拉低。','精確 Rail/Pin 依 Service Manual。'],
 engineering:['斷電拆 Option。','逐一接回找出造成問題的支路。','不要帶電插拔。'],
 verify:['冷開 5 次','30 分鐘連印無重啟','Option 全接回正常','無異常發熱'],
 flow:[['確認 AC/PSU 前端','插座/線/開關。',['正常','異常'],'先前端。'],['判斷無電/重啟','完全黑/有上電後重啟。',['無電','重啟'],'分流。'],['最小配置','移除非必要 Option。',['恢復','仍異常'],'恢復即查該支路。'],['PSU/線束','依手冊。',['供電異常','正常'],'再主板。'],['Mainboard/Panel 收斂','前段正常。',['主板方向高','Panel/線束方向高','已修復'],'記錄。']]},
{
 id:'svc-argox-ix4-cutter',brand:'Argox',models:['iX4-200 Pro','iX4-250 Pro','iX4-300 Pro'],category:'Service｜Cutter／Option',severity:'高頻',
 title:'Argox iX4 Pro｜Cutter 不切、回位失敗、Option 模組與主板分流',sources:['argox_ix4pro','argox_manuals'],
 summary:'iX4 Pro Cutter 問題先確認 Cutter Mode、Calibration 與刀路；完全不動或回位失敗時再查 Cutter 模組、Sensor、線束與驅動。',
 keyFacts:['設定錯誤與硬體故障先分開。','卡膠/卡標先斷電清理。','正常 Cutter 模組交叉後仍失敗才提高主板嫌疑。'],
 engineering:['先切 Tear-Off 驗證主機。','斷電檢查接頭。','精確測點依官方維修資料。'],
 verify:['50 張連切正常','回 Home 穩定','切位正確','無 Cutter Error'],
 flow:[['確認模式','Cutter Mode。',['正確','已修正'],'先設定。'],['Calibration/切位','重新校正。',['正常','仍異常'],'再機構。'],['斷電清刀路','膠/卡標。',['恢復','仍異常'],'再硬體。'],['檢查模組/Sensor/線束','接頭與回位。',['異常','正常'],'再交叉。'],['交叉模組/主板收斂','正常件驗證。',['模組故障','主板方向高','已修復'],'主板最後。']]}
].forEach(x=>addRepairKB(x));
