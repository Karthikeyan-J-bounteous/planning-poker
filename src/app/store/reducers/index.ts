// src/app/store/reducers/index.ts
import { ActionReducerMap } from '@ngrx/store';
import { gameReducer } from './game.reducer';
import { playersReducer, activePlayerIdReducer } from './player.reducer';
import { AppState } from 'src/app/interface/state.interface';

export const reducers: ActionReducerMap<AppState> = {
  game: gameReducer,
  players: playersReducer,
  activePlayerId: activePlayerIdReducer,
};
