// src/app/store/selectors/player.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Player } from 'src/app/interface/player.interface';
import { AppState } from 'src/app/interface/state.interface';

export const selectPlayersState = createFeatureSelector<AppState, Player[]>('players');

export const selectPlayers = createSelector(
  selectPlayersState,
  (state: Player[]) => state
);

export const selectPlayerById = (playerId: string) => createSelector(
  selectPlayersState,
  (players: Player[]) => players.find(player => player.id === playerId)
);

export const selectActivePlayerId = createSelector(
  (state: AppState) => state.activePlayerId,
  (activePlayerId) => activePlayerId
);
