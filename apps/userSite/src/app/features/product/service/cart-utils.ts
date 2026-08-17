export function flyToCart(
  source?: MouseEvent | HTMLElement | DOMRect | null,
  cartIconId = 'cart-icon',
): void {
  if (typeof document === 'undefined') return;

  const cartIcon =
    document.getElementById(cartIconId) ||
    document.querySelector('[id*="cart-icon"]') ||
    document.querySelector('a[href*="/checkout"]');

  if (!cartIcon) return;

  let startRect: DOMRect | null = null;

  if (source instanceof DOMRect) {
    startRect = source;
  } else if (source instanceof HTMLElement) {
    startRect = source.getBoundingClientRect();
  } else if (source && typeof source === 'object') {
    if ('currentTarget' in source && source.currentTarget instanceof HTMLElement) {
      startRect = source.currentTarget.getBoundingClientRect();
    } else if ('target' in source && source.target instanceof HTMLElement) {
      startRect = source.target.getBoundingClientRect();
    } else if ('clientX' in source && typeof source.clientX === 'number') {
      startRect = new DOMRect(source.clientX - 18, source.clientY - 18, 36, 36);
    }
  }

  if (!startRect) {
    updateCartBadge(cartIconId);
    return;
  }

  const endRect = cartIcon.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  const flyer = document.createElement('div');
  flyer.style.cssText = `
    position: fixed;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 9999;
    left: ${startX - 18}px;
    top: ${startY - 18}px;
  `;
  flyer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>`;
  document.body.appendChild(flyer);

  const duration = 700;
  const startTime = performance.now();

  const animate = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentX = startX + (endX - startX) * ease - 18;
    const currentY = startY + (endY - startY) * ease - Math.sin(Math.PI * progress) * 100 - 18;
    const scale = 1 - progress * 0.7;
    const opacity = progress > 0.8 ? 1 - (progress - 0.8) * 5 : 1;

    flyer.style.left = `${currentX}px`;
    flyer.style.top = `${currentY}px`;
    flyer.style.transform = `scale(${scale})`;
    flyer.style.opacity = `${opacity}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      flyer.remove();
      updateCartBadge(cartIconId);
    }
  };

  requestAnimationFrame(animate);
}

export function updateCartBadge(cartIconId = 'cart-icon'): void {
  if (typeof document === 'undefined') return;

  const cartIcon =
    document.getElementById(cartIconId) ||
    document.querySelector('[id*="cart-icon"]') ||
    document.querySelector('a[href*="/checkout"]');

  if (!cartIcon) return;

  (cartIcon as HTMLElement).style.transition = 'transform 0.15s ease';
  (cartIcon as HTMLElement).style.transform = 'scale(1.4)';
  setTimeout(() => {
    (cartIcon as HTMLElement).style.transform = 'scale(1)';
  }, 200);

  const countEl =
    document.getElementById('cart-count') || document.querySelector('[id*="cart-count"]');

  if (countEl) {
    const current = parseInt(countEl.textContent || '0', 10);
    const newCount = current + 1;
    countEl.textContent = String(newCount);
    countEl.classList.remove('hidden');
    (countEl as HTMLElement).style.transition = 'transform 0.15s ease';
    (countEl as HTMLElement).style.transform = 'scale(1.5)';
    setTimeout(() => {
      (countEl as HTMLElement).style.transform = 'scale(1)';
    }, 150);
  }
}
