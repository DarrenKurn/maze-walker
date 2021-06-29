import * as P5 from "p5";
import { Vector } from "p5";
import { cellSize } from "./constants";
import { MazeCell } from "./maze-cell";
import { Ray } from "./ray";

export class Walker {
	private readonly p5: P5;
	public readonly location: Vector;
	private readonly acceleration: Vector;
	private readonly velocity: Vector;
	private readonly rays: Ray[] = [];
	public path: Vector[];

	constructor(p5: P5, mazeCells: MazeCell[][]) {
		this.p5 = p5;
		this.location = this.p5.createVector(
			cellSize + cellSize / 2,
			cellSize + cellSize / 2
		);
		this.velocity = this.p5.createVector();
		this.acceleration = this.p5.createVector();

		for (let angle = 0; angle < 360; angle++) {
			this.rays.push(
				new Ray(
					this.p5,
					this.location,
					this.p5.radians(angle),
					mazeCells
				)
			);
		}
	}

	public draw = (): void => {
		this.p5.push();
		this.p5.fill(128, 128);
		this.p5.ellipse(
			this.location.x,
			this.location.y,
			cellSize / 4,
			cellSize / 4
		);
		this.rays.forEach((ray) => ray.draw());
	};

	public setPath = (path: Vector[]): void => {
		this.path = path;
	};

	public update = (): void => {
		const desiredDirection = this.path[0].copy();

		const steer = desiredDirection.sub(this.location);
		steer.limit(0.6);
		this.acceleration.add(steer);
		this.velocity.add(this.acceleration);
		this.velocity.limit(2);
		this.location.add(this.velocity);
		this.acceleration.mult(0);

		if (this.location.dist(this.path[0]) < 2) {
			if (this.path.length === 1) {
				this.location.set(this.path[0].copy());
			}

			this.path.splice(0, 1);
		}
	};
}
