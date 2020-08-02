import { WeatherList, HourlyItem, WeatherDataInit, ListItem, MiddleObj } from './Interfaces';

export class DataInit implements WeatherList {
  temp: Array<number> = [];

  img = '';

  day = '';

  hourly: Array<ListItem>;

  middle: MiddleObj;

  constructor() {
    this.temp = [0, 0];
    this.img = '';
    this.day = 'monday';
    this.hourly = [
      {
        main: {
          temp: 0,
        },
        dt_txt: '',
        weather: [
          {
            description: '',
          },
        ],
      },
    ];
    this.middle = {
      pop: 0,
      wind: 0,
      description: '',
      temp: 0,
      img: '',
      hum: 0,
    };
  }
}

export const hourlyInit: Array<HourlyItem> = [
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

export const weatherDataInit: WeatherDataInit = {
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
