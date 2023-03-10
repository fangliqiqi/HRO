/* eslint-disable */
require('script-loader!file-saver');
import XLSX from "xlsx-style"

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook()
  }
  this.SheetNames = []
  this.Sheets = {}
}

function datenum(v, date1904) {
  if (date1904) {
    v += 1462
  }
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i < s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

// 根据数据获取表格范围
function sheet_from_array_of_arrays(data, opts,autoLength) {
  var ws = {};
  var range = {s: {c: 10000000,r: 10000000},e: {c: 0,r: 0}}
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C]}
      switch (cell.v) {
        case (typeof cell.v === 'number') :
          cell.t = 'n'
        break
        case (typeof cell.v === 'boolean') :
          cell.t = 'b'
        break
        case (cell.v instanceof Date) :
          cell.t = 'n'
          cell.z = XLSX.SSF._table[14]
          cell.v = datenum(cell.v)
        break
        case (cell.v == null):
          continue
        default:
          cell.t = 's'
        break
      }
      const cell_ref = XLSX.utils.encode_cell({c: C,r: R})
      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  
  // 默认样式
  const defaultStyle = { 
    border: {
      bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000000" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const titleStyle ={
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 18, color: { rgb: "ea5b5b" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const thStyle = {
    border:defaultStyle.border,
    alignment: { horizontal: 'center', wrapText: true, vertical: "center" },
    font: { name: '宋体', sz: 10, color: { rgb: "000" }, outline: true, bold: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }
  const tdStyle = {
    border:defaultStyle.border,
    font: { name: '宋体', sz: 10, color: { rgb: "333" }, outline: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "ffffff" } }
  }

  // 列表
  
  const length = data[0].length
  if (length <= 26) {
    // ws = setHeader(ws,length,data,defaultStyle,thStyle)
    for (let i = 0; i < length; i++) {
      const order = String.fromCharCode((65 + i))
      const header = order + 1
      ws[header].s = thStyle
      for (var j = 2; j < data.length + 1; j++) {
        const header2 = order + j
        if (ws[header2] != undefined) {
          ws[header2].s = defaultStyle
        }
      }
    }
  } else {
    // ws = setHeaderL(ws,length,data,defaultStyle,thStyle)
    for (let i = 0; i < 26; i++) {
      const order = String.fromCharCode((65 + i))
      const header = order + 1
      ws[header].s = thStyle
      for (var j = 2; j < data.length + 1; j++) {
        const header2 = order + j
        if (ws[header2] != undefined) {
          ws[header2].s = defaultStyle
        }
      }
    }
    for (let i = 0; i < (length - 26); i++) {
      const order = String.fromCharCode((65 + i))
      const header = 'A' + order + 1
      ws[header].s = thStyle
      for (var j = 2; j < data.length + 1; j++) {
        const header2 = 'A' + order + j
        if (ws[header2] != undefined) {
          ws[header2].s = defaultStyle
        }
      }
    }
  }

  return ws
}


export function export_json_to_excel_more_sheet({
  header,
  data,
  sheetname,
  filename,
  merges = [],
  autoWidth = true,
  autoLength=0,
  bookType = "xlsx"
} = {}) {
  /* original data */
  data = [...data]

  var wb = new Workbook(),ws = []
  // 列表 添加表头header
  header.forEach((item,index) => {
    data[index].unshift(item)
    ws.push(sheet_from_array_of_arrays(data[index], index,autoLength))
  })

  // if (merges.length > 0) {
  //   if (!ws["!merges"]) {
  //     ws["!merges"] = []
  //   }
  //   merges.forEach(item => {
  //     ws["!merges"].push(XLSX.utils.decode_range(item))
  //   })
  // }
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
              const len = val.toString().length
              /*再判断是否为中文*/
              return {
                wch: (len > 10) ? 20 : len*2
              }
            } else {
              const len = val.toString().length
              return {
                wch: (len > 10) ? 20 : len*2
              }
            }
          })
        )
      )
    }
    
    /*以第一行为初始值*/
    const result = []
    for (var k = 0; k < colWidth.length; k++) {
      result[k] = colWidth[k][0]
      for (let i = 1; i < colWidth[k].length; i++) {
        for (let j = 0; j < colWidth[k][i].length; j++) {
          if (result[k][j]["wch"] < colWidth[k][i][j]["wch"]) {
            result[k][j]["wch"] = colWidth[k][i][j]["wch"] + 5
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
    wb.SheetNames.push(sheetname[k])
    wb.Sheets[sheetname[k]] = ws[k]
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