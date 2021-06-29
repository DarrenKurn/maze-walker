// Set the height and width of the canvas to a little smaller than whatever screen we're on
export const cellSize = 30;
export const canvasHeight: number = window.innerHeight - 10;
export const canvasWidth: number = window.innerWidth - 10;

export const numX = Math.floor((canvasWidth - cellSize * 2) / cellSize);
export const numY = Math.floor((canvasHeight - cellSize * 2) / cellSize);

export enum Directions {
	Up,
	Down,
	Left,
	Right,
}
