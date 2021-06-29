import * as P5 from "p5";
import { Directions, numX, numY } from "./constants";
import { MazeCell } from "./maze-cell";

export class Maze {
	private readonly p5: P5;
	public readonly mazeCells: MazeCell[][] = [];
	private readonly mazeWalk: MazeCell[] = [];
	constructor(p5: P5) {
		this.p5 = p5;
		this.initialise();
	}

	public created = false;

	public create = (): void => {
		if (this.mazeWalk.length === 0) {
			this.created = true;
			return;
		}

		let currentCell = this.mazeWalk[this.mazeWalk.length - 1];

		currentCell.visited = true;

		const directions: Directions[] = [];

		if (currentCell.X > 0) {
			directions.push(Directions.Left);
		}

		if (currentCell.X < numX - 1) {
			directions.push(Directions.Right);
		}

		if (currentCell.Y > 0) {
			directions.push(Directions.Up);
		}

		if (currentCell.Y < numY - 1) {
			directions.push(Directions.Down);
		}

		while (
			directions.length > 0 &&
			currentCell === this.mazeWalk[this.mazeWalk.length - 1]
		) {
			const direction = directions.sort(
				(a, b) => Math.random() - Math.random()
			)[0];

			switch (direction) {
				case Directions.Down:
					if (
						!this.mazeCells[currentCell.X][currentCell.Y + 1]
							.visited
					) {
						currentCell.hasBottom = false;
						currentCell =
							this.mazeCells[currentCell.X][currentCell.Y + 1];
						currentCell.hasTop = false;
					}
					break;
				case Directions.Left:
					if (
						!this.mazeCells[currentCell.X - 1][currentCell.Y]
							.visited
					) {
						currentCell.hasLeft = false;
						currentCell =
							this.mazeCells[currentCell.X - 1][currentCell.Y];
						currentCell.hasRight = false;
					}
					break;
				case Directions.Right:
					if (
						!this.mazeCells[currentCell.X + 1][currentCell.Y]
							.visited
					) {
						currentCell.hasRight = false;
						currentCell =
							this.mazeCells[currentCell.X + 1][currentCell.Y];
						currentCell.hasLeft = false;
					}
					break;
				case Directions.Up:
					if (
						!this.mazeCells[currentCell.X][currentCell.Y - 1]
							.visited
					) {
						currentCell.hasTop = false;
						currentCell =
							this.mazeCells[currentCell.X][currentCell.Y - 1];
						currentCell.hasBottom = false;
					}
					break;
			}

			directions.splice(0, 1);
		}

		if (currentCell === this.mazeWalk[this.mazeWalk.length - 1]) {
			currentCell.backtracked = true;
			this.mazeWalk.pop();
			return;
		} else {
			this.mazeWalk.push(currentCell);
		}
	};

	public draw = (routeFinding: boolean): void => {
		//if (!this.created || routeFinding) {
		this.mazeCells.forEach((x) => x.forEach((y) => y.draw(this.created)));
		//}
	};

	private initialise = (): void => {
		for (let x = 0; x < numX; x++) {
			this.mazeCells.push([]);
			for (let y = 0; y < numY; y++) {
				this.mazeCells[x].push(new MazeCell(this.p5, x, y));
			}
		}

		this.mazeWalk.push(this.mazeCells[0][0]);
	};
}
