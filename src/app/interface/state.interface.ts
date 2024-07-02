// src/app/models/state.model.ts
import { Game } from "./game.interface";
import { Player } from "./player.interface";

export interface AppState {
  game: Game;
  players: Player[];
  activePlayerId: string | null;
}
