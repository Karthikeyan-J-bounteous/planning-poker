import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../interface/game.interface';
import { AppState } from '../interface/state.interface';
import { Store } from '@ngrx/store';
import { Clipboard } from '@capacitor/clipboard';
import { updateGame } from '../store/actions/game.actions';
import { mockGame } from '../mocks/mock-data';
import { Player } from '../interface/player.interface';
import { selectActivePlayerId, selectPlayers } from '../store/selectors/player.selectors';
import { updatePlayer } from '../store/actions/player.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  playerName: string = "";
  isSpectating?: string;
  isAdmin: boolean = false;

  public game$?: Observable<Game>;
  public players$?: Observable<Player[]>;
  public activeId$?: Observable<string | null>;

  public gameData: Game = { ...mockGame };
  public playersData: Player[] = [];
  public playerDetail: Player = {} as Player;
  public activePlayerId: string | null = null;

  public gameName: string = '';
  public userEntered: boolean = false;
  public gameUrl: string = '';

  selectedDeck: string = 'modifiedFibonacci';
  selectedRound: string = 'down';
  revealCards: string = 'yes';
  selectedChange: string = "yes";
  decks: string[] = ['fibonaci', 'modifiedFibonacci', 'shirtSizes']

  constructor(
    private store: Store<AppState>,
    private menuCtrl: MenuController,
  ) {
    this.game$ = this.store.select('game');
    this.players$ = this.store.select(selectPlayers);
    this.activeId$ = this.store.select(selectActivePlayerId);
  }

  ngOnInit() {
    // Ensure observables are non-null
    const game$ = this.game$ ?? of({} as Game);
    const players$ = this.players$ ?? of([]);
    const activeId$ = this.activeId$ ?? of(null);

    combineLatest([game$, players$, activeId$]).pipe(
      map(([gameData, playersData, activeId]) => {
        this.gameData = { ...gameData };
        this.gameName = gameData.name;
        this.userEntered = !!gameData?.id?.length;
        this.gameUrl = gameData.id.length ? `https://www.planning-poker.com/home/${gameData.id}` : '';

        this.playersData = [...playersData];
        this.activePlayerId = activeId;

        const playerData = this.playersData.find(user => user.id === activeId);
        if (playerData) {
          this.playerDetail = { ...this.playerDetail, ...playerData };
          this.playerName = this.playerDetail.name;
          this.isSpectating = this.playerDetail.isPlaying ? 'no' : 'yes';
        }
      })
    ).subscribe();
  }

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.gameUrl
    });
  };

  openFirstMenu(type: string) {
    this.menuCtrl.open(type + '-menu');
  }

  updateGameName() {
    this.store.dispatch(updateGame({ game: { ...this.gameData, name: this.gameName } }));
  }

  selectRounding() {
    this.store.dispatch(updateGame({ game: { ...this.gameData, rounding: this.selectedRound === 'up' } }));
  }

  selectDeck() {
    const deckIndex = this.decks.indexOf(this.selectedDeck);
    this.store.dispatch(updateGame({ game: { ...this.gameData, deck: deckIndex, mode: this.selectedDeck } }));
  }

  selectChange() {
    this.store.dispatch(updateGame({ game: { ...this.gameData, canChangeCard: this.selectedChange === 'yes' } }));
  }
  revealCard(){
    this.store.dispatch(updateGame({ game: { ...this.gameData, reveal: this.revealCards === 'yes' } }));
  }

  updatePlayerName() {
    this.store.dispatch(updatePlayer({ id: this.activePlayerId, player: { name: this.playerName } }));
  }

  toggleSpect() {
    this.store.dispatch(updatePlayer({ id: this.activePlayerId, player: { isPlaying: !(this.isSpectating === 'yes'), selectedCard:"", hasSelectedCard: false } }));
  }
}
