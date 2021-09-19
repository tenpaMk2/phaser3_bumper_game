import { Vector } from "matter";
import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  public text: Phaser.GameObjects.Text;
  public base: MatterJS.BodyType;
  public enemies: MatterJS.BodyType[];
  readonly accelerationFactor = 0.000001;

  constructor() {
    super("demo");
    this.enemies = [];
  }

  preload = () => {};

  create = () => {
    this.matter.add.mouseSpring();

    const width = this.renderer.width;
    const height = this.renderer.height;

    this.base = this.matter.add.circle(width / 2, height / 2, 30);
    this.base.isStatic = true;

    const enemyRectangle = this.matter.add.rectangle(250, 50, 200, 32);
    const enemyCircle = this.matter.add.circle(150, 250, 16);
    this.enemies.push(enemyRectangle, enemyCircle);

    this.text = this.add.text(10, 10, "Move the mouse", {
      font: "16px Courier",
      color: "#88FF88",
    });

    this.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        //  Loop through all of the collision pairs
        const pairs = event.pairs;

        pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          if (bodyA === this.base || bodyB === this.base) {
            this.scene.restart();
          }
        });
      }
    );
  };

  update = () => {
    const pointer = this.input.activePointer;

    this.text.setText([
      "x: " + pointer.x,
      "y: " + pointer.y,
      "velocity x: " + pointer.velocity.x,
      "velocity y: " + pointer.velocity.y,
      "movementX: " + pointer.movementX,
      "movementY: " + pointer.movementY,
    ]);

    this.enemies.forEach((enemy) => {
      const toPosition = this.base.position;
      const fromPosition = enemy.position;
      const velocityX =
        (toPosition.x - fromPosition.x) * this.accelerationFactor;
      const velocityY =
        (toPosition.y - fromPosition.y) * this.accelerationFactor;
      this.matter.applyForce(
        enemy,
        new Phaser.Math.Vector2(velocityX, velocityY)
      );
    });
  };
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 500,
  height: 800,
  scene: Demo,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "matter",
    matter: {
      // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Matter.html
      gravity: {
        x: 0,
        y: 0,
      },
      setBounds: false,
      enableSleeping: true,
      debug: {
        showAxes: false,
        showAngleIndicator: true,
        angleColor: 0xe81153,

        showBroadphase: false,
        broadphaseColor: 0xffb400,

        showBounds: false,
        boundsColor: 0xffffff,

        showVelocity: true,
        velocityColor: 0x00aeef,

        showCollisions: true,
        collisionColor: 0xf5950c,

        showSeparations: false,
        separationColor: 0xffa500,

        showBody: true,
        showStaticBody: true,
        showInternalEdges: true,

        renderFill: false,
        renderLine: true,

        fillColor: 0x106909,
        fillOpacity: 1,
        lineColor: 0x28de19,
        lineOpacity: 1,
        lineThickness: 1,

        staticFillColor: 0x0d177b,
        staticLineColor: 0x1327e4,

        showSleeping: true,
        staticBodySleepOpacity: 1,
        sleepFillColor: 0x464646,
        sleepLineColor: 0x999a99,

        showSensors: true,
        sensorFillColor: 0x0d177b,
        sensorLineColor: 0x1327e4,

        showPositions: true,
        positionSize: 4,
        positionColor: 0xe042da,

        showJoint: true,
        jointColor: 0xe0e042,
        jointLineOpacity: 1,
        jointLineThickness: 2,

        pinSize: 4,
        pinColor: 0x42e0e0,

        springColor: 0xe042e0,

        anchorColor: 0xefefef,
        anchorSize: 4,

        showConvexHulls: true,
        hullColor: 0xd703d0,
      },
    },
  },
};

const game = new Phaser.Game(config);
