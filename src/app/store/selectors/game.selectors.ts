// src/app/store/selectors/game.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Game } from 'src/app/interface/game.interface';

export const selectGameState = createFeatureSelector<Game>('game');

export const selectGame = createSelector(
  selectGameState,
  (state: Game) => state
);

