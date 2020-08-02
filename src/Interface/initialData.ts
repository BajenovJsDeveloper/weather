import { IWeatherList, IHourly, IWeatherDataInit } from './Interfaces';

export const dataInit: IWeatherList[] = [
  {
    temp: [0, 0],
    img: '',
    day: 'monday',
    hourly: [
      {
        dt_txt: '',
        weather: [
          {
            description: '',
          },
        ],
      },
    ],
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

export const hourlyInit: IHourly[] = [
  {
    main: {
      temp: 0,
      humidity: 0,
    },
    dt_txt: '',
    wind: {
      deg: 0,
      speed: 0,
    },
    rain: {
      '3h': 0,
    },
    pop: 0,
    weather: [
      {
        icon: '',
        description: '',
      },
    ],
  },
];

export const weatherDataInit: IWeatherDataInit = {
  city: {
    name: '',
  },
  list: [
    {
      main: {
        temp: 0,
        humidity: 0,
      },
      dt_txt: '',
      wind: {
        deg: 0,
        speed: 0,
      },
      rain: {
        '3h': 0,
      },
      pop: 0,
      weather: [
        {
          icon: '',
          description: '',
        },
      ],
    },
  ],
};
