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
    this._convertToF = (temp = 0) => Math.round(1.8 * (temp - 273) + 32);
  }

  getSize() {
    if (this._initialize) return this.listDateArray.length;
    return null;
  }

  getIcon(opt = 0) {
    if (this._initialize) {
      return this.listDateArray[this._currentDay].weather[0].icon;
    }
    return null;
  }

  getCity() {
    if (this._initialize) {
      return this._data.city.name;
    }
    return null;
  }

  getWeatherHourly(date) {
    const hourArr = [];
    if (this._initialize) {
      const dateNow = new Date();
      const initialDay = new Date(date).getDate();
      this._data.list.forEach((item) => {
        const curDay = new Date(item.dt_txt).getDate();
        if (curDay === initialDay) {
          hourArr.push(item);
        }
      });

      if (initialDay === dateNow.getDate() && hourArr.length < 8) {
        const len = hourArr.length;
        for (let i = 0; i < 8 - len; i++) {
          // -- add some elements, which`s need to be 8
          hourArr.push(this._data.list[len + i]);
        }
      }
    }
    return hourArr;
  }

  getMinMaxTemp(option = 'C') {
    if (this._initialize) {
      const temps = [];
      const convTempFunc = option === 'F' ? this._convertToF : this._convertToC;
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

  // getCurrentTemp() {
  //   if (this._initialize) {
  //     return (
  //       this._convertToC(this.listDateArray[this._currentDay].main.temp).toString() || 'Unkown.'
  //     );
  //   }
  //   // return null;
  // }

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
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday'];
      return days[new Date(this.listDateArray[this._currentDay].dt_txt).getDay()];
    }
    return null;
  }
}

class Grafic {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  drawTemps(arr) {
    const k = Math.round(this.width / 8);
    const canvas = document.getElementById('grafic');

    if (canvas && arr.length > 0) {
      const { height } = this;
      const ctx = canvas.getContext('2d');
      let offsetX = k - 37.5;
      const dY = 2;
      const grad = ctx.createLinearGradient(0, 200, 0, 0);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, 'orange');

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - (k + arr[0] * dY));

      arr.forEach((i) => {
        ctx.lineTo(offsetX, height - (k + i * dY));
        offsetX += k;
      });
      ctx.lineTo(offsetX, height - (k + arr[arr.length - 1] * dY));
      ctx.lineTo(offsetX, height);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      offsetX = k - 37.5;
      ctx.fillStyle = 'white';
      arr.forEach((i) => {
        ctx.beginPath();
        ctx.arc(offsetX, height - (k + i * dY), 2, 0, Math.PI * 2);
        ctx.strokeText(i.toString(), offsetX - 5, height - (k + i * dY) - 5);
        offsetX += k;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      });
    }
  }
}

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

export { Grafic, Hourly };
export default Weather;
