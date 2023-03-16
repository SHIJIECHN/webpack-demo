
import { flatten as flat, concat as con } from 'lodash';
// 将上面的表达式转成下面的形式
// import flat from 'lodash/flatten';
// import con from 'lodash/concat';
console.log(flat([1, [2, [3]]]));
console.log(con([1], [2]))