import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {}

  openFirstMenu(type: string) {
    this.menuCtrl.open(type+'-menu');
  }
}
