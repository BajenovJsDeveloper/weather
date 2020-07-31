import { dataInit } from './initialData';
import { IObjGrafic } from '../Components/MyContext';
import { ImiddleObj } from '../Components/Weather';

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
