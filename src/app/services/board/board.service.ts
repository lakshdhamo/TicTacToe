import { Injectable } from "@angular/core";
import { Square } from "src/app/square/square";
import { Select, Store, Action } from '@ngxs/store';
import { Observable } from "rxjs";
import { SquareState } from "src/app/store/states/square.state";
import { UpdateSquare } from "src/app/store/actions/square.action";

@Injectable({
  providedIn: "root"
})
export class BoardService {
  squares!: Square[];
  lastAction!: Square;
  disableUndo!: boolean;
  disableRedo!: boolean;
  moves: number[][] = [];

  @Select(SquareState.getSquareList) squareList!: Observable<Square[]>;
  @Select(SquareState.getActionList) hasActions!: Observable<Square[]>;
  @Select(SquareState.getUndoList) hasUndoActions!: Observable<Square[]>;

  constructor(private store: Store) {
    this.squareList.subscribe(
      (data) => this.squares = data
    );

    // Action selector subscribtion
    this.hasActions.subscribe(
      (data) => {
        this.disableUndo = data.length > 0 ? false : true;
        this.lastAction = data.slice(-1)[0];
      }
    );

    // Undo Action selector subscribtion
    this.hasUndoActions.subscribe(
      (data) => {
        this.disableRedo = data.length > 0 ? false : true;
      }
    );
  }

  // Generate move from Index and update the moves
  updateMoves(index: number): void {
    var row = Math.floor(index / 3);
    var col = index % 3;
    this.moves.push([row, col])
  }

  // Removes the last element from the moves array
  popMove() {
    this.moves.pop();
  }

  // If someone wins, then disable the Undo/Redo
  checkStatus(index: number): string {
    let status = this.tictactoe(index);
    if (status == "X" || status == "O") {
      this.disableRedo = true;
      this.disableUndo = true;
    }
    return status;
  }

  // Update the win status for successful row
  updateRowWinStatus(row: number, totalRowCount: number) {
    let i = row * totalRowCount;
    let maxRow = i + totalRowCount;
    for (i; i < maxRow; i++) {
      this.store.dispatch(new UpdateSquare({ ...this.squares[i], win: true }))
    }
  }

  // Update the win status for successful column
  updateColWinStatus(col: number, totalColCount: number) {
    for (let i = 0; i < totalColCount; i++) {
      this.store.dispatch(new UpdateSquare({ ...this.squares[col], win: true }));
      col = col + totalColCount;
    }
  }

  // Update the win status for diagonal squares
  updateDiagWinStatus(totalColCount: number) {
    let index = 0;
    for (let i = 0; i < totalColCount; i++) {
      this.store.dispatch(new UpdateSquare({ ...this.squares[index], win: true }));
      index = index + totalColCount + 1;
    }
  }

  // Update the win status for antidiagonal squares
  updateAntiDiagWinStatus(totalColCount: number) {
    let index = totalColCount - 1;
    for (let i = 0; i < totalColCount; i++) {
      this.store.dispatch(new UpdateSquare({ ...this.squares[index], win: true }));
      index = index + totalColCount - 1;
    }
  }

  // TicTacToe algorithm to find winner.
  tictactoe(index: number): string {
    this.updateMoves(index);

    //  n stands for the size of the board, n = 3 for the current game.
    let boardSize: number = 3;

    // Method returns if moves are not sufficient
    if (this.moves.length <= boardSize * 2 - 2)
      return "Pending";

    //  Use rows and cols to record the value on each row and each column.
    //  diag1 and diag2 to record value on diagonal or anti-diagonal.
    let cols: number[] = new Array(boardSize).fill(0);
    let rows: number[] = new Array(boardSize).fill(0);
    let anti_diag: number = 0;
    let diag: number = 0;
    //  Two players having value of 1 and -1, player_1 with value = 1 places first.
    let player: number = 1;
    for (let move of this.moves) {
      //  Get the row number and column number for this move.
      let col: number = move[1];
      let row: number = move[0];
      //  Update the row value and column value.
      rows[row] = (rows[row] + player);
      cols[col] = (cols[col] + player);
      //  If this move is placed on diagonal or anti-diagonal,
      //  we shall update the relative value as well.
      if ((row == col)) {
        diag = (diag + player);
      }

      if (((row + col) == (boardSize - 1))) {
        anti_diag = (anti_diag + player);
      }

      //  Check if this move meets any of the winning conditions.
      if (Math.abs(rows[row]) == boardSize) {
        // If rows are matchings, then update the rows to Win
        this.updateRowWinStatus(row, boardSize);
        return player == 1 ? "X" : "O";
      } else if (Math.abs(cols[col]) == boardSize) {
        // If columns are matchings, then update the columns to Win
        this.updateColWinStatus(col, boardSize);
        return player == 1 ? "X" : "O";
      }
      else if (Math.abs(diag) == boardSize) {
        // If diagonal are matchings, then update the squares to Win
        this.updateDiagWinStatus(boardSize);
        return player == 1 ? "X" : "O";
      }
      else if (Math.abs(anti_diag) == boardSize) {
        // If anti-diagonal are matchings, then update the squares to Win
        this.updateAntiDiagWinStatus(boardSize);
        return player == 1 ? "X" : "O";
      }

      //  If no one wins so far, change to the other player alternatively.
      //  That is from 1 to -1, from -1 to 1.
      player = (player * -1);
    }

    //  If all moves are completed and there is still no result, we shall check if
    //  the grid is full or not. If so, the game ends with draw, otherwise pending.
    return this.moves.length == boardSize * boardSize ? "Draw" : "Pending";

  }

}
