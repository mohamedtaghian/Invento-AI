import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DriftWallComponent } from '../../shared/components/drift-wall/drift-wall.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, DriftWallComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {}
