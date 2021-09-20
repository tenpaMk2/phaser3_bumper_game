import * as Phaser from "phaser";

const ENEMY_TYPE = ["circle", "rectangle", "random"] as const;
type EnemyType = typeof ENEMY_TYPE[number];

type Area = { top: number; left: number; right: number; bottom: number };
type Position = { x: number; y: number };

export class EnemyFactory {
  constructor(public scene: Phaser.Scene) {}

  add = (enemyType: EnemyType = "random") => {
    const position = this.decidePosition();

    if (enemyType === "random") {
      const idx = Phaser.Math.RND.between(0, ENEMY_TYPE.length - 2);
      enemyType = ENEMY_TYPE[idx];
    }

    if (enemyType === "circle") {
      const radius = Phaser.Math.RND.between(10, 20);
      return this.scene.matter.add.circle(position.x, position.y, radius, {
        frictionAir: 0.4,
        ignorePointer: true,
      });
    } else if (enemyType === "rectangle") {
      const width = Phaser.Math.RND.between(5, 15);
      const height = Phaser.Math.RND.between(5, 15);
      return this.scene.matter.add.rectangle(
        position.x,
        position.y,
        width,
        height,
        {
          frictionAir: 0.4,
          ignorePointer: true,
        }
      );
    } else {
      throw new Error("Invalid enemyType.");
    }
  };

  private decidePosition = (): Position => {
    const width = this.scene.renderer.width;
    const height = this.scene.renderer.height;
    const params = [
      { top: 0, left: 0, right: width * 0.9, bottom: height * 0.1 },
      { top: height * 0.1, left: 0, right: width * 0.1, bottom: height },
      { top: 0, left: width * 0.9, right: width, bottom: height * 0.9 },
      { top: height * 0.9, left: width * 0.1, right: width, bottom: height },
    ];

    const param = params[Phaser.Math.RND.between(0, 3)];
    const x = Phaser.Math.RND.between(param.left, param.right);
    const y = Phaser.Math.RND.between(param.top, param.bottom);
    return { x: x, y: y };
  };
}
