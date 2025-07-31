import { createAction, props } from '@ngrx/store';
import { Game } from 'src/app/interface/game.interface';
import { Player } from 'src/app/interface/player.interface';

// 1. Request to create a session (send minimal data)
export const requestCreateSession = createAction(
  '[Game/API] Request Create Session',
  props<{ game: Game; playerName: String }>()
);

// 2. Successful creation (backend response)
export const createSessionSuccess = createAction(
  '[Game/API] Create Session Success',
  props<{ game: Game; player: Player }>()
);

// 3. Failure to create session
export const createSessionFailure = createAction(
  '[Game/API] Create Session Failure',
  props<{ error: string }>()
);

// 4. Local store actions
export const createGame = createAction(
  '[Game] Create Game',
  props<{ game: Game }>()
);

export const resetStore = createAction(
  '[App] Reset Store'
);

export const updateGame = createAction(
  '[Game] Update Game',
  props<{ game: Game }>()
);
