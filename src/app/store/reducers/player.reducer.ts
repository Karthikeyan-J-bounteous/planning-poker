// src/app/store/reducers/player.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Player } from 'src/app/interface/player.interface';
import { addPlayer, updatePlayer, setActivePlayerId, updatePlayerName, addNewPlayer, clearPlayerSelection } from 'src/app/store/actions/player.actions';
import { resetStore } from '../actions/game.actions';

export const initialPlayersState: Player[] = [];

const _playersReducer = createReducer(
  initialPlayersState,
  on(addNewPlayer, (state, { player }) => [player]),
  on(addPlayer, (state, { player }) => [...state, player]),
  on(updatePlayer, (state, { id, player }) => state.map(p => p.id === id ? { ...p, ...player } : p)),
  on(updatePlayerName, (state, { id, name }) => state.map(p => p.id === id ? { ...p, name } : p)),
  on(resetStore, () => initialPlayersState),
  on(clearPlayerSelection, (state) => state.map(p => ({ ...p, selectedCard: "" }))),
);

export function playersReducer(state: Player[] | undefined = initialPlayersState, action: Action) {
  return _playersReducer(state, action);
}

const initialActivePlayerIdState: any = '';

const _activePlayerIdReducer = createReducer(
  initialActivePlayerIdState,
  on(setActivePlayerId, (_state, { activePlayerId }) => activePlayerId),
  on(resetStore, () => initialActivePlayerIdState)
);

export function activePlayerIdReducer(state: string | null = initialActivePlayerIdState, action: Action) {
  return _activePlayerIdReducer(state, action);
}
