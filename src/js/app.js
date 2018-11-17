import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as myParser from './myParser';

let myTable;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        myTable=myParser.parserStart(parsedCode);
        $('#table').append(objectToTable());
    });
});

const objectToTable= ()=> {
    clear();
    let tableHtml = '<tr class="mytr"><th class="myTh">Line #</th><th class="myTh">Type</th><th class="myTh">Name</th><th class="myTh">Condition</th><th class="myTh">Value</th></tr>';
    myTable.forEach(row => {
        if(row!==undefined)
            tableHtml += `<tr class="mytr"><td class="myTd">${row.Line}</td><td class="myTd">${row.Type}</td><td class="myTd">${row.Name}</td><td class="myTd">${row.Condition}</td><td class="myTd">${row.Value}</td></tr>}`;
    });
    return tableHtml;
};

const clear= ()=>{
    $('.mytr').remove();
    $('.myTh').remove();
    $('.myTd').remove();
};
