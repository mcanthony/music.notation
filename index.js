'use strict'

// utility: fill a string with a char
function fillStr (num, char) { return Array(num + 1).join(char) }

var LETTERS = 'CDEFGAB'
var REGEX = /^([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(\d*)$/

var cache = {}
var notation = {}

/**
 * Converts pitches between strings and [array notation](https://github.com/danigb/a-pitch)
 *
 * This functions parses a string in the form `'letter + accidentals [+ octave]'`.
 * The letter can be upper or down case and the accidentals can be sharps `#`
 * flats `b` or double sharps `x`.
 *
 * The pitch array notation is 3 integers is in the form `[letter, accidentals, octave]`.
 *
 * This function caches the result to get better performance. If for some
 * reason you don't want to cache, use `pitch.parse` and `pitch.build`
 *
 * @name arr
 * @function
 * @param {String|Array} val - the pitch (can be a string or array)
 * @return {Array|String} the converted val (string if it was an array,
 * and array if it was string)
 *
 * @example
 * var pitch = require('pitch-parser')
 * pitch('C4') // => [0, 0, 4]
 * pitch([0, 0, 4]) // => 'C4'
 *
 * @example // parse
 * pitch('c2') // => [0, 0, 2]
 * pitch('F#') // => [4, 1, null] (no octave)
 *
 * @example // build
 * pitch([2, -1, 3]) // => 'Eb3'
 * pitch([6, -2, null]) // => 'Bbb'
 *
 * @example // return scientific notation
 * pitch(pitch('cbb')) // => 'Cbb'
 * pitch(pitch('fx')) // => 'F##'
 */
notation.arr = function (src) {
  if (Array.isArray(src)) return src
  return src in cache ? cache[src] : cache[src] = parsePitch(src) || parseInterval(src)
}

function toString (arr) {
  if (arr.length === 1 || arr.length === 2) return buildPitch(arr)
  else if (arr.length === 3) return buildInterval(arr)
  else if (arr.length === 0) return null
  else return buildPitch(arr)
}

notation.str = function (arr) {
  if (!Array.isArray(arr)) return null
  var str = '|' + arr[0] + '|' + arr[1] + '|' + arr[2] + '|' + arr[3] + '|' + arr[4]
  return str in cache ? cache[str] : cache[str] = toString(arr)
}

/**
 * Get a pitch array from a pitch string in scientific notation
 *
 * The pitch array of 3 integers is in the form `[letter, accidentals, octave]`
 *
 * This function is non cached. Prefer `pitch` where possible.
 *
 * @param {String} str - the pitch string
 * @return {Array} the pitch array
 *
 * @example
 * pitch.parse('C2') // => [0, 0, 2]
 * pitch.parse('C3') // => [0, 0, 3]
 * pitch.parse('C#3') // => [0, 1, 3]
 * pitch.parse('Cb3') // => [0, -1, 3]
 * pitch.parse('D##4') // => [1, 2, 4]
 * pitch.parse('F#') // => [4, 1, null]
 */
function parsePitch (str) {
  var m = REGEX.exec(str)
  if (!m) return null

  var step = LETTERS.indexOf(m[1].toUpperCase())
  var alt = m[2].replace(/x/g, '##').length
  if (m[2][0] === 'b') alt *= -1
  return m[3] ? [step, alt, +m[3], 0] : [step, alt]
}

/**
 * Get a pitch string from a pitch array
 *
 * This function is non cached. Prefer `pitch` where possible.
 *
 * @name pitch.build
 * @param {Array} arr - the pitch array
 * @return {String} the pitch string in scientific notation
 *
 * @example
 * pitch.build([2, -1, 3]) // => 'Eb3'
 * pitch.build([5, 2, 2]) // => 'A##2'
 * pitch.build([6, -2, null]) // => 'Bbb'
 */
function buildPitch (arr) {
  if (!Array.isArray(arr) || !arr.length) return null
  var letter = LETTERS.charAt(Math.abs(arr[0]) % 7)
  var acc = fillStr(Math.abs(arr[1]), arr[1] < 0 ? 'b' : '#')
  var oct = arr[2] || arr[2] === 0 ? arr[2] : ''
  return letter + acc + oct
}

'use strict'

/**
 * Converts between interval strings and [array notation](https://github.com/danigb/a-pitch)
 *
 * The interval string can be in two different formats:
 *
 * - As interval (num + quality): `'1P' '3M' '5P' '13A'` are valid intervals
 * - As scale degree (alterations + num): `'b2' '#4' 'b9'` are valid intervals
 *
 * The array notation is an array in the form `[num, alter, oct]`. See [a-pitch](https://github.com/danigb/a-pitch)
 * for more infor about array notation.
 *
 * @param {String|Array} interval - the interval in either string or array notation
 * @return {Array|String} the interval (as string if was array, as array if was string).
 * null if not a valid array
 *
 * @example
 * var interval = require('interval-parser')
 * interval('3M') // => [2, 0, 1]
 * interval([2, 0, 1]) // => '3M'
 *
 * @example // parse strings
 * interval('1P') // => [0, 0, 0]
 * interval('2m') // => [0, -1, 0]
 * interval('1') // same as interval('1P')
 * interval('5b') // same as interval('5d')
 * interval('2b') // same as interval('2m')
 *
 * @example // build strings
 * interval.build([1, 0, 0]) // => '2M'
 * interval.build([1, 0, 1]) // => '9M'
 */

var INTERVAL = /^([-+]?)(\d+)(d{1,4}|m|M|P|A{1,4}|b{1,4}|#{1,4}|)$/
var QALT = {
  P: { dddd: -4, ddd: -3, dd: -2, d: -1, P: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 },
  M: { ddd: -4, dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 }
}
var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
var TYPES = 'PMMPPMM'

/**
 * Parses an interval string and returns [a-pitch](https://github.com/danigb/a-pitch) array
 *
 * The interval string can be in two different formats:
 *
 * - As interval (num + quality): `'1P' '3M' '5P' '13A'` are valid intervals
 * - As scale degree (alterations + num): `'b2' '#4' 'b9'` are valid intervals
 *
 * @param {String} str - the interval string
 * @return {Array} the a-pitch representation
 *
 * @example
 * var interval = require('interval-parser')
 * interval.parse('1P') // => [0, 0, 0]
 * interval.parse('2m') // => [0, -1, 0]
 * interval.parse('1') // same as interval.parse('1P')
 * interval.parse('5b') // same as interval.parse('5d')
 * interval.parse('2b') // same as interval.parse('2m')
 */
function parseInterval (str) {
  var m = INTERVAL.exec(str)
  if (!m) return null
  var dir = m[1] === '-' ? -1 : 1
  var num = +m[2] - 1

  var simple = num % 7
  var oct = dir * Math.floor(num / 7)
  var type = TYPES[simple]

  var alt
  if (m[3] === '') alt = 0
  else if (m[3][0] === '#') alt = m[3].length
  else if (m[3][0] === 'b') alt = -m[3].length
  else {
    alt = QALT[type][m[3]]
    if (typeof alt === 'undefined') return null
  }

  // if descending, invert it and octave lower
  if (dir === -1) {
    alt = type === 'P' ? -alt : -(alt + 1)
    if (simple !== 0) {
      simple = 7 - simple
      oct--
    }
  }
  return [simple, alt, oct]
}

/*
 * Convert from an [a-pitch](https://github.com/danigb/a-pitch) to an interval string
 *
 * @param {Array} interval - the interval [a-pitch](https://github.com/danigb/a-pitch) array
 * @return {String} the interval string
 *
 * @example
 * var interval = require('interval-parser')
 * interval.build([1, 0, 0]) // => '2M'
 */
function buildInterval (i) {
  if (!i || !Array.isArray(i)) return null
  var t = TYPES[Math.abs(i[0]) % 7]
  var n = number(i)
  var alt = i[1]
  if (n < 0) alt = t === 'P' ? -alt : -(alt + 1)
  var q = ALTER[t][4 + alt]
  if (!q) return null
  return n + q
}

function number (i) {
  var simple = (i[0] % 7) + 1
  if (i[2] === null) return simple
  var dir = i[2] < 0 ? -1 : 1
  var oct = Math.abs(i[2])
  if (dir < 0) {
    simple = 9 - simple
    oct--
  }
  return dir * (simple + 7 * oct)
}

module.exports = notation
