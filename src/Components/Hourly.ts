class HourlyList {
  id = 0;

  _list = [
    {
      day: '',
      hourly: [{ main: { temp: 0, humidity: 0 } }],
      middle: {
        description: '',
      },
    },
  ];

  _hoCuItem = null;

  _init = false;

  init(listTable: any, id = 0) {
    this._list = listTable;
    this.id = id;
    // this._hoCuItem = null;
    this._init = false;
    if (typeof listTable === 'object') {
      [this._hoCuItem] = listTable[id].hourly;
      this._init = listTable[id].hourly.length >= 0;
    }
  }

  _getListArr: (func: any, id: number) => any = (func, id = 0) => {
    const result = this._list[this.id].hourly.map(func);
    if (id + 1 <= result.length) {
      return result[id];
    }
    return result[result.length - 1];
  };

  getWeekDay() {
    if (this._init) {
      return this._list[this.id].day;
    }
    return null;
  }

  getTArray() {
    if (this._init) {
      return this._list[this.id].hourly.map(i => Math.round(i.main.temp - 273));
    }
    return [];
  }

  getCurImg(id: number) {
    if (this._init) {
      const icon = this._getListArr((i: any) => i.weather[0].icon, id);
      return icon;
    }
    return null;
  }

  getHumidity(id: number) {
    if (this._init) {
      const hum = this._getListArr((i: any) => i.main.humidity, id);
      return hum;
    }
    return null;
  }

  getMaxTemp(id: number) {
    if (this._init) {
      const temp: number = this._getListArr((i: any) => i.main.temp, id);
      return Math.round(temp - 273);
    }
    return null;
  }

  getWindSpeed(id: number) {
    if (this._init) {
      const wind = this._getListArr((i: any) => i.wind.speed, id);
      return wind;
    }
    return null;
  }

  getDiscription(id: number) {
    if (this._init) {
      const discr = this._getListArr((i: any) => i.weather[0].description, id);
      return discr.slice(0, 1).toUpperCase().concat(discr.slice(1));
    }
    return '';
  }

  getMiddleDescription(itemId: number) {
    if (this._init) {
      const discr = this._list[itemId].middle.description;
      return discr.slice(0, 1).toUpperCase().concat(discr.slice(1));
    }
    return '';
  }

  getRain(id: number) {
    if (this._init) {
      const rain = this._getListArr((i: any) => {
        if ('rain' in i) return i.rain['3h'];
        return '';
      }, id);
      return rain;
    }
    return null;
  }

  getPop(id: number) {
    if (this._init) {
      return this._getListArr((i: any) => Math.round(i.pop * 100), id);
    }
    return null;
  }
}
const Hourly = new HourlyList();
export default Hourly;
