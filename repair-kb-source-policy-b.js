'use strict';

// 精確零件料號來源政策：A 級原廠優先；原廠未公開時允許 B 級雙來源交叉確認。
(function(){
  if(!window.KB_SOURCES)return;
  Object.assign(window.KB_SOURCES,{
    honeywell_pm45_accessories_exact:{
      label:'Honeywell PM45 / PM45c Industrial Printers Accessories Guide',
      level:'A｜原廠配件指南',
      url:'https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/ppr/en-gb/localized/accessories-guides/sps-ppr-pm45-pm45c-industrial-printer-series-accessories-guide-en-a4.pdf'
    },
    honeywell_pm45_pm65_accessories:{
      label:'Honeywell PM45 / PM65 Industrial Printers Accessories Guide',
      level:'A｜原廠配件指南',
      url:'https://prod-edam.honeywell.com/content/dam/honeywell-edam/sps/ppr/en-gb/public/products/printers/industrial/pm65/documents/sps-ppr-pm45-pm65-industrial-printers-accessories-guide-en.pdf'
    },
    tsc_mh241_parts_mirror:{
      label:'TSC MH241 Series Parts List（品牌專門經銷商保存之零件表）',
      level:'B｜原廠零件表鏡像',
      url:'https://www.tsc-drucker.com/out/media/TSC_mh241_part-list.pdf'
    },
    tsc_mh241_parts_infinite:{
      label:'TSC MH241 Series Spare Parts Listing — Infinite Solutions',
      level:'B｜專業零件商',
      url:'https://buytscprinters.com/pages/printer-spares-enquiry'
    },
    tsc_mh241_parts_barcodefactory:{
      label:'TSC MH241 Series Parts / Accessories — BarcodeFactory',
      level:'B｜專業零件商',
      url:'https://www.barcodefactory.com/tsc/printers/mh241p/mh241p-a001-0701/p-accessories'
    },
    tsc_mh241_parts_tscdrucker:{
      label:'TSC MH241 Series Spare Parts — TSC-Drucker',
      level:'B｜品牌專門經銷商',
      url:'https://www.tsc-drucker.com/en/Industrial-Printer/MH241-Series/Spare-Parts/'
    }
  });

  window.KB_PARTS_SOURCE_POLICY={
    version:1,
    a:'A 級原廠 Parts Catalog／Accessories Guide 可作為精確料號主要依據；下料前仍核對 Model、S/N、DPI、Revision、Option。',
    b:'B 級精確料號必須至少兩個獨立來源一致，並在資料庫標示「B 級雙來源」；單一 B 級來源不得升格為精確料號。',
    finalCheck:['完整型號','Serial Number','DPI','Hardware Revision','Cutter/Peel/Rewind/RFID 等選配','最新 superseded/replacement P/N']
  };
})();
