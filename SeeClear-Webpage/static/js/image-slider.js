/**
 * Image Comparison Slider
 * Allows dragging a vertical line to compare two images
 */

class ImageComparisonSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.slider = null;
    this.handle = null;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.slider = this.container.querySelector('.comparison-slider');
    this.handle = this.container.querySelector('.comparison-slider-handle');
    this.divider = this.container.querySelector('.comparison-slider-divider');

    if (!this.slider || !this.handle) return;

    // Mouse events
    this.handle.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());

    // Touch events for mobile
    this.handle.addEventListener('touchstart', (e) => this.startDrag(e));
    document.addEventListener('touchmove', (e) => this.drag(e));
    document.addEventListener('touchend', () => this.endDrag());

    // Click on slider to move handle
    this.slider.addEventListener('click', (e) => this.handleClick(e));

    // set initial position (center)
    this.updateSliderPosition(0.5);
  }

  startDrag() {
    this.isDragging = true;
    this.handle.style.cursor = 'grabbing';
    // prevent text/image dragging behavior
    document.body.style.userSelect = 'none';
    document.body.style.touchAction = 'none';
  }

  endDrag() {
    this.isDragging = false;
    this.handle.style.cursor = 'grab';
    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
  }

  drag(e) {
    if (!this.isDragging) return;

    const rect = this.slider.getBoundingClientRect();
    let clientX;

    // Support touch and mouse
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    let x = clientX - rect.left;

    // Constrain x to slider bounds
    x = Math.max(0, Math.min(x, rect.width));

    this.updateSliderPosition(x / rect.width);
  }

  handleClick(e) {
    const rect = this.slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    this.updateSliderPosition(x / rect.width);
  }

  updateSliderPosition(percentage) {
    const before = this.slider.querySelector('.comparison-slider-before');
    if (before) {
      // Use clip-path to reveal the left portion of the before layer while keeping
      // the image full-size (prevents image scaling). clip-path inset: top right bottom left
      const rightInset = (1 - percentage) * 100;
      before.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
      before.style.webkitClipPath = `inset(0 ${rightInset}% 0 0)`;
    }

    // position handle centered on divider
    const handleLeft = percentage * 100;
    this.handle.style.left = handleLeft + '%';
    this.handle.style.transform = 'translate(-50%, -50%)';
    // move divider element if present
    if (this.divider) {
      this.divider.style.left = handleLeft + '%';
      this.divider.style.transform = 'translateX(-50%)';
    }
  }
}

// Initialize sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all image comparison sliders
  const sliders = document.querySelectorAll('[data-comparison-slider]');
  sliders.forEach(sliderElement => {
    const id = sliderElement.id;
    if (id) {
      new ImageComparisonSlider(id);
    }
  });
});
