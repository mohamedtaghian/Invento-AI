import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink], // Required for the "Return" button to work
  templateUrl: './not-found.html',
})
export class NotFoundComponent {
  constructor() {
    afterNextRender(() => {
      // 1. Continuous floating animation for abstract background elements
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

      // 2. Initial pop-in animation for the main content
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
