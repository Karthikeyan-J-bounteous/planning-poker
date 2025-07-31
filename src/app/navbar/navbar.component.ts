import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable, filter, map, switchMap } from 'rxjs';
import { Game } from '../interface/game.interface';
import { Player } from '../interface/player.interface';
import { selectActivePlayerId, selectPlayers } from '../store/selectors/player.selectors';
import { Store } from '@ngrx/store';
import { selectGame } from '../store/selectors/game.selectors';
import { AppState } from '../interface/state.interface';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {

  public game$?: Observable<Game>;
  public players$?: Observable<Player[]>;
  public activeId$?: Observable<string | null>;
  userEntered: boolean = false;
  isAdmin: boolean = false;
  gameName: string = "";

  constructor(private menuCtrl: MenuController,
    private store: Store<AppState>
  ) {
    this.game$ = this.store.select(selectGame);
    this.players$ = this.store.select(selectPlayers);
    this.activeId$ = this.store.select(selectActivePlayerId);
  }

  ngOnInit() {
    this.game$?.subscribe(data => {
      this.userEntered = !!data.id.length;
      this.gameName = data.name;
    })

    this.activeId$?.pipe(
      filter(activeId => !!activeId),
      switchMap(activeId => this.players$?.pipe(
        map(players => players.find(player => player.id === activeId))
      ) ?? [])
    ).subscribe(player => {
      if (player) {
        this.isAdmin = player.role == 'host';
      }
    });
  }

  openFirstMenu(type: string) {
    if(['settings', 'group'].includes(type) && !this.isAdmin) return;
    this.menuCtrl.open(type+'-menu');
  }
}
