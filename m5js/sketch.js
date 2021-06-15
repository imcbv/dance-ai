let video;
let poseNet;
let poses;
let colors = [
  [255, 0, 0], [0, 255, 0], [0, 0, 255],
  [255, 255, 0], [255, 0, 255], [0, 255, 255],
  [255, 255, 255]
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  const options = {
    architecture: 'ResNet50',
    detectionType: 'single',
  }
  poseNet = ml5.poseNet(video, options, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function modelLoaded() {
  console.log("poseNet ready");
}

function gotPoses(detectedPoses) {
  if (detectedPoses.length > 0) {
    poses = detectedPoses;
  }
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
  return colors[index % colors.length];
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
  stroke(colors[index]);

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
