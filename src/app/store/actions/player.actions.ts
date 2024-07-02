// src/app/store/actions/player.actions.ts
import { createAction, props } from '@ngrx/store';
import { Player } from 'src/app/interface/player.interface';

export const addPlayer = createAction(
  '[Player] Add Player',
  props<{ player: Player }>()
);

export const addNewPlayer = createAction(
  '[Player] Add New Player',
  props<{ player: Player }>()
);

export const updatePlayer = createAction(
  '[Player] Update Player',
  props<{ player: Player }>()
);

export const setActivePlayerId = createAction( // Add this action
  '[Player] Set Active Player Id',
  props<{ activePlayerId: any }>()
);

export const updatePlayerName = createAction( // New action
  '[Player] Update Player Name',
  props<{ id: string, name: string }>()
);
