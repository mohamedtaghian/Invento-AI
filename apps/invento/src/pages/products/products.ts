import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { ProductService, Product } from '../../features/products/product.service';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe, NgClass],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  isDrawerOpen = false;

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
