import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmButton } from '@spartan/helm/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, HlmButton],
  templateUrl: './not-found.html',
})
export class NotFoundComponent {
  constructor() {
    afterNextRender(() => {
      gsap.to('.floating-shape', {
        y: 'random(-40, 40)',
        x: 'random(-40, 40)',
        rotation: 'random(-25, 25)',
        duration: 'random(3, 6)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      gsap.from('.content-reveal', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
      });
    });
  }
}
