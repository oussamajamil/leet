import { BadRequestException } from '@nestjs/common';

const isValideDate = (date) => {
  return !isNaN(Date.parse(date));
};
const reviver = (_key: unknown, value: string) => {
  if (typeof value === 'string' && isValideDate(value)) {
    return new Date(value);
  }
  return value;
};
export const safeParse = (value) => {
  try {
    return JSON.parse(value, reviver);
  } catch (e) {
    return value;
  }
};

 const convertToObject = (str) => {
  if (!str) return true;
  const arr = str.split('.');
  if (arr.length === 1) return { [arr[0]]: true };
  return { [arr[0]]: { include: convertToObject(arr.slice(1).join('.')) } };
};

const queryToObj = (str) => {
  let include = {};
  try {
    include = JSON.parse(str);
  } catch (e) {
    include = str.split(',').reduce((acc, curr) => {
      const obj = convertToObject(curr.trim());
      return { ...acc, ...obj };
    }, {});
  }
  return include;
};


export function ConvertQueries() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    if (key == 'findAll') {
      const orignalMethod = descriptor.value;
      descriptor.value = function (params: any, ...args: any[]) {
        const { skip, take, where, orderBy, include, select } = params;
        if (skip && !skip.match(/^\d+$/))
          throw new BadRequestException('skip must be an integer');
        if (take && !take.match(/^\d+$/))
          throw new BadRequestException('take must be an integer');
        params.skip = parseInt(skip || '0');
        params.take = parseInt(take || '20');
        try {
          params.where = JSON.parse(where || '{}');
        } catch (e) {
          throw new BadRequestException('where must be valid JSON');
        }
        try {
          params.orderBy = JSON.parse(orderBy || '{}');
        } catch (e) {
          throw new BadRequestException('orderBy must be valid JSON');
        }
        if (include) {
          params.include = queryToObj(include);
        }
        if (select) params.select = queryToObj(select);
        return orignalMethod.apply(this, [params, ...args]);
      };
      return descriptor;
    }
  };
}

