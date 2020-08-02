import React from 'react';
import { GraficTempWindPop } from '../Interface/Interfaces';

const GRAF_TEMP = 0;
const GRAF_RAIN = 1;
const GRAF_WIND = 2;
const SCALE_HEIGHT = 3;
const SCALE_MEDIUM = 2;
const SCALE_LOW = 1;
const INITIAL_WIDTH = 600;
const INITIAL_HEIGHT = 130;
const INITIAL_LENGTH = 5;
const INITIAL_SHIFT = 0;
const NUMBER_OF_TIME_SHIFTS = 8;
const ZERO_DEGREES = 0;
const START_OFFSET = 0;
const START_X = 0;
const START_Y = 0;
const FONT_SIZE = '12px';
const LINE_COLOR_1 = '#ffcc00';
const FILL_COLOR_1 = '#fff5cc';
const FILL_COLOR_2 = '#d2eaff';
const FILL_COLOR_3 = '#195bf7';
const FILL_COLOR_4 = '#3a3a3a';
const FILL_COLOR_5 = '#c6c6c6';
const FILL_COLOR_GRAY = '#aaa';
const COLR_BLUE = 'blue';
const COLOR_RED = 'red';
const COLOR_BLACK = 'black';
const LINE_THIN = 1;
const LINE_MEDIUM = 2;
const LINE_BOLD = 4;
const MARGIN_BOTTOM = 10;
const M_BOTTOM_RAIN = 20;
const M_BOTTOM_POP = 5;
const M_ABOVE_LINE = 1;
const M_BOTTOM_WIND = 30;
const TEMP_HOT = 31;
const TEMP_COLD = 0;
const ZONE_WARM = 30;
const ZONE_HOT = 45;
const ZONE_ZERO = 0;
const ZONE_COLD = -30;
const CIRCLE_DEGREE = 360;
const CIRCLE_DEGREE_HALF = 180;

class GraficsTWP implements GraficTempWindPop {
  _width = 0;

  _height = 0;

  _elem: any;

  _shift = 0;

  _k = 0;

  _grafId = 0;

  _len = 0;

  init(elem: React.RefObject<HTMLCanvasElement> | null, grafId = GRAF_TEMP): void {
    this._width = INITIAL_WIDTH;
    this._height = INITIAL_HEIGHT;
    this._elem = elem;
    this._shift = INITIAL_SHIFT;
    this._k = Math.round(INITIAL_WIDTH / NUMBER_OF_TIME_SHIFTS);
    this._grafId = grafId;
    this._len = INITIAL_WIDTH * INITIAL_LENGTH;
    // -- setup canvas width and heigth
    if (this._elem) {
      this._elem.width = INITIAL_WIDTH * INITIAL_LENGTH;
      this._elem.height = INITIAL_HEIGHT;
    }
  }

  slide(id: number, tshift: number): void {
    if (this._elem) {
      let shiftX: number;
      if (tshift > 0 && id !== 0) {
        shiftX = -(this._width * (id - 1) + tshift * this._k);
      } else {
        shiftX = -this._width * id;
      }
      this._elem.style = `left:${shiftX}px`;
    }
  }

  _DrawTemperaturesGrafic(arr: Array<Array<number>> | Array<number>, ctx: any) {
    const [k, height] = [this._k, this._height];
    let offsetX: number = k;
    let multY = SCALE_HEIGHT;
    // arr = [-45, -47, -33, -20, 0, -7, -5,-15,10]
    // arr = [27, 30, 18, 45, 33, 40, 15, 10, 39];
    // arr = [ 10, 15, 5, 22, 13, 31, 18, 30, 22]

    const arr1 = (arr as Array<number>).map(i => i);
    let minimum: number = Math.min(...arr1);
    const MAX: number = Math.max(...arr1);
    const MIN: number = Math.min(...arr1);
    const [startPoint] = arr1;
    // -- zooming grafic if temperatures > 45 deg or < -30 deg.
    if (MAX > ZONE_WARM && MAX < ZONE_HOT) multY = SCALE_MEDIUM;
    if (MIN <= ZONE_ZERO && MIN >= ZONE_COLD) multY = SCALE_MEDIUM;
    if (MAX >= ZONE_HOT || MIN < ZONE_COLD) multY = SCALE_LOW;
    // -- seek minimum in temps array (it is for temperatures which low then 0 deg.)
    if (minimum < ZERO_DEGREES) minimum = Math.abs(minimum) * multY + MARGIN_BOTTOM;
    else minimum = MARGIN_BOTTOM;
    ctx.strokeStyle = LINE_COLOR_1;
    ctx.lineWidth = LINE_BOLD;
    ctx.fillStyle = FILL_COLOR_1;
    ctx.beginPath();
    // -- draw first line
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - startPoint * multY - minimum);
    // -- draw lines
    arr1.forEach((i: number) => {
      ctx.lineTo(offsetX - k / 2, height - i * multY - minimum);
      offsetX += k;
    });
    // -- draw last line
    ctx.lineTo(offsetX - k - k / 2, height);
    ctx.stroke();
    ctx.fill();
    // -- draw temperatures
    ctx.textAlign = 'center';
    offsetX = k;
    arr1.forEach((x: number) => {
      ctx.beginPath();
      if (x <= TEMP_COLD) ctx.fillStyle = COLR_BLUE;
      else if (x > TEMP_HOT) ctx.fillStyle = COLOR_RED;
      else ctx.fillStyle = FILL_COLOR_GRAY;
      ctx.font = FONT_SIZE;
      // -- text temperatures
      ctx.fillText(x.toString(), offsetX - k / 2, height - x * multY - 8 - minimum);
      offsetX += k;
    });
  }

  _DrawPrecipitationsGrafic(arr: Array<Array<number>> | Array<number>, ctx: any): void {
    const [k, height] = [this._k, this._height];
    let offsetX = START_OFFSET;
    ctx.strokeStyle = COLR_BLUE;
    ctx.lineWidth = LINE_MEDIUM;
    ctx.fillStyle = FILL_COLOR_2;
    ctx.beginPath();
    // -- draw rectangles and lines
    arr.forEach((i: any) => {
      const [corY] = i;
      ctx.fillRect(offsetX, height - corY, k, corY);
      ctx.beginPath();
      ctx.moveTo(offsetX, height - corY - M_ABOVE_LINE);
      offsetX += k;
      ctx.lineTo(offsetX, height - corY - M_ABOVE_LINE);
      ctx.stroke();
    });
    // -- draw text
    offsetX = START_OFFSET;
    // -- set styles color and font height
    ctx.fillStyle = FILL_COLOR_3;
    ctx.font = FONT_SIZE;
    arr.forEach((i: any) => {
      const [corY, chanceOfRain] = i;
      let [pop, rain] = i;
      pop = `${pop.toString()}%`;
      rain = `${rain.toString()}mm`;
      ctx.textAlign = 'center';
      ctx.fillText(pop, offsetX + k / 2, height - corY - M_BOTTOM_POP);
      if (chanceOfRain > 0) {
        ctx.fillText(rain, offsetX + k / 2, height - corY - M_BOTTOM_RAIN);
      }
      offsetX += k;
    });
  }

  _DrawWindSpeedDirectionGrafic(arr: Array<Array<number>> | Array<number>, ctx: any) {
    let offsetX = START_OFFSET;
    const [k, height] = [this._k, this._height];
    // -- calculate middle of arrow
    const X = k / 2;
    const shiftY = M_BOTTOM_WIND;
    const Y = height - k / 2;
    ctx.strokeStyle = COLOR_BLACK;
    ctx.lineWidth = LINE_THIN;
    // -- Draw wind direction and speed
    arr.forEach((i: any) => {
      let [deg, text] = i;
      text = `${text}m/s`.toString();
      deg = Number(deg);
      // -- draw text wind speed
      ctx.fillStyle = FILL_COLOR_4;
      ctx.textAlign = 'center';
      ctx.fillText(text, X + offsetX, Y - shiftY);
      // -- draw arrow
      ctx.beginPath();
      ctx.fillStyle = FILL_COLOR_5;
      ctx.translate(X + offsetX, Y);
      ctx.rotate(((CIRCLE_DEGREE - deg) * Math.PI) / CIRCLE_DEGREE_HALF);
      // -- darw arrow
      ctx.moveTo(-9, -9);
      ctx.lineTo(9, 0);
      ctx.lineTo(-9, 9);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-9, -9);
      ctx.fill();
      ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      offsetX += k;
      ctx.closePath();
    });
  }

  draw(arr: Array<Array<number>> | Array<number>) {
    const canvas = this._elem;
    if (canvas.width && arr.length > 0) {
      const [height, len] = [this._height, this._len];
      const ctx = canvas.getContext('2d');
      ctx.clearRect(START_X, START_Y, len, height);

      if (this._grafId === GRAF_TEMP) {
        this._DrawTemperaturesGrafic(arr, ctx);
      }
      if (this._grafId === GRAF_RAIN) {
        this._DrawPrecipitationsGrafic(arr, ctx);
      }
      if (this._grafId === GRAF_WIND) {
        this._DrawWindSpeedDirectionGrafic(arr, ctx);
      }
      return true;
    }
    return false;
  }
}
// -- grafics Temperature, Wind, Precipitations
const Grafic: GraficTempWindPop = new GraficsTWP();

export default Grafic;
