'use strict';

// 深度維修白話入口：讓客戶原話可直接命中新增加的硬體/間歇故障主題。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'restart_loop',icon:'🔁',title:'印一印自己重開／反覆重新開機',issue:'使用中突然重開／反覆重啟',keywords:['印一印自己重開','印到一半重開','一直重新開機','反覆重啟','自己關機又開機','用一陣子就重開','突然斷電又開','一直重開機'],hint:'先分整機掉電、PSU 負載、過熱、外接模組與韌體／主板，不直接判主板。',kb:'突然重開 反覆重啟 PSU 過熱 主板'},
    {id:'head_open_false',icon:'🔓',title:'蓋子關好了還顯示 Head Open',issue:'Head Open 誤報／上蓋感應異常',keywords:['蓋子關了還說沒關','上蓋關好還報錯','head open','一直顯示上蓋開啟','壓住蓋子才正常','蓋子晃一下就報錯','印字頭關了還說開'],hint:'先查卡榫是否扣到底，再看 Head Open Sensor／磁鐵／微動開關與線束。',kb:'Head Open Sensor 上蓋 卡榫 線束'},
    {id:'drift_accumulate',icon:'📉',title:'第一張正常，後面越印越偏',issue:'累積漂移／越印越偏',keywords:['第一張正常後面越來越偏','越印越往上','越印越往下','每張越跑越遠','印越多偏越多','位置慢慢跑掉','累積偏移'],hint:'累積漂移優先查 Label Length、Calibration、Sensor 與 Platen 打滑；固定偏才先查 Offset。',kb:'累積漂移 Label Length Calibration Platen'},
    {id:'blackmark_fail',icon:'⬛',title:'黑標抓不到／黑線有印但一直跑紙',issue:'Black Mark 偵測異常',keywords:['黑標抓不到','黑線抓不到','有黑標還一直跑','黑標紙一直跳標','反射感應抓不到','black mark抓不到','黑線有印但不停'],hint:'確認 Reflective Sensor、黑標面向與實際感應位置，再做黑標校正。',kb:'Black Mark Reflective Sensor 黑標 校正'},
    {id:'ribbon_rewind',icon:'🧵',title:'碳帶回收軸不轉／廢碳帶不會捲',issue:'碳帶回捲／Clutch 異常',keywords:['碳帶回收軸不轉','廢碳帶不會捲','碳帶不回收','回收碳帶鬆掉','碳帶後面不會收','ribbon rewind不動','回收軸空轉'],hint:'先確認穿帶，再分 Gear／Clutch／單向軸承與驅動。',kb:'碳帶回收 Rewind Clutch Gear'},
    {id:'settings_lost',icon:'💾',title:'設定存不住／關機再開又變回去',issue:'設定重開後恢復／NVRAM',keywords:['設定存不住','關機後設定不見','重開又變回去','參數自己跑掉','改完又恢復','設定會自己改','每次開機都要重設'],hint:'先做不接電腦的單機保存測試，再分 Driver 覆蓋、Save/Apply、NVRAM/Flash。',kb:'設定存不住 NVRAM Driver 覆蓋 Flash'},
    {id:'sensor_stuck',icon:'📟',title:'Sensor 數值一直固定／遮住也不變',issue:'Sensor 讀值固定／線束／主板輸入',keywords:['sensor數值不變','感應器數值固定','遮住感應器也不變','拿紙擋住也一樣','讀值卡住','sensor卡死','感應器一直同一個數字'],hint:'先確認看的是正確通道，再做遮擋測試、線束與 Sensor 交叉；不要套用其他機器的正常值。',kb:'Sensor 數值固定 線束 主板輸入'},
    {id:'motor_stall',icon:'⚙️',title:'馬達會抖但轉不動／走兩步就停',issue:'Motor Stall／機構卡滯',keywords:['馬達會抖但不轉','馬達抖一下','走兩步就停','紙只動一下','馬達卡住','motor stall','有馬達聲但轉不動'],hint:'先斷電查機構阻力與負載，再查 Motor／線束／Driver。',kb:'Motor Stall 馬達 Gear Platen Driver'},
    {id:'cut_position',icon:'📍',title:'切刀切到字／撕紙線位置固定偏掉',issue:'Cut / Tear-off / Backfeed Offset',keywords:['切刀切到字','切的位置不對','每張都切太前面','每張都切太後面','撕紙位置不對','停紙位置不對','backfeed不對','tear off偏'],hint:'固定偏差先確認 Label Length 與 Calibration，再調 Cut/Tear-off/Backfeed Offset。',kb:'Cut Position Tear-off Backfeed Offset'},
    {id:'platen_slip',icon:'🛞',title:'滾輪打滑／紙會走但長度每次不一樣',issue:'Platen 打滑／老化／殘膠',keywords:['滾輪打滑','platen打滑','紙走的長度不一樣','滾輪很滑','滾輪硬掉','滾輪有殘膠','紙有走但距離不準'],hint:'查 Platen 表面硬化、凹痕、殘膠、壓力與導紙，修復後重新驗證定位。',kb:'Platen 打滑 殘膠 走紙長度'}
  );
}
