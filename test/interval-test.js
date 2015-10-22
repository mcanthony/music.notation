var vows = require('vows')
var assert = require('assert')
var notation = require('../')

function intervals (list) {
  return list.split(' ').map(notation.arr).map(notation.str).join(' ')
}

vows.describe('intervals').addBatch({
  'parse': {
    'parse ascending intervals': function () {
      assert.deepEqual(notation.arr('1P'), [0, 0, 0])
      assert.deepEqual(notation.arr('5P'), [4, 0, 0])
      assert.deepEqual(notation.arr('8P'), [0, 0, 1])
      assert.deepEqual(notation.arr('2M'), [1, 0, 0])
      assert.deepEqual(notation.arr('7m'), [6, -1, 0])
      assert.deepEqual(notation.arr('5A'), [4, 1, 0])
      assert.deepEqual(notation.arr('9m'), [1, -1, 1])
      assert.deepEqual(notation.arr('9AAAA'), [1, 4, 1])
      assert.deepEqual(notation.arr('11dddd'), [3, -4, 1])
    },
    'parse descending intervals': function () {
      assert.deepEqual(notation.arr('-1P'), [0, 0, 0])
      assert.deepEqual(notation.arr('-2M'), [6, -1, -1])
      assert.deepEqual(notation.arr('-9M'), [6, -1, -2])
      assert.deepEqual(notation.arr('-1P'), [0, 0, 0])
      assert.deepEqual(notation.arr('-8P'), [0, 0, -1])
      assert.deepEqual(notation.arr('-2A'), [6, -2, -1])
      assert.deepEqual(notation.arr('-8A'), [0, -1, -1])
    },
    'parse degree': function () {
      assert.deepEqual('1 2 3 4 5 6 7'.split(' ').map(notation.arr),
        '1P 2M 3M 4P 5P 6M 7M'.split(' ').map(notation.arr))
      assert.deepEqual('-1 -2 -3 -4 -5 -6 -7'.split(' ').map(notation.arr),
        '-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(notation.arr))
    },
    'malformed': function () {
      assert.equal(notation.arr('1M'), null)
      assert.equal(notation.arr(null), null)
    }
  },
  'build': {
    'edge cases': function () {
      assert.equal(notation.str([1, -1, 0]), '2m')
      assert.equal(notation.str([1, -1, 1]), '9m')
      assert.equal(notation.str([6, 0, 0]), '7M')
      assert.equal(notation.str([6, 0, -1]), '-2m')
      assert.equal(notation.str([0, -1, -1]), '-8A')
      assert.equal(notation.str([2, -1, -1]), '-6M')
      assert.equal(notation.str([0, 1, -1]), '-8d')
      assert.equal(notation.str([0, -1, -4]), '-29A')
    },
    'without octaves': function () {
      assert.equal(notation.str([1, -1, null]), '2m')
      assert.equal(notation.str([6, 1, null]), '7A')
      assert.equal(notation.str([7, 1, null]), '1A')
      assert.equal(notation.str([9, -1, null]), '3m')
      assert.equal(notation.str([3, -1, null]), '4d')
    },
    'intervals': function () {
      assert.equal(intervals('1P 2M 3M 4P 5P 6M 7M'), '1P 2M 3M 4P 5P 6M 7M')
      assert.equal(intervals('8P 9M 10M 11P 12P 13M 14M'), '8P 9M 10M 11P 12P 13M 14M')
      assert.equal(intervals('-1P -2M -3M -4P -5P -6M -7M'), '1P -2M -3M -4P -5P -6M -7M')
      assert.equal(intervals('-8P -9M -10M -11P -12P -13M -14M'), '-8P -9M -10M -11P -12P -13M -14M')
    },
    'degrees': function () {
      assert.equal(intervals('1 2 3 4 5 6 7'), '1P 2M 3M 4P 5P 6M 7M')
      assert.equal(intervals('1b 2b 3b 4b 5b 6b 7b'), '1d 2m 3m 4d 5d 6m 7m')
      assert.equal(intervals('1# 2# 3# 4# 5# 6# 7#'), '1A 2A 3A 4A 5A 6A 7A')
      assert.equal(intervals('8b 9b 10b 11b 12b 13b 14b'), '8d 9m 10m 11d 12d 13m 14m')
    },
    'malformed': function () {
      assert.equal(notation.str(null), null)
      assert.equal(notation.str('blah'), null)
    }
  }
}).export(module)
