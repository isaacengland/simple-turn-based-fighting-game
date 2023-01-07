const GAME = {
    gameOver: false,
    currentTurn: null,
    weapons: [
        {
            name: 'axe',
            accuracy: 50,
            minDamage: 20,
            maxDamage: 25,
        },
        {
            name: 'sword',
            accuracy: 85,
            minDamage: 7,
            maxDamage: 10,
        },
        {
            name: 'bow',
            accuracy: 65,
            minDamage: 10,
            maxDamage: 15,
        }
    ],
    players: [
        {
            name: "Player",
            health: 100,
            weapons: [{
                name: 'axe',
                accuracy: 50,
                minDamage: 20,
                maxDamage: 25,
            },
            {
                name: 'sword',
                accuracy: 85,
                minDamage: 7,
                maxDamage: 10,
            },
            {
                name: 'bow',
                accuracy: 65,
                minDamage: 10,
                maxDamage: 15,
            }],
            currentWeapon: null,
        },
        {
            name: "Computer",
            health: 100,
            weapons: [{
                name: 'axe',
                accuracy: 50,
                minDamage: 20,
                maxDamage: 25,
            },
            {
                name: 'sword',
                accuracy: 85,
                minDamage: 7,
                maxDamage: 10,
            },
            {
                name: 'bow',
                accuracy: 65,
                minDamage: 10,
                maxDamage: 15,
            }],
            currentWeapon: null,
        }
    ],
}

const humanPlayer = GAME.players[0];
const computer = GAME.players[1];

function randomDamage(weapon) {             //* Calculate a damage value between a weapons minimum and maximum values (both inclusive)
    return Math.floor(Math.random() * (weapon.maxDamage - weapon.minDamage + 1) + weapon.minDamage)
}

function attackSuccess(weapon) {                //* Calculate success of an attack given a weapon's accuracy
    const chance = Math.floor(Math.random() * 101)
    if (chance <= weapon.accuracy) {
        return true
    } else {
        return false
    }
}

const playerHealthBar = document.getElementsByClassName('player-health-bar')[0];
const playerHealthLabel = document.getElementsByClassName('player-health-label')[0];
const computerHealthBar = document.getElementsByClassName('computer-health-bar')[0];
const computerHealthLabel = document.getElementsByClassName('computer-health-label')[0];

function updateHealthBars() {                                    //* Update styling of health bars
    playerHealthLabel.innerHTML = `${humanPlayer.health}%`;
    computerHealthLabel.innerHTML = `${computer.health}%`;
    computerHealthLabel.style.width = computer.health + '%';
    playerHealthLabel.style.width = humanPlayer.health + '%';

    if (computer.health < 50) {                                 //* Change colors at 50% and 25%
    computerHealthLabel.style.backgroundColor = '#fce303';
    }

    if (humanPlayer.health < 50) {
    playerHealthLabel.style.backgroundColor = '#fce303';
    }

    if (computer.health < 25) {
    computerHealthLabel.style.backgroundColor = 'red';
    }

    if (humanPlayer.health < 25) {
    playerHealthLabel.style.backgroundColor = 'red';
    }
}

updateHealthBars()          //* Call on page load, otherwise they won't display properly.

for (const player of GAME.players) {        //* Give each player an attack() function that takes a target. The 'target' argument
  player.attack = function(target) {        //* might be useful if more enemies were added in the future.

    if (GAME.gameOver == true) {
      return;
    }

    document.getElementsByClassName('announcement-label')[0].classList.remove('update');        //* Necessary for announcement label transitions
    
    setTimeout(function() {
        if (player.currentWeapon == null) {                             //* Check if the player has equipped a weapon
            document.getElementsByClassName('announcement-label')[0].innerHTML = "Equip a weapon first!";
            return;                     //* Return from the function without attacking
          }
      else if (attackSuccess(player.currentWeapon)) {           //* If the attack is successful given the equipped weapon's accuracy,
        let damage = randomDamage(player.currentWeapon);        //* a damage value between the minimum damage and maximum damage (both inclusive)
        target.health -= damage;                                //* is calculated and subtracted from the target's health

        document.getElementsByClassName('announcement-label')[0].innerHTML = `Hit for ${damage} damage points!`;
        
        setTimeout(function() {
          document.getElementsByClassName('announcement-label')[0].classList.add('update');
        }, 1000);
      } 
      else {                //* The attack wasn't successful
        document.getElementsByClassName('announcement-label')[0].innerHTML = "Missed!";
        
        setTimeout(function() {
          document.getElementsByClassName('announcement-label')[0].classList.add('update');
        }, 1000);
      }

      checkGameOver();
      updateHealthBars();
    }, -500);
  };
}


function coinToss() {                               //* Give each player an equal chance to attack first
    const toss = Math.floor(Math.random() * 2)      //* Either 0 or 1
    if (toss == 0) {
        GAME.currentTurn = humanPlayer;
    } else {
        GAME.currentTurn = computer;
    }
}

function switchTurn(currentTurn) {           //* Swap who is currently attacking
    if (currentTurn == humanPlayer) {
        GAME.currentTurn = computer;
    } else {
        GAME.currentTurn = humanPlayer;
    }
}

let humanPlayerSelectedButton = null;       //* No buttons are selected at the start of the game

function humanPlayerSelectWeapon(button) {
  
    if (humanPlayerSelectedButton !== null) {       //* If a button has already been selected, play the animation in reverse
        humanPlayerSelectedButton.classList.remove('selected');
    }
  
    button.classList.add('selected');           //* Forces the final frame of the animation to appear static
    humanPlayerSelectedButton = button;         //* Ensures that the styling will be removed when a new weapon is equipped
  
    const weaponMap = {
      'player-weapon-axe-button': GAME.weapons[0],
      'player-weapon-sword-button': GAME.weapons[1],
      'player-weapon-bow-button': GAME.weapons[2]
    }
  
    humanPlayer.currentWeapon = weaponMap[button.classList[0]]      //* Ties the button to the weapon object
  }
  


function computerEquipRandomWeapon() {
    
    if (GAME.gameOver == true) {
      return;
    }
  
    const weaponButtons = document.querySelectorAll('.computer-weapons button');    //* Assign all of the computer's buttons to a variable
  
    const weaponMap = {
      'computer-weapon-axe-button': GAME.weapons[0],
      'computer-weapon-sword-button': GAME.weapons[1],
      'computer-weapon-bow-button': GAME.weapons[2]
    }
    
    weaponButtons.forEach(button => {          //* Reset the computer's buttons before equipping a new weapon
      button.classList.add('reset');
    });
    
    setTimeout(() => {
      weaponButtons.forEach(button => {
        button.classList.remove('reset');       //* Controls styling of the computer's buttons, I'm honestly not sure how but it does work
        button.classList.remove('selected');
      });
      
      const selectedButton = weaponButtons[Math.floor(Math.random() * weaponButtons.length)];
      selectedButton.classList.add('selected');                  //* Add the 'selected' class to the button of the newly equipped weapon
      computer.currentWeapon = weaponMap[selectedButton.classList[0]];
    }, 500);
  }

function checkGameOver() {
    if (humanPlayer.health <= 2) {                      //* The black health label text is difficult to see when it falls outside of the health bar.
        playerHealthLabel.style.color = '#ececec';      //* This sets the font color to white.
        if (humanPlayer.health <= 0) {
            humanPlayer.health = 0;                     //* If the health value is at or below zero, the health will be rounded up to zero because
            GAME.gameOver = true;                       //* it would be weird to have negative health, and the game will end.
            document.getElementsByClassName('computer-name-label')[0].innerHTML = 'Winner!';
            document.getElementsByClassName('computer-name-label')[0].style.color = 'gold';
            document.getElementsByClassName('attack-button')[0].remove();
        }
    } else if (computer.health <= 2) {
        computerHealthLabel.style.color = '#ececec';
        if (computer.health <= 0) {
            computer.health = 0;
            GAME.gameOver = true;
            document.getElementsByClassName('player-name-label')[0].innerHTML = 'Winner!';
            document.getElementsByClassName('player-name-label')[0].style.color = 'gold';
            document.getElementsByClassName('attack-button')[0].remove();
        }
    }
}

function debounce(func, wait) {  //* Sometimes player.attack() would be called multiple times
    let timeout;                 //* in a sinle turn. This debounce function prevents a function
    return function() {          //* from being called twice in a given time frame.
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);       //! This wasn't actually the solution to the issue,
    }                                           //! but it's cool and maybe useful elsewhere so I'm
}                                               //! leaving it here.

function gameLoop() {
    if (humanPlayer.health <= 0 || computer.health <= 0) {  //* Exit the loop when one of the players is dead
      GAME.gameOver = true;
      return;
    }
    if (GAME.currentTurn === humanPlayer) {
      if (humanPlayer.currentWeapon == null) {  //* Check if the player has equipped a weapon
        return;  //* Return from the function without allowing the computer to attack
      }
    } else {
      document.getElementsByClassName('attack-button')[0].disabled = true;  //* Disallow the player to attack multiple time per turn
      setTimeout(() => {
        computerEquipRandomWeapon();
      }, 2000);                 //* Delay computer's equip by 2 seconds
  
      setTimeout(() => {
        computer.attack(humanPlayer);  //* The computer will attack the player with its randomly selected weapon
        switchTurn(computer);          //* and its turn will end.
        document.getElementsByClassName('attack-button')[0].disabled = false;
        gameLoop();  //* Allow the player to attack on its turn if it has equipped a weapon
      }, 3000);      //* Delay computer's attack by 3 seconds
    }
  }

  function attachAttackButtonEventListener() {
    document.getElementsByClassName('attack-button')[0].addEventListener('click', function() {
      humanPlayer.attack(computer);
      if (humanPlayer.currentWeapon == null) {  //* Check if the player has equipped a weapon
        return;                 //* Return from the function without allowing the computer to attack
      }
      switchTurn(humanPlayer);
      gameLoop();               //* Allow the computer to attack on its turn if the player has equipped a weapon and already attacked
    });
  }


function startGame() {

    document.getElementsByClassName('start-button')[0].remove();        //* Replace start game button with attack button
    document.getElementsByClassName('combat-grid')[0].innerHTML = '<label class="announcement-label"></label><button class="attack-button" type="button">Attack</button>';
    coinToss();         //* Randomly select the first attacker

    document.getElementsByClassName('announcement-label')[0].innerHTML = GAME.currentTurn.name + ' is attacking first'
    setTimeout(function() {
        document.getElementsByClassName('announcement-label')[0].classList.add('update');
      }, 100);

    attachAttackButtonEventListener();
    gameLoop();
}



//* Code for displaying weapon stats on mouse hover

let axeInfo = document.getElementsByClassName("weapon-info")[0];
axeInfo.style.display = "none";                                     //* Hide info on page load
let swordInfo = document.getElementsByClassName("weapon-info")[1];
swordInfo.style.display = "none";
let bowInfo = document.getElementsByClassName("weapon-info")[2];
bowInfo.style.display = "none";
let targetAxe = document.getElementsByClassName("player-weapon-axe-button")[0];
let targetSword = document.getElementsByClassName("player-weapon-sword-button")[0];
let targetBow = document.getElementsByClassName("player-weapon-bow-button")[0];

function isTouchDevice() {          //*Detect touch device
try {
    //* try to create TouchEvent. It would fail for desktops and throw error
    document.createEvent("TouchEvent");
    return true;
} catch (e) {
    return false;
}
}

const move = (e) => {
//* Try, catch to avoid any errors for touch screens (Error thrown when user doesn't move their finger)
try {
    //* PageX and PageY return the position of client's cursor from top left of screen
    var x = !isTouchDevice() ? e.pageX : e.touches[0].pageX;
    var y = !isTouchDevice() ? e.pageY : e.touches[0].pageY;
} catch (e) {}

axeInfo.style.top = y - 75 + "px";          //* set left and top of div based on mouse position
axeInfo.style.left = x - 75 + "px";
swordInfo.style.top = y - 75 + "px";
swordInfo.style.left = x - 75 + "px";
bowInfo.style.top = y - 75 + "px";
bowInfo.style.left = x - 75 + "px";
};

targetAxe.addEventListener("mouseover", () => {         //* show circle when mouse is hovering over the button
    axeInfo.style.display = "block";
});
targetSword.addEventListener("mouseover", () => {
    swordInfo.style.display = "block";
});
targetBow.addEventListener("mouseover", () => {
    bowInfo.style.display = "block";
});
  

targetAxe.addEventListener("mouseout", () => {          //* Hide circle when mouse is no longer hovering over the button
    axeInfo.style.display = "none";
});
targetSword.addEventListener("mouseout", () => {
    swordInfo.style.display = "none";
});
targetBow.addEventListener("mouseout", () => {
    bowInfo.style.display = "none";
});

//* For mouse
document.addEventListener("mousemove", (e) => {
move(e);
});

//* For touch
document.addEventListener("touchmove", (e) => {
move(e);
});