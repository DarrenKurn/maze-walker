import P5, { Vector } from "p5";
import { cellSize, Directions, numX, numY } from "./constants";
import { Maze } from "./maze";
import { Walker } from "./walker";

export class Game {
	private readonly p5: P5;
	private readonly maze: Maze;
	private itemLocation: Vector;
	private walker: Walker;
	private routes: Vector[][] = [];
	private routeFound = false;

	constructor(p5: P5) {
		this.p5 = p5;
		this.maze = new Maze(this.p5);
	}

	public draw = (): void => {
		this.maze.draw(!this.routeFound);
		this.drawItem();
		this.walker?.draw();
		this.drawRoute();
	};

	public update = (): void => {
		if (!this.maze.created) {
			this.maze.create();
			return;
		}

		if (this.itemLocation === undefined) {
			this.resetItemLocation();

			return;
		}

		if (this.walker === undefined) {
			this.walker = new Walker(this.p5, this.maze.mazeCells);
		}

		if (!this.routeFound) {
			this.findRoute();
			return;
		}

		this.walker.update();

		if (this.walker.path.length === 0) {
			this.itemLocation = undefined;
			this.routeFound = false;
		}
	};

	private drawItem = (): void => {
		if (this.itemLocation !== undefined) {
			this.p5.push();
			this.p5.fill(0, 255, 0, 100);
			this.p5.ellipse(
				this.itemLocation.x * cellSize + cellSize + cellSize / 2,
				this.itemLocation.y * cellSize + cellSize + cellSize / 2,
				cellSize / 4,
				cellSize / 4
			);
			this.p5.pop();
		}
	};

	private drawRoute = (): void => {
		this.p5.push();
		if (this.routeFound) {
			//this.p5.stroke(0, 0, 255, 100);
			return;
		} else {
			this.p5.stroke(128, 128);
		}
		for (let i = 0; i < this.routes.length; i++) {
			if (this.routes[i].length > 1) {
				for (let j = 1; j < this.routes[i].length; j++) {
					this.p5.line(
						this.routes[i][j - 1].x * cellSize +
							cellSize +
							cellSize / 2,
						this.routes[i][j - 1].y * cellSize +
							cellSize +
							cellSize / 2,
						this.routes[i][j].x * cellSize +
							cellSize +
							cellSize / 2,
						this.routes[i][j].y * cellSize + cellSize + cellSize / 2
					);
				}
			}
		}

		this.p5.pop();
	};

	private findRoute() {
		if (this.routes.length === 0) {
			const x =
				(this.walker.location.x - cellSize - cellSize / 2) / cellSize;
			const y =
				(this.walker.location.y - cellSize - cellSize / 2) / cellSize;
			this.routes.push([this.p5.createVector(x, y)]);
			return;
		}

		for (let i = this.routes.length - 1; i >= 0; i--) {
			const directions = [
				Directions.Up,
				Directions.Down,
				Directions.Left,
				Directions.Right,
			];
			const currentLocation = this.routes[i][this.routes[i].length - 1];
			const currentCell =
				this.maze.mazeCells[currentLocation.x][currentLocation.y];
			directions.forEach((direction) => {
				switch (direction) {
					case Directions.Down:
						if (
							!currentCell.hasBottom &&
							!this.routes[i].some(
								(vec) =>
									vec.x == currentLocation.x &&
									vec.y === currentLocation.y + 1
							)
						) {
							this.routes.push([
								...this.routes[i],
								this.p5.createVector(
									currentLocation.x,
									currentLocation.y + 1
								),
							]);
						}
						break;
					case Directions.Left:
						if (
							!currentCell.hasLeft &&
							!this.routes[i].some(
								(vec) =>
									vec.x == currentLocation.x - 1 &&
									vec.y === currentLocation.y
							)
						) {
							this.routes.push([
								...this.routes[i],
								this.p5.createVector(
									currentLocation.x - 1,
									currentLocation.y
								),
							]);
						}
						break;
					case Directions.Right:
						if (
							!currentCell.hasRight &&
							!this.routes[i].some(
								(vec) =>
									vec.x == currentLocation.x + 1 &&
									vec.y === currentLocation.y
							)
						) {
							this.routes.push([
								...this.routes[i],
								this.p5.createVector(
									currentLocation.x + 1,
									currentLocation.y
								),
							]);
						}
						break;
					case Directions.Up:
						if (
							!currentCell.hasTop &&
							!this.routes[i].some(
								(vec) =>
									vec.x == currentLocation.x &&
									vec.y === currentLocation.y - 1
							)
						) {
							this.routes.push([
								...this.routes[i],
								this.p5.createVector(
									currentLocation.x,
									currentLocation.y - 1
								),
							]);
						}
						break;
				}
			});

			this.routes.splice(i, 1);
		}

		for (let i = this.routes.length - 1; i >= 0; i--) {
			const currentCell = this.routes[i][this.routes[i].length - 1];
			if (
				currentCell.x == this.itemLocation.x &&
				currentCell.y == this.itemLocation.y
			) {
				this.routeFound = true;
				this.routes = [this.routes[i]];
				this.walker.setPath(this.getPathForWalker());
				this.routes = [];
				break;
			}
		}
	}

	private getPathForWalker = () =>
		this.routes[0].map((vec) => {
			return this.p5.createVector(
				vec.x * cellSize + cellSize + cellSize / 2,
				vec.y * cellSize + cellSize + cellSize / 2
			);
		});

	private resetItemLocation = () => {
		this.routeFound = false;

		const x = Math.floor(this.p5.random(0, numX));
		const y = Math.floor(this.p5.random(0, numY));
		this.itemLocation = this.p5.createVector(x, y);
	};
}
