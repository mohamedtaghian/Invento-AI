import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan/helm/button';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, HlmButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
