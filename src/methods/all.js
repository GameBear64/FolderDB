import * as read from './core/read.js';
import * as write from './core/write.js';

import * as numbers from './data/numbers.js';
import * as strings from './data/strings.js';
import * as objects from './data/objects.js';
import * as arrays from './data/arrays.js';

import * as general from './utils/general.js';
import * as schema from './utils/schema.js';
import * as time from './utils/time.js';

export default { ...read, ...write, ...numbers, ...strings, ...arrays, ...objects, ...general, ...schema, ...time };
