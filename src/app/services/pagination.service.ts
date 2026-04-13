import { Injectable } from '@angular/core'
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator'

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  dataSource: any[] = []
  dataglobal: any[] = []
  page: number = 0;
  pageSize: number = 20;
  pageSizeOptions = [5, 10, 15, 20];
  collectionSize: number = 0

  constructor(private paginator: MatPaginatorIntl) {
    this.paginator.itemsPerPageLabel = 'Registros por página'
  }
  
  actualizaTabla($data: any) {
    this.dataSource = $data
      .map((item: any, i: number) => ({ row: i + 1, ...item }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
      )
  }

  public actualizaTabla2 = ($data: any, $event: PageEvent) => {
    this.pageSize = $event.pageSize
    this.page = $event.pageIndex
    this.dataSource = $data
      .map((item: any, i: number) => ({ row: i + 1, ...item }))
      .slice(
        this.page * this.pageSize,
        this.page * this.pageSize + this.pageSize,
      )
    return this.dataSource
  }
}
