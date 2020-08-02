import React from 'react';
import { GrafTWP } from '../Interface/Interface'

const GRAF_TEMP = 0;
const GRAF_RAIN = 1;
const GRAF_WIND = 2;
const SCALE_NUMBER = 3;
const INITIAL_WIDTH = 600;
const INITIAL_HEIGHT = 130;
const INITIAL_LENGTH = 5;
const INITIAL_SHIFT = 0;
const NUMBER_OF_TIME_SHIFTS = 8;


class GraficsTWP {
   _width: number = 0;;

   _height: number = 0;

   _elem:any;

   _shift: number = 0;

   _k: number = 0;

   _grafId: number = 0;

   _len: number = 0;

  init(elem: React.RefObject<HTMLCanvasElement> | null, grafId = GRAF_TEMP,) {
    this._width = INITIAL_WIDTH;
    this._height = INITIAL_HEIGHT;
    this._elem = elem;
    this._shift = INITIAL_SHIFT;
    this._k = Math.round(INITIAL_WIDTH / NUMBER_OF_TIME_SHIFTS);
    this._grafId = grafId;
    this._len = INITIAL_WIDTH * INITIAL_LENGTH;
    // -- setup canvas width and heigth
    if(this._elem){
      this._elem.width = INITIAL_WIDTH * INITIAL_LENGTH;
      this._elem.height = INITIAL_HEIGHT;
    }   
  }

  slide(id: number, tshift: number) {
    if (this._elem) {
      let shiftX;
      if (tshift > 0 && id !== 0) {
        shiftX = -(this._width * (id - 1) + tshift * this._k);
      } else {
        shiftX = -this._width * id;
      }
      this._elem.style = `left:${shiftX}px`;
    }
  }
  _DrawTemperaturesGrafic(arr:Array<Array<number>> | Array<number>,ctx:any){
    const [ k, height ] = [ this._k, this._height ];
    let offsetX = k;
    let multY = SCALE_NUMBER;
    // arr = [-45, -47, -33, -20, 0, -7, -5,-15,10]
    // arr = [27, 30, 18, 45, 33, 40, 15, 10, 39];
    // arr = [ 10, 15, 5, 22, 13, 31, 18, 30, 22]

    const arr1 = (arr as Array<number>).map(i => i);
    let minimum = Math.min(...arr1);
    const MAX = Math.max(...arr1);
    const MIN = Math.min(...arr1);
    // -- zooming grafic if temperatures > 45 deg or < -30 deg.
    if (MAX > 30 && MAX < 45) multY = 2;
    if (MIN <= 0 && MIN >= -30) multY = 2;
    if (MAX >= 45 || MIN < -30) multY = 1;
    // -- seek minimum in temps array (it is for temperatures which low then 0 deg.)
    if (minimum < 0) minimum = Math.abs(minimum) * multY + 10;
    else minimum = 10;
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#fff5cc';
    ctx.beginPath();
    // -- draw first line
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - arr1[0] * multY - minimum);
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
    arr1.forEach((i: number, idx: number) => {
      ctx.beginPath();
      if (i <= 0) ctx.fillStyle = 'blue';
      else if (i > 32) ctx.fillStyle = 'red';
      else ctx.fillStyle = '#aaa';
      ctx.font = '12px';
      // -- text temperatures
      ctx.fillText(i.toString(), offsetX - k / 2, height - i * multY - 8 - minimum);
      offsetX += k;
    });
    return [ multY, minimum ];
  }

  _DrawPrecipitationsGrafic(arr:Array<Array<number>> | Array<number>, ctx:any){
    const [ k, height ] = [ this._k, this._height ];
    let offsetX = 0;
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#d2eaff';
    ctx.beginPath();
    // -- draw rectangles and lines
    arr.forEach((i: any) => {
      const [corY] = i;
      ctx.fillRect(offsetX, height - corY, k, corY);
      ctx.beginPath();
      ctx.moveTo(offsetX, height - corY - 1);
      offsetX += k;
      ctx.lineTo(offsetX, height - corY - 1);
      ctx.stroke();
    });
    // -- draw text
    offsetX = 0;
    // -- set styles color and font height
    ctx.fillStyle = '#195bf7';
    ctx.font = '12px';
    arr.forEach((i: any) => {
      const [corY] = i;
      let [pop, rain] = i;
      pop = `${pop.toString()}%`;
      rain = `${rain.toString()}mm`;
      ctx.textAlign = 'center';
      ctx.fillText(pop, offsetX + k / 2, height - corY - 5);
      if (i[1] !== 0) ctx.fillText(rain, offsetX + k / 2, height - corY - 20);
      offsetX += k;
    });
  }
  _DrawWindSpeedDirectionGrafic(arr:Array<Array<number>> | Array<number>, ctx:any){
    let offsetX = 0;
    const [ k, height ] = [ this._k, this._height ];
    // -- calculate middle of arrow
    const X = k / 2;
    const Y = height - k / 2;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    // -- Draw wind direction and speed
    arr.forEach((i: any) => {
      let [deg, text] = i;
      text = `${text}m/s`.toString();
      deg = Number(deg);
      // -- draw text wind speed
      ctx.fillStyle = '#3a3a3a';
      ctx.textAlign = 'center';
      ctx.fillText(text, X + offsetX, Y - 30);
      // -- draw arrow
      ctx.beginPath();
      ctx.fillStyle = '#c6c6c6';
      ctx.translate(X + offsetX, Y);
      ctx.rotate(((360 - deg) * Math.PI) / 180);
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
    // const { k } = this;
    const canvas = this._elem;
    if (canvas.width && arr.length > 0) {
      const [ height, len ] = [ this._height, this._len ];
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, len, height);

      if (this._grafId === GRAF_TEMP) {
        this._DrawTemperaturesGrafic(arr, ctx);
      }
      if (this._grafId === GRAF_RAIN) {
        this._DrawPrecipitationsGrafic(arr, ctx);
      }
      if (this._grafId === GRAF_WIND) {
        this._DrawWindSpeedDirectionGrafic(arr,ctx);
      }
      return true;
    }
    return false;
  }
}
// -- grafics Temperature, Wind, Precipitations
const Grafic: GrafTWP = new GraficsTWP();
export default Grafic;
