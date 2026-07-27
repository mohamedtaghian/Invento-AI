import { Injectable, signal } from '@angular/core';
import { User } from './user.interface';

@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly users = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
}
