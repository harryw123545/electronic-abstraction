let freq;
let amp;
var button;
var playing;

let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier

let analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

let bgColor;
const dotSize = 3;

let cnv;
let ampX;
let ampY;
let t;
let step;
let gutter;

function setup() {
  
  // determine styling of button eleme
  button = createButton('PLAY/PAUSE');
  button.mousePressed(toggle);
  button.style('font-size', '25px');
  button.class('buttonCen');
  button.parent('myContainer');
  

  // create canvas with width 400px and height 400px
  cnv = createCanvas(windowWidth, windowHeight);
  //cnv.position(0, 0);
  cnv.style('z-index', '-1');
  bgColor = color(0, 80);


  // only draw once
  //noLoop();
  //background(0);
  fill(0, 0, 0, 120);
  stroke(0, 0);
  frameRate(24);

  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('square');

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq(modulator);

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  // fade carrier in/out on mouseover / touch start
  toggleAudio(cnv);

  console.log(cnv.width, cnv.height);

  t = 0;

  gutter = 80;
  ampX = cnv.width / 4 - gutter;
  ampY = cnv.height / 2 - gutter;
  step = 0.0008;
}




function draw() {
  background(bgColor);
  
  // map mouseY to modulator freq between a maximum and minimum frequency
  let modFreq = map(mouseY, cnv.height, 0, modMinFreq, modMaxFreq);

  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  //
  let modDepth = map(mouseX, 0, cnv.width, modMinDepth, modMaxDepth);

  //let modDepth = sliderAmp.value();
  modulator.amp(modDepth);

  // analyze the waveform
  waveform = analyzer.waveform();

  freq = map(modFreq, modMinFreq, modMaxFreq, 1, 3);
  amp = map(modDepth, modMinDepth, modMaxDepth, 1, 2);


  if (playing) {

    translate(cnv.width / 2, cnv.height / 2);

    for (let i = 0; i < TWO_PI; i += step) {
      fill(map(freq, 1, 3, 0, 255), map(i, 0, PI, 0, 255), 255);

      const x2 = ampX * sin((t) * freq)
      const y2 = ampY * cos((t) * amp)
      ellipse(x2, y2, dotSize, dotSize);
      //modFreq + modDepth +
      t += step;
    }
  } else {

  }

}

// helper function to toggle sound
function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(0.5, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(0.5, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 0.5);
  });
}

function toggle() {
  if (!playing) {
    modulator.start();
    carrier.start(); // start oscillating

    playing = true;
  } else {
    modulator.stop();
    carrier.stop();
    playing = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}