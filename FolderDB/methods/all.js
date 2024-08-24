import * as read from './core/read';
import * as write from './core/write';

// import * as general from './general';
import * as numbers from './numbers';
// import * as strings from './strings';
// import * as objects from './objects';
// import * as arrays from './arrays';
// import * as time from './time';

export default { ...read, ...write, ...numbers };
