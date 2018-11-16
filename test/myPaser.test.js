import assert from 'assert';
import * as myParser from '../src/js/myParser';

describe('Tests for myParser functions', () => {
    it('return literal statement', () => {
        const code={body: [{type: 'BlockStatement', body: [{type: 'ReturnStatement',
            argument: { type: 'Literal',value: true,raw: 'true'}}]}]};

        myParser.parseAllCode(code);
        assert.deepEqual(
            myParser.getTable()[0],
            {Line: 1 , Type:'ReturnStatement', Name: '',Condition:'',Value: true}
        );
    });

});
