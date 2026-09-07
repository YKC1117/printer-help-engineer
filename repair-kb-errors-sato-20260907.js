'use strict';

// SATO CL4NX Plus 官方錯誤碼層。

addRepairKB({
  id:'sato-cl4nxplus-1007-head-open',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1007 Head Open／印字頭鎖定仍報錯',severity:'高頻',sources:['sato_clnx_errors','sato_clnx_hw'],
  summary:'SATO 官方將 1007 原因列為 Printhead 未鎖定，或偵測開關狀態的 Sensor 異常。先重新解鎖／鎖定，再進 Head Open Sensor 與機構觸發。',
  keyFacts:['先確認 Head Lock Lever 真正鎖住。','官方明列 Head Open Sensor 故障是可能原因。','狀態完全不隨開關變化時，才提高 Sensor/線束嫌疑。'],
  engineering:['斷電檢查觸發機構與線束，不帶電插拔。'],
  verify:['開關 Head 20 次狀態正常','列印中不再誤報 1007'],
  flow:[['重新解鎖/鎖定 Head','依正常機構重新操作。',['正常','仍報 1007'],'仍報進 Sensor。'],['觀察狀態切換','開/關 Head 時錯誤狀態是否改變。',['會變','完全不變'],'不變偏 Sensor/觸發。'],['檢查 Head Open Sensor/觸發片','清潔、固定與位置。',['正常','已修復'],'再測。'],['線束交叉','斷電查接頭與線束。',['異常','正常'],'正常才往板端。'],['板端收斂','依 Service Manual 查 Input。',['主板方向高','其他'],'保留量測。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1008-out-paper',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1008 Out of Paper／有紙仍報缺紙',severity:'高頻',sources:['sato_clnx_errors','sato_clnx_cal'],
  summary:'官方列出未裝紙、裝紙錯誤、Media Sensor Level 不正確、卡紙，以及 Sensor 髒污／感度差。排查順序應從紙材安裝與 Calibration 開始。',
  keyFacts:['有紙仍報錯時先清 Sensor 並重新 Calibrate。','卡紙與貼在 Sensor 上的標籤也會造成誤判。','不要先換 Sensor。'],
  engineering:['換已知正常耗材交叉可快速排除特殊底紙。'],
  verify:['FEED 一次一張','50 張無 1008','換卷後可正常重校'],
  flow:[['確認 Media 安裝','紙材與走紙路徑正確。',['正確','已修正'],'先排裝法。'],['排除 Jam','檢查走紙路徑與 Platen。',['無 Jam','已清除'],'清除後再測。'],['清潔 Media Sensor','移除灰塵/殘膠/黏標。',['完成','清潔後正常'],'再校正。'],['Calibrate Sensor Level','依原廠 Calibrate。',['成功','失敗'],'失敗進硬體。'],['Sensor/線束收斂','交叉 Sensor/線束。',['Sensor方向高','板端方向高','已修復'],'板端最後。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1009-ribbon-end',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1009 Ribbon End／碳帶未用完卻報錯',severity:'高頻',sources:['sato_clnx_errors','sato_clnx_ribbon'],
  summary:'官方列出 Ribbon 未裝、裝法錯誤、Ribbon 已用完，以及 Ribbon Sensor 髒污／感度異常。Ribbon End 的偵測與 Ribbon Supply Spindle 是否有正常轉動也相關。',
  keyFacts:['碳帶路徑與 Supply Spindle 轉動要先確認。','Sensor 髒污是官方列出的原因。','若碳帶其實不動，機構/軸系問題也會讓 Sensor 看起來像壞掉。'],
  engineering:['先確認回收軸與供應軸真的有正常轉動。'],
  verify:['有 Ribbon 時不報 1009','真正 Ribbon End 時能正確停機','連印 100 張正常'],
  flow:[['確認 Ribbon 安裝','Ribbon 路徑、方向與張力正確。',['正確','已重裝'],'先重裝。'],['確認 Supply/Take-up 軸轉動','列印時是否正常轉。',['正常','不轉/打滑'],'不轉先修機構。'],['清潔 Ribbon Sensor','依原廠方式清潔。',['完成','清後正常'],'仍異常再深入。'],['重新啟動/校正','依原廠流程重啟與相關 Sensor 設定。',['正常','仍 1009'],'進硬體。'],['Sensor/線束收斂','檢查 Sensor/線束/輸入。',['Sensor方向高','板端方向高'],'記錄。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1010-media-error',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1010 Media Error／紙材偵測異常',severity:'高頻',sources:['sato_clnx_errors','sato_clnx_cal'],
  summary:'1010 Media Error 應先從紙材類型、I-Mark/Gap Sensor、Sensor Level 與 Calibration 切問題。特殊透明底紙、預印刷與黑標位置都可能影響判讀。',
  keyFacts:['Gap 與 I-Mark 是不同偵測模式。','特殊紙材先用正常耗材交叉。','校正能完成但仍定位錯，才回查尺寸/Offset/Driver。'],
  engineering:['不要用一次失敗直接判 Sensor 壞。'],
  verify:['Calibration 成功','FEED 一次一張','連印無 Media Error'],
  flow:[['確認 Sensor Type','Gap/I-Mark 與耗材一致。',['正確','已修正'],'先排設定。'],['確認 Sensor 位置與清潔','實際 Gap/Mark 通過感應區。',['正常','已修正'],'再校正。'],['重新 Calibration','依原廠 Sensor Calibration。',['成功','失敗'],'失敗換紙交叉。'],['正常耗材交叉','排除特殊材料。',['正常','仍異常'],'仍異常偏硬體。'],['Sensor/線束收斂','依 Service Manual 查 Sensor input。',['Sensor方向高','板端方向高'],'板端最後。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1012-head-error',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1012 Head Error／Printhead 壞點或磨耗',severity:'高',sources:['sato_clnx_errors','sato_clnx_quality'],
  summary:'SATO 官方說明 1012 與 Printhead element 磨耗／損壞相關，必要時更換 Printhead；即使暫時忽略錯誤繼續印，也應用掃碼器驗證條碼。',
  keyFacts:['固定壞點是重要證據。','官方允許調整 Head Check 條件，但這不是永久修復。','條碼區有壞點時必須實際掃描驗證。'],
  engineering:['換 Head 前檢查 Head cable 與接頭。'],
  verify:['Head Check 通過','測試圖無固定缺線','條碼可掃'],
  flow:[['印測試圖確認壞點','看缺線是否固定。',['固定','不固定'],'不固定先查 Platen/耗材。'],['清潔 Head/Platen','清潔後重測。',['恢復','仍固定'],'仍固定偏 Head。'],['檢查 Head Cable','斷電檢查接頭。',['正常','已修復'],'再測。'],['更換/交叉 Printhead','使用正確規格。',['恢復','仍異常'],'仍異常查驅動。'],['掃碼驗證','實際掃描條碼。',['通過','失敗'],'失敗不得交機。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1013-1014-usb',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1013 USB R/W Error／1014 USB Memory Full',severity:'中',sources:['sato_clnx_errors'],
  summary:'USB R/W 與 USB Memory Full 先分儲存媒體、檔案系統/容量與 Printer USB 介面。單一隨身碟失敗不能直接判 Printer 主板。',
  keyFacts:['先換已知正常 USB 儲存裝置交叉。','1014 先釋放空間或改用容量足夠裝置。','多支正常 USB 都 R/W Error 才提高 Printer 介面方向。'],
  engineering:['不要把 USB Host 儲存問題與電腦 USB Device 列印問題混為一談。'],
  verify:['可讀寫 USB','重開機後仍正常','原檔案可正常處理'],
  flow:[['確認錯誤碼','1013 還是 1014。',['1013','1014'],'分流。'],['換正常 USB 裝置','排除裝置/格式問題。',['正常','仍失敗'],'正常表示外部裝置問題。'],['檢查容量/檔案','1014 清空空間；1013 換檔案交叉。',['恢復','仍失敗'],'再深入。'],['重啟 Printer','排除暫時狀態。',['正常','仍異常'],'持續才查介面。'],['USB Host/主板收斂','依 Service Manual 查介面。',['板端方向高','其他'],'記錄。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1015-cutter',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1015 Cutter Error／刀片未回定位',severity:'高',sources:['sato_clnx_errors','sato_clnx_offset'],
  summary:'官方列出 Cutter 內卡紙，或 Cutter Blade 未回指定位置。可先移除 Jam、按 FEED 嘗試讓 Cutter 回位；持續失敗再往 Home/Position、Motor 與 Cutter Board。',
  keyFacts:['官方要求注意 Cutter Blade 傷害風險。','FEED 可嘗試使刀片回指定位置。','重開機仍無法回位才進硬體。'],
  engineering:['先斷電清除殘膠與碎紙。'],
  verify:['連切 100 張','重開機初始化正常','無 1015'],
  flow:[['清除 Cutter Jam','斷電移除卡紙/殘膠。',['完成','無 Jam'],'再測。'],['按 FEED 嘗試回 Home','依官方方式讓 Cutter 回位。',['成功','失敗'],'失敗進硬體。'],['檢查 Cutter 機構','齒輪/刀片是否卡滯。',['正常','卡滯'],'卡滯先修。'],['Home Sensor/Motor/線束','依 Service Manual 交叉。',['Sensor/Motor方向高','正常'],'正常才看 Board。'],['Cutter Board 收斂','板端最後判定。',['Board方向高','其他'],'記錄。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1016-cutter-cover',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1016 Cutter Cover Open／切刀蓋已關仍報開啟',severity:'常見',sources:['sato_clnx_errors'],
  summary:'Cutter Cover Open 要先確認 Cutter Cover 真正關到底、觸發機構沒有偏移，再查 Cover Sensor 與線束。',
  keyFacts:['外殼沒扣到底與 Sensor 故障要分開。','狀態不隨開關變化時才偏 Sensor/線束。'],
  engineering:['拆 Cutter Cover 前先斷電。'],
  verify:['開關 Cover 20 次狀態正確','列印/切標正常'],
  flow:[['重新關閉 Cutter Cover','確認卡榫與外殼沒有變形。',['正常','仍報錯'],'仍報進 Sensor。'],['觀察狀態變化','手動開/關 Cover。',['會變','不變'],'不變偏 Sensor。'],['檢查觸發機構/Sensor','清潔與固定。',['正常','已修復'],'再測。'],['檢查線束','斷電查接頭。',['正常','異常'],'異常修復。'],['板端收斂','依 Service Manual 查 input。',['板端方向高','其他'],'最後。']]
});

addRepairKB({
  id:'sato-cl4nxplus-1017-command',brand:'SATO',models:['CL4NX Plus'],category:'錯誤碼／警報',
  title:'CL4NX Plus｜1017 SBPL Command Error／特定工作一送就錯',severity:'中',sources:['sato_clnx_errors'],
  summary:'SBPL Command Error 若只在特定標籤或工作出現，優先查指令內容、模擬模式、資料編碼與應用程式輸出，不應先拆 Printer。',
  keyFacts:['Self Test 正常＋只有特定工作錯，資料端優先。','保存原始 SBPL 工作最有助重現。','換 Driver/語言設定可能改變輸出。'],
  engineering:['用最小 SBPL 測試格式切開 Printer 與應用程式。'],
  verify:['最小測試格式正常','原工作修正後可連印','重開機後仍正常'],
  flow:[['確認本機 Self Test','Printer 不經電腦是否正常。',['正常','異常'],'異常先修 Printer。'],['最小 SBPL 測試','只送基本文字/條碼。',['正常','失敗'],'正常表示原工作問題。'],['比對原始資料','找不支援或格式錯誤指令。',['找到','未找到'],'保留原檔。'],['檢查 Driver/Emulation','語言模式與送出的資料是否一致。',['正確','已修正'],'再測。'],['韌體/主板收斂','所有合法最小格式都錯才進 Printer。',['韌體方向','板端方向','其他'],'最後。']]
});
