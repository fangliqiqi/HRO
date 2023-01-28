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
  // console.log(opts);
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
      // yhy修改
      var cell = {
        v: data[R][C] == 0 || data[R][C] ? data[R][C] : ''
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
  let style23 = { border: border2, alignment: { horizontal: 'center', wrapText: true, vertical: "center" }, font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } } };

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

  // 工资明细数据整理
  if (opts == 0) {
    let length = data[0].length
    if (length <= 26) {
      for (let i = 0; i < length; i++) {
        let order = String.fromCharCode((65 + i))
        let header = order + 1
        ws[header].s = style23
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
    } else {
      for (let i = 0; i < 26; i++) {
        let order = String.fromCharCode((65 + i))
        let header = order + 1
        ws[header].s = style23
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
      for (let i = 0; i < (length - 26); i++) {
        let order = String.fromCharCode((65 + i))
        let header = 'A' + order + 1
        if(ws[header]){
          ws[header].s = style23
        }
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = 'A' + order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
    }
  }
  // 结算单数据整理
  if (opts == 1) {
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } },
      { s: { r: 1, c: 7 }, e: { r: 1, c: 8 } },

      { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } },
      { s: { r: 2, c: 7 }, e: { r: 2, c: 8 } },

      { s: { r: 3, c: 1 }, e: { r: 3, c: 8 } },
      { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
      { s: { r: 4, c: 4 }, e: { r: 4, c: 5 } },
      { s: { r: 4, c: 7 }, e: { r: 4, c: 8 } },

      { s: { r: 5, c: 0 }, e: { r: 8, c: 0 } },
      { s: { r: 5, c: 1 }, e: { r: 8, c: 1 } },
      { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
      { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
      { s: { r: 5, c: 7 }, e: { r: 5, c: 8 } },
      { s: { r: 6, c: 2 }, e: { r: 6, c: 3 } },
      { s: { r: 6, c: 4 }, e: { r: 6, c: 5 } },
      { s: { r: 6, c: 7 }, e: { r: 6, c: 8 } },
      { s: { r: 7, c: 2 }, e: { r: 7, c: 3 } },
      { s: { r: 7, c: 4 }, e: { r: 7, c: 5 } },
      { s: { r: 7, c: 7 }, e: { r: 7, c: 8 } },
      { s: { r: 8, c: 2 }, e: { r: 8, c: 3 } },
      { s: { r: 8, c: 4 }, e: { r: 8, c: 5 } },
      { s: { r: 8, c: 7 }, e: { r: 8, c: 8 } },
      { s: { r: 9, c: 0 }, e: { r: 12, c: 0 } },
      { s: { r: 9, c: 1 }, e: { r: 12, c: 1 } },
      { s: { r: 9, c: 2 }, e: { r: 9, c: 3 } },
      { s: { r: 9, c: 4 }, e: { r: 9, c: 5 } },
      { s: { r: 9, c: 7 }, e: { r: 9, c: 8 } },
      { s: { r: 10, c: 2 }, e: { r: 10, c: 3 } },
      { s: { r: 10, c: 4 }, e: { r: 10, c: 5 } },
      { s: { r: 10, c: 7 }, e: { r: 10, c: 8 } },
      { s: { r: 11, c: 2 }, e: { r: 11, c: 3 } },
      { s: { r: 11, c: 4 }, e: { r: 11, c: 5 } },
      { s: { r: 11, c: 7 }, e: { r: 11, c: 8 } },
      { s: { r: 12, c: 2 }, e: { r: 12, c: 3 } },
      { s: { r: 12, c: 4 }, e: { r: 12, c: 5 } },
      { s: { r: 12, c: 7 }, e: { r: 12, c: 8 } },

      { s: { r: 13, c: 0 }, e: { r: 16, c: 0 } },
      { s: { r: 13, c: 1 }, e: { r: 16, c: 1 } },

      { s: { r: 13, c: 2 }, e: { r: 13, c: 3 } },
      { s: { r: 13, c: 4 }, e: { r: 13, c: 5 } },
      { s: { r: 13, c: 7 }, e: { r: 13, c: 8 } },
      { s: { r: 14, c: 2 }, e: { r: 14, c: 3 } },
      { s: { r: 14, c: 4 }, e: { r: 14, c: 5 } },
      { s: { r: 14, c: 7 }, e: { r: 14, c: 8 } },
      { s: { r: 15, c: 2 }, e: { r: 15, c: 3 } },
      { s: { r: 15, c: 4 }, e: { r: 15, c: 5 } },
      { s: { r: 15, c: 7 }, e: { r: 15, c: 8 } },
      { s: { r: 16, c: 2 }, e: { r: 16, c: 3 } },
      { s: { r: 16, c: 4 }, e: { r: 16, c: 5 } },
      { s: { r: 16, c: 7 }, e: { r: 16, c: 8 } },

      { s: { r: 17, c: 1 }, e: { r: 17, c: 3 } },
      { s: { r: 17, c: 4 }, e: { r: 17, c: 5 } },
      { s: { r: 17, c: 7 }, e: { r: 17, c: 8 } },

    ]
    // console.log(data[data.length - 1]);
     // data[data.length - 1] 自定义数据的长度、差余额的长度、代扣个税的长度、项目成本的长度、项目成本明细的长度/个人代扣的长度、单位代扣
    let addNum = 17
     // 代扣个人年终奖税
    if (data[data.length - 1][2] > 0) {
      ws['!merges'].push({ s: { r: 18, c: 1 }, e: { r: 18, c: 3 } })
      ws['!merges'].push({ s: { r: 18, c: 4 }, e: { r: 18, c: 5 } })
      ws['!merges'].push({ s: { r: 18, c: 7 }, e: { r: 18, c: 8 } })
      addNum = 18
    }
    // 自定义数据
    let less = data[data.length - 1][0]
    if (less > 0) {
      for (let l = 1; l <= less; l++) {
        ws['!merges'].push({ s: { r: l + addNum, c: 1 }, e: { r: l + addNum, c: 3 } })
        ws['!merges'].push({ s: { r: l + addNum, c: 4 }, e: { r: l + addNum, c: 5 } })
        ws['!merges'].push({ s: { r: l + addNum, c: 7 }, e: { r: l + addNum, c: 8 } })
      }
    }
     // 项目成本报销
     let projectNum = data[data.length - 1][3]
     if(projectNum>0){
      //  console.log('项目成本报销',projectNum);
       for (let l = 0; l < less+projectNum; l++) {
         ws['!merges'].push({ s: { r: l + addNum+less+1, c: 2 }, e: { r: l + addNum+less+1, c: 3 } })
         ws['!merges'].push({ s: { r: l + addNum+less+1, c: 4 }, e: { r: l + addNum+less+1, c: 5 } })
         ws['!merges'].push({ s: { r: l + addNum+less+1, c: 7 }, e: { r: l + addNum+less+1, c: 8 } })
       }
     }
    //  个人代扣
    let peoWithholdNum = data[data.length - 1][5]
    if (peoWithholdNum > 0) {
      for (let l = 0; l <= less+projectNum+peoWithholdNum; l++) {
        ws['!merges'].push({ s: { r: l + addNum+less+projectNum+1, c: 1 }, e: { r: l + addNum+less+projectNum+1, c: 3 } })
        ws['!merges'].push({ s: { r: l + addNum+less+projectNum+1, c: 4 }, e: { r: l + addNum+less+projectNum+1, c: 5 } })
        ws['!merges'].push({ s: { r: l + addNum+less+projectNum+1, c: 7 }, e: { r: l + addNum+less+projectNum+1, c: 8 } })
      }
    }
    // 单位代扣
    let unitWithholdNum = data[data.length - 1][6]
    if (unitWithholdNum > 0) {
      let units = addNum+less+projectNum+peoWithholdNum
      for (let l = 0; l <= less+projectNum+peoWithholdNum+unitWithholdNum; l++) {
        ws['!merges'].push({ s: { r: l + units+1, c: 1 }, e: { r: l + units+1, c: 3 } })
        ws['!merges'].push({ s: { r: l + units+1, c: 4 }, e: { r: l + units+1, c: 5 } })
        ws['!merges'].push({ s: { r: l + units+1, c: 7 }, e: { r: l + units+1, c: 8 } })
      }
    }


    const fixLength = less + addNum + projectNum + peoWithholdNum + unitWithholdNum;
    ws['!merges'].push({ s: { r: fixLength +1, c: 1 }, e: { r: fixLength + 1, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength +1, c: 4 }, e: { r: fixLength + 1, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength +1, c: 7 }, e: { r: fixLength + 1, c: 8 } })

    ws['!merges'].push({ s: { r: fixLength +2, c: 1 }, e: { r: fixLength + 2, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength +2, c: 4 }, e: { r: fixLength + 2, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength +2, c: 7 }, e: { r: fixLength + 2, c: 8 } })

    ws['!merges'].push({ s: { r: fixLength + 3, c: 1 }, e: { r: fixLength + 3, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 3, c: 4 }, e: { r: fixLength + 3, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 3, c: 7 }, e: { r: fixLength + 3, c: 8 } })

    ws['!merges'].push({ s: { r: fixLength + 4, c: 1 }, e: { r: fixLength + 4, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 4, c: 4 }, e: { r: fixLength + 4, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 4, c: 7 }, e: { r: fixLength + 4, c: 8 } })

    ws['!merges'].push({ s: { r: fixLength + 5, c: 1 }, e: { r: fixLength + 5, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 5, c: 4 }, e: { r: fixLength + 5, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 5, c: 7 }, e: { r: fixLength + 5, c: 8 } })

    ws['!merges'].push({ s: { r: fixLength + 6, c: 1 }, e: { r: fixLength + 6, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 6, c: 4 }, e: { r: fixLength + 6, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 6, c: 7 }, e: { r: fixLength + 6, c: 8 } })
 
    // 结算金额合计
    ws['!merges'].push({ s: { r: fixLength + 7, c: 1 }, e: { r: fixLength + 7, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 7, c: 7 }, e: { r: fixLength + 7, c: 8 } })

    // 开票金额合计
    ws['!merges'].push({ s: { r: fixLength + 8, c: 1 }, e: { r: fixLength + 8, c: 6 } })
    ws['!merges'].push({ s: { r: fixLength + 8, c: 7 }, e: { r: fixLength + 8, c: 8 } })
    //  上次差余额
    ws['!merges'].push({ s: { r: fixLength + 9, c: 1 }, e: { r: fixLength + 9, c: 6 } })
    ws['!merges'].push({ s: { r: fixLength + 9, c: 7 }, e: { r: fixLength + 9, c: 8 } })
    // 累计差余额
    ws['!merges'].push({ s: { r: fixLength + 10, c: 1 }, e: { r: fixLength + 10, c: 6 } })
    ws['!merges'].push({ s: { r: fixLength + 10, c: 7 }, e: { r: fixLength + 10, c: 8 } })
    //  备注
    ws['!merges'].push({ s: { r: fixLength + 11, c: 1 }, e: { r: fixLength + 11, c: 8 } })
    //  发票类型
    ws['!merges'].push({ s: { r: fixLength + 12, c: 2 }, e: { r: fixLength + 12, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 12, c: 4 }, e: { r: fixLength + 12, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 12, c: 7 }, e: { r: fixLength + 12, c: 8 } })
    ws['!merges'].push({ s: { r: fixLength + 13, c: 2 }, e: { r: fixLength + 13, c: 3 } })
    ws['!merges'].push({ s: { r: fixLength + 13, c: 4 }, e: { r: fixLength + 13, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 13, c: 7 }, e: { r: fixLength + 13, c: 8 } })
    //  审核人:
    ws['!merges'].push({ s: { r: fixLength + 14, c: 1 }, e: { r: fixLength + 14, c: 5 } })
    ws['!merges'].push({ s: { r: fixLength + 14, c: 7 }, e: { r: fixLength + 14, c: 8 } })
    
     // 差余额
    ws['!merges'].push({ s: { r: fixLength + 16, c: 0 }, e: { r: fixLength + 16, c: 8 } })
    ws['!merges'].push({ s: { r: fixLength + 17, c: 1 }, e: { r: fixLength + 17, c: 2 } })
    ws['!merges'].push({ s: { r: fixLength + 17, c: 3 }, e: { r: fixLength + 17, c: 4 } })
    ws['!merges'].push({ s: { r: fixLength + 17, c: 5 }, e: { r: fixLength + 17, c: 6 } })
    ws['!merges'].push({ s: { r: fixLength + 17, c: 7 }, e: { r: fixLength + 17, c: 8 } })
    let less2 = data[data.length - 1][1]
    if (less2 > 0) {
      for (let i = 1; i <= less2; i++) {
        ws['!merges'].push({ s: { r: fixLength + 17 + i, c: 1 }, e: { r: fixLength + 17 + i, c: 2 } })
        ws['!merges'].push({ s: { r: fixLength + 17 + i, c: 3 }, e: { r: fixLength + 17 + i, c: 4 } })
        ws['!merges'].push({ s: { r: fixLength + 17 + i, c: 5 }, e: { r: fixLength + 17 + i, c: 6 } })
        ws['!merges'].push({ s: { r: fixLength + 17 + i, c: 7 }, e: { r: fixLength + 17 + i, c: 8 } })
      }
    }

     //成本报销明细
     ws['!merges'].push({ s: { r: fixLength + less2 + 19, c: 0 }, e: { r: fixLength + less2 + 19, c: 8 } })

    
    // style3 首行标题  style5黄背景黑粗 style4黄背景黑细 style6正常
     // 样式
    for (var m = 0; m < 9; m++) {
      let order = String.fromCharCode((65 + m))
      if (order == 'A' || order == 'G') {
        ws[order + '2'].s = style5
        ws[order + '3'].s = style5
        ws[order + '4'].s = style5
      } else {
        ws[order + '2'].s = style4
        ws[order + '3'].s = style4
        ws[order + '4'].s = style4
      }
      for (var n = 5; n < data.length + 1; n++) {
        if (ws[order + n] != undefined) {
          ws[order + n].s = style6
        }
      }
      ws[order + (data.length)].s = { border: border, font: { name: '宋体', sz: 9, color: { rgb: "FFFFFF" }, outline: true } };
      
      ws[order + (less + addNum + projectNum + peoWithholdNum + unitWithholdNum +16)].s = style0
      
      ws[order + (less + addNum +  projectNum + peoWithholdNum + unitWithholdNum + less2 + 19)].s = style0
      
      ws[order + '5'].s = style15
    }
    ws["A1"].s = style3

    // for (let i = (addNum + 1); i <= (10 + less + addNum + projectNum + 1); i++) {
    //   if (ws["B" + i] != undefined) {
    //     ws["B" + i].s = style9
    //   }
    // }

    let wsrows = [];
    wsrows.push({ hpx: 40 })
    ws['!rows'] = wsrows;
  }

  // 银行数据整理
  if (opts == 2) {
    for (let m = 0; m < 6; m++) {
      let order = String.fromCharCode((65 + m))
      for (let i = 1; i <= data.length; i++) {
        if (ws[order + i] != undefined) {
          if (order != 'F') {
            ws[order + i].s = style23
          } else {
            if (ws[order + i]) {
              ws[order + i].s = style23
            }
          }
        }
      }
    }
  }
  // 现金数据整理
  if (opts == 3) {
    for (let m = 0; m < 3; m++) {
      let order = String.fromCharCode((65 + m))
      for (let i = 1; i <= data.length; i++) {
        if (ws[order + i] != undefined) {
          ws[order + i].s = style23
        }
      }
    }

  }
  // 社保明细
  if (opts == 4) {
    for (let m = 0; m < 20; m++) {
      let order = String.fromCharCode((65 + m))
      for (let i = 1; i <= data.length; i++) {
        if (ws[order + i] != undefined) {
          ws[order + i].s = style23
        }
      }
    }

  }
  //商险明细
  if (opts == 5) {
    for (let m = 0; m < 16; m++) {
      let order = String.fromCharCode((65 + m))
      for (let i = 1; i <= data.length; i++) {
        if (ws[order + i] != undefined) {
          ws[order + i].s = style23
        }
      }
    }
  }
  // 备注2
  // if (opts == 6) {

  // }
  // 封面数据整理
  if (opts > 5 && opts < 100) {
    const obj = data.length==9?{ s: { r: 0, c: 4 }, e: { r: 8, c: 4 } }:{ s: { r: 0, c: 4 }, e: { r: 9, c: 4 } }
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      obj,
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

    let wsrows = [];
    // 修改首行的行高
    wsrows.push({ hpx: 30 })
    wsrows.push({ hpx: 35 })
    wsrows.push({ hpx: 20 })
    for (let i = 2; i < 10; i++) {
      wsrows.push({ hpx: 20 })
    }
    ws['!rows'] = wsrows;
  }

  
  // 商险差额明细整理
  if (opts == 100) {
    let length = data[0].length
    if (length <= 26) {
      for (let i = 0; i < length; i++) {
        let order = String.fromCharCode((65 + i))
        let header = order + 1
        ws[header].s = style23
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
    } else {
      for (let i = 0; i < 26; i++) {
        let order = String.fromCharCode((65 + i))
        let header = order + 1
        ws[header].s = style23
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
      for (let i = 0; i < (length - 26); i++) {
        let order = String.fromCharCode((65 + i))
        let header = 'A' + order + 1
        ws[header].s = style23
        for (var j = 2; j < data.length + 1; j++) {
          let header2 = 'A' + order + j
          if (ws[header2] != undefined) {
            ws[header2].s = style23
          }
        }
      }
    }
  }

  //垫付单
  if (opts == 200) {
    ws['!merges'] = []
    for (let i = 7; i < data.length; i++) {
      ws['!merges'].push({ s: { r: i, c: 1 }, e: { r: i, c: 3 } })
    }
    let wsrows = [];
    for (let m = 0; m < 4; m++) {
      let order = String.fromCharCode((65 + m))
      for (let i = 1; i <= data.length; i++) {
        if (ws[order + i] != undefined) {
          ws[order + i].s = style6
        }
      }
      //ws[order + 8].s = style3
    }

    for (let i = 0; i < data.length; i++) {
      wsrows.push({ hpx: 35 })
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
  coverLength,
  insLength = 0
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
    if (j == 1 || (j > 5 && j < header.length - insLength)) {
      data[j].splice(0, 1)
    }
    
    if (j > 5 + coverLength && j <= header.length - insLength - 1) {
      ws.push(sheet_from_array_of_arrays(data[j], 200))
    } else if (j > header.length - insLength - 1) {
      ws.push(sheet_from_array_of_arrays(data[j], 100))
    } else {
      ws.push(sheet_from_array_of_arrays(data[j], j))
    }

    // if (j > (header.length - insLength - 1)) {
    //   ws.push(sheet_from_array_of_arrays(data[j], 100))

    // } else {
    //   ws.push(sheet_from_array_of_arrays(data[j], j))
    // }
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
          if (k == 0) {
            result[k][j]["wch"] = 12

            if (j == 7) {
              result[k][j]["wch"] = 20
            }
            if (j == 6 || j == 5) {
              result[k][j]["wch"] = 16
            }
            if (j >= 19) {
              result[k][j]["wch"] = 14
            }
          }
          if (k == 1) {
            result[k][j]["wch"] = 12
          }
          if (k > 5 && k <= (header.length - insLength - 1)) {

            if (j == 4) {
              result[k][j]["wch"] = 2
            } else if (j == 0) {
              result[k][j]["wch"] = 40
            } else {
              result[k][j]["wch"] = 30
            }
          }
          if (k == 2 && j == 4) {
            result[k][j]["wch"] = 40
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
