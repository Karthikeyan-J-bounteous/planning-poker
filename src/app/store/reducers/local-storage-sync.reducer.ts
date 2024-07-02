// reducers/local-storage-sync.reducer.ts
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from 'src/app/interface/state.interface';

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({ keys: ['game', 'players', 'activePlayerId'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<AppState>> = [localStorageSyncReducer];
