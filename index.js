//CONTANTS
const CENTER = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  center: function () {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
  },
};
window.addEventListener("load", function () {
  //CANVAS SETUP
  console.log("loaded");
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let acx = 0;
  let acy = 0;

  //ANIMATION
  let lastTime = 0;
  let timer = 0;
  const fps = 60;
  const nextFrame = 1000 / fps;

  const ball = new Ball(CENTER.x, CENTER.y, 50, null, null, acx, acy);
  const lines = new Lines();
  let acl = new Accelerometer({ frequency: 60 });
  acl.addEventListener("reading", () => {
    const acx2 = acl.x * acl.x;
    const acy2 = acl.y * acl.y;
    const acz2 = acl.z * acl.z;

    const acx = Math.atan(acl.x / Math.sqrt(acy2 + acz2));
    const acy = Math.atan(acl.y / Math.sqrt(acx2 + acz2));
    ball.setGravity(-acx, acy);

    lines.setAngle(acx, acy);
  });

  acl.start();

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //console.log(((1 / timer) * 1000).toFixed(2));
      //CODE

      lines.draw(ctx);
      ball.draw(ctx);
      // END
      timer = 0;
      frames = 0;
    } else {
      timer += deltaTime;
    }
    frames++;
    requestAnimationFrame(animate);
  }
  animate(0);

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CENTER.center();
  });
});

class Ball {
  constructor(x, y, r, vx = 0, vy = 0, gx = 0, gy = 0.9, damping = 0.6) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
    this.gx = gx;
    this.gy = gy;
    this.damping = damping;
  }
  #animate() {
    // X
    if (this.x + this.r >= window.innerWidth) {
      this.vx = -this.vx * this.damping;
      this.x = window.innerWidth - this.r;
    } else if (this.x - this.r <= 0) {
      this.vx = -this.vx * this.damping;
      this.x = this.r;
    }

    // Y
    if (this.y + this.r >= window.innerHeight) {
      this.vy = -this.vy * this.damping;
      this.y = window.innerHeight - this.r;
    } else if (this.y - this.r <= 0) {
      this.vy = -this.vy * this.damping;
      this.y = this.r;
    }

    this.vx += this.gx;
    this.vy += this.gy;

    this.x += this.vx;
    this.y += this.vy;
  }
  setGravity(gx, gy) {
    this.gx = gx;
    this.gy = gy;
  }
  draw(context) {
    context.fillStyle = "white";
    context.strokeWidth = 3;
    context.beginPath();
    context.ellipse(this.x, this.y, this.r, this.r, 0, 0, Math.PI * 2);
    context.fill();
    this.#animate();
  }
}

class Lines {
  constructor() {
    this.anglex = 0;
    this.angley = 0;
  }
  setAngle(anglex, angley) {
    this.anglex = -anglex;
    this.angley = angley;
  }
  draw(context) {
    context.lineWidth = 1;
    context.setLineDash([5, 5]);

    context.beginPath();
    context.strokeStyle = "green";
    context.moveTo(0, CENTER.y);
    context.lineTo(window.innerWidth, CENTER.y);
    context.stroke();

    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(CENTER.x, 0);
    context.lineTo(CENTER.x, window.innerHeight);
    context.stroke();

    context.setLineDash([]);

    context.translate(CENTER.x, CENTER.y);
    context.rotate(this.anglex);
    context.beginPath();
    context.strokeStyle = "green";
    context.moveTo(-5000, 0);
    context.lineTo(5000, 0);

    context.stroke();

    context.moveTo(0, -5000 / 2);
    context.lineTo(0, 5000);

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.translate(CENTER.x, CENTER.y);
    context.rotate(Math.PI / 2 + this.angley);
    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(-5000, 0);
    context.lineTo(5000, 0);

    context.stroke();

    context.moveTo(0, -5000 / 2);
    context.lineTo(0, 5000);

    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}
