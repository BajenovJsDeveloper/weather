class Weather {
  constructor() {
    this.listDateArray = [];
    this._currentDay = 0;
    this._initialDay = 1;
    this._initialize = false;
    this._data = null;
    this._convertToC = (temp = 0) => Math.round(temp) - 273;
  }

  getSize() {
    return this.listDateArray.length;
  }

  getIcon(opt = 0) {
    return this.listDateArray[this._currentDay].weather[0].icon;
  }

  getCity() {
    return this._data.city.name;
  }

  getMinMaxTemp() {
    if (this._initialize) {
      const temps = [];
      this._data.list.forEach((item) => {
        const d = new Date(item.dt_txt);
        if (d.getDate() === this._initialDay + this._currentDay) {
          temps.push(this._convertToC(item.main.temp));
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
    return null;
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
        this._convertToC(this.listDateArray[this._currentDay].main.temp).toString() || 'Unkown.'
      );
    }
    return null;
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
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday'];
      return days[new Date(this.listDateArray[this._currentDay].dt_txt).getDay()];
    }
    return null;
  }
}

export default Weather;
