import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { hlmUl } from '@spartan/helm/typography';
import { TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-steps-bar',
  imports: [RouterLink, RouterLinkActive, NgClass, TranslatePipe],
  templateUrl: './steps-bar.html',
  styleUrl: './steps-bar.css',
})
export class StepsBar {
  protected readonly hlmUl = hlmUl;
}
