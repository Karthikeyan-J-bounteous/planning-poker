import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SocketService } from 'src/app/services/socket.service';
import { requestCreateSession, createSessionSuccess, createSessionFailure, createGame } from '../actions/game.actions';
import { addPlayer, setActivePlayerId } from '../actions/player.actions';
import { switchMap, map, catchError, concatMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private socketService: SocketService,
    private router: Router
  ) {}

// 1. When requesting to create session
requestCreateSession$ = createEffect(() =>
  this.actions$.pipe(
    ofType(requestCreateSession),
    switchMap(({ game, playerName }) => {
      const payload = { game, playerName }; // 👈 send both together
      return this.socketService.emitWithAck('create-session', payload).pipe(
        tap((response: any) => {
          const gameId = response.game.id;
          this.socketService.joinGame(gameId);

          this.socketService.listen('game-expired').subscribe((data) => {
            console.warn('Game expired:', data);
            alert(data.message);
            this.router.navigate(['/']);
          });
        }),
        map((response: any) => createSessionSuccess({ game: response.game, player: response.player })),
        catchError((error) => of(createSessionFailure({ error: error.message || 'Session creation failed' })))
      );
    })
  )
);
  

  // 2. When session creation is successful
  createSessionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSessionSuccess),
      concatMap(({ game, player }) => [
        createGame({ game }),  // ✅ Create game
        addPlayer({ player }), // ✅ Add player
        setActivePlayerId({ activePlayerId: player.id }) // ✅ Set active player
      ])
    )
  );

  // 3. Navigate after success separately (dispatch: false)
  navigateAfterCreateSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSessionSuccess),
      tap(({ game }) => {
        this.router.navigate(['/home', game.id]);
      })
    ),
    { dispatch: false } // 👈 Very important here!
  );

    // 3. Handle session creation failure (Optional: add snackbar etc.)
    createSessionFailure$ = createEffect(() =>
        this.actions$.pipe(
          ofType(createSessionFailure),
          tap(({ error }) => {
            console.error('Session creation failed:', error);
            // 👇 Show snackbar/toast here if needed
            // this.snackbarService.showError('Failed to create session');
          })
        ),
        { dispatch: false }
      );

}
