import { Square } from "src/app/square/square";

export class UpdateSquare {
  static readonly type = '[Square] Update';

  constructor(public payload: Square) {
  }
}

export class ResetSquare {
  static readonly type = '[Square] Reset';

  constructor() {
  }
}

export class UndoSquare {
  static readonly type = '[Square] Undo';

  constructor() {
  }
}

export class RedoSquare {
  static readonly type = '[Square] Redo';

  constructor() {
  }
}
