class Weather {
  
  #currentDay = 0;
  #initialDay = 1;
  #initialize = false;
  #data = null; 
  #listDateArray = [];
  #convertToC = (temp = 0) => Math.round(temp - 273);
  #convertToF = (temp = 0) => Math.round(1.8 * (temp - 273) + 32);
  constructor() {
    // F = 1.8 * (K-273) + 32;
    // C = K - 273
  }

  getSize() {
    if (this.#initialize) return this.#listDateArray.length;
    return null;
  }

  getIcon(opt = 0) {
    if (this.#initialize) {
      return this.#listDateArray[this.#currentDay].weather[0].icon;
    }
    return null;
  }

  getCity() {
    if (this.#initialize) {
      return this.#data.city.name;
    }
    return null;
  }

  getWeatherHourly(date) {
    const hourArr = [];
    if (this.#initialize) {
      const dateNow = new Date();
      const initialDay = new Date(date).getDate();
      this.#data.list.forEach((item) => {
        const curDay = new Date(item.dt_txt).getDate();
        if (curDay === initialDay) {
          hourArr.push(item);
        }
      });

      if (initialDay === dateNow.getDate() && hourArr.length < 8) {
        const len = hourArr.length;
        for (let i = 0; i < 8 - len; i++) {
          // -- add some elements, which`s need to be 8
          hourArr.push(this.#data.list[len + i]);
        }
      }
    }
    return hourArr;
  }

  getMinMaxTemp(option = 'C') {
    if (this.#initialize) {
      const temps = [];
      const convTempFunc = (option === 'F') ? this.#convertToF : this.#convertToC;
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

  getDateArray() {
    return this.#listDateArray;
  }

  init(data) {
    if (data) {
      this.#data = data;
      let firstDay = 0;
      const strData = new Date(this.#data.list[0].dt_txt);
      this.#initialDay = strData.getDate();
      this.#listDateArray = this.#data.list.filter((date) => {
        const d = new Date(date.dt_txt);
        if (d.getDate() !== firstDay) {
          firstDay = d.getDate();
          return true;
        }
        return false;
      });
      this.#initialize = true;  // -- initialized
    }
    return this.#initialize; // -- not initialized
  }
  nextDate() {
    if(this.#initialize && this.#currentDay < 6){
      this.#currentDay++;
      return true;
    }
    return false;
  }

  getCurDateTime(format) {
    if(this.#initialize){
      const newDate = new Date(this.#listDateArray[this.#currentDay].dt_txt);
      const option = { day: 'numeric', month: 'long', year: 'numeric' };
      switch (format) {
        case 'DMY':
          // option.weekday = 'long';
          return newDate.toLocaleDateString('en-US', option);
        case 'DMYhm':
          option.minute = '2-digit';
          option.hour = '2-digit';
          option.hour12 = false;
          return newDate.toLocaleDateString('en-US', option);
        default:
          return '';
      }
    }
    return '';
  }

  getDayOfWeek() {
    if (this.#initialize) {
      const newDate = new Date(this.#listDateArray[this.#currentDay].dt_txt);
      return newDate.toLocaleString('en-US',{weekday:'long'});
    }
    return '';
  }

  // getTimeList(){
  //   if (this.#initialize) {
  //     const timeList = this.#listDateArray[this.#currentDay]
  //   }
  // }
}




export default Weather;
