const prompt = require("prompt-sync")({ sigint: true });

const hat = "✅";
const hole = "❌";
const fieldCharacter = "✨";
const pathCharacter = "❤️";

class Field {
  constructor(field) {
    this.field = field;
  }

  static findElement(field, target) {
    const results = [];
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        if (field[i][j] === target) {
          results.push([i, j]);
        }
      }
    }
    return results;
  }

  static isSolvable(matrix, charPos, hatPos) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    const stack = [charPos];
    visited[charPos[0]][charPos[1]] = true;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (stack.length > 0) { 
      const [currX, currY] = stack.pop();

      if (currX === hatPos[0] && currY === hatPos[1]) {
        return true;
      }

      for (const [dx, dy] of directions) {
        const nextX = currX + dx;
        const nextY = currY + dy;

        if (nextX >= 0 && nextX < rows && nextY >= 0 && nextY < cols) {
          if (!visited[nextX][nextY] && matrix[nextX][nextY] !== hole) {
            visited[nextX][nextY] = true;
            stack.push([nextX, nextY]);
          }
        }
      }
    }
    return false;
  }

  static generateField(rows, cols, hpcts) {
    let matrix;
    let solvable = false;

    while (!solvable) {
      matrix = Array.from({ length: rows }, () =>
        Array(cols).fill(fieldCharacter),
      );
      const numHole = Math.floor(hpcts * rows * cols);

      let hatPos = [];
      let charPos = [];

      let holesPlaced = 0;
      while (holesPlaced < numHole) {
        let posX = Math.floor(Math.random() * rows);
        let posY = Math.floor(Math.random() * cols);

        if (matrix[posX][posY] === fieldCharacter) {
          matrix[posX][posY] = hole;
          holesPlaced++;
        }
      }

      let hatPlaced = false;
      while (!hatPlaced) {
        let hatPosX = Math.floor(Math.random() * rows);
        let hatPosY = Math.floor(Math.random() * cols);

        if (matrix[hatPosX][hatPosY] === fieldCharacter) {
          matrix[hatPosX][hatPosY] = hat;
          hatPos = [hatPosX, hatPosY];
          hatPlaced = true;
        }
      }

      let characterPlaced = false;
      while (!characterPlaced) {
        let charPosX = Math.floor(Math.random() * rows);
        let charPosY = Math.floor(Math.random() * cols);

        if (matrix[charPosX][charPosY] === fieldCharacter) {
          matrix[charPosX][charPosY] = pathCharacter;
          charPos = [charPosX, charPosY];
          characterPlaced = true;
        }
      }
      solvable = Field.isSolvable(matrix, charPos, hatPos);
    }

    return matrix;
  }

  static moveRight(field) {
    let currPos = Field.findElement(field, pathCharacter);
    let row = currPos[0][0];
    let col = currPos[0][1];

    let newCol = col + 1;

    if (newCol >= field[0].length) {
      console.log("🚫 You went out of bounds! Game over");
      return false;
    }
    let nextTile = field[row][newCol];

    if (nextTile === hole) {
      console.log("💀 You fell into a hole! Game over.");
      return false;
    } else if (nextTile === hat) {
      console.log("🎉 You found the hat! You win!");
      return false;
    }

    field[row][col] = fieldCharacter;
    field[row][newCol] = pathCharacter;

    return true;
  }

  static moveLeft(field) {
    let currPos = Field.findElement(field, pathCharacter);
    let row = currPos[0][0];
    let col = currPos[0][1];

    let newCol = col - 1;

    if (newCol < 0) {
      console.log("🚫 You went out of bounds! Game over");
      return false;
    }
    let nextTile = field[row][newCol];

    if (nextTile === hole) {
      console.log("💀 You fell into a hole! Game over.");
      return false;
    } else if (nextTile === hat) {
      console.log("🎉 You found the hat! You win!");
      return false;
    }

    field[row][col] = fieldCharacter;
    field[row][newCol] = pathCharacter;

    return true;
  }

  static moveUp(field) {
    let currPos = Field.findElement(field, pathCharacter);
    let row = currPos[0][0];
    let col = currPos[0][1];

    let newRow = row - 1;

    if (newRow < 0) {
      console.log("🚫 You went out of bounds! Game over");
      return false;
    }
    let nextTile = field[newRow][col];

    if (nextTile === hole) {
      console.log("💀 You fell into a hole! Game over.");
      return false;
    } else if (nextTile === hat) {
      console.log("🎉 You found the hat! You win!");
      return false;
    }

    field[row][col] = fieldCharacter;
    field[newRow][col] = pathCharacter;

    return true;
  }

  static moveDown(field) {
    let currPos = Field.findElement(field, pathCharacter);
    let row = currPos[0][0];
    let col = currPos[0][1];

    let newRow = row + 1;

    if (newRow >= field.length) {
      console.log("🚫 You went out of bounds! Game over");
      return false;
    }
    let nextTile = field[newRow][col];

    if (nextTile === hole) {
      console.log("💀 You fell into a hole! Game over.");
      return false;
    } else if (nextTile === hat) {
      console.log("🎉 You found the hat! You win!");
      return false;
    }

    field[row][col] = fieldCharacter;
    field[newRow][col] = pathCharacter;

    return true;
  }

  static printMap(field) {
    console.log(field.map((row) => row.join(" ")).join("\n"));
  }

  runGame() {
    let gameRunning = true;
    while (gameRunning) {
      Field.printMap(this.field);
      let input = prompt("Enter keys (W, A, S, D): ").toLowerCase().trim();
      switch (input) {
        case "w":
          gameRunning = Field.moveUp(this.field);
          break;
        case "a":
          gameRunning = Field.moveLeft(this.field);
          break;
        case "s":
          gameRunning = Field.moveDown(this.field);
          break;
        case "d":
          gameRunning = Field.moveRight(this.field);
          break;
        default:
          console.log("Invalid input. Please use W, A, S, or D.");
          break;
      }
    }
  }
}

const game = new Field(Field.generateField(5, 6, 0.25));

game.runGame();


