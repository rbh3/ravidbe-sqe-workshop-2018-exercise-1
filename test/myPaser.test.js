import assert from 'assert';
import * as myParser from '../src/js/myParser';

describe('Tests for myParser functions', () => {
    it('return literal statement', () => {
        const code={body: [{type: 'BlockStatement', body: [{type: 'ReturnStatement',
            argument: { type: 'Literal',value: true,raw: 'true'}}]}]};
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'ReturnStatement', Name: '',Condition:'',Value: true}]
        );
    });

    it('using params on function Declaration', () => {
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'x'
                    },
                    'params': [
                        {
                            'type': 'Identifier',
                            'name': 'y'
                        },
                        {
                            'type': 'Identifier',
                            'name': 'z'
                        }
                    ],
                    'body': {
                        'type': 'BlockStatement',
                        'body': []
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
                }
            ],
            'sourceType': 'script'
        };

        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'FunctionDeclaration', Name: 'x',Condition:'',Value: ''},
                {Line: 1 , Type:'Variable Declaration', Name: 'y',Condition:'',Value: ''},
                {Line: 1 , Type:'Variable Declaration', Name: 'z',Condition:'',Value: ''}]
        );
    });

    it('for loop and update expression',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'ForStatement',
                    'init': {
                        'type': 'VariableDeclaration',
                        'declarations': [
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'i'
                                },
                                'init': {
                                    'type': 'Literal',
                                    'value': 0,
                                    'raw': '0'
                                }
                            }
                        ],
                        'kind': 'let'
                    },
                    'test': {
                        'type': 'BinaryExpression',
                        'operator': '<',
                        'left': {
                            'type': 'Identifier',
                            'name': 'i'
                        },
                        'right': {
                            'type': 'Literal',
                            'value': 5,
                            'raw': '5'
                        }
                    },
                    'update': {
                        'type': 'UpdateExpression',
                        'operator': '++',
                        'argument': {
                            'type': 'Identifier',
                            'name': 'i'
                        },
                        'prefix': false
                    },
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'ExpressionStatement',
                                'expression': {
                                    'type': 'UpdateExpression',
                                    'operator': '++',
                                    'argument': {
                                        'type': 'Identifier',
                                        'name': 'i'
                                    },
                                    'prefix': true
                                }
                            }
                        ]
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'ForStatement', Name: '',Condition:'let i=0; i < 5; i++',Value: ''},
                {Line: 2 , Type:'UpdateExpression', Name: '++i',Condition:'',Value: ''}]
        );
    });

    it('update statement prefix',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'UpdateExpression',
                        'operator': '++',
                        'argument': {
                            'type': 'Identifier',
                            'name': 'i'
                        },
                        'prefix': true
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'UpdateExpression', Name: '++i',Condition:'',Value: ''}]
        );
    });

    it('Function Declaration and Variable Declaration',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'binarySearch'
                    },
                    'params': [],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'VariableDeclaration',
                                'declarations': [
                                    {
                                        'type': 'VariableDeclarator',
                                        'id': {
                                            'type': 'Identifier',
                                            'name': 'low'
                                        },
                                        'init': null
                                    },
                                    {
                                        'type': 'VariableDeclarator',
                                        'id': {
                                            'type': 'Identifier',
                                            'name': 'high'
                                        },
                                        'init': null
                                    },
                                    {
                                        'type': 'VariableDeclarator',
                                        'id': {
                                            'type': 'Identifier',
                                            'name': 'mid'
                                        },
                                        'init': null
                                    }
                                ],
                                'kind': 'let'
                            }
                        ]
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'FunctionDeclaration', Name: 'binarySearch',Condition:'',Value: ''},
                {Line: 2 , Type:'Variable Declaration', Name: 'low',Condition:'',Value: null},
                {Line: 2 , Type:'Variable Declaration', Name: 'high',Condition:'',Value: null},
                {Line: 2 , Type:'Variable Declaration', Name: 'mid',Condition:'',Value: null}]
        );
    });

    it('AssignmentExpression',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'low'
                        },
                        'right': {
                            'type': 'Literal',
                            'value': 0,
                            'raw': '0'
                        }
                    }
                },
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'high'
                        },
                        'right': {
                            'type': 'BinaryExpression',
                            'operator': '-',
                            'left': {
                                'type': 'Identifier',
                                'name': 'n'
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 1,
                                'raw': '1'
                            }
                        }
                    }
                },
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'mid'
                        },
                        'right': {
                            'type': 'BinaryExpression',
                            'operator': '/',
                            'left': {
                                'type': 'BinaryExpression',
                                'operator': '+',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'low'
                                },
                                'right': {
                                    'type': 'Identifier',
                                    'name': 'high'
                                }
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 2,
                                'raw': '2'
                            }
                        }
                    }
                },
                {
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'high'
                        },
                        'right': {
                            'type': 'BinaryExpression',
                            'operator': '-',
                            'left': {
                                'type': 'Identifier',
                                'name': 'mid'
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 1,
                                'raw': '1'
                            }
                        }
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'AssignmentExpression', Name: 'low',Condition:'',Value: 0},
                {Line: 2 , Type:'AssignmentExpression', Name: 'high',Condition:'',Value: '(n - 1)'},
                {Line: 3 , Type:'AssignmentExpression', Name: 'mid',Condition:'',Value: '(low + high) / 2'},
                {Line: 4 ,Type:'AssignmentExpression', Name: 'high',Condition:'',Value: '(mid - 1)'}]
        );
    });

    it('return Unary Expression',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'FunctionDeclaration',
                    'id': {
                        'type': 'Identifier',
                        'name': 'x'
                    },
                    'params': [],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [
                            {
                                'type': 'ReturnStatement',
                                'argument': {
                                    'type': 'UnaryExpression',
                                    'operator': '-',
                                    'argument': {
                                        'type': 'Literal',
                                        'value': 1,
                                        'raw': '1'
                                    },
                                    'prefix': true
                                }
                            }
                        ]
                    },
                    'generator': false,
                    'expression': false,
                    'async': false
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'FunctionDeclaration', Name: 'x',Condition:'',Value: ''},
                {Line: 2 , Type:'ReturnStatement', Name: '',Condition:'',Value: -1}]
        );
    });

    it('while statement',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'WhileStatement',
                    'test': {
                        'type': 'BinaryExpression',
                        'operator': '<=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'low'
                        },
                        'right': {
                            'type': 'Identifier',
                            'name': 'high'
                        }
                    },
                    'body': {
                        'type': 'BlockStatement',
                        'body': []
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'WhileStatement', Name: '',Condition:'low <= high',Value: ''}]
        );
    });

    it('if statement',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'IfStatement',
                    'test': {
                        'type': 'BinaryExpression',
                        'operator': '<',
                        'left': {
                            'type': 'Identifier',
                            'name': 'X'
                        },
                        'right': {
                            'type': 'MemberExpression',
                            'computed': true,
                            'object': {
                                'type': 'Identifier',
                                'name': 'V'
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': 'mid'
                            }
                        }
                    },
                    'consequent': {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'high'
                            },
                            'right': {
                                'type': 'BinaryExpression',
                                'operator': '-',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'mid'
                                },
                                'right': {
                                    'type': 'Literal',
                                    'value': 1,
                                    'raw': '1'
                                }
                            }
                        }
                    },
                    'alternate': {
                        'type': 'IfStatement',
                        'test': {
                            'type': 'BinaryExpression',
                            'operator': '>',
                            'left': {
                                'type': 'Identifier',
                                'name': 'X'
                            },
                            'right': {
                                'type': 'MemberExpression',
                                'computed': true,
                                'object': {
                                    'type': 'Identifier',
                                    'name': 'V'
                                },
                                'property': {
                                    'type': 'Identifier',
                                    'name': 'mid'
                                }
                            }
                        },
                        'consequent': {
                            'type': 'ExpressionStatement',
                            'expression': {
                                'type': 'AssignmentExpression',
                                'operator': '=',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'low'
                                },
                                'right': {
                                    'type': 'BinaryExpression',
                                    'operator': '+',
                                    'left': {
                                        'type': 'Identifier',
                                        'name': 'mid'
                                    },
                                    'right': {
                                        'type': 'Literal',
                                        'value': 1,
                                        'raw': '1'
                                    }
                                }
                            }
                        },
                        'alternate': {
                            'type': 'ExpressionStatement',
                            'expression': {
                                'type': 'UpdateExpression',
                                'operator': '++',
                                'argument': {
                                    'type': 'Identifier',
                                    'name': 'mid'
                                },
                                'prefix': true
                            }
                        }
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'If Statement', Name: '',Condition:'X < V[mid]',Value: ''},
                {Line: 2 , Type:'AssignmentExpression', Name: 'high',Condition:'',Value: '(mid - 1)'},
                {Line: 3 , Type:'Else If Statement', Name: '',Condition:'X > V[mid]',Value: ''},
                {Line: 4, Type:'AssignmentExpression', Name: 'low',Condition:'',Value: '(mid + 1)'},
                {Line: 5 , Type:'Else Statement', Name: '',Condition:'',Value: ''},
                {Line: 6 , Type:'UpdateExpression', Name: '++mid',Condition:'',Value: ''}]
        );
    });

    it('if statement with literals',()=>{
        const code={
            'type': 'Program',
            'body': [
                {
                    'type': 'IfStatement',
                    'test': {
                        'type': 'Literal',
                        'value': true,
                        'raw': 'true'
                    },
                    'consequent': {
                        'type': 'BlockStatement',
                        'body': []
                    },
                    'alternate': {
                        'type': 'IfStatement',
                        'test': {
                            'type': 'Literal',
                            'value': false,
                            'raw': 'false'
                        },
                        'consequent': {
                            'type': 'BlockStatement',
                            'body': [
                                {
                                    'type': 'IfStatement',
                                    'test': {
                                        'type': 'BinaryExpression',
                                        'operator': '<',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'x'
                                        },
                                        'right': {
                                            'type': 'Literal',
                                            'value': 5,
                                            'raw': '5'
                                        }
                                    },
                                    'consequent': {
                                        'type': 'BlockStatement',
                                        'body': []
                                    },
                                    'alternate': null
                                }
                            ]
                        },
                        'alternate': {
                            'type': 'BlockStatement',
                            'body': []
                        }
                    }
                }
            ],
            'sourceType': 'script'
        };
        assert.deepEqual(
            myParser.parserStart(code),
            [{Line: 1 , Type:'If Statement', Name: '',Condition:true,Value: ''},
                {Line: 2 , Type:'Else If Statement', Name: false,Condition:'',Value: ''},
                {Line: 3, Type:'If Statement', Name: '',Condition:'x < 5',Value: ''},
                {Line: 4 , Type:'Else Statement', Name: '',Condition:'',Value: ''}]
        );
    });

});



