import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [RouterLink, HlmButton, HlmCard],
  templateUrl: './order-confirmed.html',
})
export class OrderConfirmedComponent {
  constructor() {
    afterNextRender(() => {
      // Animated Checkmark Pop
      gsap.from('.success-circle', { scale: 0, rotation: -45, duration: 0.6, ease: 'back.out(2)' });

      // Draw SVG Checkmark Path
      gsap.fromTo(
        '.checkmark-path',
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.8, delay: 0.8, ease: 'power2.inOut' },
      );

      // Sequenced Entrance Animation for Cards
      gsap.from('.confirm-anim', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        delay: 0.4,
      });

      // Stagger Timeline Steps
      gsap.from('.border-l-2 > div', { x: -10, opacity: 0, stagger: 0.15, delay: 0.8 });
    });
  }
}
