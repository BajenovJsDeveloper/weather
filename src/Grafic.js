class GraficsTWP{
  init( width, height, len = 600, elem = null, grafId = 0) {
    this.width = width;
    this.height = height;
    this.elem = elem;
    this.shift = 0;
    this.k = Math.round(width / 8);
    this.grafId = grafId;
    this.len = len;
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
    //-- Draw Temperatures grafic
    if (canvas && arr.length > 0) {
      const { height } = this;
	  const ctx = canvas.getContext('2d');
	  ctx.clearRect(0, 0, this.len, this.height);
      if(this.grafId === 0){
      	  let offsetX = k;
      	  const multY = 3;      
	      ctx.strokeStyle = '#ffcc00';
	      ctx.lineWidth = 4;
	      ctx.fillStyle = '#fff5cc'; // grad;
	      ctx.beginPath();
	      //-- draw first line 
	      ctx.moveTo(0, height);
	      ctx.lineTo(0, height - arr[0] * multY);
	      //-- draw lines
	      arr.forEach((i) => {
	        ctx.lineTo(offsetX - k/2, height - i * multY);
	        offsetX += k;
	      });
	      //-- draw last line 
	      ctx.lineTo(offsetX - k - k/2, height);
	      ctx.stroke();
	      ctx.fill();
	      // -- draw temperatures
	      ctx.beginPath();
	      offsetX = k;
	      arr.forEach((i, idx) => {
	        ctx.beginPath();
	        ctx.fillStyle = '#aaa';
	        ctx.font = '12px';
	        // -- text temperatures
	        ctx.fillText(i.toString(), offsetX - (k / 2) - 7, height - (i * multY) - 8);
	        offsetX += k;
	      });
      }
      //-- Draw Precipitations grafic
      if(this.grafId === 1){
      	console.log('drawing rain...')
      	let offsetX = 0;
      	ctx.strokeStyle = 'blue';
	    ctx.lineWidth = 2;
	    ctx.fillStyle = '#d2eaff';
	    ctx.beginPath();
	    //-- draw rectangles and lines
	    arr.forEach((i) => {
	      let [corY] = i;
	      ctx.fillRect(offsetX, height - corY, k, corY);
	      ctx.beginPath();
	      ctx.moveTo(offsetX, height - corY - 1);
	      offsetX += k;
	      ctx.lineTo(offsetX, height - corY - 1);
	      ctx.stroke();
	    });
	    //-- draw text
	    offsetX = 0;
	    //-- set styles color and font height
	    ctx.fillStyle = '#195bf7';
	    ctx.font = '12px';
	    arr.forEach((i) => {
	      let [corY] = i;
	      let [pop, rain] = i;
	      pop = `${pop.toString()}%`;
	      rain = `${rain.toString()}mm`;
	      const popTextW = ctx.measureText(pop).width / 2;
	      const rainTextW = ctx.measureText(rain).width / 2;
	      ctx.fillText(pop, offsetX + k/2 - popTextW, height - corY - 5);
	      if(i[1] !== 0) 
	      	ctx.fillText(rain, offsetX + k/2 - rainTextW, height - corY - 20);
	      offsetX += k;
	    });
      }
      //-- Draw Wind dirrection grafic
      if(this.grafId === 2){
      	let offsetX = 0;
      	//-- calculate middle of arrow
      	let X = k/2;
      	let Y = this.height - k/2;
      	//-- set styles color and line width
      	ctx.strokeStyle = 'black';
	    ctx.lineWidth = 1;	
        //-- Draw wind direction and speed
      	arr.forEach(i => {
      		let [deg, text] = i;
      		text = `${text}m/s`.toString();
      		deg = Number(deg);
      		//-- draw text wind speed
      		ctx.fillStyle = '#3a3a3a';
      		ctx.fillText(text, (X - ctx.measureText(text).width / 2) + offsetX, Y - 30);
      		//-- draw arrow 
      	    ctx.beginPath();
      	    ctx.fillStyle = '#c6c6c6';
	      	ctx.translate(X + offsetX, Y);
	      	ctx.rotate((360 - deg) * Math.PI / 180);
	      	ctx.moveTo(-9,-9);
	      	ctx.lineTo(9, 0);
	      	ctx.lineTo(-9, 9);
	      	ctx.lineTo(-2, 0);
	      	ctx.lineTo(-9,-9);
	      	ctx.fill();
	      	ctx.stroke();
	      	ctx.setTransform(1, 0, 0, 1, 0, 0);
	      	offsetX += k;
	      	ctx.closePath();
      	})
      }
    }
  }
}
//-- grafics Temperature, Wind, Precipitations
const Grafic = new GraficsTWP();
export default Grafic;
