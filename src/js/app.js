import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as esprima from 'esprima';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        parseAllCode(parsedCode);
        console.log(myTable);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

let lineCount=1;
let myTable=[];

const parseAllCode = (codeToParse) =>{
    myTable=[];
    codeToParse.body.forEach(item=>{
        cases(item);
    });
};

const cases=(myCase)=>{
    switch (myCase.type) {
    case 'FunctionDeclaration': {
        fundecl(myCase);
        break;
    }
    case 'VariableDeclaration': {
        vardecl(myCase);
        break;
    }
    case 'ExpressionStatement': {
        expState(myCase);
        break;
    }
    case 'WhileStatement': {
        whileState(myCase);
        break;
    }
    case 'IfStatement': {
        ifState(myCase);
        break;
    }
    case 'ReturnStatement':{
        returnState(myCase);
        break;
    }
    case 'Identifier': {
        return myCase.name;
    }
    case 'UnaryExpression':{
        return unaryExp(myCase);
        break;
    }
    case 'MemberExpression': {
        return myCase.object.name + '[' + cases(myCase.property) + ']';
    }

    }
};
const expState=(item) =>{
    if(item.expression.right.type==='Literal')
        myTable.push({Line: lineCount , Type: item.expression.type, Name: item.expression.left.name, Condition:'' , Value: item.expression.right.value});
    if(item.expression.right.type==='BinaryExpression')
        myTable.push({Line: lineCount , Type: item.expression.type, Name: item.expression.left.name, Condition:'' , Value: binaexp(item.expression.right)});
    if(item.expression.right.type==='Identifier')
        myTable.push({Line: lineCount , Type: item.expression.type, Name: item.expression.left.name, Condition:'' , Value: item.expression.right.name});
    lineCount++;
};

const whileState=(item) =>{
    myTable.push({Line: lineCount , Type: item.type, Name: '', Condition: binaexp(item.test), Value:''});
    lineCount++;
    parseAllCode(item.body);
    lineCount++;
};

const ifState=(item) =>{
    myTable.push({Line: lineCount , Type: item.type, Name: '', Condition: binaexp(item.test), Value:''});
    lineCount++;
    cases(item.consequent);
    if(item.alternate) {
        if(item.alternate.type==='IfStatement'){
            myTable.push({Line: lineCount, Type: 'else if Statement', Name: '', Condition: binaexp(item.alternate.test), Value: ''});
            lineCount++;
            cases(item.alternate.consequent);
        }
        if(item.alternate.alternate){
            myTable.push({Line: lineCount, Type: 'else Statement', Name: '', Condition: '', Value: ''});
            lineCount++;
            cases(item.alternate.alternate);
        }

    }
};

const binaexp= (item)=>{
    let expression='';
    if(item.left.type=='Identifier') {
        expression += item.left.name;
        expression += item.operator;
    }
    if(item.left.type=='BinaryExpression') {
        expression += '('+binaexp(item.left)+')';
        expression += item.operator;
    }
    if(item.left.type=='Literal') {
        expression += item.right.value;
        expression += item.operator;
    }
    if(item.left.type=='MemberExpression')
        expression+=cases(item.left);
    if(item.right.type=='Identifier')
        expression+=item.right.name;
    if(item.right.type=='Literal')
        expression+=item.right.value;
    if(item.right.type=='BinaryExpression')
        expression+= binaexp(item.right);
    if(item.right.type=='MemberExpression')
        expression+=cases(item.right);
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



