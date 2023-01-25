// create AJAX request to get all the words from API call 

function createDict() {
  const wordSite = "http://localhost:3000/wordlist.txt";
  const task = fetch(wordSite); // fetch is a function that return an object that is a promise 
  const task2 = task.then((response) => {
    return response.text()
  });
  //every .then return a promise too
  const task3 = task2.then((resposeText) => {
    const words = resposeText.split("\n")
      .filter((word) => // return and curly brackets goes together 
        word.length === 5);
    return words;
  })
  return task3; //

}

createDict().then((wordList) => {
  console.log(wordList);
  const gameState =initGame(wordList);
  const guessForm = document.getElementById('guessForm');
  const gameBoard = document.getElementById('gameBoard');
  generateBoardHTML(gameState.board,gameBoard);
  guessForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    // formData is like a dictionary and has a get method 
    // pass the form name attribute to get the value as a key
    if(gameState.gameFinished === 'lost') {
      alert('You are out of turn');
      return;
    } 
    else if (gameState.gameFinished === 'win') {
      alert('Congrats');
      return;
    }
    const guessWordObject= new FormData(guessForm);
    const guessWord = guessWordObject.get('guess');
    if (updateBoard(guessWord,gameState))
      generateBoardHTML(gameState.board,gameBoard);

    console.log(gameState.board);

  })

})
console.log("some string")

const RandomWord = (wordList) =>
  wordList[Math.floor(Math.random() * wordList.length)]

const countingLetter = (word) => {
  const answerDict = {};
  for (let index = 0; index < word.length; index++) {
    const letter = word.charAt(index);
    if (answerDict[letter] == null) {
      answerDict[letter] = 1;
    }
    else {
      answerDict[letter] += 1;
    }

  }
  return answerDict;
}

function initGame(wordList) {
  const board = [];
  const cols = 5;
  const rows = 6;
  const gameCounter = 0;
  for (let row = 0; row < rows; row++) {
    const currRow = [];
    for (let col = 0; col < cols; col++) {
      currRow.push([null, 'white']);
    }
    board.push(currRow);
  }
  const answer = RandomWord(wordList);
  const answerDict = countingLetter(answer);
  return {
    board: board,
    cols: cols,
    rows: rows,
    gameCounter: gameCounter,
    gameFinished: 'playing',
    answer: answer,
    answerDict: answerDict,
    wordSet: new Set(wordList)
  }
}

function updateBoard(guess,gameState) {

  // nverting a boolian to if not ...
  if (!gameState.wordSet.has(guess)){
    return false;
  }
  // making a  DEEP copy by converting the object to a string first  
  //  then to an obj by JSON.parse
  const answerDict = JSON.parse(JSON.stringify(gameState.answerDict));
  let greenCounter = 0;
  for (let index = 0; index < guess.length; index ++){
    const guessChar = guess.charAt(index);
    const answerChar = gameState.answer.charAt(index);
    if(guessChar === answerChar){
      gameState.board[gameState.gameCounter][index] = [guessChar,'green'];
      answerDict[guessChar] -=1;
      greenCounter +=1;

    }
  }
  if (greenCounter === gameState.cols) {
    gameState.gameFinished = 'win';
    return true;
  }

  for (let index = 0; index < guess.length; index ++){
    const guessChar = guess.charAt(index);
    // if curlybraces containig one line, you can skip the curly braces;
    if (gameState.board[gameState.gameCounter][index][1] === 'green')
      continue;
    if(answerDict[guessChar] == null || answerDict[guessChar] === 0)
      gameState.board[gameState.gameCounter][index] = [guessChar,'gray'];
    else{
      gameState.board[gameState.gameCounter][index] = [guessChar,'yellow'];
      answerDict[guessChar] -=1;
    }   
  }
  gameState.gameCounter +=1;
  if (gameState.gameCounter == gameState.rows){
    gameState.gameFinished = 'lost';
  }
  return true;
}

function generateBoardHTML(board,gameBoardHTML){
  gameBoardHTML.innerHTML = "";
  for( const row of board) {
    // tablCell is a variable that is a parameter to the function map that 
    // we want the mapping happens on it
    const arr = row.map((tableCell)=>{
      return `<td bgcolor=${tableCell[1]}>${tableCell[0]}</td>`;
    })
    gameBoardHTML.innerHTML += `<tr>${arr.join('')}</tr>`;
  }
}

 
