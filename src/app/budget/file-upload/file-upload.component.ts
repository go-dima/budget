import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';

@Component({
  selector: 'pm-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private _transactionsService: TransactiosService) {}

  ngOnInit() {}

  handleFileInput(files: FileList) {
    this._transactionsService.uploadFile(files.item(0));
  }
}
