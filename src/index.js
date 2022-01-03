import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }
  return [null,[]];
}

function Square(props) {

  return (
    <button className="square" onClick={props.onClick} style={props.winner ? {"background": '#00FF00'}:(props.draw ? {"background": '#FFFF00'}: null)}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}  
        onClick={() => this.props.onClick(i)}
        winner = {this.props.winnerlines.includes(i)}
        draw = {this.props.draw}
      />
    );
  }

  render() {
    return (
      <div>
        
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  static DRAWMESAGE = 'DRAWWW!!!';


  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      showHistoryReversed: false,
    };
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseHistoryView(){
    this.setState({
      showHistoryReversed: !this.state.showHistoryReversed,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      
    });
  }
  moveDescription(move){
    let currentBoard = this.state.history[move].squares;
    let pastBoard = this.state.history[move-1].squares;
    
    for( let i = 0; i<9 ; i++){
       if (currentBoard[i] !== pastBoard[i]){
         return `player:${currentBoard[i]}, col:${Math.trunc(i/3)+1}, row:${i%3+1}`;
       }
    }
    
  }
  render() {
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const [winner,lines] = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + (move ? `(${this.moveDescription(move)})`: "") :
        'Go to game start';
      return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{move !== this.state.stepNumber  ? (desc):(<b>{desc}</b>)}</button>
        </li>
      );
    });
    
    if(this.state.showHistoryReversed){
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {

      if(moves.length === 10)
        status = Game.DRAWMESAGE;
      else
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
   
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerlines = {lines}
            draw = {status === Game.DRAWMESAGE}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick = {()=>{this.reverseHistoryView()}}>{this.state.showHistoryReversed ? "Switch to Ordered":"Switch to Reversed"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
