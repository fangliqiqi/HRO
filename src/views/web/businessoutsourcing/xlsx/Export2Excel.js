/* eslint-disable */
require('script-loader!file-saver');
import XLSX from 'xlsx-style'

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
      }
      ;

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

function sheet_from_array_of_arrays(data, opts) {
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
                                       title,
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
  data.unshift(title);
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
  var dataInfo = wb.Sheets[wb.SheetNames[0]];

  const borderAll = {  //单元格外侧框线
    top: {
      style: 'thin'
    },
    bottom: {
      style: 'thin'
    },
    left: {
      style: 'thin'
    },
    right: {
      style: 'thin'
    }
  };
  //给所以单元格加上边框
  for (var i in dataInfo) {
    if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1') {

    } else {
      dataInfo[i + ''].s = {
        border: borderAll
      }
    }
  }

  // 去掉标题边框
  let arr = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1"];
  arr.some(function (v) {
    let a = merges[0].split(':')
    if (v == a[1]) {
      dataInfo[v].s = {}
      return true;
    } else {
      dataInfo[v].s = {}
    }
  })

  //设置主标题样式
  dataInfo["A1"].s = {
    font: {
      name: '宋体',
      sz: 18,
      color: {rgb: "ff0000"},
      bold: true,
      italic: false,
      underline: false
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    },
    // fill: {
    //   fgColor: {rgb: "008000"},
    // },
  };

  // console.log(merges)
  // console.log(dataInfo)


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
                                                  autoLength
                                                } = {}) {
  /* original data */
  filename = filename || "excel-list"
  data = [...data]
  for (var i = 0; i < header.length; i++) {
    data[i].unshift(header[i])
  }

  // data.unshift(header)

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = sheetname
  var wb = new Workbook(),
    ws = []
  for (var j = 0; j < header.length; j++) {
    if (j == 1 || j > 5) {
      data[j].splice(0, 1)
    }
    ws.push(sheet_from_array_of_arrays_bill(data[j], j,autoLength))
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
        }
      }
    }
    //重写行宽
    result = [];
    result.push([{wch: 25},{wch: 23},{wch: 19},{wch: 23}]);
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

function sheet_from_array_of_arrays_bill(data, opts,autoLength) {
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
  // R: ROWS  C: COLUNMS
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
  let style0 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style2 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true } };
  let style3 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 18, color: { rgb: "ea5b5b" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style4 = { alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 11, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
  let style5 = { border: border2,alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true, bold: true } };
  let style5_1 = { border: border2,alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 9, color: { rgb: "000000" }, outline: true } };
  let style5_2 = { border: border2,alignment: { horizontal: 'left', wrapText: true, vertical: "center" }, font: { sz: 9, color: { rgb: "000000" }, outline: true } };
  let style5_header = { border: border2,alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true,bold: true }, fill: {fgColor: { rgb: "DDDDDD" }} };
  let style5_header_1 = { border: border2,alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 9, color: { rgb: "000000" }, outline: true,bold: true }, fill: {fgColor: { rgb: "DDDDDD" }} };
  //边框加粗
  let style6 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style7 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style8 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "bottom" }, font: { sz: 22, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style9 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style10 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style11 = { border: border2, font: { sz: 9, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style12 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style13 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style14 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style15 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 } } };
  let style16 = { border: border3, alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 9, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  let style17 = { border: border2, alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 } } };
  // 结算单数据整理
  if (opts == 0) {
    // 合并单元格
    ws['!merges'] = []
    for(let i = 0; i < 6; i++) {
      if(i == 0) {
        ws['!merges'].push({ s: { r: i, c: 0 }, e: { r: i, c: 3 } });
      } else {
        ws['!merges'].push({ s: { r: i, c: 1 }, e: { r: i, c: 3 } });
      }
    }
    // settleIncomeOthers:0,
    // costingPayments:0,
    // invoice:this.invoice.length,
    // reciveList:0,
    // incomeList:0,
    let auto = ws['!merges'].length + autoLength.settleIncomeOthers + autoLength.costingPayments + 1;
    for(let i = ws['!merges'].length; i <= auto; i++) {
      ws['!merges'].push({ s: { r: i, c: 0 }, e: { r: i, c: 0 } });
    }
    for(let i = auto + 1; i < auto + 4; i++) {
      ws['!merges'].push({ s: { r: i, c: 1 }, e: { r: i, c: 2 } });
    }
    const begin = auto + 7 + autoLength.invoice + autoLength.reciveList
    for(let i = begin; i <= begin + autoLength.incomeList; i ++){
      ws['!merges'].push({ s: { r: i, c: 0 }, e: { r: i, c: 1 } });
      ws['!merges'].push({ s: { r: i, c: 2 }, e: { r: i, c: 3 } });
    }

    // 表格样式
    for (let m = 0; m < 4; m++) {
      let order = String.fromCharCode((65 + m))
      if (order == 'A') {
        for(let i = 1; i <= 8; i++) {
          if(i == 1) {
            ws[order + String(i)].s = style5_header
          } else {
            ws[order + String(i)].s = style5_header_1
          }
        }
        const temp = 9+autoLength.settleIncomeOthers+autoLength.costingPayments
        for(let i = 9; i <= data.length; i++) {
          if(i<temp){
            ws[order + String(i)].s = style5_1
          }else if(i<(temp+5)){
            ws[order + String(i)].s = style5_header_1
          }else if(i<(temp+5+autoLength.invoice)){
            ws[order + String(i)].s = style5_1
          }else if(i == (temp+5+autoLength.invoice)){
            ws[order + String(i)].s = style5_header_1
          }else if(i == (temp+6+autoLength.invoice + autoLength.reciveList)){
            ws[order + String(i)].s = style5_header_1
          }else{
            ws[order + String(i)].s = style5_1
          }
        }
      } else {
        ws[order + '7'].s = style5
        const temp = 8+autoLength.settleIncomeOthers+autoLength.costingPayments
        for(let i = 1; i <= data.length; i++) {
          if(i < 7) {
            ws[order + String(i)].s = style5_2
          }else if(i === 7) {
            ws[order + String(i)].s = style5_header_1
          }else if(i <= (temp+3)) {
            if(ws[order + String(i)]){
              ws[order + String(i)].s = style5_2
            }
          }else if(i === (temp+4)){
            ws[order + String(i)].s = (order==='C') ? style5_header_1 : style5_1
          }else if(i === (temp+5)){
            ws[order + String(i)].s = style5_header_1
          }else if(i < (temp+5+autoLength.invoice)){
            ws[order + String(i)].s = style5_1
          }else if(i === (temp+6+autoLength.invoice)){
            ws[order + String(i)].s = style5_header_1
          }else if(i == (temp+7+autoLength.invoice + autoLength.reciveList)){
            ws[order + String(i)].s = style5_header_1
          }else{
            ws[order + String(i)].s = style5_1
          }
        }
      }
      // ws[order + (data.length)].s = { border: border, font: { sz: 9, color: { rgb: "FFFFFF" }, outline: true } };
    }
    
    let wsrows = [];
    for(let i = 0; i < data.length; i++) {
      // {hpt: 12}, // "points"
      // {hpx: 36}, // "pixels"
      if(i == 0) {
        wsrows.push({hpx: 26})
      } else {
        wsrows.push({hpx: 21})
      }
    }
    ws['!rows'] = wsrows;
  }
  // 封面数据整理
  if (opts == 1) {
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      { s: { r: 3, c: 4 }, e: { r: 10, c: 4 } },
    ]
    if (data.length == 16) {
      ws['!merges'].push({ s: { r: 11, c: 1 }, e: { r: 11, c: 2 } })
      ws['!merges'].push({ s: { r: 12, c: 0 }, e: { r: 12, c: 3 } })
      ws['!merges'].push({ s: { r: 13, c: 0 }, e: { r: 13, c: 3 } })
      ws['!merges'].push({ s: { r: 15, c: 2 }, e: { r: 15, c: 3 } })
    } else {
      ws['!merges'].push({ s: { r: 11, c: 0 }, e: { r: 11, c: 3 } })
      ws['!merges'].push({ s: { r: 12, c: 0 }, e: { r: 12, c: 3 } })
      ws['!merges'].push({ s: { r: 14, c: 2 }, e: { r: 14, c: 3 } })
    }

    for (var m = 0; m < 4; m++) {
      let order = String.fromCharCode((65 + m))
      ws[order + '1'].s = style12
      ws[order + '2'].s = style8
      ws[order + '4'].s = style7
      ws[order + '6'].s = style0
      if (data.length == 16) {
        ws["A12"].s = style13
        ws["B12"].s = style14
        ws["C12"].s = style13
        ws["D12"].s = style15
        ws["E13"].s = { border: border }
        ws[order + "13"].s = style11
        ws[order + "14"].s = style11
        ws[order + "16"].s = style16
      } else {
        ws["E12"].s = { border: border }
        ws[order + "11"].s = style0
        ws[order + "12"].s = style11
        ws[order + "13"].s = style11
        ws[order + "15"].s = style16
      }
      ws["E4"].s = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" } }
    }
  }
  return ws;
}
