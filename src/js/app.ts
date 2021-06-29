import P5 from "p5";
import { canvasHeight, canvasWidth } from "./constants";
import { Game } from "./game";

class App {
	private currentP5: P5;
	private game: Game;

	public initialise = () => {
		const sketch = (p5: P5) => {
			p5.setup = (): void => {
				const canvas = p5.createCanvas(canvasWidth, canvasHeight);
				canvas.parent("main-canvas");
			};

			p5.draw = () => {
				this.game.update();
				this.currentP5.background(51);
				this.game.draw();
			};
		};

		this.currentP5 = new P5(sketch);
		this.game = new Game(this.currentP5);
	};
}

window.onload = () => {
	const app = new App();
	app.initialise();
};
