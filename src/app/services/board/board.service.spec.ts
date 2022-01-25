import { UndoSquare, RedoSquare } from './../../store/actions/square.action';
import { Square } from './../../square/square';
import { BoardService } from './board.service';
import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from '@ngxs/store';
import { SquareState } from 'src/app/store/states/square.state';
import { ResetSquare, UpdateSquare } from 'src/app/store/actions/square.action';
import { InitialState } from '@ngxs/store/internals';

// State initial state
export const INITIAL_STATE = {
  name: 'Squares',
  defaults: {
    squares: [] = Array(9).fill({ player: "", win: false, index: 0 }),
    actions: [],
    undoActions: []
  }
};

describe('board service', () => {

  let boardService: BoardService;
  let store: Store;
  let squares = Array(9).fill({ player: "", win: false, index: 0 });

  beforeEach(() => {

    // Configuration
    TestBed.configureTestingModule(
      {
        imports: [NgxsModule.forRoot([SquareState])],
        providers: [BoardService]
      }
    );

    boardService = TestBed.inject(BoardService);
    store = TestBed.inject(Store);

    // Setting up initial state
    store.reset({
      ...store.snapshot(),
      squares: INITIAL_STATE
    });

  })

  it("initial state", () => {
    const square = store.selectSnapshot(state => state.squares);
    expect(square).toEqual(INITIAL_STATE);
  });

  it("update state", () => {
    store.dispatch(new UpdateSquare({ ...squares[0], win: true }));
    const square = store.selectSnapshot(SquareState);
    expect(square.squares[0]).toEqual({ player: "", win: true, index: 0 });
  });

  it("reset state", () => {
    store.dispatch(new ResetSquare());
    const square = store.selectSnapshot(SquareState);
    expect(square.squares).toEqual(INITIAL_STATE.defaults.squares);
  });

  it("undo/redo state", () => {
    // Action
    store.dispatch(new UpdateSquare({ ...squares[0], win: true }));
    let square = store.selectSnapshot(SquareState);
    expect(square.squares[0]).toEqual({ player: "", win: true, index: 0 });

    // Undo
    store.dispatch(new UndoSquare());
    square = store.selectSnapshot(SquareState);
    expect(square.squares[0]).toEqual({ player: "", win: false, index: 0 });

    // Redo
    store.dispatch(new RedoSquare());
    square = store.selectSnapshot(SquareState);
    expect(square.squares[0]).toEqual({ player: "", win: true, index: 0 });

  });


});
