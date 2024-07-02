import { createReducer, on, Action } from '@ngrx/store';
import { Game } from 'src/app/interface/game.interface';
import { updateGame } from 'src/app/store/actions/game.actions';

export const initialState: Game = {
  canChangeCard: false,
  deck: 0,
  id: '',
  isRoom: false,
  mode: '',
  name: '',
  rounding: false,
  playerIds: []
};

const _gameReducer = createReducer(
  initialState,
  on(updateGame, (state, { game }) => ({ ...state, ...game }))
);

export function gameReducer(state: Game | undefined, action: Action) {
  return _gameReducer(state, action);
}
