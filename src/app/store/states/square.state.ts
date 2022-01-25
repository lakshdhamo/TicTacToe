import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, Observable, of } from 'rxjs';
import { SquareStateModel } from '../model/square.state.model';
import { RedoSquare, ResetSquare, UndoSquare, UpdateSquare } from './../actions/square.action';

@State<SquareStateModel>({
  name: 'Squares',
  defaults: {
    squares: [] = Array(9).fill({ player: "", win: false, index: 0 }),
    actions: [],
    undoActions: []
  }
})
@Injectable()
export class SquareState {

  constructor() {
  }

  @Selector()
  static getSquareList(state: SquareStateModel) {
    return state.squares;
  }

  @Selector()
  static getActionList(state: SquareStateModel) {
    return state.actions;
  }

  @Selector()
  static getUndoList(state: SquareStateModel) {
    return state.undoActions;
  }

  @Action(UpdateSquare)
  updateSquare({ getState, setState }: StateContext<SquareStateModel>, { payload }: UpdateSquare) {
    // Get the state
    const state = getState();

    // Add payload to Action list
    const actins = [...state.actions];
    actins.push(payload);

    // Update the Square state
    const squareList = [...state.squares];
    squareList[payload.index] = payload;

    // Set the state
    setState({
      ...state,
      squares: squareList,
      actions: actins
    });
    return;
  }

  @Action(UndoSquare)
  undoSquare({ getState, setState }: StateContext<SquareStateModel>, { }: UndoSquare) {
    // Get the state
    const state = getState();

    // Remove payload from Action list
    const actions = [...state.actions];
    const payload = actions.pop();

    // Add payload to Undo list
    const undoActions = [...state.undoActions];
    if (payload) {
      undoActions.push(payload);
    }

    // Update the Square state
    const squareList = [...state.squares];
    if (payload) {
      squareList[payload.index] = { player: "", win: false, index: 0 };
    }

    // Set the state
    setState({
      ...state,
      squares: squareList,
      actions: actions,
      undoActions: undoActions
    });
    return;

  }

  @Action(RedoSquare)
  redoSquare({ getState, setState }: StateContext<SquareStateModel>, { }: RedoSquare) {
    // Get the state
    const state = getState();

    // Remove payload from Undo list
    const undoActions = [...state.undoActions];
    const payload = undoActions.pop();

    // Add payload to Action list
    const actions = [...state.actions];
    if (payload) {
      actions.push(payload);
    }

    // Update the Square state
    const squareList = [...state.squares];
    if (payload) {
      squareList[payload.index] = payload;
    }

    // Set the state
    setState({
      ...state,
      squares: squareList,
      actions: actions,
      undoActions: undoActions
    });
    return;

  }

  @Action(ResetSquare)
  resetState(ctx: StateContext<SquareStateModel>): Observable<SquareStateModel> {
    return of(ctx.getState()).pipe(
      map(currentState => {
        ctx.patchState({
          squares: [] = Array(9).fill({ player: "", win: false, index: 0 }),
          actions: [],
          undoActions: []
        });
        return currentState;
      })
    );
  }

}
