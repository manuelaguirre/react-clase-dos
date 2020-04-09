/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './memoTest.css';
import FancyButton from '../small/FancyButton';



const Card = ({ value, cardNumber, onClick = () => {} }) => (
    <div
        onClick={onClick}
        className={cx('memo-card', 'cuadro', cardNumber, { 'memo-card-face-up': value === 'card-face-up' },
            { 'memo-card-clear': value === 'card-clear' })}
    >
        {' '}
        <div className="cuadro-inner">
            <div className="cuadro-front" />
            <div className="cuadro-back" />
        </div>
    </div>
);


Card.propTypes = {
    cardNumber: PropTypes.string,
    value: PropTypes.oneOf(['card-face-down', 'card-face-up', 'card-clear']),
    onClick: PropTypes.func,
};

const shuffleDeck = (deck) => {
    for (let index = deck.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor((Math.random() * (index + 1)));
        const b = deck[randomIndex];
        deck[randomIndex] = deck[index];
        deck[index] = b;
    }
};

const createDeck = () => {
    const initialDeck = ['carta01',
        'carta01',
        'carta02',
        'carta02',
        'carta03',
        'carta03',
        'carta04',
        'carta04',
        'carta05',
        'carta05',
        'carta06',
        'carta06',
        'carta07',
        'carta07',
        'carta08',
        'carta08'];
    shuffleDeck(initialDeck);
    const newGameBoard = initialDeck.map((element) => ({
        cardNumber: element,
        value: 'card-face-down',
    }));
    return newGameBoard;
};

const useMemoTestGameState = (initialDeck) => {
    const [boardState, setBoardState] = React.useState(initialDeck);
    const [isInputDisabled, setIsInputDisabled] = React.useState(false);
    const gameEnded = boardState.every(e => e.value === 'card-clear');
    const hideFaceUpCards = () => {
        const newBoardState = boardState.map((card) => (
            {...card, value : card.value === 'card-face-up' ? 'card-face-down' : card.value }));
        setBoardState(newBoardState);
    };

    const solveFaceUpCards = () => {
        const newBoardState = 
    boardState.map((card) => {
        return {...card, value : card.value === 'card-face-up' ? 'card-clear' : card.value};
    });
        setBoardState(newBoardState);
    };

    const blockUserInput = () => {
        setIsInputDisabled(true);
    };

    const unblockUserInput = () => {
        setIsInputDisabled(false);
    };

    const cardClickHandler = (index) => {
        const cards = [...boardState];
        if (cards[index].value === 'card-face-down') {
            cards[index].value = 'card-face-up';
            setBoardState(cards);
        }
        const faceUpCards = boardState.filter((card) => card.value === 'card-face-up');
        if (faceUpCards.length === 2) {
            blockUserInput();
            if (faceUpCards[0].cardNumber === faceUpCards[1].cardNumber) {
                setTimeout(() => {
                    solveFaceUpCards();
                    unblockUserInput();

                }, 1000);
            } else {
                setTimeout(() => {
                    hideFaceUpCards();
                    unblockUserInput();
                }, 1000);
            }
        }

        return null;
    };

    const restart = () => {
        setBoardState(createDeck());
    };

    return {
        boardState, gameEnded, cardClickHandler, restart , isInputDisabled
    };
};

const MemoTest = () => {
    const {
        boardState, gameEnded, cardClickHandler, restart, isInputDisabled
    } = useMemoTestGameState(createDeck());


    const cards = boardState;
    const rows = [cards.slice(0, 4), cards.slice(4, 8), cards.slice(8, 12), cards.slice(12, 16)];
    return (
        <>
            <div className= {cx('memotest', {'collapsed' : gameEnded})}>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="tictactoe-row">
                        {row.map((card, index) => (
                            <Card
                                key={4 * rowIndex + index}
                                value={card.value}
                                onClick={isInputDisabled ? ()=>{} : () => cardClickHandler(rowIndex * 4 + index)}
                                cardNumber={card.cardNumber}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div  className= {cx({'collapsed': !gameEnded})}><span>Juego Completado!
            </span>
            </div>
            <FancyButton onClick ={restart}>Reiniciar</FancyButton>
        </>
    );
};

export default MemoTest;
