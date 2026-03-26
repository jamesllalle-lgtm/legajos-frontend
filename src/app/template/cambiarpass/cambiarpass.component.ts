import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-cambiarpass',
  templateUrl: './cambiarpass.component.html',
  styleUrls: ['./cambiarpass.component.sass']
})
export class CambiarpassComponent implements OnInit {
  hide = true;
  hiden = true;
  hidec = true;
  constructor(
    public configserv: ConfiguracionService,
    public dialogRef: MatDialogRef<CambiarpassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: '' }) { }

  ngOnInit(): void {
  }

}
