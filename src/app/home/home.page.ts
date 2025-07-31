import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, combineLatest, of } from 'rxjs';
import { Game } from '../interface/game.interface';
import { AppState } from '../interface/state.interface';
import { Store } from '@ngrx/store';
import { mockGame, mockPlayer } from '../mocks/mock-data';
import { resetStore, updateGame, createGame, requestCreateSession } from '../store/actions/game.actions';
import { Player } from '../interface/player.interface';
import { selectActivePlayerId, selectPlayers } from '../store/selectors/player.selectors';
import { setActivePlayerId, addPlayer, updatePlayerName } from '../store/actions/player.actions';
import { map, filter, switchMap, tap, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../services/socket.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class HomePage implements OnInit {

  sessionId?: string | null;
  public game$?: Observable<Game>;
  public players$?: Observable<Player[]>;
  public activeId$?: Observable<string | null>;

  public showCard = false;

  @ViewChild('cardContainer') cardContainer?: ElementRef<HTMLDivElement>;
  isOverflowing: boolean = false;

  public playerData: Player = { ...mockPlayer };

  public playersData: Player[] = [];
  public gameData: Game = { ...mockGame };
  public activePlayerId: string | null = null;
  public showID: boolean = false;
  public myForm: FormGroup;

  public alertInputs = [
    {
      name: 'dataInput',
      placeholder: 'Enter Name',
    }
  ];
  private existingSessionIds = ['session1', 'session2', 'session3'];
  private cards: Array<string>[] = [
    ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
    ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '49', '100'],
    ['XS', 'S', 'M', 'L', 'XL']
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private socketService: SocketService
  ) {
    this.game$ = this.store.select('game');
    this.players$ = this.store.select(selectPlayers);
    this.activeId$ = this.store.select(selectActivePlayerId);

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      sessionId: ['']
    });
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

        this.showCard = gameData.show;

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

  generateId(prefix = '', length = 3): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomChars = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return prefix + randomChars;
  }

  startSession(): void {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
  
    this.store.dispatch(requestCreateSession({ game: this.gameData, playerName: this.myForm.value.name }));
  }

  joinSession(): void {
    if (!this.showID) {
      this.showID = true;
      return;
    }

    const idControl = this.myForm.get('sessionId');
    idControl?.setValidators(Validators.required);
    idControl?.updateValueAndValidity();

    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return
    }

    const enteredId = idControl?.value;
    if (this.existingSessionIds.includes(enteredId)) {
      // Proceed with join logic if session ID is found
      console.log('Session joined');
    } else {
      // Set a custom error on the sessionId control if the ID is not found
      idControl?.setErrors({ notFound: true });
    }
  }


  private parseCardValue(card: string): number {
    if (card.includes('/')) {
      const [numerator, denominator] = card.split('/').map(Number);
      return numerator / denominator;
    } else if (isNaN(parseFloat(card))) {
      const sizeMap: {[key: string]: number} = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5 };
      return sizeMap[card] || 0;
    } else {
      return parseFloat(card);
    }
  }

  public calculateAverage(): string {
    const selectedCards = this.playersData
    .filter(player => player.selectedCard && player.selectedCard !== 'c' && player.selectedCard !== 'h')
    .map(player => player.selectedCard!);
    if(!selectedCards.length) return '?';
    const deck = this.cards[this.gameData.deck];
    const numericValues = selectedCards.map(card => this.parseCardValue(card));
    const average = numericValues.reduce((acc, cur) => acc + cur, 0) / numericValues.length;

    // Find the closest card value
    const closestValue = deck.reduce((prev, curr) => {
      const prevDiff = Math.abs(this.parseCardValue(prev.toString()) - average);
      const currDiff = Math.abs(this.parseCardValue(curr.toString()) - average);
      if (!this.gameData.rounding) {
        return (currDiff < prevDiff || (currDiff === prevDiff && this.parseCardValue(curr.toString()) < this.parseCardValue(prev.toString()))) ? curr : prev;
      } else {
        return (currDiff < prevDiff || (currDiff === prevDiff && this.parseCardValue(curr.toString()) > this.parseCardValue(prev.toString()))) ? curr : prev;
      }
    });

    return closestValue.toString();
  }

}
