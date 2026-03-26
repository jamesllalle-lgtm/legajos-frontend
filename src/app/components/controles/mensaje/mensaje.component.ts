import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.sass']
})
export class MensajeComponent implements OnInit {

  constructor(
    public valserv: ValidateService
  ) { }

  ngOnInit(): void {
  }

}
