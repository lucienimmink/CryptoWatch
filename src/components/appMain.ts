import { LitElement, html, customElement } from 'lit-element';
import { outlet } from 'lit-element-router';

@customElement('app-main')
@outlet
export class Main extends LitElement {
  render() {
    return html` <slot></slot> `;
  }
}
