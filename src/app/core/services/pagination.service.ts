import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }
  paginate<T>(data: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }
}
