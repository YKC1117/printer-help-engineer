'use strict';

// 補入維修資料已引用、且可由原廠資料確認存在的舊機／同系列機型。
// 這些型號加入 catalog 的目的，是讓工程師可直接搜尋與查看專屬資料；不是把停產機誤標成現行產品。
PRODUCTS.push(
  {b:'Zebra',t:'工業型',s:'Xi4 系列',m:'140Xi4',status:'已停產',note:'Zebra 舊款 5 吋 Xi4 工業型；原廠建議替代方向為 ZT620'},
  {b:'Zebra',t:'工業型',s:'Xi4 系列',m:'170Xi4',status:'已停產',note:'Zebra 舊款 6.6 吋 Xi4 工業型；原廠建議替代方向為 ZT620'},
  {b:'TSC',t:'桌上型',s:'TH 系列',m:'TH240T',status:'官網產品頁',note:'203 dpi；TH Series 彩色觸控螢幕版本'},
  {b:'TSC',t:'桌上型',s:'TH 系列',m:'TH340T',status:'官網產品頁',note:'300 dpi；TH Series 彩色觸控螢幕版本'},
  {b:'Argox',t:'桌上型',s:'P4 系列（舊）',m:'P4-250',status:'已停產',note:'舊款 203 dpi P4；接續型號 P4-250 Pro'},
  {b:'Argox',t:'桌上型',s:'P4 系列（舊）',m:'P4-350',status:'已停產',note:'舊款 300 dpi P4；接續型號 P4-350 Pro'}
);
