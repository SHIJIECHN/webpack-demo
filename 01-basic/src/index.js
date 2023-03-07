// import { join } from 'lodash';

// console.log(_.join(['a', 'b', 'c'], '@'));
// console.log('11');
// import $ from 'jquery';

// console.log($);

fetch('/api/users').then((res) => res.json()).then((res) => {
  console.log(res);
});