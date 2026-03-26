import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titlemodule',
  templateUrl: './titlemodule.component.html',
  styleUrls: ['./titlemodule.component.sass']
})
export class TitlemoduleComponent implements OnInit {
  @Input() title: string = '';
  @Input() route: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
