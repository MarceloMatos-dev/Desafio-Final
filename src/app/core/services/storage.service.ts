import {
  Injectable
}
from '@angular/core';
@Injectable( {
  providedIn:'root'
}) export class StorageService {
  get<T>(k:string, f:T):T {
    try {
      return JSON.parse(localStorage.getItem(k)||'') as T
    } catch {
      return f
    }
  }
  set(k:string, v:unknown) {
    localStorage.setItem(k, JSON.stringify(v))
  }
  remove(k:string) {
    localStorage.removeItem(k)
  }
}
