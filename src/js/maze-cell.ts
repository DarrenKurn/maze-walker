import P5 from "p5";
import { cellSize } from "./constants";

export class MazeCell {
	private readonly p5: P5;

	constructor(p5: P5, x: number, y: number) {
		this.p5 = p5;
		this.X = x;
		this.Y = y;
		this.drawnX = x * cellSize + cellSize;
		this.drawnY = y * cellSize + cellSize;
	}

	public backtracked = false;
	public hasBottom = true;
	public hasLeft = true;
	public hasRight = true;
	public hasTop = true;
	public visited = false;

	public readonly drawnX;
	public readonly drawnY;
	public readonly X;
	public readonly Y;

	public draw = (created: boolean): void => {
		if (!this.visited) {
			return;
		}
		if (this.hasBottom) {
			this.drawEdge(
				this.drawnX,
				this.drawnY + cellSize,
				this.drawnX + cellSize,
				this.drawnY + cellSize,
				created
			);
		}

		if (this.hasLeft) {
			this.drawEdge(
				this.drawnX,
				this.drawnY,
				this.drawnX,
				this.drawnY + cellSize,
				created
			);
		}

		if (this.hasRight) {
			this.drawEdge(
				this.drawnX + cellSize,
				this.drawnY,
				this.drawnX + cellSize,
				this.drawnY + cellSize,
				created
			);
		}

		if (this.hasTop) {
			this.drawEdge(
				this.drawnX,
				this.drawnY,
				this.drawnX + cellSize,
				this.drawnY,
				created
			);
		}
	};

	private drawEdge = (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		created: boolean
	) => {
		this.p5.push();
		if (created) {
			this.p5.stroke(128, 10);
		} else if (this.backtracked) {
			this.p5.stroke(0, 128, 0, 100);
		} else {
			this.p5.stroke(128, 100);
		}
		this.p5.line(x1, y1, x2, y2);
		this.p5.pop();
	};
}
