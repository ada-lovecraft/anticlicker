ENGINE.Game = {

  create: function() {
    var app = this.app;
    this.score = 0;
    this.interval = null;
    this.mousePos = {x: app.center.x, y: app.center.y};

    this.level = 1;
    this.levelScore = 0;
    this.score = 0;
    this.scores = {
      levelScore: 0,
      gameScore: 0
    };

    this.resetThomas();
    this.resetLevelDisplay();
    this.resetScoreDisplay();
    this.resetScorePopup();
    this.scorePopup.alpha = 0;
  },
  resetScorePopup: function() {
    this.scorePopup = {
      x: this.mousePos.x,
      y: this.mousePos.y,
      alpha: 1.0
    };
    console.log('reset score popup:', this.scorePopup);
  },
  resetLevelDisplay: function() {
    this.levelDisplay = {
      progress: 0,
      nextLevel: this.level * 10,
      x: 30,
      y: 30,
      width: 250
    };
    console.log('reset level display:', this.levelDisplay);
  },
  resetScoreDisplay: function() {
    this.scoreDisplay ={
      x: this.app.width - 30,
      y: 30
    };
  },
  resetThomas: function() {
    this.thomas = {
      x: this.mousePos.x,
      y: this.mousePos.y,
      width: 0,
      height: 64,
      alpha: 1.0
    };
  },
  mousedown: function(data) {
    this.interval = setInterval(this.updateScore.bind(this), 1000);
    if(this.killScoreTween) {
      this.killScoreTween.stop();
      this.killScoreTween = null;
    }
    if(this.killProgressTween) {
      this.killProgressTween.stop();
      this.killProgressTween = null;
    }
    this.updateScore();
  },
  mouseup: function() {
    this.resetThomas();
    clearInterval(this.interval);
    this.thomas.alpha = 0;
    this.killScoreTween = this.app.tween(this.scores).to({levelScore: 0, gameScore: 0}, this.level, 'linear');
    this.killProgressTween = this.app.tween(this.levelDisplay).to({progress: 0}, this.level, 'linear');
  },
  mousemove: function(data) {
    this.mousePos = {x: data.x, y: data.y};
    console.log(this.mousePos);
  },
  step: function(dt) {
    if(this.levelDisplay.progress >= 1.0) {
        this.level++;
        this.scores.levelScore = 1;
        this.resetLevelDisplay();

      }
  },

  render: function() {
    /* get reference to the application */
    //console.log(this.levelDisplay.levelProgress);
    var app = this.app;
    var t = this.thomas;

    /* get reference to drawing surface */

    var layer = this.app.layer;

    /* clear screen */

    layer
      .save()
      .clear("#222")
      .font("24px Arial")
      // draw radar
      .strokeStyle("#c08")
      .lineWidth(4)
      .align(0.5, 0.5)
      .a(t.alpha)
      .strokeCircle(t.x, t.y, t.width)
      .ra()
      .a(t.alpha/2)
      .strokeCircle(t.x, t.y, t.width / 2)
      .ra()
      .a(t.alpha/4)
      .strokeCircle(t.x, t.y, t.width / 4)
      .ra()
      .align(0.0, 0.5)
      // draw level progress
      .lineWidth(1)
      .fillStyle('#c08')
      .fillRect(this.levelDisplay.x, this.levelDisplay.y, this.levelDisplay.width * this.levelDisplay.progress, 20)
      .strokeRect(this.levelDisplay.x, this.levelDisplay.y, this.levelDisplay.width, 20)
      // draw score
      .fillStyle('#fff')
      .textAlign("right")
      .fillText('Score: ' + Math.ceil(this.scores.gameScore), this.scoreDisplay.x, this.scoreDisplay.y)
      // draw score popup
      .a(this.scorePopup.alpha)
      .textAlign("center")
      .fillText('+' + this.level, this.scorePopup.x, this.scorePopup.y)
      .ra()
      .restore();
  },
  updateScore: function() {
    this.scores.gameScore += this.level;
    this.scores.levelScore++;
    this.resetScorePopup();
    this.resetThomas();
    var progress = this.scores.levelScore/this.levelDisplay.nextLevel;
    this.app.tween(this.thomas).to({ alpha: 0, width: 64}, 1.0, 'outExpo');
    this.app.tween(this.levelDisplay).to({progress: progress}, 1.0, 'outExpo');
    this.app.tween(this.scorePopup).to({alpha: 0, y: this.scorePopup.y - 100 * (_.random(75, 100)/100), x: this.scorePopup.x + 50 * (_.random(-100, 100) / 100)}, 1.0, 'outExpo');
  }
};
