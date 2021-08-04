import { LitElement, html, customElement } from 'lit-element';
import buttons from '../styles/buttons';
import headers from '../styles/headers';
import tradepairs from '../utils/tradepairs';
import { global as EventBus } from '../utils/EventBus';

import './pair';
import { get, set } from 'idb-keyval';
import { nothing } from 'lit-html';

@customElement('input-nav')
export class Main extends LitElement {
  wallet: any;
  noPairs: boolean;
  noAmount: boolean;
  static get styles() {
    return [headers, buttons];
  }
  constructor() {
    super();
    this.wallet = {};
    this.noPairs = false;
    this.noAmount = false;
    this._listen();
  }

  _listen() {
    EventBus.on(
      'change',
      async (change: any) => {
        const id = change.target.id;
        const value = change.target.value;
        const crypto = id.split('|')[0];
        const field = id.split('|')[1];
        // get current wallet
        this.wallet =
          Object.keys(this.wallet).length !== 0
            ? this.wallet
            : (await get('wallet')) || {};
        // append/overwrite data
        this.wallet[crypto] = this.wallet[crypto] || {};
        this.wallet[crypto][field] = value;
      },
      this
    );
  }
  async _doCheck() {
    this.noPairs = false;
    this.noAmount = false;
    let pairs = Object.keys(this.wallet);
    if (pairs.length === 0) {
      // no data has changed, get saved wallet
      this.wallet = await get('wallet');
      pairs = Object.keys(this.wallet);
    }
    this.requestUpdate();
    if (pairs.length === 0) {
      this.noPairs = true;
      this.requestUpdate();
    } else {
      pairs.forEach((pair: any) => {
        const fields = Object.keys(this.wallet[pair]);
        if (!fields.includes('amount')) {
          this.noAmount = true;
          this.requestUpdate();
        } else {
          set('wallet', this.wallet);
          this.requestUpdate();
          EventBus.emit('check', this);
        }
      });
    }
  }

  render() {
    return html`
      <h1>Crypto⌚</h1>
      ${this.noPairs
        ? html` <alert-window type="warn">Please fill some data</alert-window> `
        : nothing}
      ${this.noAmount
        ? html`
            <alert-window type="warn"
              >Please specify the amount as well</alert-window
            >
          `
        : nothing}
      ${tradepairs.map(
        (tradepair: any) => html` <trade-pair .pair=${tradepair}></trade-pair> `
      )}
      <button class="btn btn-primary" @click=${this._doCheck}>
        Let's check!
      </button>
    `;
  }
}
