'use strict';

// 硬體層白話搜尋：把現場口語直接導向線束、Clutch、Interface、Firmware/NVRAM 與 PSU 負載排查。
if(typeof CUSTOMER_PHRASE_RULES!=='undefined'){
  CUSTOMER_PHRASE_RULES.push(
    {id:'wire_intermit',icon:'🪢',title:'碰到線就好／晃一下又壞',issue:'線束／接頭間歇故障',keywords:['碰到線就好','晃一下又壞','晃線會好','壓著線就正常','開蓋就壞','蓋子動一下就報錯','線動一下就恢復','接頭鬆鬆的'],hint:'優先做退 Pin、折傷、夾傷、氧化與晃線導通測試，不要直接換 Sensor 或主板。',kb:'線束 接頭 退Pin 間歇故障'},
    {id:'rewind_slip',icon:'🧵',title:'碳帶回收很鬆／空軸會轉、上碳帶就不轉',issue:'Ribbon Rewind／Clutch 打滑',keywords:['碳帶回收很鬆','回收軸沒力','空軸會轉上碳帶不轉','回收軸打滑','碳帶越印越鬆','碳帶回捲沒力','clutch打滑'],hint:'先分穿帶、Clutch、Gear/Belt 與驅動，不把回收問題誤判成 Ribbon Sensor。',kb:'Ribbon Rewind Clutch Spindle Gear'},
    {id:'usb_loose',icon:'🔌',title:'USB 要喬角度才有反應／插座鬆',issue:'USB Interface／Connector 機械故障',keywords:['usb要喬角度','usb插座鬆','usb碰一下就斷','usb插著會斷線','插頭要壓著才有反應','usb孔鬆掉'],hint:'跨線材/電腦測試後若仍跟插座角度有關，查 Connector、焊點與 Interface，不先重裝 Driver。',kb:'USB Interface Connector 焊點'},
    {id:'lan_no_link',icon:'🌐',title:'網路孔完全沒燈／Link 不亮',issue:'LAN Interface／PHY／Connector',keywords:['網路孔沒燈','lan燈不亮','link不亮','插網路線完全沒反應','網路燈都不亮','換網路線還是沒燈'],hint:'先換線與 Switch Port，再查 RJ45、Interface/NIC 與供電；Link 都沒有和 IP 設定不同。',kb:'LAN Link RJ45 Interface NIC PHY'},
    {id:'firmware_boot',icon:'💿',title:'更新後開不了／卡 Logo／一直重開',issue:'Firmware／Recovery／Boot',keywords:['更新後開不了','更新韌體後卡住','更新後一直重開','卡logo進不去','firmware更新失敗','韌體刷壞','更新一半斷電'],hint:'不要反覆亂刷，先依該機原廠 Recovery 流程與版本要求處理。',kb:'Firmware Recovery Boot NVRAM'},
    {id:'nvram_lost',icon:'💾',title:'關機再開設定全部跑掉',issue:'NVRAM／Flash／外部覆蓋',keywords:['關機再開設定全跑掉','每次開機都恢復預設','ip每次重開都變','darkness重開就變','設定保存不了','設定不記憶'],hint:'先拔掉 USB/LAN 做單機 Save 測試，切開 Driver 覆蓋與 NVRAM/Flash。',kb:'NVRAM Flash 設定保存 Driver 覆蓋'},
    {id:'bearing_noise',icon:'🛞',title:'轉一圈固定某個位置卡／喀一聲',issue:'Bearing／Bushing／軸偏心',keywords:['轉一圈固定會卡','每轉一圈喀一聲','滾輪轉一圈有卡點','軸承有間隙','軸會晃','轉到某個角度很緊','齒輪每圈叫一次'],hint:'斷電卸載後手轉整圈，查軸承、軸套、偏心、齒輪嚙合與軸向間隙。',kb:'Bearing Bushing 軸承 軸套 偏心'},
    {id:'headopen_press',icon:'🔒',title:'要壓住上蓋才不報 Head Open',issue:'Head Open Sensor／Latch 對位',keywords:['要壓住蓋子才正常','壓上蓋就不報錯','壓著印字頭才ready','蓋子關了要用力壓','head open壓住就好'],hint:'這種症狀先看 Latch、觸發片/磁鐵、Sensor 距離與線束。',kb:'Head Open Sensor Latch 磁鐵 微動開關'},
    {id:'peel_wait',icon:'🏷️',title:'剝一張就停／拿走標籤還是不繼續',issue:'Peel／Label Taken Sensor',keywords:['剝一張就停','拿走標籤還是不印','取標後不繼續','peel一張就停','label taken沒反應','剝紙模式卡住'],hint:'先確認普通模式正常，再查 Label Taken Sensor、底紙路徑與 Rewinder。',kb:'Peel Label Taken Sensor Rewinder'},
    {id:'psu_load',icon:'⚡',title:'待機正常，一列印／切刀就重開',issue:'PSU 負載掉壓／過載',keywords:['待機正常一列印就重開','切刀一動就重開','馬達一動就重開','開始印就斷電','一加速就重開','列印加熱就重啟'],hint:'這種不是只量待機電壓；要做負載隔離、PSU/接頭與選配模組測試。',kb:'PSU 負載 掉壓 過載 重啟'},
    {id:'option_board',icon:'🧩',title:'裝上切刀／剝紙／介面板就不正常',issue:'Option Board／外接模組隔離',keywords:['裝上切刀就壞','接上剝紙就重開','裝介面卡後不能開機','拔掉選配就正常','接上模組就掉電','裝配件後開始異常'],hint:'斷電隔離選配板/模組，確認是否拉低供電或造成通訊衝突。',kb:'Option Board Cutter Peeler Interface 負載隔離'},
    {id:'connector_burn',icon:'🔥',title:'接頭焦黑／塑膠變色／有燒焦味',issue:'Connector 過熱／接觸電阻／供電',keywords:['接頭焦黑','插頭燒黑','塑膠變黃','有燒焦味','接頭很燙','端子燒掉','插座融掉'],hint:'先斷電，不只換接頭；還要查負載過流、端子鬆動與相鄰線材，避免再次燒毀。',kb:'Connector 過熱 接觸電阻 PSU 線束'}
  );
}
