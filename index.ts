/*!
 * handlebars-helpers <https://github.com/helpers/handlebars-helpers>
 *
 * Copyright (c) 2013-2017, Jon Schlinkert, Brian Woodward.
 * Released under the MIT License.
 */

import arrayHelpers from './lib/array';
import collectionHelpers from './lib/collection';
import comparisonHelpers from './lib/comparison';
import dateHelpers from './lib/date';
import mathHelpers from './lib/math';
import numberHelpers from './lib/number';
import stringHelpers from './lib/string';
import urlHelpers from './lib/url';

// Individual helper collections
export const array = arrayHelpers;
export const collection = collectionHelpers;
export const comparison = comparisonHelpers;
export const date = dateHelpers;
export const math = mathHelpers;
export const number = numberHelpers;
export const string = stringHelpers;
export const url = urlHelpers;

function handlebarsHelpers(names?: string[] | { handlebars?: any }): any {
  // If called without arguments, return all helpers
  if (!names) {
    return Object.assign({},
      arrayHelpers,
      collectionHelpers,
      comparisonHelpers,
      dateHelpers,
      mathHelpers,
      numberHelpers,
      stringHelpers,
      urlHelpers
    );
  }

  // If it's an options object with handlebars instance
  if (typeof names === 'object' && !Array.isArray(names) && names.handlebars) {
    const allHelpers = Object.assign({},
      arrayHelpers,
      collectionHelpers,
      comparisonHelpers,
      dateHelpers,
      mathHelpers,
      numberHelpers,
      stringHelpers,
      urlHelpers
    );
    
    // Register all helpers
    for (const name in allHelpers) {
      names.handlebars.registerHelper(name, allHelpers[name]);
    }
    
    return allHelpers;
  }

  // If array of specific helper collections
  if (Array.isArray(names)) {
    const result: any = {};
    
    for (const name of names) {
      switch (name) {
        case 'array':
          Object.assign(result, arrayHelpers);
          break;
        case 'collection':
          Object.assign(result, collectionHelpers);
          break;
        case 'comparison':
          Object.assign(result, comparisonHelpers);
          break;
        case 'date':
          Object.assign(result, dateHelpers);
          break;
        case 'math':
          Object.assign(result, mathHelpers);
          break;
        case 'number':
          Object.assign(result, numberHelpers);
          break;
        case 'string':
          Object.assign(result, stringHelpers);
          break;
        case 'url':
          Object.assign(result, urlHelpers);
          break;
      }
    }
    
    return result;
  }

  return {};
}

// Add getters for individual collections
Object.defineProperty(handlebarsHelpers, 'array', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in arrayHelpers) {
          options.handlebars.registerHelper(name, arrayHelpers[name]);
        }
      }
      return arrayHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'collection', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in collectionHelpers) {
          options.handlebars.registerHelper(name, collectionHelpers[name]);
        }
      }
      return collectionHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'comparison', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in comparisonHelpers) {
          options.handlebars.registerHelper(name, comparisonHelpers[name]);
        }
      }
      return comparisonHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'date', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in dateHelpers) {
          options.handlebars.registerHelper(name, dateHelpers[name]);
        }
      }
      return dateHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'math', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in mathHelpers) {
          options.handlebars.registerHelper(name, mathHelpers[name]);
        }
      }
      return mathHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'number', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in numberHelpers) {
          options.handlebars.registerHelper(name, numberHelpers[name]);
        }
      }
      return numberHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'string', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in stringHelpers) {
          options.handlebars.registerHelper(name, stringHelpers[name]);
        }
      }
      return stringHelpers;
    };
  }
});

Object.defineProperty(handlebarsHelpers, 'url', {
  get: function() {
    return function(options?: { handlebars?: any }) {
      if (options && options.handlebars) {
        for (const name in urlHelpers) {
          options.handlebars.registerHelper(name, urlHelpers[name]);
        }
      }
      return urlHelpers;
    };
  }
});

export default handlebarsHelpers;
