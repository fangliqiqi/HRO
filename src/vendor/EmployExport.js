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
  let style0 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true, bold: true, }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style2 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style3 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "ea5b5b" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style4 = { alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 11, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
  let style5 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
  //边框加粗
  let style6 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style7 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style8 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "bottom" }, font: { sz: 22, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style9 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style10 = { alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style11 = { border: border2, font: { sz: 9, color: { rgb: "333" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style12 = { border: border, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style13 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style14 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 14, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style15 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { sz: 11, color: { rgb: "000000" }, outline: true, bold: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style16 = { border: border3, alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 9, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  let style17 = { border: border2, alignment: { horizontal: 'left', wrapText: true, vertical: "left" }, font: { sz: 11, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };
  // 报账表
  let wsrows = [];
  if (opts == 0) {
    let length = data[0].length
    let headerArr = []
    let order
    if (length < 26) {
      for (let i = 0; i < length; i++) {
        order = String.fromCharCode((65 + i))
        headerArr.push(order)
      }
    } else {
      for (let i = 0; i < 26; i++) {
        order = String.fromCharCode((65 + i))
        headerArr.push(order)
      }
    }


    if (length >= 26) {
      let balance = (length - 26) % 26
      let orderMore = parseInt((length - 26) / 26)
      if (orderMore > 0) {
        for (let c = 0; c <= orderMore; c++) {
          if (c == orderMore) {
            for (let d = 0; d < balance; d++) {
              order = String.fromCharCode((65 + c)) + String.fromCharCode((65 + d))
              headerArr.push(order)
            }
          } else {
            for (let d = 0; d < 26; d++) {
              order = String.fromCharCode((65 + c)) + String.fromCharCode((65 + d))
              headerArr.push(order)
            }
          }

        }
      } else {
        for (let m = 0; m < balance; m++) {
          order = String.fromCharCode((65 + 0)) + String.fromCharCode((65 + m))
          headerArr.push(order)
        }
      }
    }
    for (let d of headerArr) {
      let header = d + 1
      ws[header].s = style0
      for (let j = 2; j <= data.length; j++) {
        let header2 = d + j
        if (ws[header2] != undefined) {
          ws[header2].s = style2
        }
      }
    }
    wsrows.push({ hpx: 30 })
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
  bookType = "xlsx"
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
    if (j >= 1) {
      data[j].splice(0, 1)
    }
    ws.push(sheet_from_array_of_arrays(data[j], j))
  }
  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = []
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item))
    })
  }
  // console.log("width", autoWidth)
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
