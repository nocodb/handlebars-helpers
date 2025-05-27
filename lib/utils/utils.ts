import getValue from 'get-value';
import createFrameLib from 'create-frame';
import arraySort from 'array-sort';
import forInLib from 'for-in';

export const get = getValue;
export const createFrame = createFrameLib;
export const sortBy = arraySort;
export const forIn = forInLib;

// Replace simple dependencies with native implementations
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isEven(value: any): boolean {
  return isNumber(value) && value % 2 === 0;
}

export function falsey(value: any, keywords?: string[]): boolean {
  // Default falsey keywords from the original falsey library
  const defaultKeywords = ['false', 'null', 'undefined', 'nil', 'nope', 'no', 'nah', 'nay', ''];
  const allKeywords = keywords ? defaultKeywords.concat(keywords) : defaultKeywords;
  
  // Standard JavaScript falsey values
  if (!value || value === 0 || value === '' || value === null || value === undefined || value === false) {
    return true;
  }
  
  // Check against keyword strings (case insensitive)
  if (typeof value === 'string') {
    return allKeywords.includes(value.toLowerCase());
  }
  
  return false;
}

// Add some utility functions that may be needed
export function contains(val: any, obj: any, start?: number) {
  if (val == null || obj == null || !isNumber(val.length)) {
    return false;
  }
  return val.indexOf(obj, start) !== -1;
}

export function chop(str: string) {
  if (typeof str !== 'string') return '';
  const re = /^[-_.\W\s]+|[-_.\W\s]+$/g;
  return str.trim().replace(re, '');
}

export function changecase(str: string, fn?: Function) {
  if (typeof str !== 'string') return '';
  if (str.length === 1) {
    return str.toLowerCase();
  }
  
  str = chop(str).toLowerCase();
  if (typeof fn !== 'function') {
    fn = identity;
  }
  
  const re = /[-_.\W\s]+(\w|$)/g;
  return str.replace(re, function(_, ch) {
    return fn(ch);
  });
}

export function identity(value: any) {
  return value;
}

export function random(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function forEach(array: any[], options: any) {
  var data = createFrame(options, options.hash);
  var len = array.length;
  var buffer = '';
  var i = -1;

  while (++i < len) {
    var item = array[i];
    data.index = i;
    item.index = i + 1;
    item.total = len;
    item.isFirst = i === 0;
    item.isLast = i === (len - 1);
    buffer += options.fn(item, {data: data});
  }
  return buffer;
}

export function forOwn(obj: any, options: any) {
  var data = createFrame(options, options.hash);
  var buffer = '';
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var item = obj[key];
      data.key = key;
      buffer += options.fn(item, {data: data});
    }
  }
  return buffer;
}