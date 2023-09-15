// const isValideDate = (date) => {
//   return !isNaN(Date.parse(date));
// };
// const reviver = (key, value) => {
//   if (typeof value === "string" && isValideDate(value)) {
//     return new Date(value);
//   }
//   return value;
// };
// const safeParse = (value) => {
//   try {
//     return JSON.parse(value, reviver);
//   } catch (e) {
//     return value;
//   }
// };

// console.log(
//   safeParse(
//     '{"name":"oussama","res":{"data":"test","date":"2023-09-14T12:55:11.402Z"}}'
//   )
// );

const data = "test";

console.log(data[(0, data.length - 1)]);
