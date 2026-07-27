import { Injectable, signal } from '@angular/core';
import { Supplier } from './supplier.interface';

@Injectable({ providedIn: 'root' })
export class SupplierStore {
  readonly suppliers = signal<Supplier[]>([]);
  readonly selectedSupplier = signal<Supplier | null>(null);
}
