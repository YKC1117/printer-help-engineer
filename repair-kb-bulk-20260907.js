'use strict';

// 2026-09-07 大批次擴充：目標由約 67 筆提升到接近 200 筆。
// 這一層提供「每個主力機型家族都有可直接開始排查的工程入口」；
// 有精確原廠來源就掛來源，沒有同型號手冊的項目明確保留為工程通用基線。

addRepairPack({id:'zebra-zt600',brand:'Zebra',label:'ZT610 / ZT620',models:['ZT610','ZT620'],sources:['zebra_zt600','zebra_zt600_tw','zebra_jg','zebra_cal'],issues:['power','feed','sensor','quality','comms','cutter','ribbon'],note:'ZT600 工業機先保留設定/耗材與硬體隔離順序，避免把 Sensor 或主板過早定罪。'});
addRepairPack({id:'zebra-xi4',brand:'Zebra',label:'110Xi4 / 220Xi4',models:['110Xi4','220Xi4'],sources:['zebra_xi4','zebra_110','zebra_jg','zebra_cal'],issues:['power','feed','sensor','quality','comms','cutter','ribbon'],note:'Xi4 舊機常見老化、接頭、線束、Platen、Gear 與 Sensor 問題，交叉測試價值高。'});
addRepairPack({id:'zebra-zt400',brand:'Zebra',label:'ZT411 / ZT421',models:['ZT411','ZT421'],sources:['zebra_zt400','zebra_jg','zebra_cal'],issues:['power','feed','sensor','quality','comms','cutter','ribbon'],note:'ZT400 系列先利用內建診斷、Sensor Profile 與原廠壓力調整邏輯，再進硬體。'});
addRepairPack({id:'zebra-zt510',brand:'Zebra',label:'ZT510',models:['ZT510'],sources:['zebra_zt510','zebra_jg','zebra_cal'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'ZT510 是 105SL 系列升級方向，工業機排查仍先切開耗材、Sensor、機構與驅動。'});
addRepairPack({id:'zebra-zt200',brand:'Zebra',label:'ZT111 / ZT210 / ZT220 / ZT230 / ZT231',models:['ZT111','ZT210','ZT220','ZT230','ZT231'],sources:['zebra_zt230','zebra_zt231','zebra_jg','zebra_cal'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'同系列不同世代面板路徑可能不同；實際選單名稱以各機 User Guide 為準。'});
addRepairPack({id:'zebra-zd46',brand:'Zebra',label:'ZD421 / ZD621',models:['ZD421','ZD621'],sources:['zebra_zd421','zebra_zd421_cal','zebra_jg'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'桌上型先用 SmartCal/Manual Calibration 與最小連線交叉，避免直接拆機。'});
addRepairPack({id:'zebra-zd2',brand:'Zebra',label:'ZD220 / ZD230 / ZD888TA',models:['ZD220','ZD230','ZD888TA'],sources:['zebra_cal','zebra_jg'],issues:['power','feed','sensor','quality','comms'],note:'此組以 Zebra 通用 ZPL 校正/感應診斷為工程基線，精確按鍵流程需看個別型號文件。'});
addRepairPack({id:'zebra-legacy-desktop',brand:'Zebra',label:'GK420 / GX420 / GX430 / GT800',models:['GK420','GX420','GX430','GT800'],sources:['zebra_cal','zebra_jg'],issues:['power','feed','sensor','quality','comms'],note:'舊桌機優先查電源供應器、Platen、Sensor 髒污、USB/Driver 與耗材裝法。'});
addRepairPack({id:'zebra-mobile',brand:'Zebra',label:'ZR658 / ZR668 / ZQ511 / ZQ521 / QLn420',models:['ZR658','ZR668','ZQ511','ZQ521','QLn420'],sources:[],issues:['power','sensor','quality','comms'],note:'行動機需額外把 Battery、Charging、Bluetooth/Wi-Fi 與底座/接點納入隔離；精確電池規格看該機文件。'});

addRepairPack({id:'tsc-mhmb',brand:'TSC',label:'MH241 / MH341 / MH641 / MH640 / MB240T / MB340T',models:['MH241','MH341','MH641','MH640','MB240T','MB340T'],sources:['tsc_mh241','tsc_mh_product'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'工業型可善用 TPH Care/內建診斷與 TSC Console；壞點、Sensor 與連線要分開。'});
addRepairPack({id:'tsc-thte',brand:'TSC',label:'TH240 / TH340 / TE200 / TE210 / TE300 / TE310',models:['TH240','TH340','TE200','TE210','TE300','TE310'],sources:['tsc_th240','tsc_th_product','tsc_te'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'桌上型常見耗材、Ribbon 回收、Sensor 校正與 Driver 問題，先做最小化交叉。'});
addRepairPack({id:'tsc-ttptx',brand:'TSC',label:'TTP-247 / TTP-345 / TTP-244 PRO / TX610',models:['TTP-247','TTP-345','TTP-244 PRO','TX610'],sources:['tsc_ttp'],issues:['power','feed','sensor','quality','comms'],note:'高 DPI 機種更要注意速度、熱量、耗材匹配與固定壞點，不可只靠 Darkness 補品質。'});
addRepairPack({id:'tsc-da',brand:'TSC',label:'DA210 / DA220',models:['DA210','DA220'],sources:[],issues:['power','feed','sensor','comms'],note:'Direct Thermal 桌機沒有 Ribbon 路徑，遇到空白要先確認紙材是否真為熱感紙。'});
addRepairPack({id:'tsc-alpha',brand:'TSC',label:'Alpha-3R',models:['Alpha-3R'],sources:[],issues:['power','sensor','quality','comms'],note:'行動機優先把 Battery、充電、藍牙/Wi-Fi 與摔落造成的接點/外殼變形納入。'});

addRepairPack({id:'argox-p4',brand:'Argox',label:'P4-650 / P4 Pro 系列',models:['P4-650','P4-250 Pro','P4-350 Pro','P4-650 Pro'],sources:['argox_p4','argox_p4_product'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'P4 系列遇到白色/特殊碳帶品質問題，先固定速度/濃度與耗材，不把 Zebra 的 Darkness 數字直接套用。'});
addRepairPack({id:'argox-ix4',brand:'Argox',label:'iX4 Pro 系列',models:['iX4-200 Pro','iX4-240 Pro','iX4-250 Pro','iX4-350 Pro'],sources:[],issues:['power','feed','sensor','quality','comms','ribbon'],note:'此組為工業型工程基線；精確 Sensor、板件與拆裝以 iX4 Pro Service 文件為準。'});
addRepairPack({id:'argox-desktop',brand:'Argox',label:'CX / CP / OS 桌上型',models:['CX-3140 Pro','CX-2140 Pro','OS-214EX Pro','CP-2140EX','CP-3140EX','CP-3140L','CP-2140M','OS-214plus'],sources:['argox_cp','argox_os214'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'舊新世代按鍵校正方式可能不同；先確認實際型號再照原廠開機/FEED 流程。'});

addRepairPack({id:'godex-industrial',brand:'GoDEX',label:'GX / ZX / EZ 工業型',models:['GX4200i','GX4300i','GX4600i','ZX420i+','ZX430i+','ZX1200i+','ZX1300i+','ZX1600i+','EZ2250i','EZ2350i','EZ6250i','EZ6350i'],sources:['godex_zx1000i'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'不同 GoDEX 系列 Sensor/面板選單不同；此組以工業機通用隔離為基線，ZX1000i+ 有原廠校正資源。'});
addRepairPack({id:'godex-desktop',brand:'GoDEX',label:'GE / G500 / RT / DT 桌上型',models:['GE300','GE330','EZ120','G500+','G530+','RT700i+','RT730i+','RT863i+','DT2x','G500','G530','EZ520','EZ530'],sources:['godex_g500'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'桌上型遇到連線問題可先用 GoLabel/NetSetting 或系統測試頁切開軟體與硬體；實際工具依型號。'});

addRepairPack({id:'toshiba-bexba',brand:'TOSHIBA',label:'B-EX / BA 系列',models:['BA410T','BA420T','B-EX4T1','B-EX4T2','B-EX4T3','B-EX6T','SA4TM'],sources:['toshiba_ba410','toshiba_bex4'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'TOSHIBA Threshold、Reflective/Transmissive Sensor 與 Ribbon Sensor 設定要與實際耗材配合；舊 SA4TM 細節另依原廠舊機文件。'});

addRepairPack({id:'sato-cl',brand:'SATO',label:'CL4NX Plus / CL4-SXR',models:['CL4NX Plus','CL4-SXR'],sources:['sato_clnx_cal','sato_clnx_quality','sato_clnx_ribbon','sato_clnx_offset'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'CL4NX Plus 可利用錯誤碼與原廠 Sensor/Offset/Quality 指引快速收斂；CL4-SXR 精確選單依該機文件。'});

addRepairPack({id:'honeywell-modern',brand:'Honeywell (Datamax/Intermec)',label:'PM45 / PX940 / PX240S',models:['PM45','PX940','PX240S'],sources:['honeywell_pm45','honeywell_pm45_cal','honeywell_px940','honeywell_px940_faq'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'現代 Honeywell 先利用 Calibration Wizard、Sensor 對位與系統診斷；PX940 窄標籤特別注意 LSS 對位。'});
addRepairPack({id:'datamax-legacy',brand:'Honeywell (Datamax/Intermec)',label:'Datamax H / I / M-Class',models:['H-4212X','H-4310X','H-4606X','H-4212','H-4310','H-4408','H-4606','I-4212e','I-4310e','I-4606e','M-4206','M-4210','M-4308'],sources:['honeywell_iclass','datamax_iclass_op','datamax_iclass_maint'],issues:['power','feed','sensor','quality','comms','ribbon'],note:'舊 Datamax 維修價值在逐層隔離：Sensor/Media、Drive Motor/Gear、PSU、Main Logic PCB；不要跳步換板。'});
