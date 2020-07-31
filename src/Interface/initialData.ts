function random(num: number, shift = 0) {
  return shift + Math.round(Math.random() * num);
}

export function dateGenerator(day: number, mon: number, year: number, hour: number, len: number) {
  const result = [];
  let z = hour;
  let cnt = 0;
  for (let i = 0; i < len; i++) {
    const obj1 = {
      main: {
        temp: random(25, 5) + 273,
        humidity: 0,
      },
      dt_txt: new Date(year, mon - 1, cnt + day, z, 0, 0),
      wind: {
        deg: 0,
        speed: random(10),
      },
      rain: {
        '3h': 0,
      },
      pop: random(50) / 100,
      weather: [
        {
          icon: '02n',
          description: 'Nothing',
        },
      ],
    };
    result.push(obj1);
    if (z >= 21) {
      z = 0;
      cnt++;
    } else z += 3;
  }
  return result;
}

export const initialData = {
  city: {
    name: 'Chishimnau',
  },
  list: dateGenerator(28, 7, 2020, 12, 40),
};

export const dataInit = [
  {
    temp: [0, 0],
    img: '',
    day: 'monday',
    hourly: [{ dt_txt: '', weather: [{ description: '' }] }],
    middle: {
      pop: 0,
      wind: 0,
      description: '',
      temp: 0,
      img: '',
      hum: 0,
    },
  },
];
