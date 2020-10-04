var xlsx = require('json-as-xlsx')

var columns = [
    { label: 'Email', value: 'email' }, // Top level data
    { label: 'Age', value: row => (row.age + ' years') }, // Run functions
    { label: 'Password', value: row => (row.hidden ? row.hidden.password : '') }, // Deep props
]

var content = [
    { email: 'Ana', age: 16, hidden: { password: '11111111' } },
    { email: 'Luis', age: 19, hidden: { password: '12345678' } }
]

var settings = {
    sheetName: 'First sheet', // The name of the sheet
    fileName: 'Users', // The name of the spreadsheet
    extraLength: 3 // A bigger number means that columns should be wider
}


xlsx(columns, content, settings, download) // Will download the excel file