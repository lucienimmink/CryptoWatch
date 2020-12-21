import { LitElement, html, customElement, property } from 'lit-element';
import fieldset from '../styles/fieldset';

import './input-group';
@customElement('trade-pair')
export class Main extends LitElement {
  @property()
  pair: any;

  static get styles() {
    return [fieldset];
  }

  render() {
    return html`<div class="card">
      <fieldset>
        <legend>${this.pair.name}</legend>
        <input-group
          name="${this.pair.name} amount"
          id="${this.pair.name}|amount"
        ></input-group>
        <br />
        <input-group
          name="Bought at"
          prefix="€"
          id="${this.pair.name}|at"
        ></input-group>
        or
        <br />
        <input-group
          name="Bought for"
          prefix="€"
          id="${this.pair.name}|for"
        ></input-group>
      </fieldset>
    </div>`;
  }
}
