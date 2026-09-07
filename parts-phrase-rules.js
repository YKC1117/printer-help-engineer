'use strict';

// 零件／換件白話入口：讓工程師可直接用現場口語找「要不要換哪個零件」。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'part_head_replace',icon:'🧩',title:'印字頭是不是壞了／要不要換 Printhead',issue:'Printhead 換件判斷',keywords:['印字頭是不是壞了','印字頭要不要換','printhead要換嗎','印字頭壞掉','換印字頭','固定白線換頭','印字頭缺點'],hint:'先用固定測試圖、清潔、Head Cable 與交叉測試確認，不要因為印淡就直接換頭。',kb:'Printhead 換件判斷 Head Cable 固定白線'},
    {id:'part_platen_replace',icon:'🛞',title:'滾輪硬掉／凹掉／要不要換 Platen',issue:'Platen 換件判斷',keywords:['滾輪硬掉','滾輪凹掉','滾輪裂掉','platen要換','滾輪要不要換','滾輪磨損','滾輪老化','滾輪沒摩擦力'],hint:'先清潔、看偏磨/凹痕/硬化，再用連續列印確認是否真的造成打滑或局部淡。',kb:'Platen 換件判斷 打滑 硬化 凹痕'},
    {id:'part_sensor_replace',icon:'📟',title:'Sensor 是不是壞了／感應器要不要換',issue:'Sensor 換件判斷',keywords:['感應器是不是壞了','sensor是不是壞了','感應器要不要換','sensor要換嗎','換感應器','感應器完全沒變化','感應器死掉'],hint:'先確認位置、清潔、Calibration 與讀值變化；線束正常且交叉支持才換 Sensor。',kb:'Sensor 換件判斷 線束 讀值固定 Calibration'},
    {id:'part_cutter_replace',icon:'✂️',title:'切刀是不是壞了／要不要換 Cutter',issue:'Cutter 換件判斷',keywords:['切刀是不是壞了','切刀要不要換','cutter要換嗎','換切刀','切刀模組壞了','切刀馬達壞','切刀home sensor'],hint:'先分設定、卡滯、Motor、Home Sensor 與整組 Cutter Assy，不要直接整組更換。',kb:'Cutter 換件判斷 Home Sensor Motor Assy'},
    {id:'part_motor_replace',icon:'⚙️',title:'馬達是不是壞了／有聲音但紙不走',issue:'Motor / Gear 換件判斷',keywords:['馬達是不是壞了','馬達要不要換','motor要換嗎','有馬達聲紙不走','馬達轉齒輪不轉','齒輪裂掉','皮帶鬆掉','換馬達'],hint:'有馬達聲先查 Gear/Belt/Clutch/Platen；完全不動才往 Motor/Driver 深入。',kb:'Drive Motor Gear Belt 換件判斷'},
    {id:'part_psu_replace',icon:'🔌',title:'電源板是不是壞了／PSU 要不要換',issue:'PSU 換件判斷',keywords:['電源板是不是壞了','psu是不是壞了','電源供應器要換嗎','換psu','電源板沒輸出','接負載掉壓','一開機就掉電'],hint:'先確認 AC、PSU 正確測點與外接負載；空載正常、接某模組掉壓時先查負載。',kb:'PSU 換件判斷 掉壓 負載 Mainboard'},
    {id:'part_mainboard_replace',icon:'🧠',title:'主板是不是壞了／Mainboard 要不要換',issue:'Mainboard 換件判斷',keywords:['主板是不是壞了','主機板是不是壞了','mainboard要換嗎','換主板','主板壞了嗎','logic board壞','電源正常但不開機'],hint:'主板放最後：PSU、負載、線束、Sensor/Motor 與面板支路都排除後再判。',kb:'Mainboard 換件判斷 PSU 負載 Logic Board'},
    {id:'part_cable',icon:'🔗',title:'線束／接頭鬆掉／退 Pin／接觸不良',issue:'Cable / Connector / Harness',keywords:['線束壞掉','接頭鬆掉','退pin','線斷掉','接觸不良','晃線就正常','插頭氧化','接頭歪掉'],hint:'斷電檢查端子退 Pin、折傷、氧化與拉扯痕；不要只看外皮完整就判線束正常。',kb:'線束 Connector Harness 退 Pin 接觸不良'},
    {id:'part_order_number',icon:'🏷️',title:'零件料號怎麼確認／怕買錯版本',issue:'Parts number / 料號核對',keywords:['料號怎麼看','零件料號','怕買錯零件','零件版本','part number','parts number','印字頭料號','滾輪料號','切刀料號'],hint:'料號要依完整型號、序號、DPI、寬度、選配與硬體 revision 核對，不只看系列名稱。',kb:'料號 序號 DPI Parts List 選配 版本'}
  );
}
