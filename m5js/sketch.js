let video;
let poseNet;
let poses;
let playing = false;
let recentValues = [];

const USE_CAMERA = false;
const COLORS = [
  [255, 0, 0], [0, 255, 0], [0, 0, 255],
  [255, 255, 0], [255, 0, 255], [0, 255, 255],
  [255, 255, 255]
];
const ARCHITECTURE = 'MobileNetV1'; // 'MobileNetV1', 'ResNet50'
const SMOOTH = true;
const NUM_SMOOTHING = 5;

function setup() {
  createCanvas(640, 480);
  if (USE_CAMERA) {
    video = createCapture(VIDEO);
  } else {
    video = createVideo(['../assets/video/dance_1_test_720.mov',]);
    button = createButton('play');
    button.mousePressed(togglePlayVideo);
  }
  video.hide();

  const options = {
    architecture: ARCHITECTURE,
    detectionType: 'single',
  }
  poseNet = ml5.poseNet(video, options, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function modelLoaded() {
  console.log("poseNet ready");
}

function togglePlayVideo() {
  if (playing) {
  video.pause();
  button.html('play');
} else {
  video.loop();
  button.html('pause');
}
playing = !playing;
}

function gotPoses(detectedPoses) {
  if (detectedPoses.length > 0) {
    poses = detectedPoses;
  }
}

function averageVal(x) {
  // the first time this runs we add the current x to the array n number of times
  if (recentValues.length < 1) {
    console.log('this should only run once');
    for (let i = 0; i < NUM_SMOOTHING; i++) {
      recentValues.push(x);
    }
    // if the number of frames to average is increased, add more to the array
  } else if (recentValues.length < NUM_SMOOTHING) {
    console.log('adding more xs');
    const moreVals = NUM_SMOOTHING - recentValues.length;
    for (let i = 0; i < moreVals; i++) {
      recentValues.push(x);
    }
    // otherwise update only the most recent number
  } else {
    console.log("3rd option - else");
    recentValues.shift(); // removes first item from array
    recentValues.push(x); // adds new x to end of array
  }

  let sum = 0;
  for (let i = 0; i < recentXs.length; i++) {
    sum += recentXs[i];
  }

  // return the average x value
  return sum / recentXs.length;
}

function drawClown(){
  eyeR = pose.rightEye;
  eyeL = pose.leftEye;
  d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

  fill(255, 0, 0);
  ellipse(pose.nose.x, pose.nose.y, d);
  fill(0, 255, 0);
  ellipse(pose.leftWrist.x, pose.leftWrist.y, 64);
  ellipse(pose.rightWrist.x, pose.rightWrist.y, 64);
}

function getColor(index) {
  return COLORS[index % COLORS.length];
}

function drawPosePoints(pose, index){
  fill(getColor(index));
  pose.keypoints.forEach((keypoint) => {
    let x = keypoint.position.x;
    let y = keypoint.position.y
    ellipse(x, y, 16);
  })
}

function drawSkeleton(skeleton, index) {
  const color = getColor(index);
  strokeWeight(2);
  stroke(COLORS[index]);

  skeleton.forEach((bone) => {
      let a = bone[0];
      let b = bone[1];
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    })
}

function draw() {
  image(video, 0 ,0);
  if (poses) {
    // drawClown();
    poses.forEach((pose, index) => {
      drawPosePoints(pose.pose, index);
      drawSkeleton(pose.skeleton, index);
    })
  }

}
