import { LitElement, html, customElement, property } from 'lit-element';
import { nothing } from 'lit-html';
import input from '../styles/input';
import { global as EventBus } from '../utils/EventBus';

@customElement('input-group')
export class Main extends LitElement {
  @property()
  name: string;
  @property()
  prefix: string;
  @property()
  id: string;
  @property({ type: Number })
  value: number;

  static get styles() {
    return [input];
  }

  constructor() {
    super();
    this.name = '';
    this.prefix = '';
    this.id = '';
    this.value = 0;
  }

  _onChange() {
    EventBus.emit('change', {
      id: this.id,
      value: this.shadowRoot?.querySelector('input')?.value,
    });
  }

  render() {
    return html` <label for=${this.name}>${this.name}</label>
    ${this.prefix ? html`<span>${this.prefix}</span>` : nothing}
    <input type="tel" id=${this.name} @change=${this._onChange} value=${
      this.value || ''
    }></input> `;
  }
}
