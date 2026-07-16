import { Component } from '@angular/core';
import { StepsBar } from '../../components/steps-bar/steps-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-builder-layout',
  imports: [StepsBar, RouterOutlet],
  templateUrl: './builder-layout.html',
  styleUrl: './builder-layout.css',
})
export class BuilderLayout {}
