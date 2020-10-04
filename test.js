var xlsx = require('json-as-xlsx');
var columns = [
    { label: 'Email', value: 'email' },
    { label: 'Age', value: function (row) { return (row.age + ' years'); } },
    { label: 'Password', value: function (row) { return (row.hidden ? row.hidden.password : ''); } },
];
var content = [
    { email: 'Ana', age: 16, hidden: { password: '11111111' } },
    { email: 'Luis', age: 19, hidden: { password: '12345678' } }
];
var settings = {
    sheetName: 'First sheet',
    fileName: 'Users',
    extraLength: 3 // A bigger number means that columns should be wider
};
var download = true; // If true will download the xlsx file, otherwise will return a buffer
xlsx(columns, content, settings, download); // Will download the excel file
