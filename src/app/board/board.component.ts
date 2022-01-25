import { Component, OnInit } from "@angular/core";
import { Store } from '@ngxs/store';
import { ScoreSheet } from "../scoresheet/ScoreSheet";
import { BoardService } from "../services/board/board.service";
import { ScoreService } from "../services/score/score.service";
import { SquareStateModel } from "../store/model/square.state.model";
import { RedoSquare, ResetSquare, UndoSquare, UpdateSquare } from './../store/actions/square.action';

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  playerTurn!: boolean;
  winner!: string | null;
  isDraw!: boolean | undefined;
  playerXwins!: number;
  playerOwins!: number;
  disable = false;

  //* Injecting ScoreService
  constructor(private scoreService: ScoreService,
    public boardService: BoardService,
    private store: Store
  ) { }

  ngOnInit() {
    //* Intializing the Game
    this.newGame();
    this.playerXwins = 0;
    this.playerOwins = 0;
  }

  // Fires when user clicks New Game button
  newGame() {
    //* Resetting Game
    this.store.dispatch(new ResetSquare());
    this.playerTurn = true;
    this.winner = null;
    this.isDraw = false;
    this.disable = false;
    this.boardService.moves = [];
  }

  get playerMarker() {
    return this.playerTurn ? "X" : "O";
  }

  // Fires when user clicks square
  action(index: number) {
    //* Checks whether square is empty
    if (this.boardService.squares[index].player === "") {
      //* Replaces empty square with playerMarker
      this.store.dispatch(new UpdateSquare({ player: this.playerMarker, win: false, index: index }));
      //* Switches turn
      this.playerTurn = !this.playerTurn;
    }

    // Check the winning status
    this.checkStatus(index);
  }

  // Fires when user clicks Undo button
  undo() {
    this.store.dispatch(new UndoSquare());
    this.playerTurn = !this.playerTurn;
    this.boardService.popMove();
  }

  // Fires when user clicks Redo button
  redo() {
    this.store.dispatch(new RedoSquare());
    this.playerTurn = !this.playerTurn;

    // Gets the last action and find the Index of it.
    const state = this.store.selectSnapshot<any>((state: SquareStateModel) => state);
    let index = state.Squares.actions.slice(-1)[0].index

    // Make the move
    this.boardService.updateMoves(index);
  }

  // Checks winning status
  checkStatus(index: number) {
    //* Check for Winner
    let status = this.boardService.checkStatus(index);

    // Make necessary changes for UI update
    switch (status) {
      case "X":
        this.playerXwins += 1;
        this.winner = status;
        break;
      case "O":
        this.playerOwins += 1;
        this.winner = status;
        break;
      case "Draw":
        this.isDraw = true;
        break;
      case "Pending":

        break;
      default:

        break;
    }

    // Disable the squares
    if (this.winner !== null) {
      this.disable = true;
    }

    //* Update the Score sheet
    this.scoreService.publish(
      new ScoreSheet(this.playerXwins, this.playerOwins)
    );
  }

}
