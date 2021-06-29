import * as P5 from "p5";
import { Vector } from "p5";
import { canvasWidth, cellSize, Directions, numX, numY } from "./constants";
import { MazeCell } from "./maze-cell";

export class Ray {
	private readonly p5: P5;
	private readonly location: Vector;
	private readonly angle: number;
	private readonly mazeCells: MazeCell[][];

	constructor(
		p5: P5,
		location: Vector,
		angle: number,
		mazeCells: MazeCell[][]
	) {
		this.p5 = p5;
		this.location = location;
		this.angle = angle;
		this.mazeCells = mazeCells;
	}

	public draw = (): void => {
		this.p5.push();
		this.p5.stroke(128, 12);
		const direction = Vector.fromAngle(this.angle).mult(
			this.getIntersectionPoint()
		);
		const endPosition = Vector.add(this.location, direction);
		this.p5.line(
			this.location.x,
			this.location.y,
			endPosition.x,
			endPosition.y
		);
		this.p5.pop();
	};

	private getIntersectionPoint = (): number => {
		const walls = [
			Directions.Down,
			Directions.Left,
			Directions.Right,
			Directions.Up,
		];

		let closestIntersection = canvasWidth;

		for (let i = 1; i < canvasWidth; i++) {
			const direction = Vector.fromAngle(this.angle).mult(i);
			const endPosition = Vector.add(this.location, direction);
			const mazeX = Math.min(
				Math.max(Math.floor((endPosition.x - cellSize) / cellSize), 0),
				numX - 1
			);
			const mazeY = Math.min(
				Math.max(Math.floor((endPosition.y - cellSize) / cellSize), 0),
				numY - 1
			);
			const currentCell = this.mazeCells[mazeX][mazeY];
			let distance = canvasWidth;
			walls.forEach((wall) => {
				switch (wall) {
					case Directions.Down:
						if (currentCell.hasBottom) {
							distance = this.checkIntersection(
								this.location.x,
								this.location.y,
								endPosition.x,
								endPosition.y,
								currentCell.drawnX,
								currentCell.drawnY + cellSize,
								currentCell.drawnX + cellSize,
								currentCell.drawnY + cellSize
							);
						}
						break;
					case Directions.Left:
						if (currentCell.hasLeft) {
							distance = this.checkIntersection(
								this.location.x,
								this.location.y,
								endPosition.x,
								endPosition.y,
								currentCell.drawnX,
								currentCell.drawnY,
								currentCell.drawnX,
								currentCell.drawnY + cellSize
							);
						}
						break;
					case Directions.Right:
						if (currentCell.hasRight) {
							distance = this.checkIntersection(
								this.location.x,
								this.location.y,
								endPosition.x,
								endPosition.y,
								currentCell.drawnX + cellSize,
								currentCell.drawnY,
								currentCell.drawnX + cellSize,
								currentCell.drawnY + cellSize
							);
						}
						break;
					case Directions.Up:
						if (currentCell.hasTop) {
							distance = this.checkIntersection(
								this.location.x,
								this.location.y,
								endPosition.x,
								endPosition.y,
								currentCell.drawnX,
								currentCell.drawnY,
								currentCell.drawnX + cellSize,
								currentCell.drawnY
							);
						}
						break;
				}

				if (distance < closestIntersection) {
					closestIntersection = distance;
				}
			});

			if (closestIntersection < canvasWidth) {
				break;
			}
		}

		return closestIntersection;
	};

	private checkIntersection = (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number
	): number => {
		const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (d == 0) {
			return canvasWidth;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
		const u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;

		if (0.0 <= t && t <= 1.0 && 0.0 <= u && u <= 1.0) {
			const intersectX = x1 + t * (x2 - x1);
			const intersectY = y1 + t * (y2 - y1);

			return this.location.dist(
				this.p5.createVector(intersectX, intersectY)
			);
		}

		return canvasWidth;
	};
}
