import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-confirmed.html',
})
export class OrderConfirmedComponent {
  constructor() {
    afterNextRender(() => {
      gsap.from('.confirm-anim', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    });
  }
}
