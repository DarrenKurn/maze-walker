# Maze Walker

## Background ##
Another lockdown home holiday with little to do means it's time for another coding challenge.

## The Idea ##
The idea for this challenge is to bring together a few experiments that I think will work well together. The basic premise is to first use a maze creation algorithm to create a random closed maze. Once the maze is created, a walker will be added to the maze, and using a maze solving algorithm, it will navigate around the maze to find a randomly placed item. Once the item has been collected, a new item will appear elsewhere in the maze and the walker will start again.

## Tools ##
This project uses Typescript and P5.

## Notes ##
The algorithm that is used for the maze creation is a [recursive depth-first search](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_implementation). Essentially, how it works is
* Create a grid and have a walker start at the first cell
* Randomly pick a neighbouring cell to move to. If the new cell has not previously been visited, remove the wall between the current cell and the new cell
* If the current cell is surrounded by cells that have already been visited, backtrack to the previous cell and attempt to go in a different direction from there
* At the point which the algorithm returns to the first cell, the algorithm is complete

The maze-solving function is similar to [A*](https://en.wikipedia.org/wiki/A*_search_algorithm), but probably a little more brute-forcey, whereby we just try every route we can until we reach the end destination.

Finally, ray casting - this simply involves sending out a line in every direction (1 line per degree between 1 and 360) and then using [line segment intersection](https://en.wikipedia.org/wiki/Intersection_(Euclidean_geometry)#Two_line_segments) maths to determine whether the ray line intersects with any of the maze walls. To help a little with performance, I start with a zero length ray and slowly increase the ray length to determine the closes wall (the maze is fully enclosed, so there will always be a wall to hit). This is more efficient than having every ray line check every cell.

## Usage notes ##
Cell size is set in the constants file. The maze will always fit the screen, so changing the cell size will change the size of corridors, but not the overall size of the maze.

I have included a file in the root called `run.ps1`. This is just a helper powershell script that sets up the app to run in Https.

## Demo ##
A video of the app running can be found at [https://youtu.be/49XI7dMKL-I](https://youtu.be/49XI7dMKL-I)