import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-previmage',
  templateUrl: './previmage.component.html',
  styleUrls: ['./previmage.component.sass']
})
export class PrevimageComponent implements OnInit {

  dateFecha: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"

  constructor(
    public dialogRef: MatDialogRef<PrevimageComponent>,
    public configserv: ConfiguracionService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {img: ""},
  ) {

    }

    ngOnInit(): void {

    }
  }
