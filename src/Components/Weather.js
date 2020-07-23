class WeatherData {
  #currentDay = 0;

  #initialDay = 1;

  #initialize = false;

  #data = null;

  #listDateArray = [];

  #firstDayTimeShift = 0;

  #convertToC = (temp = 0) => Math.round(temp - 273);

  #convertToF = (temp = 0) => Math.round(1.8 * (temp - 273) + 32);

  // F = 1.8 * (K-273) + 32;
  // C = K - 273

  getShift() {
    return this.#firstDayTimeShift;
  }

  getSize() {
    if (this.#initialize) return this.#listDateArray.length;
    return null;
  }

  getRain() {
    if (this.#initialize) {
      const resultArr = this.#data.list.map((i) => {
        const rain = i.rain ? i.rain['3h'] : 0;
        return [Math.round(i.pop * 100), rain];
      });
      return resultArr;
    }
    return [null, null];
  }

  getWind() {
    if (this.#initialize) {
      const resultArr = this.#data.list.map((i) => [i.wind.deg, i.wind.speed]);
      return resultArr;
    }
    return [null, null];
  }

  getTemperatures() {
    if (this.#initialize) {
      return this.#data.list.map((i) => Math.round(i.main.temp - 273));
    }
    return [null];
  }

  getIcon(opt = 0) {
    if (this.#initialize) {
      if (this.#currentDay === 0) return this.#listDateArray[this.#currentDay].weather[0].icon;

      const date = this.#listDateArray[this.#currentDay].dt_txt;
      const newArr = this.getWeatherHourly(date);
      const middleItem = Math.floor(newArr.length / 2);
      const img = newArr[middleItem].weather[0].icon;
      return img;
    }
    return '';
  }

  getCity() {
    if (this.#initialize) {
      return this.#data.city.name;
    }
    return '';
  }

  getWeatherHourly(date) {
    const hoursArr = [];
    if (this.#initialize) {
      const dateNow = new Date();
      const initialDay = new Date(date).getDate();
      this.#data.list.forEach((item) => {
        const curDay = new Date(item.dt_txt).getDate();
        if (curDay === initialDay) {
          hoursArr.push(item);
        }
      });

      if (initialDay === dateNow.getDate() && hoursArr.length < 8) {
        const len = hoursArr.length;
        // -- create time shift number in first day
        // -- which must have not an 8 parts in time line (24/3 = 8)
        this.#firstDayTimeShift = len;
        for (let i = 0; i < 8 - len; i++) {
          // -- add some time elements, which`s need to be 8
          hoursArr.push(this.#data.list[len + i]);
        }
      }
    }
    return hoursArr;
  }

  getMinMaxTemp(option = 'C') {
    if (this.#initialize) {
      const temps = [];
      const convTempFunc = option === 'F' ? this.#convertToF : this.#convertToC;
      this.#data.list.forEach((item) => {
        const d = new Date(item.dt_txt);
        if (d.getDate() === this.#initialDay + this.#currentDay) {
          temps.push(convTempFunc(item.main.temp));
        }
      });
      return [Math.min(...temps), Math.max(...temps)];
    }
    return [null, null];
  }

  getDiscription() {
    if (this.#initialize) {
      return this.#listDateArray[this.#currentDay].weather[0].description;
    }
    return null;
  }

  getDateArray5() {
    return this.#listDateArray;
  }

  init(data) {
    if (typeof data.list === 'object') {
      this.#data = data;
      let firstDay = 0;
      const stringDate = new Date(this.#data.list[0].dt_txt);
      this.#initialDay = stringDate.getDate();
      this.#listDateArray = this.#data.list.filter((item) => {
        const dt = new Date(item.dt_txt);
        if (dt.getDate() !== firstDay) {
          firstDay = dt.getDate();
          return true;
        }
        return false;
      });
      // -- initialized
      this.#initialize = true;
      // -- delet last element from array. Need to be 5 alements
      if (this.#listDateArray.length > 5) this.#listDateArray.pop();
    }
    // -- not initialized
    return this.#initialize;
  }

  nextDate() {
    if (this.#initialize && this.#currentDay < 5) {
      this.#currentDay++;
      return true;
    }
    return false;
  }

  getDayOfWeek() {
    if (this.#initialize) {
      const newDate = new Date(this.#listDateArray[this.#currentDay].dt_txt);
      return newDate.toLocaleString('en-US', { weekday: 'long' });
    }
    return '';
  }
}
const Weather = new WeatherData();
// const Weather = WeatherData;
export default Weather;
