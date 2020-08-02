// import { DataInit } from './initialData';

// const initialDataList = [new DataInit()];

export interface HourlyList {
  id: number;
  _list: {};
  _init: boolean;
  init(listTable: Array<WeatherList>, id: number): void;
  _getListArr(func: any, id: number): any;
  getWeekDay(): string | null;
  getTArray(): Array<number>;
  getCurImg(id: number): string | null;
  getHumidity(id: number): number | null;
  getMaxTemp(id: number): number | null;
  getWindSpeed(id: number): number | null;
  getDiscription(id: number): string;
  getMiddleDescription(itemId: number): string;
  getRain(id: number): string | null;
  getPop(id: number): number | null;
}

export interface GraficTempWindPop {
  _elem: React.RefObject<HTMLCanvasElement>;
  _width: number;
  _shift: number;
  _k: number;
  _grafId: number;
  _len: number;
  init(elem: React.RefObject<HTMLCanvasElement> | null, grafId: number | undefined): void;
  draw(arr: Array<number> | Array<Array<number>>): boolean | Array<number>;
  slide(id: number, tshift: number): void;
  _DrawWindSpeedDirectionGrafic(arr: Array<number> | Array<Array<number>>, ctx: any): void;
  _DrawTemperaturesGrafic(arr: Array<Array<number>> | Array<number>, ctx: any): void;
  _DrawPrecipitationsGrafic(arr: Array<Array<number>> | Array<number>, ctx: any): void;
}

export interface ListItem {
  main: { temp: number };
  dt_txt: string;
  weather: Array<{ description: string }>;
}

export interface MiddleObj {
  wind: number;
  pop: number;
  description: string;
  temp: number;
  img: string;
  hum: number;
}

export interface WeatherData {
  _currentDay: number;
  _initialDay: number;
  _initialize: boolean;
  _data: WeatherDataInit;
  _listDateArray: any;
  _firstDayTimeShift: number;
  _convertTempToC: (temp: number) => number;
  getShift: () => number;
  getRain: () => Array<Array<number>>;
  getWind: () => Array<Array<number>>;
  getTemperatures: () => Array<number>;
  getIcon: () => string;
  getCity: () => string;
  getMiddle: (date: string) => MiddleObj;
  getWeatherHourly(date: string, isfull?: boolean): Array<ListItem>;
  getMinMaxTemp(): number[];
  getDatesList: () => Array<HourlyItem>;
  init(data: any): boolean;
  nextDate(): boolean;
  getDayOfWeek(): string;
}

export interface ButtonsNavProps {
  butonId: number;
  hdlClickGrafic: (id: number) => void;
}

export interface DayDiscr {
  dayDiscr: {
    weekDay: string | null;
    humidity: number | null;
    temperature: number | null;
    windSpeed: number | null;
    curTimeWeatherImg: string | null;
    pop: number | null;
  };
}

export interface WeatherGraficProps {
  graficArray: ObjGrafic;
  curItemId: number;
  graficId: number | undefined;
}

export interface Rref extends HTMLCanvasElement {
  readonly current: HTMLCanvasElement | null;
  width: number;
  height: number;
}

export interface WeatherForDayProps {
  dataList: Array<WeatherList>;
  curItemId: number;
  timeLineId: number | null;
}

export interface WeatherCardsProps {
  dataList: Array<WeatherList>;
  handleClick: ((idx: number) => void) | undefined;
  curItemId: number | undefined;
}

export interface MainProps {
  city: string;
  dataList: Array<WeatherList>;
  curItemId: number;
  time: string;
  loading: boolean;
  timeLineId: number | null;
}

export interface TimeLineProps {
  timeLine: Array<string> | undefined;
  timeClick: ((id: number) => void) | undefined;
  timeLineId: number | null;
}

export interface HourlyItem {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    deg: number;
    speed: number;
  };
  rain: {
    '3h': number;
  };
  pop: number;
  dt_txt: string;
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface WeatherList {
  img: string;
  temp: Array<number>;
  day: string;
  middle: MiddleObj;
  hourly: Array<{
    main: {
      temp: number;
    };
    dt_txt: string;
    weather: Array<{
      description: string;
    }>;
  }>;
}

export type Obj = ObjGrafic;

export interface ObjGrafic {
  arr: Array<Array<number>> | Array<number>;
  tshift: number;
}

export interface ContextProps {
  graficArray: ObjGrafic;
  curItemId: number;
  handleClick: (id: number) => void;
  timeClick: (id: number) => void;
  timeLine: Array<string>;
  timeLineId: number | null;
  graficId: number;
  hdlClickGrafic: (id: number) => void;
}

export interface WeatherDataInit {
  city: {
    name: string;
  };
  list: Array<HourlyItem>;
}
