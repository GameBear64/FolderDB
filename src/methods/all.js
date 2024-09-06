import * as read from './core/read';
import * as write from './core/write';

import * as numbers from './data/numbers';
// import * as strings from './data/strings';
// import * as objects from './data/objects';
import * as arrays from './data/arrays';

import * as general from './utils/general';
import * as time from './utils/time';

export default { ...read, ...write, ...numbers, ...arrays, ...general, ...time };
