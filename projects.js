// 1. Deposite some money
// 2. Determine number of lines to bet on
// 3. Collect a bet mount
// 4. Spin the slot Machine
// 5. Check if you won
// 6. give the user their win
// 7. Play again

const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}


const deposit = () => {
    while (true) {
        const depositeAmount = prompt("Enter a deposit a mount: ");
        const numberDepositAmount = parseFloat(depositeAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.")
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter The Number of Line to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of Lines, try again.")
        } else {
            return numberOfLines;
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the Total per bet: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.")
        } else {
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbol = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbol.length)
            const selectedSymbol = reelSymbol[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbol.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const row = [];

    for (let i = 0; i < ROWS; i++) {
        row.push([]);
        for (let j = 0; j < COLS; j++) {
            row[i].push(reels[j][i])
        }
    }

    return row;
};

const printRow = (row) => {
    for (const rows of row) {
        let rowString = "";
        for (const [i, symbol] of rows.entries()) {
            rowString += symbol
            if (i != rows.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }

    return winnings;
};

const game = () => {

    let balance = deposit();
    while (true) {
        console.log("You have a balance of $ " + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reel = spin();
        const rows = transpose(reel);
        printRow(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You run out of money!")
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?")

        if (playAgain != "y") break;
    }
}

game();
