import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, combineLatest, of } from 'rxjs';
import { Game } from '../interface/game.interface';
import { AppState } from '../interface/state.interface';
import { Store } from '@ngrx/store';
import { mockGame, mockPlayer } from '../mocks/mock-data';
import { resetStore, updateGame } from '../store/actions/game.actions';
import { Player } from '../interface/player.interface';
import { selectActivePlayerId, selectPlayers } from '../store/selectors/player.selectors';
import { setActivePlayerId, addPlayer, updatePlayerName } from '../store/actions/player.actions';
import { map, filter, switchMap, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {

  sessionId?: string | null;
  public game$?: Observable<Game>;
  public players$?: Observable<Player[]>;
  public activeId$?: Observable<string | null>;

  public card = true;

  @ViewChild('cardContainer') cardContainer?: ElementRef<HTMLDivElement>;
  isOverflowing: boolean = false;

  public playerData: Player = { ...mockPlayer };

  public playersData: Player[] = [];
  public gameData: Game = { ...mockGame };
  public activePlayerId: string | null = null;

  public alertInputs = [
    {
      name: 'dataInput',
      placeholder: 'Enter Name',
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private store: Store<AppState>
  ) {
    this.game$ = this.store.select('game');
    this.players$ = this.store.select(selectPlayers);
    this.activeId$ = this.store.select(selectActivePlayerId);
  }

  ngOnInit(): void {
    const game$ = this.game$ ?? of({} as Game);
    const players$ = this.players$ ?? of([]);
    const activeId$ = this.activeId$ ?? of(null);

    this.sessionId = this.route.snapshot.paramMap.get('sessionId');

    if (!this.sessionId) {
      this.store.dispatch(resetStore());
    }

    this.subscribeToStore(this.game$, 'Game Data');
    this.subscribeToStore(this.players$, 'Player Data');
    this.subscribeToStore(this.activeId$, 'ID Data');

    combineLatest([game$, players$, activeId$]).pipe(
      map(([gameData, playersData, activeId]) => {
        this.gameData = { ...gameData };

        this.playersData = [...playersData];
        this.activePlayerId = activeId;

        const playerData = this.playersData.find(user => user.id === activeId);
        if (playerData) {
          this.playerData = { ...this.playerData, ...playerData };
        }
      })
    ).subscribe();

    activeId$?.pipe(
      take(1),
      tap(activeId => {
        if (!activeId && this.sessionId) {
          this.initializePlayer();
        }
      }),
      filter(activeId => !!activeId),
      switchMap(activeId =>
        this.players$?.pipe(
          map(players => players.find(player => player.id === activeId))
        ) ?? of(null)
      )
    ).subscribe(player => {
      if (player) {
        this.playerData = player;
        if (!player.name.length) {
          this.askName();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.checkOverflow();
    window.addEventListener('resize', () => this.checkOverflow());
  }

  checkOverflow() {
    const container = this.cardContainer?.nativeElement;
    if (container)
      this.isOverflowing = container.scrollWidth > container.clientWidth;
  }

  initializePlayer(): void {
    const userId = this.generateId(Date.now().toString(), 20);
    this.playerData = { ...this.playerData, id: userId, isPlaying: true, isPresent: true, role: 'player' };
    this.gameData = { ...this.gameData, id: this.sessionId!, playerIds: [...this.gameData.playerIds, userId] };

    this.store.dispatch(updateGame({ game: this.gameData }));
    this.store.dispatch(addPlayer({ player: this.playerData }));
    this.store.dispatch(setActivePlayerId({ activePlayerId: userId }));
    this.askName();
  }

  subscribeToStore<T>(observable$: Observable<T> | undefined, label: string): void {
    observable$?.subscribe((data) => {
      console.log(label, data);
    });
  }

  async askName(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: this.alertInputs,
      backdropDismiss: false,
      animated: true,
      cssClass: 'custom-alert',
      buttons: [{
        text: 'ENTER',
        handler: (data) => this.handleNameInput(data)
      }],
      header: "Please enter your name"
    });
    await alert.present();
  }

  handleNameInput(data: { dataInput: string }): void {
    if (!data.dataInput.trim()) {
      this.askName();
      return;
    }
    const playerId = this.playerData.id;
    const playerName = data.dataInput.trim();
    this.store.dispatch(updatePlayerName({ id: playerId, name: playerName }));
  }

  generateId(prefix = '', length = 5): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomChars = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return prefix + randomChars;
  }

  startSession(): void {
    const userId = this.generateId(Date.now().toString(), 20);
    this.playerData = { ...this.playerData, id: userId, isPlaying: true, isPresent: true, role: 'host' };
    this.gameData = { ...this.gameData, playerIds: [...this.gameData.playerIds, userId] };

    const sessionId = this.generateId(new Date().getTime().toString(), 5);
    this.gameData = { ...this.gameData, id: sessionId };

    this.store.dispatch(updateGame({ game: this.gameData }));
    this.store.dispatch(addPlayer({ player: this.playerData }));
    this.store.dispatch(setActivePlayerId({ activePlayerId: userId }));

    this.router.navigate(['/home', sessionId]);
  }

  flipCard(card: any): void {
    this.card = !card;
  }
}
