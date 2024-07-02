import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Game } from '../interface/game.interface';
import { AppState } from '../interface/state.interface';
import { Store } from '@ngrx/store';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  gameUrl : string = "";
  public game$ ?: Observable<Game>;


  constructor(
    private store: Store<AppState>,
    private menuCtrl: MenuController,
  ) { 
    this.game$ = this.store.select('game');
  }

  ngOnInit() {
    this.game$?.subscribe(data => {
      console.log("data in menu", data)
      this.gameUrl = data.id.length? `https://www.planning-poker.com/home/${data.id}` : '';
    })
  }

   writeToClipboard = async () => {
    await Clipboard.write({
      string: this.gameUrl
    });
  };

  openFirstMenu(type: string) {
    this.menuCtrl.open(type+'-menu');
  }

}

