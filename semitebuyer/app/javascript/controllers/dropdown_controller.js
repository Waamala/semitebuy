import { Controller } from "@hotwired/stimulus"

// Toggle a dropdown menu open/closed.
// Usage:
//   <div data-controller="dropdown">
//     <button data-action="click->dropdown#toggle">Open</button>
//     <div data-dropdown-target="menu" class="hidden">...</div>
//   </div>
export default class extends Controller {
  static targets = ["menu"]

  connect() {
    this.boundOutsideClick = this.outsideClick.bind(this)
    document.addEventListener("click", this.boundOutsideClick)
  }

  disconnect() {
    document.removeEventListener("click", this.boundOutsideClick)
  }

  toggle(event) {
    event.stopPropagation()
    this.menuTarget.classList.toggle("hidden")
  }

  outsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.menuTarget.classList.add("hidden")
    }
  }
}
