import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan/helm/button';
import { LangSelector } from '../lang-selector/lang-selector';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, HlmButton, LangSelector],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
