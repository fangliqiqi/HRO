/* eslint-disable */
require('script-loader!file-saver');
import XLSX from "xlsx-style"

function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      };

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan)
        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts,settleType,listLength,rowNum,takingBalance) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  
  let border = {
    bottom: { style: "thin", color: { rgb: "c0c0c0" } }, top: { style: "thin", color: { rgb: "c0c0c0" } },
    left: { style: "thin", color: { rgb: "c0c0c0" } }, right: { style: "thin", color: { rgb: "c0c0c0" } }
  }
  let border2 = {
    bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
  }
  let border3 = {
    bottom: { style: "thin", color: { rgb: "c0c0c0" } }, top: { style: "thin", color: { rgb: "c0c0c0" } },
  }
  let border4 = {
    bottom: { style: "thin", color: { rgb: "c0c0c0" } }, top: { style: "thin", color: { rgb: "c0c0c0" } },
    left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
  }
  let style0 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style2 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style3 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 18, color: { rgb: "ea5b5b" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style4 = { font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
  let style5 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
  //边框加粗
  let style6 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style7 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style8 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "bottom" }, font: { name: '宋体', sz: 22, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style9 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style10 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style11 = { border: border2, font: { sz: 9, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style12 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style13 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style14 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style15 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style16 = { border: border3, font: { name: '宋体', sz: 9, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style17 = { border: border2, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style18 = { border: border, font: { name: '宋体', sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style19 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 12, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style20 = { border: border4, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 12, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style21 = { border: border, font: { name: '宋体', sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style22 = { border: border2, font: { name: '宋体', sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style24 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };

  // 默认样式
  const defaultStyle = {
    border: {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 11, color: { rgb: "000000" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const headStyle = { 
    border: defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 14, color: { rgb: "000000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  };
  const titleStyle = {
    border: defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "bottom" },
    font: { name: '宋体', sz: 22, color: { rgb: "000000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  };
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 11, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  
  let wsrows = [];
  // 结算单数据整理
  if (opts == 0) {
    let merges = [];
    merges = merges.concat([
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
      { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
    ]);
    if(settleType == 0){ // 0普通工资
      merges = merges.concat([
        { s: { r: 5, c: 0 }, e: { r: 8, c: 0 } },
        { s: { r: 5, c: 1 }, e: { r: 8, c: 1 } },
        { s: { r: 9, c: 0 }, e: { r: 12, c: 0 } },
        { s: { r: 9, c: 1 }, e: { r: 12, c: 1 } },
        { s: { r: 13, c: 0 }, e: { r: 16, c: 0 } },
        { s: { r: 13, c: 1 }, e: { r: 16, c: 1 } },
        { s: { r: 17, c: 1 }, e: { r: 17, c: 2 } },
      ])

      for(let j=18;j<listLength+18+rowNum;j++){
        merges = merges.concat([
          { s: { r: j, c: 1 }, e: { r: j, c: 2 } },
        ])
      }
      const rowLine = listLength+18+rowNum
      merges = merges.concat([
        { s: { r: rowLine, c: 1 }, e: { r: rowLine, c: 2 } },
        { s: { r: rowLine+1, c: 1 }, e: { r: rowLine+1, c: 2 } },
        { s: { r: rowLine+2, c: 1 }, e: { r: rowLine+2, c: 2 } },
        { s: { r: rowLine+3, c: 1 }, e: { r: rowLine+3, c: 2 } },
        { s: { r: rowLine+4, c: 1 }, e: { r: rowLine+4, c: 2 } },
        { s: { r: rowLine+5, c: 1 }, e: { r: rowLine+5, c: 3 } },
        { s: { r: rowLine+6, c: 1 }, e: { r: rowLine+6, c: 4 } },
        { s: { r: rowLine+7, c: 1 }, e: { r: rowLine+7, c: 4 } },
        { s: { r: rowLine+8, c: 1 }, e: { r: rowLine+8, c: 4 } },
        { s: { r: rowLine+9, c: 1 }, e: { r: rowLine+9, c: 5 } },
      ])
    }else if(settleType == 5){   //工程
      merges = [].concat([
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 4 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
        { s: { r: 5, c: 0 }, e: { r: 8, c: 0 } },
        { s: { r: 5, c: 1 }, e: { r: 8, c: 1 } },
        { s: { r: 9, c: 0 }, e: { r: 10, c: 0 } },
        { s: { r: 9, c: 1 }, e: { r: 10, c: 1 } },
        { s: { r: 11, c: 0 }, e: { r: 12, c: 0 } },
        { s: { r: 11, c: 1 }, e: { r: 12, c: 1 } }
      ]);
      for(let k=0; k < listLength; k++){
        merges = merges.concat([
          { s: { r: 13+k, c: 1 }, e: { r: 13+k, c: 2 } },
        ])
      }
      let ablance = 0;
      if(takingBalance != 0){
        merges = merges.concat([
          { s: { r: 14+j, c: 1 }, e: { r: 14+j, c: 2 } },
        ])
        ablance++
      }
      merges = merges.concat([
        { s: { r: 13+listLength+ablance, c: 1 }, e: { r: 13+listLength+ablance, c: 2 } },
        { s: { r: 14+listLength+ablance, c: 1 }, e: { r: 14+listLength+ablance, c: 2 } },
        { s: { r: 15+listLength+ablance, c: 1 }, e: { r: 15+listLength+ablance, c: 2 } },
        { s: { r: 16+listLength+ablance, c: 1 }, e: { r: 16+listLength+ablance, c: 2 } },
        { s: { r: 17+listLength+ablance, c: 1 }, e: { r: 17+listLength+ablance, c: 2 } },
        { s: { r: 18+listLength+ablance, c: 1 }, e: { r: 18+listLength+ablance, c: 2 } },
        { s: { r: 19+listLength+ablance, c: 1 }, e: { r: 19+listLength+ablance, c: 2 } },
        { s: { r: 20+listLength+ablance, c: 1 }, e: { r: 20+listLength+ablance, c: 2 } },
        { s: { r: 21+listLength+ablance, c: 1 }, e: { r: 21+listLength+ablance, c: 2 } },
        { s: { r: 22+listLength+ablance, c: 2 }, e: { r: 22+listLength+ablance, c: 4 } },
      ])
    }else{
      // 1非扣税
      merges = merges.concat([
        { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } },
      ])
      for(let j=0;j<listLength+5;j++){
        merges = merges.concat([
          { s: { r: 6+j, c: 1 }, e: { r: 6+j, c: 2 } },
        ])
      }
      merges = merges.concat([
        { s: { r: 6+listLength+5, c: 1 }, e: { r: 6+listLength+5, c: 3 } },
        { s: { r: 6+listLength+6, c: 1 }, e: { r: 6+listLength+6, c: 4 } },
        { s: { r: 6+listLength+7, c: 1 }, e: { r: 6+listLength+7, c: 4 } },
        { s: { r: 6+listLength+8, c: 1 }, e: { r: 6+listLength+8, c: 4 } },
        { s: { r: 6+listLength+9, c: 1 }, e: { r: 6+listLength+9, c: 5 } },
      ])
    }

    ws['!merges'] = merges;
    const total = settleType == 5 ? 5 : 6
    for (var m = 0; m < total; m++) {
      let order = String.fromCharCode((65 + m))
      if (order == 'A' || order == 'E') {
        ws[order + '2'].s = style5
        ws[order + '3'].s = style5
        ws[order + '4'].s = style5
      } else {
        ws[order + '2'].s = style4
        ws[order + '3'].s = style4
        ws[order + '4'].s = style4
      }
      ws[order + '5'].s = style15;
      for (var n = 6; n < data.length + 1; n++) {
        if (ws[order + n] != undefined) {
          ws[order + n].s = style6
        }
      }
      
      ws["A1"].s = style3
      if(ws[order + (data.length)] && settleType != 5){
        ws[order + (data.length)].s = { border: border, font: { sz: 9, color: { rgb: "FFFFFF" }, outline: true } };
      }
    }
    
    wsrows.push({ hpx: 40 })
    ws['!rows'] = wsrows;
  }

  // 封面数据整理
  if (opts >= 1) {
    ws['!merges'] = [   
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 9, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } },
      { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } },
      { s: { r: 4, c: 3 }, e: { r: 5, c: 3 } },
      { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } },
      { s: { r: 7, c: 1 }, e: { r: 7, c: 3 } },
      { s: { r: 8, c: 0 }, e: { r: 8, c: 3 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 3 } },
    ]

    for (var m = 0; m < 5; m++) {
      const order = String.fromCharCode((65 + m))
      for (let i = 1; i < 11; i++) {
        if(ws[order + String(i)]){
          ws[order + String(i)].s = defaultStyle
        }
      }
    }
    ws['A1'].s = headStyle
    ws['A2'].s = titleStyle
    ws['A4'].s = thStyle
    ws['B4'].s = thStyle
    ws['C4'].s = thStyle
    ws['C3'].s = thStyle
    ws['D4'].s = thStyle
    ws['A7'].s = thStyle
    ws['A8'].s = thStyle
    
    // 修改首行的行高
    wsrows.push({ hpx: 30 })
    wsrows.push({ hpx: 35 })
    wsrows.push({ hpx: 20 })
    for (let i = 2; i < 10; i++) {
      wsrows.push({ hpx: 20 })
    }
    ws['!rows'] = wsrows;
  }

  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "test.xlsx")
}

export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  filename = filename || 'excel-list'
  data = [...data]
  data.unshift(header);

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.${bookType}`);
}


export function export_json_to_excel_more_sheet({
  multiHeader = [],
  header,
  data,
  sheetname,
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx",
  settleType = 0, // 结算单类型 0自定义暂停发1非扣税
  listLength = 0, // 自定义项目长度
  rowNum = 0,
  takingBalance = 0
} = {}) {
  /* original data */
  filename = filename || "excel-list"
  data = [...data]
  for (var i = 0; i < header.length; i++) {
    data[i].unshift(header[i])
  }
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = sheetname
  var wb = new Workbook(),
    ws = []
  for (var j = 0; j < header.length; j++) {
    data[j].splice(0, 1)
    ws.push(sheet_from_array_of_arrays(data[j], j,settleType,listLength,rowNum,takingBalance))
  }
  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = []
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item))
    })
  }
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    var colWidth = []
    for (var k = 0; k < header.length; k++) {
      colWidth.push(
        data[k].map(row =>
          row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
              return {
                wch: 10
              }
            } else if (val.toString().charCodeAt(0) > 255) {
              /*再判断是否为中文*/
              return {
                wch: val.toString().length * 2
              }
            } else {
              return {
                wch: val.toString().length
              }
            }
          })
        )
      )
    }

    /*以第一行为初始值*/
    let result = []
    for (var k = 0; k < colWidth.length; k++) {
      result[k] = colWidth[k][0]
      for (let i = 1; i < colWidth[k].length; i++) {
        for (let j = 0; j < colWidth[k][i].length; j++) {
          if (result[k][j]["wch"] < colWidth[k][i][j]["wch"]) {
            result[k][j]["wch"] = colWidth[k][i][j]["wch"] + 5
          }
          //result[k][j]["wch"] = 25
          if (k == 0) {
            result[k][j]["wch"] = 13.75
          }
          if (k >= 1) {
            if(j == 0) {
              result[k][j]["wch"] = 40
            } else if(j == 4){
              result[k][j]["wch"] = 2
            } else {
              result[k][j]["wch"] = 30
            }
          }
        }
      }
    }
    // 分别给sheet表设置宽度
    for (var l = 0; l < result.length; l++) {
      ws[l]["!cols"] = result[l]
    }
  }

  /* add worksheet to workbook */
  for (var k = 0; k < header.length; k++) {
    wb.SheetNames.push(ws_name[k])
    wb.Sheets[ws_name[k]] = ws[k]
  }

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  })
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    `${filename}.${bookType}`
  )
}
