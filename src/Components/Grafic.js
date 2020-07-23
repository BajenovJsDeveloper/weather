class GraficsTWP {
  init(width, height, len = 1, elem = null, grafId = 0) {
    this.width = width;
    this.height = height;
    this.elem = elem;
    this.shift = 0;
    this.k = Math.round(width / 8);
    this.grafId = grafId;
    this.len = width * len;
    // -- setup canvas width and heigth
    this.elem.width = width * len;
    this.elem.height = height;
  }

  slide(id, tshift) {
    if (this.elem) {
      let shiftX;
      if (tshift > 0 && id !== 0) {
        shiftX = -(this.width * (id - 1) + tshift * this.k);
      } else {
        shiftX = -this.width * id;
      }
      this.elem.style = `left:${shiftX}px`;
    }
  }

  draw(arr) {
    const { k } = this;
    const canvas = this.elem;
    // arr = [-45, -47, -33, -20, 0, -7, -5,-15,10]
    if (canvas && arr.length > 0) {
      const { height } = this;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.len, this.height);
      // -- Draw Temperatures grafic
      if (this.grafId === 0) {
        let offsetX = k;
        let multY = 3;
        let minimum = Math.min(...arr);
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        // -- zooming grafic if temperatures > 45 deg or < -30 deg.
        if (max > 30 && max < 45) multY = 2;
        if (min <= 0 && min >= -30) multY = 2;
        if (max >= 45 || min < -30) multY = 1;
        // -- seek minimum in temps array (it is for temperatures which low then 0 deg.)
        if (minimum < 0) minimum = Math.abs(minimum) * multY + 10;
        else minimum = 10;

        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#fff5cc'; // grad;
        ctx.beginPath();
        // -- draw first line
        ctx.moveTo(0, height);
        ctx.lineTo(0, height - arr[0] * multY - minimum);
        // -- draw lines
        // console.log(multY, minimum);
        arr.forEach((i) => {
          ctx.lineTo(offsetX - k / 2, height - i * multY - minimum);
          offsetX += k;
        });
        // -- draw last line
        ctx.lineTo(offsetX - k - k / 2, height);
        ctx.stroke();
        ctx.fill();
        // -- draw temperatures
        // ctx.beginPath();
        ctx.textAlign = 'center';
        offsetX = k;
        arr.forEach((i, idx) => {
          ctx.beginPath();
          // -- color blue if temp <= 0
          if (i <= 0) ctx.fillStyle = 'blue';
          // -- color red if temp > 32
          else if (i > 32) ctx.fillStyle = 'red';
          // -- color default
          else ctx.fillStyle = '#aaa';
          ctx.font = '12px';
          // -- text temperatures
          ctx.fillText(i.toString(), offsetX - k / 2, height - i * multY - 8 - minimum);
          offsetX += k;
        });
        return [multY, minimum];
      }
      // -- Draw Precipitations grafic
      if (this.grafId === 1) {
        // arr=[[10,1],[90,3],[100,5],[0,0],[0,0],[3,0],[10,0],[50,1]];
        let offsetX = 0;
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#d2eaff';
        ctx.beginPath();
        // -- draw rectangles and lines
        arr.forEach((i) => {
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
        arr.forEach((i) => {
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
      // -- Draw Wind dirrection grafic
      if (this.grafId === 2) {
        let offsetX = 0;
        // -- calculate middle of arrow
        const X = k / 2;
        const Y = this.height - k / 2;
        // -- set styles color and line width
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        // -- Draw wind direction and speed
        arr.forEach((i) => {
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
      return true;
    }
    return false;
  }
}
// -- grafics Temperature, Wind, Precipitations
const Grafic = new GraficsTWP();
export default Grafic;
