class HourlyList {
  init(listTable, id = 0) {
    this._list = listTable;
    this.id = id;
    this._hoCuItem = null;
    this._init = false;
    // this._timeId = timeId;
    if (typeof listTable === 'object') {
      [this._hoCuItem] = listTable[id].hourly;
      this._init = listTable[id].hourly.length >= 0;
    }
  }

  #getListArr = (func, id = 0) => {
    const result = this._list[this.id].hourly.map(func);
    if (id + 1 <= result.length) {
      return result[id];
    }
    return result[result.length - 1];
  };

  // getPpressure(id) {
  //   // console.log('get preasure id: ',id)
  //   if (this._init) {
  //     const pressure = this.#getListArr((i) => i.main.pressure, id);
  //     return pressure;
  //   }
  //   return null;
  // }

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

  getCurImg(id) {
    if (this._init) {
      const icon = this.#getListArr((i) => i.weather[0].icon, id);
      return icon;
    }
    return null;
  }

  getHumidity(id) {
    if (this._init) {
      const hum = this.#getListArr((i) => i.main.humidity, id);
      return hum;
    }
    return null;
  }

  getMaxTemp(id) {
    if (this._init) {
      const temp = this.#getListArr((i) => i.main.temp, id);
      return Math.round(temp - 273);
    }
    return null;
  }

  getWindSpeed(id) {
    if (this._init) {
      const wind = this.#getListArr((i) => i.wind.speed, id);
      return wind;
    }
    return null;
  }

  // getWindDir(id) {
  //   if (this._init) {
  //     return this.#getListArr((i) => i.wind.deg, id);
  //   }
  //   return null;
  // }

  getDiscription(id) {
    if (this._init) {
      const discr = this.#getListArr((i) => i.weather[0].description, id);
      return discr.slice(0, 1).toUpperCase().concat(discr.slice(1));
    }
    return null;
  }

  getRain(id) {
    if (this._init) {
      const rain = this.#getListArr((i) => {
        if ('rain' in i) return i.rain['3h'];
        return '';
      }, id);
      return rain;
    }
    return null;
  }

  getPop(id) {
    if (this._init) {
      return this.#getListArr((i) => Math.round(i.pop * 100), id);
    }
    return null;
  }
}
const Hourly = new HourlyList();
export default Hourly;
