import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-steps-bar',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './steps-bar.html',
  styleUrl: './steps-bar.css',
})
export class StepsBar {}
