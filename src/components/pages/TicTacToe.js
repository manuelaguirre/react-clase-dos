/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './TicTacToe.css';
import FancyButton from '../small/FancyButton';

/*
  Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente
  TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

  Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
  La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
  Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
  {
    tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
    currentPlayer: // un string que representa el jugador actual ('X' o 'O')
    winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
    gameEnded: // un booleano que representa si el juego terminó o no
    setTileTo: // una función que se ejecutará en cada click
    restart: // una función que vuelve a setear el estado original del juego
  }

  Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
  Esto les dará algunas pistas
*/
const fullRow = (symbol, tiles) => {
  for (let i = 0; i < tiles.length; i += 3) {
    if (symbol === tiles[i] && tiles[i] === tiles[i + 1] && tiles[i + 1] === tiles[i + 2]) {
      return true;
    }
  } return null;
};

const fullColumn = (symbol, tiles) => {
  for (let i = 0; i < tiles.length / 3; i += 1) {
    if (symbol === tiles[i] && tiles[i] === tiles[i + 3] && tiles[i + 3] === tiles[i + 6]) {
      return true;
    }
  } return null;
};

const fullDiagonal = (symbol, tiles) => {
  for (let i = 1; i < 3; i += 1) {
    if (symbol === tiles[4] && tiles[4] === tiles[4 - 2 * i] && tiles[4] === tiles[4 + 2 * i]) {
      return true;
    }
  } return null;
};

const fullBoard = (tiles) => !tiles.includes('');

const victoryX = (tiles) => (fullColumn('X', tiles) || fullDiagonal('X', tiles) || fullRow('X', tiles));
const victory0 = (tiles) => (fullColumn('O', tiles) || fullDiagonal('O', tiles) || fullRow('O', tiles));


const Square = ({ value, onClick = () => {} }) => (
  <div onClick={onClick} className="square">
    {value}
  </div>
);
Square.propTypes = {
  value: PropTypes.oneOf(['X', 'O', '']),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => {} }) => (
  <div className={cx('winner-card', { 'winner-card--hidden': !show })}>
    <span className="winner-card-text">
      {winner ? `Player ${winner} has won the game!` : "It's a tie!"}
    </span>
    <FancyButton onClick={onRestart}>Play again?</FancyButton>
  </div>
);

WinnerCard.propTypes = {
  // Esta propiedad decide si el componente se muestra o está oculto
  // También se podría mostrar el componente usando un if (&&), pero usamos esta prop para mostrar los estilos correctamente.
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(['X', 'O']),
  onRestart: PropTypes.func,
};
// eslint-disable-next-line no-nested-ternary
const getWinner = (tiles) => (victoryX(tiles) ? 'X' : victory0(tiles) ? 'O' : null);
// calcular el ganador del partido a partir del estado del tablero
// (existen varias formas de calcular esto, una posible es listar todos los
// casos en los que un jugador gana y ver si alguno sucede)


const useTicTacToeGameState = (initialPlayer) => {
  const [tiles, setTiles] = React.useState(['', '', '', '', '', '', '', '', '']);
  const [currentPlayer, setCurrentPlayer] = React.useState(initialPlayer);
  const winner = getWinner(tiles);
  const gameEnded = !!winner || fullBoard(tiles);

  const setTileTo = (tileIndex, player) => {
    // convertir el tile en la posición tileIndex al jugador seleccionado
    // ejemplo: setTileTo(0, 'X') -> convierte la primera casilla en 'X'
    const newTiles = tiles;
    newTiles[tileIndex] = player;
    setTiles(newTiles);
    const newPlayer = player === 'X' ? 'O' : 'X';
    setCurrentPlayer(newPlayer);
    return null;
  };
  const restart = () => {
    const newTiles = ['', '', '', '', '', '', '', '', ''];
    setTiles(newTiles);
    setCurrentPlayer('X');
  };

  // por si no reconocen esta sintáxis, es solamente una forma más corta de escribir:
  // { tiles: tiles, currentPlayer: currentPlayer, ...}
  return {
    tiles, currentPlayer, winner, gameEnded, setTileTo, restart,
  };
};


const TicTacToe = () => {
  const {
    tiles, currentPlayer, winner, gameEnded, setTileTo, restart,
  } = useTicTacToeGameState('X');

  const rows = [tiles.slice(0, 3), tiles.slice(3, 6), tiles.slice(6, 9)];

  return (
    <div className="tictactoe">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="tictactoe-row">
          {row.map((tile, index) => <Square key={rowIndex + index} value={tile} onClick={tile ? null : () => { setTileTo(rowIndex * 3 + index, currentPlayer); }} />)}
        </div>
      ))}
      <WinnerCard show={gameEnded} winner={winner} onRestart={restart} />
    </div>
  );
};

export default TicTacToe;
