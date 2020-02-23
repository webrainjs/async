"use strict";

var _objectToString = require("../../../../main/common/log/objectToString");

/* tslint:disable:no-construct use-primitive-type */
describe('common > log > objectToString', function () {
  it('base', function () {
    var error = new Error('TestError');
    var arr = [1, error];
    var obj = {
      arr: arr,
      date: new Date(),
      Number: new Number(123),
      Boolean: new Boolean(false),
      string: 'string',
      String: new String('String')
    };
    arr.obj = obj;
    error.obj = obj;
    var str = (0, _objectToString.objectToString)(obj); // console.log(str)
  });
});