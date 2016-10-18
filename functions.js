// The functions used by wall_generator at runtime:


/////////////////////// Setup code: ///////////////////////////

function startup() {
  fill(255,255,255); // Set the text color
  textSize(24);
  text("This program attempts to create abstract glitch wallpapers.",100,140);
  text("It generates these through user awe and frustration.",100,165);
  text("To play:",125,200);
  text("NEW: Clicking the mouse will affect the color of local squares!",150,225);
  text("NEW: The 'z' and 'x' keys change the radius of that effect.",150,250);
  text("NEW: The 'c' key will wash the board with new colors.",150,275);
  text("< / > adjusts the color variance.",150,300);
  text("^ / v shifts the speed of the ball.",150,325);
  text("The 's' key will save a .png image (browsers will vary)",150,350);
  text("Hit 'ENTER' to begin",100,400);
}


  
/////////////////////// Ball code: ////////////////////////////

// Draw the ellipse
function renderBall() {
  // Once the background is being updated to a 'current' state, this will eliminate ball trails
  push();
  stroke(0);
  strokeWeight(0.5);
  if (mouseIsPressed) {
    fill(newR(r),newG(g),newB(b));
  } else {
  fill(255, 255, 255);
  }
  ellipse(eX,eY,40,40); // (x,y,l,h); draws from center.
  pop();
}

// Make it move
function moveBall() {
  eY = eY + yspeed;
  eX = eX + xspeed;
}

// Make it bounce off walls
function detectWalls() {
  if (eY > height - 15) {
    bottomHit = !bottomHit;
    yspeed = -yspeed;
  }
  
  if (eY < 15) {
    topHit = !topHit;
    yspeed = -yspeed;
  }
  
  if (eX > width - 15) {
    rightHit = !rightHit;
    xspeed = -xspeed;
  }
  
  if (eX < 15) {
    leftHit = !leftHit;
    xspeed = -xspeed;
  }
}

// Test the fours walls for collision, updating the colors if so
function wallHit(w) {
  if (w === true) {
    w = !w;
    return;
  }
}



/////////////////////// Block code: ////////////////////////////

// Block object constructor:
function block(x, y) {
  this.x = x * blockSize;  // Properties of every block
  this.y = y * blockSize;
  this.r = 0;
  this.g = 0;
  this.b = 0;
  
  // Two functions of block objects:
    // Make overwrites the object's color variables, then prints to draw
  this.make = function(x, y, z) {
    this.r = x;
    this.g = y;
    this.b = z;
    fill(newR(this.r),newG(this.g),newB(this.b));
    rect(this.x, this.y, blockSize, blockSize);
  }
  
    // Show simply prints a new instance to draw
  this.show = function() {
    fill(this.r, this.g, this.b)
    rect(this.x, this.y, blockSize, blockSize);
  }
  
}



//////////////////////////  Colors  ///////////////////////////

/* Still can't figure out how to make this one function:
   Problem is about taking a variable input global variable and setting that variable without using
   the global variable's name, in order to keep the input global variable variable. Make sense?
   (Similarly, see the currently unused wallHit() )
*/

// Successfully replace random() with noise() and you'll get some sweet results.

// Loop over the 2D array and update the block at index near the ball with new colors
function localizedColors() {
  for (var co = round(((eX/blockSize) - affect)); co < ((eX/blockSize) + affect); co++) {
    for (var ro = round(((eY/blockSize) - affect)); ro < ((eY/blockSize) + affect); ro++) {
      if (  co >= 0  &&  ro >= 0  && co < width/blockSize  &&  ro < height/blockSize) { // Can't get last rows to populate
        fill(newR(r),newG(g),newB(b));
        noStroke();
        blocks[co][ro].make(r, g, b);
      }
    }
  }
}

// Loop over the 2D array and update the block at each index with new colors
function updateColors() {
  for (var co = 0; co < width/blockSize; co++) {
    for (var ro = 0; ro < height/blockSize; ro++) {
      fill(newR(r),newG(g),newB(b));
      noStroke();
      blocks[co][ro].make(r, g, b);
    }
  }
}

function newR(n) {
  if (n >= 255 || n <= 0) {
    n = 128;
  } else {
    n = random(n-v, n+v);
  }
  r = n;
  return r;
}

function newG(n) {
  if (n >= 255 || n <= 0) {
    n = 128;
  } else {
    n = random(n-v, n+v);
  }
  g = n;
  return g;
}

function newB(n) {
  if (n >= 255 || n <= 0) {
    n = 128;
  } else {
    n = random(n-v, n+v);
  }
  b = n
  return b;
}

// Ideally, a generic:
function newC(n) {
  if (n >= 255 || n <= 0) {
    n = 128;
  } else {
    n = random(n-v, n+v);
  }
  c = n
  return c;
}



//////////////////////////  Controls  ///////////////////////////

// Controls (movement could be tweaked, but they're kinda fun how they are)
function keyPressed() {
  
    // Start Game
  if (keyCode === ENTER) {
    if (yspeed !== 0) {
      return;
    } else {
      xspeed = 10;
      yspeed = 5;
    }
  }
  
  function mousePressed() {
    ellipse(mouseX, mouseY, 5, 5);
    return false;
  }
  
  // Decrease color variance
  if (keyCode === LEFT_ARROW) {
    if (v > 0) {
      if (v < 5) {
        v -= 0.5;
      } else if (v < 10) {
        v -= 1;
      } else if (v < 25) {
        v -= 2;
      } else {
        v -= 5;
      }
    }
  }
  
  // Increase color variance
  if (keyCode === RIGHT_ARROW) {
    if (v <= 101) {
      if (v < 5) {
        v += 0.5;
      } else if (v < 10) {
        v += 1;
      } else if (v < 25) {
        v += 2;
      } else {
        v += 5;
      }
    }
  }
  
  // Speed up (unless inverted :P)
  if (keyCode === UP_ARROW) {
    if (yspeed == 0) {
      return;
    }
    xspeed += 2;
    yspeed += 2;
  }
  
  // Slow down (unless inverted :P)
  if (keyCode === DOWN_ARROW) {
    if (yspeed == 0) {
      return;
    }
    xspeed -= 2;
    yspeed -= 2;
  }
  
}

// Registers specific 'regular' keys
function keyTyped() {
  
  // When the user hits the 's' key, the blocks are drawn fresh in their current state and a .png is saved via browser.
  if (key === 's') {
    for (var i = 0; i < width/blockSize; i++) { // Loop over each column
      for (var j = 0; j < height/blockSize; j++) {  // Loop over each row of the current column
        blocks[i][j].show(); // Now print the block in its current state, no color update
      }
    }
    saveCanvas('glitch_wp.png', 'png');
  }
  
  // The 'z' key lowers the area of affect for changing colors
  if (key === 'z') {
    if (affect > 0) {
      affect--;
    }
  }
  
  // The 'x' key raises the area of affect
  if (key === 'x') {
    if (affect < (height/blockSize)/2 ) {
      affect++;
    }
  }
  
  // The 'c' key washes the board
  if (key === 'c') {
    updateColors();
  }
}


