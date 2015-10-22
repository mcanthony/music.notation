var vows = require('vows')
var assert = require('assert')
var notation = require('../')

vows.describe('note').addBatch({
  'parse': {
    'parse pitch': function () {
      assert.deepEqual(notation.arr('C4'), [0, 0, 4, 0])
      assert.deepEqual(notation.arr('g4'), [4, 0, 4, 0])
      assert.deepEqual(notation.arr('a4'), [5, 0, 4, 0])
      assert.deepEqual(notation.arr('B#3'), [6, 1, 3, 0])
      assert.deepEqual(notation.arr('Db4'), [1, -1, 4, 0])
    },
    'parse pitch class': function () {
      assert.deepEqual(notation.arr('C'), [0, 0])
      assert.deepEqual(notation.arr('Ebb'), [2, -2])
      assert.deepEqual(notation.arr('Bb'), [6, -1])
      assert.deepEqual(notation.arr('fx'), [3, 2])
    },
    'invalid values': function () {
      assert.equal(notation.arr(null), null)
      assert.equal(notation.arr('blah'), null)
    }
  },
  'build': {
    'pitch string': function () {
      assert.equal(notation.str([0, 0, 4, 0]), 'C4')
      assert.equal(notation.str([4, 0, 4, 0]), 'G4')
      assert.equal(notation.str([5, 0, 4, 0]), 'A4')
      assert.equal(notation.str([6, 1, 3, 0]), 'B#3')
      assert.equal(notation.str([1, -1, 4, 0]), 'Db4')
      assert.equal(notation.str([4, -3, 1, 0]), 'Gbbb1')
      assert.equal(notation.str([-1, 0, 0, 0]), 'D0')
    },
    'pitch class string': function () {
      assert.equal(notation.str([0, 0, null, 0]), 'C')
      assert.equal(notation.str([0, -3, null, 0]), 'Cbbb')
      assert.equal(notation.str([4, 1, null, 0]), 'G#')
    },
    'invalid arrays': function () {
      assert.equal(notation.str([]), null)
      assert.equal(notation.str([]), null)
    }
  }
}).export(module)
