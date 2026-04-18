import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-console',
  imports: [RouterLink],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss',
})
export class ConsoleComponent implements OnInit {

  products:Product[] = [];

  private consoleProductService = inject(ConsoleProductService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.consoleProductService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  getPreview(product: Product): string {
    return product.pathpictureone || 'assets/no-image.png';
  }

  edit(product: Product) {
    this.consoleProductService.product = product;
    this.router.navigateByUrl('admin/update')
    console.log(product.id);
  }

  delete(id: number) {
    if (confirm('Supprimer le produit avec l\'id: ' + id + ' ?')) {

      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  logout(){
    this.auth.logout();
  }




}
