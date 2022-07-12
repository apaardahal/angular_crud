import { OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular13Crud';

  displayedColumns: string[] = ['productName', 'category',  'date', 'freshness','price', 'action' ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService){}

  ngOnInit(): void {
    this.getAllProducts();
  }


  openDialog() {
     this.dialog.open(DialogComponent, {
      width: '30%'
     }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllProducts()
      }
    })
  }

  getAllProducts(){
    this.api.getProduct()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },  
        error: (err) => {
          alert('Error Fetched Product');
        }
      })
  }

  editProduct(row: any){
    this.dialog.open(DialogComponent, {
      data: row
    }).afterClosed().subscribe(val => {
      if(val === 'update'){
        this.getAllProducts()
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert('Deleted Successfully')
        this.getAllProducts();
      },
      error: (err) => {
        alert('Error deleting product')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
