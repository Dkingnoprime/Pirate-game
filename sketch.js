const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;

var canvas, angle, tower, ground, cannon;
var balls=[]
var boats=[]
var boatAnimation=[]
var boatSpriteData, boatSpritesheet
var boatBrokeAnimation=[]
var ballSpriteData, ballSpritesheet
var ballBrokeAnimation=[]
var boatBrokeSpriteData, boatBrokeSpritesheet
var isGamerOver = false 


function preload() {
  backgroundImg = loadImage("./assets/background.gif");

  towerImage = loadImage("./assets/tower.png");

  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpritesheet = loadImage("./assets/boat/boat.png");

  boatBrokeSpriteData = loadJSON("./assets/boat/brokenBoat.json");
  boatBrokeSpritesheet = loadImage("./assets/boat/brokenBoat.png");

  ballBrokeSpriteData = loadJSON("./assets/waterSplash/waterSplash.json");
  ballBrokeSpritesheet = loadImage("./assets/waterSplash/waterSplash.png");

  soundBackGround = loadSound("./assets/background_music.mp3");

  soundCannonExplosion = loadSound("./assets/cannon_explosion.mp3");

  soundCannonWater = loadSound("./assets/cannon_water.mp3");

  soundPirateLaugh = loadSound("./assets/pirate_laugh.mp3");
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  var boatsFrames=boatSpriteData.frames;
  for (var i = 0; i < boatsFrames.length; i++) {
    var pos = boatsFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var boatsBrokeFrames=boatBrokeSpriteData.frames;
  for (var i = 0; i < boatsBrokeFrames.length; i++) {
    var pos = boatsBrokeFrames[i].position;
    var img = boatBrokeSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatBrokeAnimation.push(img);
  }

  var ballsBrokeFrames=ballBrokeSpriteData.frames;
  for (var i = 0; i < ballsBrokeFrames.length; i++) {
    var pos = ballsBrokeFrames[i].position;
    var img = ballBrokeSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    ballBrokeAnimation.push(img);
  }
  
  var options = {
    isStatic: true
  }
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);
  angleMode(DEGREES)
  angle=15;
  cannon=new Cannon(220,140,170,170,angle);


}

function draw() {
  image(backgroundImg,0,0,1200,600)
  Engine.update(engine);

  if (!soundBackGround.isPlaying()) {
    soundBackGround.play();
    soundBackGround.setVolume(0.05);
  }
  
  rect(ground.position.x, ground.position.y, width * 2, 1);
  

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();  
  
  for (var i=0; i<balls.length; i++) {
    showCannonBalls(balls[i],i)
    colisionWithBoats(i);
  }
  cannon.display()
  showBoats()
}

function keyReleased(){
  if (keyCode===32) {
    balls[balls.length-1].shoot();
    soundCannonExplosion.play()
    soundCannonExplosion.setVolume(0.2)
  }
}

function keyPressed(){
  if (keyCode===32) {
    cannonBall=new CannonBall(cannon.x,cannon.y);
    balls.push(cannonBall)
  }
}

function showCannonBalls(ball,i) {
  if (ball){
    ball.display()
    if (ball.body.position.x>=width || ball.body.position.y>=height-50) {
      if (!ball.isSink) {
        //o som estourado é proprosital
        soundCannonWater.play()
        soundCannonWater.setVolume(0.1)
        ball.remove(i)
      }
    }
  }
}

function showBoats() {
  if (boats.length>0){
    if (boats[boats.length-1]===undefined || boats[boats.length -1].body.position.x<width-300) {
      var positions=[-20,-40,-60,-70];
      position=random(positions);
      boat=new Boat(width,height-100,170,170,position,boatAnimation);
      boats.push(boat);
    }

    for(var i=0; i<boats.length;i++){
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body,{x:-0.9, y:0})
        boats[i].display()
        boats[i].animate()
        var collision = Matter.SAT.collides(tower,boats[i].body) 
        if (collision.collided && !boats[i].isBroken) {
        isGameOver = true 
        gameOver()
        }
      }
      else{
        boats[i]
      }
      
    }
  }
  else{
    boat=new Boat(width-79,height-60,170,170,-80,boatAnimation);
    boats.push(boat);
  }
}

function colisionWithBoats(index) {
  for(var i=0; i<boats.length; i++) {
    if (balls[index]!==undefined && boats[i]!=undefined) {
      var colision= Matter.SAT.collides(balls[index].body,boats[i].body)
      if (colision.collided){
        boats[i].remove(i)
        Matter.World.remove(world,balls[index].body)
        delete balls[index]
      }
    }
  }
}

function gameOver() {
  swal({
    title: "Game Over",
    text: "Thanks for gaming",
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "150x150",
    confirmButtonText: "Reload",
  },
function (isConfirm) {
  if(isConfirm){
    location.reload()
  }
})

}