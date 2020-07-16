
class Grafic {
  constructor(width, height, elem) {
    this.width = width;
    this.height = height;
    this.elem = elem;
  }

  drawTemps(arr) {
    const k = Math.round(this.width / 8);
    const canvas = this.elem;

    if (canvas && arr.length > 0) {
      const { height } = this;
      const ctx = canvas.getContext('2d');
      let offsetX = k - 1.5;
      const dY = 1.5;

      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#fff5cc'; //grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - (arr[0] * dY));
      //-- draw lines
      arr.forEach((i) => {
        ctx.lineTo(offsetX, height - (i * dY));
        offsetX += k;
      });
      ctx.lineTo(offsetX, height - (arr[arr.length - 1] * dY));
      ctx.lineTo(offsetX, height);
      ctx.stroke();
      ctx.fill();
      // ctx.closePath();

      ctx.beginPath();
      offsetX = k - 1.5;
      ctx.fillStyle = 'white';
      //-- draw arcs and temps
      arr.forEach((i) => {
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
     	ctx.lineWidth = 0.5;
        ctx.strokeText(i.toString(), offsetX - 5, height - (i * dY) - 5);
        offsetX += k; 
     	ctx.stroke();
      });
    }
  }
}
export default Grafic