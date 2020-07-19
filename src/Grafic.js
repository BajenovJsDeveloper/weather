class Graf {
  init(width, height, elem = null) {
    this.width = width;
    this.height = height;
    this.elem = elem;
    this.shift = 0;
    this.k = Math.round(width / 8);
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

  drawTemps(arr) {
    const { k } = this;
    const canvas = this.elem;

    if (canvas && arr.length > 0) {
      const { height } = this;
      const ctx = canvas.getContext('2d');
      let offsetX = k;
      const deltaY = 1.5;
      ctx.clearRect(0, 0, this.width, this.height);

      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#fff5cc'; // grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - arr[0] * deltaY);
      // -- draw lines
      arr.forEach((i) => {
        ctx.lineTo(offsetX, height - i * deltaY);
        offsetX += k;
      });
      // ctx.lineTo(offsetX, height - (arr[arr.length - 1] * dY));
      ctx.lineTo(offsetX - k, height);
      ctx.stroke();
      ctx.fill();
      // ctx.closePath();

      ctx.beginPath();
      offsetX = k;
      ctx.fillStyle = 'white';
      // -- draw arcs and temps
      arr.forEach((i, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.5;
        // -- draw temperatures
        ctx.strokeText(i.toString(), offsetX - k / 2, height - i * deltaY - 8);
        // -- draw numbers
        // ctx.strokeText(idx.toString(), offsetX - k/2, height - (i * deltaY) - 20);
        ctx.stroke();
        // -- draw circles
        // ctx.beginPath();
        // ctx.fillStyle = 'black';
        // ctx.arc(offsetX, height - (i * deltaY),3,Math.PI * 2,false);
        // ctx.fill();
        offsetX += k;
      });
    }
  }
}
const Grafic = new Graf();
export default Grafic;
