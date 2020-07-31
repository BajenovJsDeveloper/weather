import { dataInit, listInit, weatherDataInit } from './initialData';

export interface GrafTWP {
  elem: React.RefObject<HTMLCanvasElement>;
  width: number | undefined;
  init(
    width: number,
    height: number,
    len: number,
    elem: React.RefObject<HTMLCanvasElement> | null,
    grafId: number | undefined,
  ): void;
  draw(arr: number[] | number[][]): boolean | number[];
  slide(id: number, tshift: number): void;
}


interface IList_Item {
  dt_txt: string;
  weather: Array<{ description: string }>;
}

export interface ImiddleObj {
  wind: number;
  pop: number;
  description: string;
  temp: number;
  img: string;
  hum: number;
}

export interface IWeatherData {
  _currentDay: number;
  _initialDay: number;
  _initialize: boolean;
  _data: typeof weatherDataInit;
  _listDateArray: any;
  _firstDayTimeShift: number;
  _convertToC: (temp: number) => number;
  _convertToF: (temp: number) => number;
  getShift: () => number;
  getSize: () => number | null;
  getRain: () => Array<Array<number>>;
  getWind: () => Array<Array<number>>;
  getTemperatures: () => Array<number>;
  getIcon: () => string;
  getCity: () => string;
  getMiddle: (date: string) => ImiddleObj;
  getWeatherHourly(date: any, isfull?: boolean): Array<IList_Item>;
  getMinMaxTemp(option: 'C' | 'F'): number[];
  getDateArray5: () => typeof listInit;
  init(data: any): boolean;
  nextDate(): boolean;
  getDayOfWeek(): string;
}


export interface IButtonsNavProps {
  butonId: number;
  hdlClickGrafic: (id: number) => void;
}

export interface IdayDiscr {
  dayDiscr: {
    weekDay: string | null;
    humidity: number | null;
    temperature: number | null;
    windSpeed: number | null;
    curTimeWeatherImg: string | null;
    pop: number[] | null;
  };
}

export interface IWeatherGraficProps {
  graficArray: IObjGrafic;
  curItemId: number;
  graficId: number | undefined;
}

export interface Rref extends HTMLCanvasElement {
  readonly current: HTMLCanvasElement | null;
  width: number;
  height: number;
}

export interface IWeatherForDayProps {
  dataList: typeof dataInit;
  curItemId: number;
  timeLineId: number | null;
}

export interface IWeatherCardsProps {
  dataList: typeof dataInit;
  handleClick: ((idx: number) => void) | undefined;
  curItemId: number | undefined;
}

export interface IMainProps {
  city: string;
  dataList: typeof dataInit;
  curItemId: number;
  time: string;
  loading: boolean;
  timeLineId: number | null;
}

export interface ITimeLineProps {
  timeLine: Array<string> | undefined;
  timeClick: ((id: number) => void) | undefined;
  timeLineId: number | null;
}

export interface IHourly {
  dt_txt: string;
  weather: Array<{ description: string }>;
}

export interface IWeatherList {
  img: string;
  temp: number[];
  day: string;
  middle: ImiddleObj;
  hourly: Array<{ dt_txt: string; weather: Array<{ description: string }> }>;
}

export interface IObj {
  arr: number[] | number[][];
  tshift: number;
}

export interface IObjGrafic {
  arr: Array<Array<number>> | Array<number>;
  tshift: number;
}

export interface IContextProps {
  graficArray: IObjGrafic;
  curItemId: number;
  handleClick: (id: number) => void;
  timeClick: (id: number) => void;
  timeLine: Array<string>;
  timeLineId: number | null;
  graficId: number;
  hdlClickGrafic: (id: number) => void;
}