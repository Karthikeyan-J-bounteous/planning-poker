import { createReducer, on, Action } from '@ngrx/store';
import { Game } from 'src/app/interface/game.interface';
import { resetStore, updateGame } from 'src/app/store/actions/game.actions';

export const initialState: Game = {
  canChangeCard: false,
  show: false,
  deck: 0,
  id: '',
  reveal: true,
  mode: 'modifiedFibonacci',
  name: '',
  rounding: true,
  playerIds: []
};

const _gameReducer = createReducer(
  initialState,
  on(updateGame, (state, { game }) => ({ ...state, ...game })),
  on(resetStore, () => initialState)
);

export function gameReducer(state: Game | undefined, action: Action) {
  return _gameReducer(state, action);
}
