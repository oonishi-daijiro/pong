 const field_data = {
   width: (9000) + 'px',
   height: (5500) + 'px',
   color: '#000033',
   canvas_height: 550,
   canvas_width: 900
 };

 const paddle_data = {
   right_x: 850,
   left_x: 25,
   width: 30,
   height: 100,
   color: '#FFFFFF',
 };
 const ball_data = {
   color: '#FFFFFF',
   width: 40,
   height: 40,
   draw: function () {
     field.fillRect(canvas.width / 2 - ball_data.width / 2, canvas.height / 2 - ball_data.height / 2, ball_data.width, ball_data.height);
   },
   ball_speed: 12.0,
   re_attack_L: 70,
   re_attack_R: 800
 };

 const centerline_data = {
   width: 3,
   height: 550,
   color: '#FFFFFF',
   draw: function (interbal) {
     field.fillRect(450, 0, centerline_data.width, centerline_data.height);
     for (let i = 0; i <= 20; i++) {
       field.clearRect(450, interbal, 6, 30);
       interbal += 55;
     };
   }
 };

 const sounds = {
   ref: add_sound('sounds/ref_sound.mp3')
 }

 function add_sound(path) {
   let data = new Audio();
   data.src = path;
   return data;
 }
 let FPS = 0;
 const get_fps = () => {
   setInterval(() => {
     console.log(FPS);
     FPS = 0;
   }, 1000);
 }
 get_fps()
 const canvas = document.getElementById('canvas');
 const field = canvas.getContext('2d');
 const body = document.getElementById('body');
 //eventlistener
 canvas.addEventListener('click', (function (info) { //Watch the mouse posision. it will be remove leter
   let rec = info.target.getBoundingClientRect();
   let x = info.clientX - Math.floor(rec.left);
   let y = info.clientY - Math.floor(rec.top);
   console.log(x, y);
 }), false);
 document.addEventListener('keydown', main, false);
 if (!canvas.getContext) {
   window.alert("PLEASE USE SUPPORTED CANVAS BROWSER");
 }

 canvas.width = field_data.canvas_width
 canvas.height = field_data.canvas_height
 field.fillStyle = centerline_data.color;
 //Draw canvas
 window.onload = (() => {
   field.fillRect(paddle_data.right_x, 225, paddle_data.width, paddle_data.height);
   field.fillRect(paddle_data.left_x, 225, paddle_data.width, paddle_data.height);
 });
 //drawing paddle at center when open this page
 centerline_data.draw(-20);
 ball_data.draw(55);

 function random_num(max, min) {
   let random = Math.floor(Math.random() * (max - min + 1) + min);
   return random;
 }

 function main() {
   let points = {
     left: 0,
     right: 0
   }
   let ball = {
     x: canvas.width / 2,
     y: canvas.height / 2,
     speed: ball_data.ball_speed,
     angle: 180,
     radians: 0,
     vx: 0,
     vy: 0,
     ref_one_only: true
   }
   let moveball_aniframe
   let aniframe_r
   let aniframe_l
   let keydata_r = ''
   let keydata_l = ''
   let paddle_position = {
     right: canvas.height / 2,
     left: canvas.height / 2
   }
   random_num(1, 0) === 1 ? ball.angle = 180 : ball.angle = 360
   let ref_randR = true
   let ref_randL = true
   let reflection_once = true
   document.addEventListener('keydown', () => { //right side

     if (event.key === 'o') {
       keydata_r = 1
       ref_randR = true
     } else if (event.key === 'l') {
       keydata_r = 2
       ref_randR = true
     }
   }, false)
   document.addEventListener('keyup', () => { //right side
     if (event.key === 'o' || event.key === 'l') {
       keydata_r = 3
       ref_randR = false
     }

   }, false)
   document.addEventListener('keydown', () => { //left side
     if (event.key === 'q') {
       keydata_l = 1
       ref_randL = true
     } else if (event.key === 'a') {
       keydata_l = 2
       ref_randL = true
     }
   }, false)
   document.addEventListener('keyup', () => { //left side
     if (event.key === 'q' || event.key === 'a') {
       keydata_l = 3
       ref_randL = false
     }
   }, false)

   function right_paddle_draw() {
     field.clearRect(paddle_data.right_x, paddle_position.right - paddle_data.height / 2, paddle_data.width + 3, canvas.height + 3);
     if (keydata_r === 1) {
       paddle_position.right -= 10
     } else if (keydata_r === 2) {
       paddle_position.right += 10
     } else if (keydata_r = 3) {
       paddle_position.right += 0
     }
     if (paddle_position.right <= 60) {
       paddle_position.right = 60
     } else if (paddle_position.right >= 490) {
       paddle_position.right = 490
     }
     field.fillRect(paddle_data.right_x, paddle_position.right - 50, paddle_data.width, paddle_data.height);
     aniframe_r = requestAnimationFrame(right_paddle_draw)
   }

   function left_paddle_draw() {
     field.clearRect(paddle_data.left_x, paddle_position.left - paddle_data.height / 2, paddle_data.width, canvas.height);
     if (keydata_l === 1) {
       paddle_position.left -= 10
     } else if (keydata_l === 2) {
       paddle_position.left += 10
     } else if (keydata_l = 3) {
       paddle_position.left += 0
     }
     if (paddle_position.left <= 60) {
       paddle_position.left = 60
     } else if (paddle_position.left >= 490) {
       paddle_position.left = 490
     }
     field.fillRect(paddle_data.left_x, paddle_position.left - 50, paddle_data.width, paddle_data.height);
     aniframe_l = requestAnimationFrame(left_paddle_draw)
   }

   right_paddle_draw()
   left_paddle_draw()

   function ball_update() {
     ball.radians = ball.angle * Math.PI / 180;
     ball.vx = Math.cos(ball.radians) * ball.speed;
     ball.vy = Math.sin(ball.radians) * ball.speed;
   }
   ball_update();

   function reflection() {
     if ((ref_randL || ref_randR) && reflection_once) {
       if (ball.angle <= 180) {
         ball.angle = 180 - ball.angle + random_num(15, 0);
       } else if (ball.angle > 180) {
         ball.angle = 180 - ball.angle - random_num(15, 0);
       }
       reflection_once = false
       return
     }
     if (ball.angle <= 180 && reflection_once) {
       reflection_once = false
       ball.angle = 180 - ball.angle
     } else if (ball.angle > 180 && reflection_once) {
       reflection_once = false
       ball.angle = 180 - ball.angle
     }
   }

   function judge() {
     let left_value = document.getElementById('points_left')
     let right_value = document.getElementById('points_right')
     left_value.firstChild.nodeValue = points.left
     right_value.firstChild.nodeValue = points.right
   }

   function re_start() {
     let toggle = 0
     let interval
     let timer = 0

     function first_attack() {
       left_paddle_draw()
       right_paddle_draw()

       function re_attack(re_attack, angle) {
         let aniframe
         let ball_y
         const ball_move = () => {
           field.clearRect(re_attack, 0, ball_data.width, canvas.height)
           field.clearRect(re_attack, 0, ball_data.width, canvas.height)
           if (angle === 180) {
             ball_y = paddle_position.left - ball_data.height / 2;
             field.fillRect(re_attack, ball_y, ball_data.width, ball_data.height)
           } else if (angle === 360) {
             ball_y = paddle_position.right - ball_data.height / 2;
             field.fillRect(re_attack, ball_y, ball_data.width, ball_data.height)
           }
           aniframe = requestAnimationFrame(ball_move)
         }
         ball_move()

         function attack() {
           if (event.key === ' ') {
             field.clearRect(ball_data.re_attack_L, ball_y, ball_data.width, ball_data.height)
             setTimeout(() => {
               cancelAnimationFrame(aniframe)
             }, true);
             ref_randL = false
             ref_randR = false
             ball.y = ball_y + 25
             ball.x = re_attack + 25
             ball.angle = angle
             play()
             document.removeEventListener('keydown', attack, false)
           }
         }
         document.addEventListener('keydown', attack, false)

       }
       if (ball.x < canvas.width / 2) {
         re_attack(ball_data.re_attack_L, 180)
       } else if (ball.x > canvas.width / 2) {
         re_attack(ball_data.re_attack_R, 360)
       }
     }
     interval = setInterval(() => {
       if (timer === 3) {
         first_attack()
         clearInterval(interval)
       }
       if (toggle === 0) {
         field.fillRect(ball.x - 25, ball.y - 25, ball_data.width, ball_data.height)
         timer++
         toggle = 1
       } else if (toggle === 1) {
         field.clearRect(ball.x - 27, ball.y - 27, 50, 50);
         toggle = 0
       }
     }, 300);
   }

   function play() { //Rooping this function
     FPS++
     document.removeEventListener('keydown', main, false)
     field.clearRect(ball.x - 27, ball.y - 27, 50, 50);
     ball.x += ball.vx;
     ball.y += ball.vy;
     let x_floor = Math.floor(ball.x);
     let y_floor = Math.floor(ball.y);
     centerline_data.draw(-20);
     field.fillRect(x_floor - 25, y_floor - 25, ball_data.width, ball_data.height);
     if (y_floor <= 25 || y_floor >= 525) {
       setTimeout(() => {
        //  sounds.ref.play();
       }, true);
       ball.angle = 360 - ball.angle;
       ball_update();
     }
     if (x_floor + ball_data.width / 2 > 890 || x_floor - ball_data.width / 2 < 10) {
       setTimeout(() => {
         cancelAnimationFrame(moveball_aniframe)
         cancelAnimationFrame(aniframe_l)
         cancelAnimationFrame(aniframe_r)
         ball.x > canvas.width / 2 ? points.left++ : points.right++
         judge()
         re_start()
         console.log(points);
       }, true);
     }
     if (x_floor + ball_data.width / 2 > 850 && x_floor + ball_data.width / 2 < 870) { //right side
       if (y_floor + ball_data.height / 2 >= paddle_position.right - paddle_data.height / 2 && y_floor - ball_data.height / 2 < paddle_position.right + paddle_data.height / 2) {
         reflection()
         ball_update()
         setTimeout(() => {
          //  sounds.ref.play();
         }, true);
       }
     }
     if (x_floor - ball_data.width / 2 < 66 && x_floor - ball_data.width / 2 > 30) { //left side
       if (y_floor + ball_data.height / 2 >= paddle_position.left - paddle_data.height / 2 && y_floor - ball_data.height / 2 < paddle_position.left + paddle_data.height / 2) {
         reflection()
         ball_update()
         setTimeout(() => {
          //  sounds.ref.play();
         }, true);
       }
     }
     if (x_floor < 800 && x_floor > 200) {
       reflection_once = true
     }
     moveball_aniframe = requestAnimationFrame(play);
   } //move ball func's scope
   play();
 } //game proccecing's scope
