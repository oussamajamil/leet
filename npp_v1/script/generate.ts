import * as fs from 'fs';

const getFile = (path: string) => {
  const data = fs.readFileSync(path, 'utf8');
  return data;
};

const main = () => {
  const regex = new RegExp(/model\s(\w+)\s\{([\s\S]*?)\}/g, 'g');

  const res = getFile('prisma/schema.prisma')
    ?.match(regex)
    .map((item) => {
      return {
        name: item.match(/model\s(\w+)\s\{/)[1],
        content: item
          .match(/model\s(\w+)\s\{([\s\S]*?)\}/)[2]
          .split('\n')
          .map((item) => item.trim())
          ?.filter((item) => item !== '' && !item.startsWith('//'))
          ?.map((item) => {
            const [name, type, ...validation] = item.split(/\s+/);
            return {
              name,
              validation,
              IsRequired:
                !type.endsWith('?') &&
                !validation.some((ele) => ele.includes('@default')),
              type: type.endsWith('?') ? type.split('?')[0] : type,
            };
          }),
      };
    });

  if (res.length === 0) {
    console.log('No model found');
    return;
  } else {
    console.log(JSON.stringify(res, null, 2));
  }
};

main();

// console.log(['test', '@default(test)'].includes(/@default/));

//check if tables has  @default

// const dt = ['test1', 'test22'];
// console.log(dt.includes(/test2+/));
// console.log('/test2+/'.test(dt));
