class Weather {
  constructor() {
    this.listDateArray = [];
    this._currentDay = 0;
    this._initialDay = 1;
    this._initialize = false;
    this._data = null;
    // F = 1.8 * (K-273) + 32;
    // C = K - 273
    this._convertToC = (temp = 0) => Math.round(temp - 273);
    this._convertToF = (temp = 0) => Math.round(1.8 * (temp - 273) + 32)
  }

  getSize() {
   if(this._initialize) return this.listDateArray.length;
  }

  getIcon(opt = 0) {
    if(this._initialize){
      return this.listDateArray[this._currentDay].weather[0].icon;
    }
  }

  getCity() {
    if(this._initialize){
      return this._data.city.name;
    }
  }

  getMinMaxTemp(option = 'C') {
   
    if (this._initialize) {
      const temps = [];
      const convTempFunc = (option === 'F')? this._convertToF : this._convertToC; 
      this._data.list.forEach((item) => {
        const d = new Date(item.dt_txt);
        if (d.getDate() === this._initialDay + this._currentDay) {
          temps.push(convTempFunc(item.main.temp));
        }
      });

      return [Math.min(...temps), Math.max(...temps)];
    }
    return [null, null];
  }

  getDiscription() {
    if (this._initialize) {
      return this.listDateArray[this._currentDay].weather[0].description;
    }
    // return null;
  }

  getDateArray() {
    return this.listDateArray;
  }

  init(data) {
    if (data) {
      this._data = data;
      let firstDay = 0;
      this._initialDay = new Date(this._data.list[0].dt_txt).getDate();
      this.listDateArray = this._data.list.filter((date) => {
        const d = new Date(date.dt_txt);
        if (d.getDate() !== firstDay) {
          firstDay = d.getDate();
          return true;
        }
        this._initialize = true;
        return false;
      });
      return true; // -- initialized
    }
    return false; // -- not initialized
  }

  getCurrentTemp() {
    if (this._initialize) {
      return (
        this._convertToC(this.listDateArray[this._currentDay].main.temp)
            .toString() || 'Unkown.'
      );
    }
    // return null;
  }

  nextDate() {
    if (this._currentDay < 6) {
      this._currentDay++;
      return true;
    }
    return false;
  }

  getCurDateTime(format) {
    const newDate = new Date(this.listDateArray[this._currentDay].dt_txt);
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
        return null;
    }
  }

  getDayOfWeek() {
    if (this._initialize) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[new Date(this.listDateArray[this._currentDay].dt_txt).getDay()];
    }
    return null;
  }
}

export default Weather;
