// src/app/mock-data/mock-data.ts
import { Game} from "../interface/game.interface";
import { Player } from "../interface/player.interface";

export const mockGame: Game = {
  canChangeCard: false,
  deck: 1,
  id: '',
  reveal: true,
  mode: 'fibonacci',
  name: '',
  rounding: true,
  playerIds: [],
};

export const mockPlayer: Player = {
    hasSelectedCard: false,
    id: '',
    isPlaying: true,
    isPresent: true,
    name: '',
    role: 'player',
  }

export const mockPlayers: Player[] = [
  mockPlayer
];
