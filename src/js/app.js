import $ from 'jquery';
import {parseCode} from './code-analyzer';

let lineCount=1;
let myTable=[];

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        lineCount=1;
        myTable=[];
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        parseAllCode(parsedCode);
        $('#table').append(objectToTable());
    });
});

const parseAllCode = (codeToParse) =>{
    codeToParse.body.forEach(item=>{
        cases(item);
    });
};

const cases= (myCase)=>{
    return allCases[myCase.type](myCase);
};

const elseIfState= (item)=>{
    ifState(item,'Else If Statement');
};

const ifState = (item,type)=>{
    if (type===undefined)
        type='If Statement';
    myTable.push({Line: lineCount , Type:type, Name: '', Condition:cases(item.test), Value:''});
    lineCount++;
    cases(item.consequent);
    if (item.alternate!=null)
    {
        if (item.alternate.type=='IfStatement')
            item.alternate.type='ElseIfStatment';
        else {
            myTable.push({Line: lineCount , Type:'Else Statement', Name: '', Condition:'', Value:''});
            lineCount++;
        }
        cases(item.alternate);
    }
};
const updateExp= (item)=>{
    myTable.push({Line: lineCount,Type: item.type, Name: updateState(item),Condition: '',Value: ''});
    lineCount++;
};
const assExp=(item) =>{
    myTable.push({Line: lineCount,Type: item.type,Name: cases(item.left),Condition: '',Value: cases(item.right)});
    lineCount++;
};

const expState=(item) =>{
    cases(item.expression);
};

const whileState=(item) =>{
    myTable.push({Line: lineCount , Type: item.type, Name: '', Condition: binaryExp(item.test), Value:''});
    lineCount++;
    parseAllCode(item.body);
    lineCount++;
};

const binaryExp= (item)=>{
    const left= cases(item.left);
    const right= cases(item.right);
    const expression= left+item.operator+right;
    if(item.operator==='+' || item.operator==='-')
        return '('+expression+')';
    return expression;
};

const fundecl= (item)=>{
    myTable.push({Line: lineCount , Type: item.type, Name: item.id.name, Condition:'' , Value:''});
    item.params.forEach((param)=> myTable.push({Line: lineCount , Type:'Variable Declaration', Name: param.name, Condition:'' , Value:''}) );
    lineCount++;
    if(item.body)
        parseAllCode(item.body);
};

const vardecl= (item)=>{
    item.declarations.forEach((decleration)=>myTable.push({Line: lineCount , Type: decleration.type, Name: decleration.id.name, Condition:'' , Value:decleration.init}));
    lineCount++;
};

const returnState=(item) =>{
    myTable.push({Line: lineCount , Type: item.type, Name: '', Condition:'' , Value: cases(item.argument)});
    lineCount++;
};

const unaryExp=(item) =>{
    let expression='';
    expression+=item.operator;
    expression+=item.argument.value;
    return expression;
};

const forState= (item)=>{
    let expression= item.init.kind+' '+ cases(item.init.declarations[0].id)+ '='+item.init.declarations[0].init.value+'; ';
    expression+=cases(item.test)+'; ';
    expression+=updateState(item.update);
    myTable.push({Line: lineCount , Type: item.type, Name: '', Condition: expression , Value: ''});
    lineCount++;
    parseAllCode(item.body);
};

const  updateState=(item)=> {
    let opertator = item.operator;
    item.prefix ? opertator = opertator + cases(item.argument) : opertator = cases(item.argument) + opertator;
    return opertator;
};

const allCases={
    'FunctionDeclaration': fundecl,
    'VariableDeclaration': vardecl,
    'ExpressionStatement': expState,
    'WhileStatement': whileState,
    'IfStatement': ifState,
    'ElseIfStatment': elseIfState,
    'ReturnStatement': returnState,
    'BlockStatement': (myCase)=>parseAllCode(myCase),
    'Identifier': (myCase)=> {return myCase.name;},
    'UnaryExpression': unaryExp,
    'MemberExpression': (myCase)=> {return myCase.object.name + '[' + cases(myCase.property) + ']';},
    'ForStatement': forState,
    'Literal': (myCase)=> {return myCase.value;},
    'BinaryExpression': binaryExp,
    'UpdateExpression': updateExp,
    'AssignmentExpression':assExp,

};

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

}