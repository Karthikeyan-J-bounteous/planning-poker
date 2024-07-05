import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, of } from 'rxjs';
import { Game } from 'src/app/interface/game.interface';
import { Player } from 'src/app/interface/player.interface';
import { AppState } from 'src/app/interface/state.interface';
import { mockGame } from 'src/app/mocks/mock-data';
import { updateGame } from 'src/app/store/actions/game.actions';
import { clearPlayerSelection, updatePlayer } from 'src/app/store/actions/player.actions';
import { selectActivePlayerId, selectPlayers } from 'src/app/store/selectors/player.selectors';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent  implements OnInit {

  @ViewChild('cardContainer') cardContainer ?: ElementRef<HTMLDivElement>;

  isOverflowing: boolean = false;

  public game$?: Observable<Game>;
  public players$?: Observable<Player[]>;
  public activeId$?: Observable<string | null>;
  public playerDetail: Player = {} as Player;
  public isAdmin ?: boolean = false;

  isSpectating?: boolean;

  cards = [
    ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
    ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '49', '100'],
    ['XS', 'S', 'M', 'L', 'XL']];

    selectedDeck : number = 1;

  isClicked: string | undefined = undefined;

  public gameData: Game = { ...mockGame };
  public playersData: Player[] = [];
  public activePlayerId: string | null = null;

  constructor(
    private store: Store<AppState>,
  ) { 
    this.game$ = this.store.select('game');
    this.players$ = this.store.select(selectPlayers);
    this.activeId$ = this.store.select(selectActivePlayerId);
  }

  ngOnInit() {

    const game$ = this.game$ ?? of({} as Game);
    const players$ = this.players$ ?? of([]);
    const activeId$ = this.activeId$ ?? of(null);

    combineLatest([game$, players$, activeId$]).pipe(
      map(([gameData, playersData, activeId]) => {
        this.gameData = { ...gameData };
        this.selectedDeck = this.gameData.deck;

        this.playersData = [...playersData];
        this.activePlayerId = activeId;

        const playerData = this.playersData.find(user => user.id === activeId);
        if (playerData) {
          this.playerDetail = { ...this.playerDetail, ...playerData };
          this.isSpectating = !this.playerDetail.isPlaying;
          this.isAdmin = this.playerDetail.role == 'host';
          this.isClicked = !this.isSpectating? this.playerDetail.selectedCard : undefined;
        }
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.checkOverflow();
    window.addEventListener('resize', () => this.checkOverflow());
  }

  checkOverflow() {
    const container = this.cardContainer?.nativeElement;
    if(container)
    this.isOverflowing = container.scrollWidth > container.clientWidth;
  }

  click(val : string){
    if(val == this.isClicked || this.isSpectating || (this.gameData.show && !this.gameData.canChangeCard)) return;
    this.isClicked = val;
    this.store.dispatch(updatePlayer({ id: this.activePlayerId, player: { selectedCard: this.isClicked, hasSelectedCard: !!this.isClicked } }));
  }

  clickReveal(){
    if(this.gameData.show)  this.store.dispatch(clearPlayerSelection());
    this.gameData.show = !this.gameData.show;
    this.store.dispatch(updateGame({game: this.gameData}));
  }

}
