import { hourlyInit, weatherDataInit } from '../Interface/initialData';
import { IWeatherData } from '../Interface/Interfaces';

const numberOfDaysInList: number = 5;
const ZERO_KELVIN: number = 273;
const FIRST: number = 0;
const TIME_SHIFT: number = 8;

class WeatherData {
  _currentDay: number = 0;

  _initialDay: number = 1;

  _initialize: boolean = false;

  _data = weatherDataInit;

  _listDateArray = hourlyInit;

  _firstDayTimeShift = 0;

  _convertTempToC = (temp = 0) => Math.round(temp - ZERO_KELVIN);

  // _convertToF = (temp = 0) => Math.round(1.8 * (temp - ZERO_KELVIN) + 32);

  // F = 1.8 * (K-ZERO_KELVIN) + 32;
  // C = K - ZERO_KELVIN
  _reset() {
    this._currentDay = 0;
    this._initialDay = 1;
    this._initialize = false;
    this._data = weatherDataInit;
    this._listDateArray = hourlyInit;
    this._firstDayTimeShift = 0;
  }

  getShift() {
    return this._firstDayTimeShift;
  }

  getRain() {
    if (this._initialize) {
      const resultArr = this._data.list.map(i => {
        const rain = i.rain ? i.rain['3h'] : 0;
        return [Math.round(i.pop * 100), rain];
      });
      return resultArr;
    }
    return [[0, 0]];
  }

  getWind() {
    if (this._initialize) {
      const resultArr = this._data.list.map(i => [i.wind.deg, i.wind.speed]);
      return resultArr;
    }
    return [[0, 0]];
  }

  getTemperatures() {
    if (this._initialize) {
      return this._data.list.map(i => Math.round(i.main.temp - ZERO_KELVIN));
    }
    return [];
  }

  getIcon() {
    if (this._initialize) {
      if (this._currentDay === 0) return this._listDateArray[this._currentDay].weather[FIRST].icon;
      const date = this._listDateArray[this._currentDay].dt_txt;
      const newArr = this.getWeatherHourly(date);
      const middleItem = Math.floor(newArr.length / 2);
      const img = newArr[middleItem].weather[FIRST].icon;
      return img;
    }
    return '';
  }

  getCity() {
    if (this._initialize) {
      return this._data.city.name;
    }
    return '';
  }

  getMiddle(date: string) {
    const midlleObj = {
      wind: 0,
      pop: 0,
      description: '',
      temp: 0,
      img: '',
      hum: 0,
    };

    if (this._initialize) {
      const hourlyArray = this.getWeatherHourly(date, true);
      const n = Math.floor(hourlyArray.length / 2);
      const midElement = hourlyArray[n];
      midlleObj.wind = midElement.wind.speed;
      midlleObj.pop = Math.round(midElement.pop * 100);
      midlleObj.description = midElement.weather[FIRST].description;
      midlleObj.temp = Math.round(midElement.main.temp - ZERO_KELVIN);
      midlleObj.img = midElement.weather[FIRST].icon;
      midlleObj.hum = midElement.main.humidity;
    }
    return midlleObj;
  }

  getWeatherHourly(date: string, isfull: boolean = false) {
    const hoursArr = [];
    if (this._initialize) {
      const dateNow = new Date().getDate();
      const initialDay = new Date(date).getDate();
      this._data.list.forEach(item => {
        const currrentDay = new Date(item.dt_txt).getDate();
        if (currrentDay === initialDay) {
          hoursArr.push(item);
        }
      });
      const len = hoursArr.length;
      // -- fill hoursArr with next data if length < TIME_SHIFT and if day === current day
      if (!isfull && initialDay === dateNow && hoursArr.length < TIME_SHIFT) {
        // -- create time shift number in first day
        this._firstDayTimeShift = len;
        for (let i = 0; i < TIME_SHIFT - len; i++) {
          hoursArr.push(this._data.list[len + i]);
        }
      }
    }
    return hoursArr;
  }

  getMinMaxTemp() {
    if (this._initialize) {
      const temps: number[] = [];
      this._data.list.forEach(item => {
        const d = new Date(item.dt_txt).getDate();
        const mon = new Date(item.dt_txt).getMonth();
        const year = new Date(item.dt_txt).getFullYear();
        const d1 = new Date(year, mon, this._initialDay + this._currentDay).getDate();
        if (d === d1) {
          temps.push(this._convertTempToC(item.main.temp));
        }
      });
      return [Math.min(...temps), Math.max(...temps)];
    }
    return [0, 0];
  }

  getDatesList() {
    return this._listDateArray;
  }

  init(data: any) {
    this._initialize = false;
    if (typeof data.list === 'object') {
      this._reset();
      this._data = data;
      let firstDay = 0;
      const stringDate = new Date(this._data.list[0].dt_txt);
      this._initialDay = stringDate.getDate();
      this._listDateArray = this._data.list.filter(item => {
        const dt = new Date(item.dt_txt).getDate();
        if (dt !== firstDay) {
          firstDay = dt;
          return true;
        }
        return false;
      });
      if (typeof this._listDateArray === 'object') {
        this._listDateArray = this._listDateArray.slice(0, numberOfDaysInList);
        this._initialize = true;
      }
    }
    return this._initialize;
  }

  nextDate() {
    if (this._initialize && this._currentDay < numberOfDaysInList) {
      this._currentDay++;
      return true;
    }
    return false;
  }

  getDayOfWeek() {
    if (this._initialize) {
      const newDate = new Date(this._listDateArray[this._currentDay].dt_txt);
      return newDate.toLocaleString('en-US', { weekday: 'long' });
    }
    return '';
  }
}

const Weather: IWeatherData = new WeatherData();
export default Weather;
