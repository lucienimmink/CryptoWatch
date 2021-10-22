import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { get } from 'idb-keyval';
import fieldset from '../styles/fieldset';

import './input-group';
@customElement('trade-pair')
export class Main extends LitElement {
  @property()
  pair: any;
  wallet: any;

  static get styles() {
    return [fieldset];
  }
  constructor() {
    super();
    this._getWallet();
  }
  async _getWallet() {
    this.wallet = (await get('wallet')) || {};
    this.requestUpdate();
  }

  render() {
    return html`<div class="card">
      <fieldset>
        <legend>${this.pair.name}</legend>
        <input-group
          name="${this.pair.name} amount"
          id="${this.pair.name}|amount"
          value="${this.wallet[this.pair.name]?.amount}"
        ></input-group>
        ${this.pair.fiat
          ? nothing
          : html`
              <br />
              <input-group
                name="Bought at"
                prefix="€"
                id="${this.pair.name}|at"
                value="${this.wallet[this.pair.name]?.at}"
              ></input-group>
              or
              <br />
              <input-group
                name="Bought for"
                prefix="€"
                id="${this.pair.name}|for"
                value="${this.wallet[this.pair.name]?.for}"
              ></input-group>
            `}
      </fieldset>
    </div>`;
  }
}
