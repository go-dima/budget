import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';

@Component({
  selector: 'pm-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileName: string = 'Choose transactions file';

  constructor(private _transactionsService: TransactiosService) {}

  ngOnInit() {}

  handleFileInput(files: FileList) {
    this.fileName = files.item(0).name;
    this._transactionsService.uploadFile(files.item(0));
  }
}
