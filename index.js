import { Levels } from './level.js';

const keys = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down'
}

let currentLevel = 0;
// Stocker une sauvegarde du niveau original dans originalGrid, puis stocker le grid de la partie dans actualGrid
let originalGrid = Object.assign([], Levels[currentLevel]);
let actualGrid = originalGrid.map((arr) => { return arr.slice(); });
let playerDirection = 'down';

// Fonction principale pour mettre à jour l'affichage du jeu.
export function updateGame() {
  // Le niveau est un tableau à deux dimensions stocké dans le fichier level.js
  // Chaque case du tableau correspond à un élément du jeu
  // 0 = empty ; 1 = wall ; 2 = box ; 3 = player ; 4 = target

  // Effacer le canvas
  const canvas = document.getElementById('game');
  canvas.innerHTML = '';
      
  // Note à moi-même #1 : grid désigne le tableau 
  // const canvas = document.getElementById('game');
  // Note à moi-même #2 : canvas désigne le plateau de jeu, comme objet visuel
  console.log('originalGrid : ');
  console.log(originalGrid);
  console.log('actualGrid : ');
  console.log(actualGrid);
  // Pour chaque array dans le tableau d'array, générer une cellule/case de la classe associée
      for (let i = 0; i < actualGrid.length; i++) {
        for (let j = 0; j < actualGrid[i].length; j++) {
          
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.classList.add('type-' + actualGrid[i][j]);
          cell.id = `cell-${i}-${j}`;
          if (actualGrid[i][j] === 1) {
            cell.classList.add('wall');
          } else if (actualGrid[i][j] === 2) {
            cell.classList.add('box');
            let box = document.createElement('img');
            box.src = './images/box.png';
            box.style.width = '100%';
            box.style.height = '100%';
            // Si la box est sur une target, la box devient de couleur vert
            let targets = getTargetsPosition();
            for (let k = 0; k < targets.length; k++) {
              if (i === targets[k][0] && j === targets[k][1]) {
                box.src = './images/box-target.png';
              }
            }
            cell.appendChild(box);
            
            

          } else if (actualGrid[i][j] === 3) {
            let player = document.createElement('img');
            player.id = 'playerImage';

            if (playerDirection === 'down') {
              player.src = './images/sprite_0.png';
            } else if (playerDirection === 'up') {
              player.src = './images/sprite_3.png';
            } else if (playerDirection === 'left') {
              player.src = './images/sprite_6.png';
            } else if (playerDirection === 'right') {
              player.src = './images/sprite_9.png';
            }
            player.style.width = '100%';
            player.style.height = '100%';
            cell.appendChild(player);
            cell.style.backgroundImage = `url(./images/textures/plank.png)`;
            cell.style.backgroundSize = 'cover';
            cell.style.backgroundPosition = 'center';
            cell.classList.add('player');
            // cell.id = 'playerCell';

          } else if (originalGrid[i][j] === 4) {
            cell.classList.add('target');
            let target = document.createElement('img');
            target.src = './images/textures/target2.png';
            target.style.width = '100%';
            target.style.height = '100%';
            cell.appendChild(target);
          }
          else {
            cell.classList.add('floor');
          }
          cell.style.top = `${i * 4}vw`;
          cell.style.left = `${j * 4}vw`;
          
          canvas.appendChild(cell);
            
        }
      }
      // Ajuster le canvas pour qu'il ait la largeur égale à la longueur d'un sous-array multiplié par 50, et la longueur égale à la longueur du tableau multiplié par 50, disposés en grille de pixels
      canvas.style.width = `${actualGrid[0].length * 4}vw`;
      canvas.style.height = `${actualGrid.length * 4}vw`;
      canvas.style.display = 'grid';
      canvas.style.gridTemplateColumns = `repeat(${actualGrid[0].length}, 4vw)`;
      canvas.style.gridTemplateRows = `repeat(${actualGrid.length}, 4vw)`;
      canvas.style.gap = '0';
    
      // Vérifier si le joueur a gagné
      // Si la position des box dans actualGrid est égale à la position des targets dans originalGrid, le joueur a gagné
      let boxes = getBoxesPosition();
      let targets = getTargetsPosition();
      let win = false;
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i][0] === targets[i][0] && boxes[i][1] === targets[i][1]) {
          win = true;
        } else {
          win = false;
          break;
        }
      }
      if (win) {
        if (currentLevel === Levels.length - 1) {
          alert('You won ! There are no more levels left, congratulations !');
          return;
        }
        currentLevel++;
        originalGrid = Object.assign([], Levels[currentLevel]);
        actualGrid = originalGrid.map((arr) => { return arr.slice(); });
        updateGame();
      }

}

function getBoxesPosition() {
  let boxes = [];
  for (let i = 0; i < actualGrid.length; i++) {
    for (let j = 0; j < actualGrid[i].length; j++) {
      if (actualGrid[i][j] === 2) {
        boxes.push([i, j]);
      }
    }
  }
  return boxes;
}

function getTargetsPosition() {
  let targets = [];
  for (let i = 0; i < originalGrid.length; i++) {
    for (let j = 0; j < originalGrid[i].length; j++) {
      if (originalGrid[i][j] === 4) {
        targets.push([i, j]);
      }
    }
  }
  return targets;
}


// Fonction principale pour gérer les événements du clavier.
document.addEventListener('keydown', function(event) {
  // Si un mouvement est déjà en cours ou que le joueur est face à un mur, ne rien faire
  if (document.getElementById('playerFrame') !== null) {
    return;
  } else if (document.getElementById('boxFrame') !== null) {
    return;
  }
  
  // Récupérer l'image du joueur et l'effacer
  let playerImage = document.getElementById('playerImage');
  if (playerImage !== null) {
    playerImage.src = '';
  }
  
  // Récupérer le code de la touche appuyée
  const key = event.key;
  let playerPosition = getPlayerPosition();
  console.log('playerPosition : ');
  console.log(playerPosition);
  // Exécuter le code approprié en fonction de la touche appuyée
  if (key === 'ArrowDown') {
    // Si la case en-dessous du joueur est vide ou contient une target vide, le joueur se déplace vers le bas
    if (actualGrid[playerPosition[0] + 1][playerPosition[1]] === 0 || actualGrid[playerPosition[0] + 1][playerPosition[1]] === 4) {
      
        actualGrid[playerPosition[0]][playerPosition[1]] = 0;
        actualGrid[playerPosition[0] + 1][playerPosition[1]] = 3;
        movePlayer('down', playerPosition);

    }
    // Si la case en-dessous du joueur contient une box, le joueur pousse la box vers le bas et se déplace vers le bas
    else if (actualGrid[playerPosition[0] + 1][playerPosition[1]] === 2) {
      if (actualGrid[playerPosition[0] + 2][playerPosition[1]] === 0 || actualGrid[playerPosition[0] + 2][playerPosition[1]] === 4) { // Si la case en-dessous de la box est vide, le joueur pousse la box vers le bas et se déplace vers le bas
        // Effacer la box de la case actuelle et la placer dans la case en-dessous
        let box = document.getElementById(`cell-${playerPosition[0] + 1}-${playerPosition[1]}`);
        box.classList.remove('box');
        box.innerHTML = '';
        box.src = '';
        actualGrid[playerPosition[0]][playerPosition[1]] = 0;
        actualGrid[playerPosition[0] + 1][playerPosition[1]] = 3;
        actualGrid[playerPosition[0] + 2][playerPosition[1]] = 2;
        
        movePlayer('down', playerPosition);
        moveBox('down', playerPosition);
      } 
      // Si la case en-dessous de la box est un mur, le joueur ne peut pas pousser la box
      else if (actualGrid[playerPosition[0] + 2][playerPosition[1]] === 1) {
        updateGame();
        return; 
      } 
      // Si la case en-dessous de la box contient une autre box, le joueur ne peut pas pousser la box
      else if (actualGrid[playerPosition[0] + 2][playerPosition[1]] === 2) {
        updateGame();
        return;
      }
    }
    // Si la case en-dessous est un mur, le joueur ne peut pas se déplacer vers le bas
    else if (actualGrid[playerPosition[0] + 1][playerPosition[1]] === 1) {
      updateGame();
      return;
    }
  }
  else if (key === 'ArrowUp') {
    if (actualGrid[playerPosition[0] - 1][playerPosition[1]] === 0 || actualGrid[playerPosition[0] - 1][playerPosition[1]] === 4) {
      actualGrid[playerPosition[0]][playerPosition[1]] = 0;
      actualGrid[playerPosition[0] - 1][playerPosition[1]] = 3;
      movePlayer('up', playerPosition);
    }
    else if (actualGrid[playerPosition[0] - 1][playerPosition[1]] === 2) {
      if (actualGrid[playerPosition[0] - 2][playerPosition[1]] === 0 || actualGrid[playerPosition[0] - 2][playerPosition[1]] === 4) { // Si la case au-dessus de la box est vide, le joueur pousse la box vers le haut et se déplace vers le haut
        let box = document.getElementById(`cell-${playerPosition[0] - 1}-${playerPosition[1]}`);
        box.classList.remove('box');
        box.innerHTML = '';
        box.src = '';
        actualGrid[playerPosition[0]][playerPosition[1]] = 0;
        actualGrid[playerPosition[0] - 1][playerPosition[1]] = 3;
        actualGrid[playerPosition[0] - 2][playerPosition[1]] = 2;
        movePlayer('up', playerPosition);
        moveBox('up', playerPosition);
      } 
      else if (actualGrid[playerPosition[0] - 2][playerPosition[1]] === 1) {
        updateGame();
        return; 
      } 
      else if (actualGrid[playerPosition[0] - 2][playerPosition[1]] === 2) {
        updateGame();
        return;
      }
    }
    else if (actualGrid[playerPosition[0] - 1][playerPosition[1]] === 1) {
      updateGame();
      return;
    }
  }
  else if (key === 'ArrowLeft') {
    if (actualGrid[playerPosition[0]][playerPosition[1] - 1] === 0 || actualGrid[playerPosition[0]][playerPosition[1] - 1] === 4) {
      actualGrid[playerPosition[0]][playerPosition[1]] = 0;
      actualGrid[playerPosition[0]][playerPosition[1] - 1] = 3;
      movePlayer('left', playerPosition);
    }
    else if (actualGrid[playerPosition[0]][playerPosition[1] - 1] === 2) { // Si la case à gauche du joueur contient une box
      if (actualGrid[playerPosition[0]][playerPosition[1] - 2] === 0 || actualGrid[playerPosition[0]][playerPosition[1] - 2] === 4) { // Si la case à gauche de la box est vide, le joueur pousse la box vers la gauche et se déplace vers la gauche
        let box = document.getElementById(`cell-${playerPosition[0]}-${playerPosition[1] - 1}`);
        box.classList.remove('box');
        box.innerHTML = '';
        box.src = '';
        actualGrid[playerPosition[0]][playerPosition[1]] = 0;
        actualGrid[playerPosition[0]][playerPosition[1] - 1] = 3;
        actualGrid[playerPosition[0]][playerPosition[1] - 2] = 2;
        movePlayer('left', playerPosition);
        moveBox('left', playerPosition);
      } 
      else if (actualGrid[playerPosition[0]][playerPosition[1] - 2] === 1) {
        updateGame();
        return; 
      } 
      else if (actualGrid[playerPosition[0]][playerPosition[1] - 2] === 2) {
        updateGame();
        return;
      }
    }
    else if (actualGrid[playerPosition[0]][playerPosition[1] - 1] === 1) {
      updateGame();
      return;
    }
  }
  else if (key === 'ArrowRight') {
    if (actualGrid[playerPosition[0]][playerPosition[1] + 1] === 0 || actualGrid[playerPosition[0]][playerPosition[1] + 1] === 4) {
      actualGrid[playerPosition[0]][playerPosition[1]] = 0;
      actualGrid[playerPosition[0]][playerPosition[1] + 1] = 3;
      movePlayer('right', playerPosition);
    }
    else if (actualGrid[playerPosition[0]][playerPosition[1] + 1] === 2) { // Si la case à droite du joueur contient une box
      if (actualGrid[playerPosition[0]][playerPosition[1] + 2] === 0 || actualGrid[playerPosition[0]][playerPosition[1] + 2] === 4) { // Si la case à droite de la box est vide, le joueur pousse la box vers la droite et se déplace vers la droite
        let box = document.getElementById(`cell-${playerPosition[0]}-${playerPosition[1] + 1}`);
        box.classList.remove('box');
        box.innerHTML = '';
        box.src = '';
        actualGrid[playerPosition[0]][playerPosition[1]] = 0;
        actualGrid[playerPosition[0]][playerPosition[1] + 1] = 3;
        actualGrid[playerPosition[0]][playerPosition[1] + 2] = 2;
        movePlayer('right', playerPosition);
        moveBox('right', playerPosition);
      } 
      else if (actualGrid[playerPosition[0]][playerPosition[1] + 2] === 1) {
        updateGame();
        return; 
      } 
      else if (actualGrid[playerPosition[0]][playerPosition[1] + 2] === 2) {
        updateGame();
        return;
      }
    }
    else if (actualGrid[playerPosition[0]][playerPosition[1] + 1] === 1) {
      updateGame();
      return;
    }
  }
  setTimeout(() => {
  updateGame();
  } , 600);
});

// Player movement animation
function movePlayer(direction, playerPosition) {
  if (direction === 'down') {
    // Parcourir les 3 sprites du joueur en mouvement vers le bas 0, 1, 2, en déplaçant le joueur 1/3 de la hauteur de la cellule à chaque sprite, avec un intervalle de 100ms entre chaque sprite
    let playerFrame;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (playerFrame !== undefined) {
          playerFrame.remove();
        }
        playerFrame = document.createElement('img');
        playerFrame.src = `./images/sprite_${i}.png`;
        playerFrame.style.width = '4vw';
        playerFrame.style.height = '4vw';
        playerFrame.style.position = 'absolute';
        playerFrame.style.top = `${(playerPosition[0] * 4) + (i * (1.33))}vw`;
        playerFrame.style.left = `${playerPosition[1] * 4}vw`;
        playerFrame.style.zIndex = '1';
        playerFrame.id = 'playerFrame';
        document.getElementById('game').appendChild(playerFrame);
        playerDirection = 'down';

      }, 200 * i);
    }
  } 
  else if (direction === 'up') {
    let playerFrame;
    for (let i = 3; i < 6; i++) {
      setTimeout(() => {
        if (playerFrame !== undefined) {
          playerFrame.remove();
        }
        playerFrame = document.createElement('img');
        playerFrame.src = `./images/sprite_${i}.png`;
        playerFrame.style.width = '4vw';
        playerFrame.style.height = '4vw';
        playerFrame.style.position = 'absolute';
        playerFrame.style.top = `${(playerPosition[0] * 4) - ((i-3) * (1.33))}vw`;
        playerFrame.style.left = `${playerPosition[1] * 4}vw`;
        playerFrame.style.zIndex = '1';
        playerFrame.id = 'playerFrame';
        document.getElementById('game').appendChild(playerFrame);
        playerDirection = 'up';

      }, 200 * (i - 3));
    }
  }
  else if (direction === 'left') {
    let playerFrame;
    for (let i = 6; i < 9; i++) {
      setTimeout(() => {
        if (playerFrame !== undefined) {
          playerFrame.remove();
        }
        playerFrame = document.createElement('img');
        playerFrame.src = `./images/sprite_${i}.png`;
        playerFrame.style.width = '4vw';
        playerFrame.style.height = '4vw';
        playerFrame.style.position = 'absolute';
        playerFrame.style.top = `${playerPosition[0] * 4}vw`;
        playerFrame.style.left = `${(playerPosition[1] * 4) - ((i-6) * (1.33))}vw`;
        playerFrame.style.zIndex = '1';
        playerFrame.id = 'playerFrame';
        document.getElementById('game').appendChild(playerFrame);
        playerDirection = 'left';

      }, 200 * (i - 6));
    }
  }
  else if (direction === 'right') {
    let playerFrame;
    for (let i = 9; i < 12; i++) {
      setTimeout(() => {
        if (playerFrame !== undefined) {
          playerFrame.remove();
        }
        playerFrame = document.createElement('img');
        playerFrame.src = `./images/sprite_${i}.png`;
        playerFrame.style.width = '4vw';
        playerFrame.style.height = '4vw';
        playerFrame.style.position = 'absolute';
        playerFrame.style.top = `${playerPosition[0] * 4}vw`;
        playerFrame.style.left = `${(playerPosition[1] * 4) + ((i-9) * (1.33))}vw`;
        playerFrame.style.zIndex = '1';
        playerFrame.id = 'playerFrame';
        document.getElementById('game').appendChild(playerFrame);
        playerDirection = 'right';

      }, 200 * (i - 9));
    }
  }
}

function moveBox(direction, playerPosition) {
  if (direction === 'down') {
    let boxFrame;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (boxFrame !== undefined) {
          boxFrame.remove();
        }
        boxFrame = document.createElement('img');
        boxFrame.src = `./images/box.png`;
        boxFrame.style.width = '4vw';
        boxFrame.style.height = '4vw';
        boxFrame.style.position = 'absolute';
        boxFrame.style.top = `${((playerPosition[0] * 4) + 4) + (i * (1.33))}vw`;
        boxFrame.style.left = `${playerPosition[1] * 4}vw`;
        boxFrame.style.zIndex = '1';
        boxFrame.id = 'boxFrame';
        document.getElementById('game').appendChild(boxFrame);
      }, 200 * i);
    }
  }
  else if (direction === 'up') {
    let boxFrame;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (boxFrame !== undefined) {
          boxFrame.remove();
        }
        boxFrame = document.createElement('img');
        boxFrame.src = `./images/box.png`;
        boxFrame.style.width = '4vw';
        boxFrame.style.height = '4vw';
        boxFrame.style.position = 'absolute';
        boxFrame.style.top = `${((playerPosition[0] * 4) - 4) - (i * (1.33))}vw`;
        boxFrame.style.left = `${playerPosition[1] * 4}vw`;
        boxFrame.style.zIndex = '1';
        boxFrame.id = 'boxFrame';
        document.getElementById('game').appendChild(boxFrame);
      }, 200 * i);
    }
  }
  else if (direction === 'left') {
    let boxFrame;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (boxFrame !== undefined) {
          boxFrame.remove();
        }
        boxFrame = document.createElement('img');
        boxFrame.src = `./images/box.png`;
        boxFrame.style.width = '4vw';
        boxFrame.style.height = '4vw';
        boxFrame.style.position = 'absolute';
        boxFrame.style.top = `${playerPosition[0] * 4}vw`;
        boxFrame.style.left = `${((playerPosition[1] * 4) - 4) - (i * (1.33))}vw`;
        boxFrame.style.zIndex = '1';
        boxFrame.id = 'boxFrame';
        document.getElementById('game').appendChild(boxFrame);
      }, 200 * i);
    }
  }
  else if (direction === 'right') {
    let boxFrame;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (boxFrame !== undefined) {
          boxFrame.remove();
        }
        boxFrame = document.createElement('img');
        boxFrame.src = `./images/box.png`;
        boxFrame.style.width = '4vw';
        boxFrame.style.height = '4vw';
        boxFrame.style.position = 'absolute';
        boxFrame.style.top = `${playerPosition[0] * 4}vw`;
        boxFrame.style.left = `${((playerPosition[1] * 4) + 4) + (i * (1.33))}vw`;
        boxFrame.style.zIndex = '1';
        boxFrame.id = 'boxFrame';
        document.getElementById('game').appendChild(boxFrame);
      }, 200 * i);
    }
  }

  
}

function getPlayerPosition() {
  for (let i = 0; i < actualGrid.length; i++) {
    for (let j = 0; j < actualGrid[i].length; j++) {
      if (actualGrid[i][j] === 3) {
        return [i, j];
      }
    }
  }
}

// Fonction principale pour configurer l'interface du jeu.
export function setupInterface() {
  const startBox = createStartBox();
  handleStartEvent(startBox);
}

// Crée une fenêtre d'accueil invitant le joueur à appuyer sur une touche pour commencer le jeu.
function createStartBox() {
  const startBox = document.createElement('div');
  startBox.id = 'startBox';
  startBox.textContent = 'Press any key to start';
  document.body.appendChild(startBox);
  return startBox;
}

// Gère l'événement de démarrage du jeu.
function handleStartEvent(startBox) {
  document.addEventListener('keydown', (e) => {
    startBox.style.display = 'none';
    // updateGame();
    // Supprimer l'écouteur d'événement pour éviter que le jeu ne commence à chaque touche pressée
    startBox.remove();
    
  });
  document.addEventListener('click', (e) => {
    startBox.style.display = 'none';
    // updateGame();
    startBox.remove();
  });
}