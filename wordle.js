// 1. 변수 및 상수 선언
let height = 6; // 게임 보드의 높이
let width = 5;  // 게임 보드의 너비
let row = 0;     // 현재 행 (게임 보드의 행)
let col = 0;     // 현재 열 (게임 보드의 열)
let score = 0;   // 게임 스코어
let hintCount = 0;   // 힌트 사용 횟수
const maxHintCount = 6;  // 최대 힌트 사용 횟수
const maxWordLength = 5;  // 입력해야 하는 최소 글자 수

const wordList = [
    "APPLE", "TABLE", "CHAIR", "MOUSE", "CLOCK", "WATER", "LIGHT", "HEART",
    "STARS", "MUSIC", "PAPER", "HOUSE", "CHIPS", "FRUIT", "GRASS", "EMAIL", "MONEY", "CARDS",
    "GAMES", "SNAKE", "POWER", "FLOOR", "BRICK", "STONE", "SHIRT", "FENCE", "BEACH", "WINGS",
    "PLANE", "TIGER", "CLOUD", "DOGGO", "CATS4", "CROWN", "LIGHT", "TABLE", "DANCE", "JUMPS",
    "CREAK", "SWEEP", "SWING", "CRANE", "FIERY", "RIVER", "SMILE", "EAGLE", "STORM", "GLOVE",
    "JELLY", "LOCKS", "DREAM", "RACER", "MAGIC", "QUACK", "TRAIN", "SPEED", "SPARK", "SKILL",
    "ROBOT", "JOKER", "COAST", "CHESS", "FLAME", "HAVEN", "CRUST", "QUICK", "SAUCE", "MUSIC",
    "RHYME", "CRISP", "STONE", "OCEAN", "MOUNT", "COLOR", "DIVER", "LUNCH", "SHADE", "FABLE",
    "WATCH", "YACHT", "BLINK", "SCARF", "GRILL", "FLOSS", "GRAND", "MOUSE", "BLAST", "SWARM",
    "FLUTE", "SWORD", "SAILS", "PAGES", "BLIND", "RACER", "PIPES", "BLINK", "SWEEP", "CLIFF",
    "CYCLE", "CRANE", "STARS", "LIGHT", "SOUND", "THUMB", "SPACE", "EARTH", "SWING", "PUNCH",
    "CROWN", "FRUIT", "SHIRT", "BRICK", "GLOVE", "BEACH", "FLOOR", "MOUSE", "STONE", "TABLE",
    "DREAM", "JOKER", "CLOUD", "DOGGO", "EMAIL", "CRISP", "MAGIC", "POWER", "MONEY", "RHYME",
    "LIGHT", "CHESS", "TABLE", "STORM", "FENCE", "CHAIR", "WATER", "HEART", "STARS", "MUSIC",
    "PAPER", "HOUSE", "CHIPS", "FRUIT", "GRASS", "EMAIL", "MONEY", "CARDS", "GAMES", "SNAKE",
    "POWER", "FLOOR", "BRICK", "STONE", "SHIRT", "FENCE", "BEACH", "WINGS", "PLANE", "TIGER",
    "CLOUD", "DOGGO", "CATS4", "CROWN", "LIGHT", "TABLE", "DANCE", "JUMPS", "CREAK", "SWEEP",
    "SWING", "CRANE", "FIERY", "RIVER", "SMILE", "EAGLE", "STORM", "GLOVE", "JELLY", "LOCKS",
    "DREAM", "RACER", "MAGIC", "QUACK", "TRAIN", "SPEED", "SPARK", "SKILL", "ROBOT", "JOKER",
    "CHESS", "FLAME", "HAVEN", "CRUST", "QUICK", "SAUCE", "MUSIC", "COAST"
];
let word = wordList[Math.floor(Math.random() * wordList.length)]; // 게임에서 사용할 단어를 무작위로 선택
let gameOver = false;  // 게임 오버 상태

// 2. 함수 정의

// 새로운 게임 시작 함수
function startNewGame() {
  row = 0;
  col = 0;
  hintCount = 0;

  if (gameOver) {
    score = 0;  // 게임 오버 시 스코어 초기화
  }

  clearBoard();  // 게임 보드 초기화
  word = wordList[Math.floor(Math.random() * wordList.length)];  // 새로운 단어 선택
  clearTiles();  // 타일 초기화
  gameOver = false; // 게임 오버 상태 초기화
  updateScore(); // 스코어 업데이트
}

// 게임 보드의 타일 초기화 함수
function clearTiles() {
  for (let c = 0; c < width; c++) {
    let currTile = document.getElementById(row.toString() + '-' + c.toString());
    currTile.innerText = "";
    currTile.classList.remove("correct", "present", "absent");
  }
}

// 3. HTML 엘리먼트 생성 및 초기화
function infinity() {
  // 게임 보드의 HTML 엘리먼트 생성 및 초기화
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let tile = document.createElement("span");
      tile.id = r.toString() + '-' + c.toString();
      tile.classList.add("tile");
      tile.innerText = "";
      document.getElementById("board").appendChild(tile);
    }
  }
    // 4. 이벤트 핸들러 등록

    // 키 입력 이벤트 핸들러 등록
    document.addEventListener("keyup", (e) => {
      if (gameOver) return;  // 게임 오버 상태일 때는 이벤트 처리 중지
      if ("KeyA" <= e.code && e.code <= "KeyZ") {
        // 알파벳 입력은 허용
        if (col < width) {
          let currTile = document.getElementById(row.toString() + '-' + col.toString());
          if (currTile.innerText == "") {
            currTile.innerText = e.key.toUpperCase();
            col += 1;
            currTile.focus(); // 타일에 포커스를 줌
          }
        }
      } else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
          col -= 1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
      } else if (e.code == "Enter" && col >= maxWordLength) {
        // 엔터 키로 단어 제출 및 게임 로직 업데이트
        update();
        if (row == height - 1) {
          let correct = true;
          for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(row.toString() + '-' + c.toString());
            if (word[c] != currTile.innerText) {
              correct = false;
              break;
            }
          }
          if (correct) {
            updateScore();
            setTimeout(() => {
              showMessageGameClear();
              startNewGame(); // 다음 게임 시작
            }, 2000);
          } else {
            gameOver = true;
            showMessageGameOver();
            setTimeout(() => {
              startNewGame(); // 다음 게임 시작
            }, 2000);
          }
        } else {
          row += 1;
          col = 0;
          hintCount++;
          if (hintCount >= maxHintCount) {
            gameOver = true;
            setTimeout(() => {
              startNewGame(); // 다음 게임 시작
            }, 2000);
          }
        }
      } else {
        e.preventDefault(); // 그 외 입력 무시 (한글 및 기타 특수 문자)
      }
    });
  }

// 5. 게임 로직 업데이트 함수
function update() {
  let correct = 0;
  let finished = true;

  for (let c = 0; c < width; c++) {
    let currTile = document.getElementById(row.toString() + '-' + c.toString());
    let letter = currTile.innerText;
    if (word[c] == letter) {
      currTile.classList.add("correct");
      correct += 1;
    } else if (word.includes(letter)) {
      currTile.classList.add("present");
      finished = false;
    } else {
      currTile.classList.add("absent");
      finished = false;
    }
  }

  if (correct === width && finished) {
    let clearScore = 100 - (hintCount * 10);
    score += clearScore;
    updateScore();

    setTimeout(() => {
      showMessageGameClear();
      startNewGame(); // 다음 게임 시작
    },);
  }
}

// 6. 게임 보드 초기화 함수
function clearBoard() {
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let currTile = document.getElementById(r.toString() + '-' + c.toString());
      currTile.innerText = "";
      currTile.classList.remove("correct", "present", "absent");
    }
  }
}

// 7. 스코어 업데이트 함수
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = "Score : " + score;
}

// 8. 화면에 메시지 표시 함수
function showMessageGameOver() {
  const messageContainer = document.getElementById("message-container");
  const message1 = document.getElementById("message1");

  messageContainer.style.display = "block"; // 메시지 컨테이너를 표시
  message1.style.display = "block"; // 메시지 컨테이너를 표시
  setTimeout(() => {
    messageContainer.style.display = "none"; // 일정 시간 후 메시지 컨테이너를 숨김
    message1.style.display = "none"; // 일정 시간 후 메시지 컨테이너를 숨김
  }, 2000); // 메시지를 2초 동안 보여준 후 숨김
}

function showMessageGameClear() {
  const messageContainer = document.getElementById("message-container");
  const message1 = document.getElementById("message2");

  messageContainer.style.display = "block"; // 메시지 컨테이너를 표시
  message1.style.display = "block"; // 메시지 컨테이너를 표시
  setTimeout(() => {
    messageContainer.style.display = "none"; // 일정 시간 후 메시지 컨테이너를 숨김
    message1.style.display = "none"; // 일정 시간 후 메시지 컨테이너를 숨김
  }, 2000); // 메시지를 2초 동안 보여준 후 숨김
}
// 9. 게임 초기화 및 이벤트 처리 시작
infinity();

//네온
const colors = gsap.to('.colors', {
  paused: true,
  duration: 20,
  repeat: -1,
  '--hue': 360,
})

const doRandom = () => {
  gsap.timeline()
    .to('.colors', {
      duration: 0.1,
      // opacity: function(){ return gsap.utils.random(.90, .95) },
      delay: function(){ return gsap.utils.random(.1, 2) },
    }).to('.colors', {
      duration: 0.1,
      // opacity: 1,
      onComplete: function(){
        doRandom()
      }
    })
}

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (! mediaQuery || ! mediaQuery.matches) {
  colors.play();
  doRandom();
}

