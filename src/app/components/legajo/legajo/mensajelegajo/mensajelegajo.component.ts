import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-mensajelegajo',
  templateUrl: './mensajelegajo.component.html',
  styleUrls: ['./mensajelegajo.component.sass']
})
export class MensajelegajoComponent implements OnInit {

  constructor(public lstserv: ListService,private _bottomSheetRef: MatBottomSheetRef<MensajelegajoComponent>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnInit(): void {}
}
