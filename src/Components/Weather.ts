import { listInit, weatherDataInit } from '../Interface/initialData';
import { IWeatherData } from '../Interface/Interface';


class WeatherData {
  _currentDay = 0;

  _initialDay = 1;

  _initialize = false;

  _data = weatherDataInit;

  _listDateArray = listInit;

  _firstDayTimeShift = 0;

  _convertToC = (temp = 0) => Math.round(temp - 273);

  _convertToF = (temp = 0) => Math.round(1.8 * (temp - 273) + 32);

  // F = 1.8 * (K-273) + 32;
  // C = K - 273
  _reset() {
    this._currentDay = 0;
    this._initialDay = 1;
    this._initialize = false;
    this._data = weatherDataInit;
    this._listDateArray = listInit;
    this._firstDayTimeShift = 0;
  }

  getShift() {
    return this._firstDayTimeShift;
  }

  getSize() {
    if (this._initialize) return this._listDateArray.length;
    return null;
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
      return this._data.list.map(i => Math.round(i.main.temp - 273));
    }
    return [];
  }

  getIcon() {
    if (this._initialize) {
      if (this._currentDay === 0) return this._listDateArray[this._currentDay].weather[0].icon;
      const date = this._listDateArray[this._currentDay].dt_txt;
      const newArr = this.getWeatherHourly(date);
      const middleItem = Math.floor(newArr.length / 2);
      const img = newArr[middleItem].weather[0].icon;
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
      midlleObj.description = midElement.weather[0].description;
      midlleObj.temp = Math.round(midElement.main.temp - 273);
      midlleObj.img = midElement.weather[0].icon;
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
        const curDay = new Date(item.dt_txt).getDate();
        if (curDay === initialDay) {
          hoursArr.push(item);
        }
      });
      const len = hoursArr.length;
      // -- fill hoursArr with next data if length < 8 and if day === current day
      if (!isfull && initialDay === dateNow && hoursArr.length < 8) {
        // -- create time shift number in first day
        // -- which must have not an 8 parts in time line (24/3 = 8)
        this._firstDayTimeShift = len;
        for (let i = 0; i < 8 - len; i++) {
          // -- add some time elements, which`s need to be 8
          hoursArr.push(this._data.list[len + i]);
        }
      }
    }
    return hoursArr;
  }

  getMinMaxTemp(option = 'C') {
    if (this._initialize) {
      const temps: number[] = [];
      const convTempFunc = option === 'F' ? this._convertToF : this._convertToC;
      this._data.list.forEach(item => {
        const d = new Date(item.dt_txt).getDate();
        const mon = new Date(item.dt_txt).getMonth();
        const year = new Date(item.dt_txt).getFullYear();
        const d1 = new Date(year, mon, this._initialDay + this._currentDay).getDate();
        if (d === d1) {
          temps.push(convTempFunc(item.main.temp));
        }
      });
      return [Math.min(...temps), Math.max(...temps)];
    }
    return [0, 0];
  }

  getDateArray5() {
    return this._listDateArray.slice(0, 5);
  }

  init(data: any) {
    if (typeof data.list === 'object') {
      this._reset();
      this._data = data;
      let firstDay = 0;
      const stringDate = new Date(this._data.list[0].dt_txt);
      this._initialDay = stringDate.getDate();
      this._listDateArray = this._data.list.filter(item => {
        const dt = new Date(item.dt_txt);
        if (dt.getDate() !== firstDay) {
          firstDay = dt.getDate();
          return true;
        }
        return false;
      });
      if (typeof this._listDateArray === 'object') {
        // -- delet last elements from array. Need to be 5 alements
        this._listDateArray = this._listDateArray.slice(0, 5);
        // -- initialized
        this._initialize = true;
      } else this._initialize = false;
    } else this._initialize = false;
    // -- not initialized
    return this._initialize;
  }

  nextDate() {
    if (this._initialize && this._currentDay < 5) {
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
