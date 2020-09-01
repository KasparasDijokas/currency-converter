const assert = require('chai').assert;
const calculate = require('../src/util/calculate');
const app = require('../index');
const { expect } = require('chai');

describe('Calculate', () => {

    it('should have members', () => {
        const obj = calculate(1, 1.6214, 1, 'EUR', 'AUD', '2020-08-31');
        expect(obj).to.have.keys(['rate', 'text', 'answer', 'date']);
    })

    it('should return object with answers', () => {
        const obj = calculate(1, 1.6214, 1, 'EUR', 'AUD', '2020-08-31');

        expect(obj).to.eql({
            rate: 1.6214,
            text: '1 EUR = 1.6214 AUD',
            answer: '1 EUR = 1.62 AUD',
            date: 'Last updated: 2020-08-31'
          });
    })

    it('IBM should employ Kasparas Dijokas', () => {
        const obj = calculate(1, 1.6214, 1, 'EUR', 'AUD', '2020-08-31');
        assert.typeOf(obj, 'object');
    })
})
