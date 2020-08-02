function random(num: number, shift = 0) {
  return shift + Math.round(Math.random() * num);
}

const TEMPERATURE = 25;
const SHIFT = 5;
const SEC = 0;
const MIN = 0;
const WIND_SPEED = 10;
const CHANCE_OF = 50;
const HUND_PER = 100;
const TIME_POINT = 21;
const TIME_SHIFT = 3;
const ZERO_KELVIN = 273;

interface DateProps {
  day: number;
  mon: number;
  year: number;
  hour: number;
  len: number;
}

export function dateGenerator<DateProps>(
  day: number,
  mon: number,
  year: number,
  hour: number,
  len: number,
): {} {
  const result = [];
  let h = hour;
  let cnt = 0;
  for (let i = 0; i < len; i += 1) {
    const obj1 = {
      main: {
        temp: random(TEMPERATURE, SHIFT) + ZERO_KELVIN,
        humidity: 0,
      },
      dt_txt: new Date(year, mon - 1, day + cnt, h, MIN, SEC),
      wind: {
        deg: 0,
        speed: random(WIND_SPEED),
      },
      rain: {
        '3h': 0,
      },
      pop: random(CHANCE_OF) / HUND_PER,
      weather: [
        {
          icon: '02n',
          description: 'Nothing',
        },
      ],
    };
    result.push(obj1);
    if (h >= TIME_POINT) {
      h = 0;
      cnt += 1;
    } else h += TIME_SHIFT;
  }
  return result;
}

export const initialData = {
  city: {
    name: 'Chishimnau',
  },
  list: dateGenerator<DateProps>(28, 7, 2020, 12, 40),
};
