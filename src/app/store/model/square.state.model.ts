import { Square } from "src/app/square/square";

export class SquareStateModel {
  squares!: Square[];
  actions!: Square[];
  undoActions!: Square[];
}
