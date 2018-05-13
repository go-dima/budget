import { Component, OnInit } from '@angular/core';
import { IProduct } from './product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent
        implements OnInit {
    pageTitle: string = "Product Detail";
    product: IProduct;

    constructor(private _route: ActivatedRoute) {  }

    ngOnInit() {
      let id = +this._route.snapshot.paramMap.get('id');
      this.pageTitle += `: ${id}`;
      this.product = {
        "productId": id,
        "productName": "Dummy",
        "productCode": "GDN-1337",
        "releaseDate": "February 31, 2978",
        "description": "Someday",
        "price": 10.01,
        "starRating": 4.9,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
      }
    }

}
