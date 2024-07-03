import { createAction, props } from '@ngrx/store';
import { Game } from 'src/app/interface/game.interface';

export const updateGame = createAction(
  '[Game] Update Game',
  props<{ game: Game }>()
);

export const resetStore = createAction('[App] Reset Store');