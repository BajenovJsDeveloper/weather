class Hourly {
  constructor(listTable, id) {
    this._list = listTable;
    this.id = id;
    this._hoCuItem = null;
    this._init = false;
    if (listTable) {
      this._hoCuItem = listTable[id].hourly[0];
      this._init = listTable[id].hourly.length >= 0;
    }
  }

  getPpressure() {
    if (this._init) {
      const pressure = this._list[this.id].hourly.map((i) => i.main.pressure);
      return Math.max(...pressure);
    }
    return null;
  }

  getWeekDay() {
    if (this._init) {
      return this._list[this.id].day;
    }
    return null;
  }

  getTArray() {
    if (this._init) {
      return this._list[this.id].hourly.map((i) => Math.round(i.main.temp - 273));
    }
    return [];
  }

  getCurImg() {
    if (this._init) {
      return this._hoCuItem.weather[0].icon;
    }
    return null;
  }

  getHumidity() {
    if (this._init) {
      const hum = this._list[this.id].hourly.map((i) => i.main.humidity);
      return Math.max(...hum);
    }
    return null;
  }

  getMaxTemp() {
    if (this._init) {
      let temp = this._list[this.id].hourly.map((i) => i.main.temp);
      temp = Math.max(...temp);
      return Math.round(temp - 273);
    }
    return null;
  }

  getWindSpeed() {
    if (this._init) {
      const wind = this._list[this.id].hourly.map((i) => i.wind.speed);
      return Math.max(...wind);
    }
    return null;
  }

  getWindDir() {
    if (this._init) {
      return this._hoCuItem.wind.deg;
    }
    return null;
  }

  getDiscription(date) {
    if (this._init) {
      return this._list[this.id].hourly[0].weather[0].description;
    }
    return null;
  }
}

export default Hourly