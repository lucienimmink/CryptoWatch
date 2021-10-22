import { LitElement, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigator } from '@addasoft/lit-element-router';
import buttons from '../styles/buttons';
import headers from '../styles/headers';
import { global as EventBus } from '../utils/EventBus';
import { get } from 'idb-keyval';

import './pair-detail';
import fieldset from '../styles/fieldset';
import p from '../styles/p';
import language from '../utils/language';
import small from '../styles/small';
import muted from '../styles/muted';
import positive from '../styles/positive';
import negative from '../styles/negative';
import calculating from '../styles/calculating';

const INTERVAL = 5 * 1000;

@customElement('details-nav')
@navigator
export class Main extends LitElement {
  wallet: any;
  profit: number;
  paid: number;
  total: number;
  currencyFormatter: any;
  numberFormatter: any;
  percentage: number;
  isCalculating: boolean;

  static get styles() {
    return [
      headers,
      buttons,
      fieldset,
      p,
      small,
      muted,
      positive,
      negative,
      calculating,
    ];
  }
  constructor() {
    super();
    this._getWallet();
    this._listen();
    this.profit = 0;
    this.paid = 0;
    this.total = 0;
    this.percentage = 0;
    this.currencyFormatter = new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'EUR',
    });
    this.numberFormatter = new Intl.NumberFormat(language, {
      maximumSignificantDigits: 3,
    });
    this.isCalculating = true;
    setInterval(() => {
      this._doRefresh();
    }, INTERVAL);
  }
  async _getWallet() {
    const wallet = (await get('wallet')) || {};
    // clean up wallet
    // this.wallet = Object.keys(wallet).filter(ledger => ledger.amount > 0);
    Object.keys(wallet).forEach(key => {
      if (!wallet[key].amount || wallet[key].amount == 0) {
        delete wallet[key];
      }
    });
    this.wallet = wallet;
    this.requestUpdate();
  }
  _goBack() {
    this.navigate(`../`);
  }
  navigate(href: any) {
    throw new Error(`Method not implemented. ${href}`);
  }
  async _doRefresh() {
    this.isCalculating = true;
    this.requestUpdate();
    await this._getWallet();
    EventBus.emit('refresh', this, {
      ts: new Date().getTime(),
    });
    // reset for next cycle
    this.profit = 0;
    this.paid = 0;
    this.total = 0;
  }

  _listen() {
    const handled: any = {};
    EventBus.on(
      'calculation',
      (calculation: any, data: any) => {
        const walletLength = Object.keys(this.wallet).length;
        const paid = Number(calculation.target.paid);
        if (calculation.target.fiat) {
          this.paid += paid;
          this.total += paid;
          this.percentage = (this.profit / this.paid) * 100;
        } else {
          const profit = calculation.target.profit;
          this.profit += profit;
          this.paid += paid;
          const totalForPair = profit + paid;
          this.total += totalForPair;
          this.percentage = (this.profit / this.paid) * 100;
        }
        this.isCalculating = false;
        if (data?.ts) {
          handled[data.ts] = handled[data.ts] || [];
          handled[data.ts].push(true);
          if (handled[data.ts].length === walletLength) {
            this.requestUpdate();
            // clean up
            delete handled[data.ts];
          }
        } else {
          this.requestUpdate();
        }
      },
      this
    );
    EventBus.on(
      'check',
      () => {
        this._doRefresh();
      },
      this
    );
  }

  render() {
    return html`
      <h1>Crypto⌚</h1>
      ${Object.keys(this.wallet).map(
        (key: string) =>
          html`<pair-detail
            name=${key}
            .pair=${this.wallet[key]}
          ></pair-detail>`
      )}
      ${Object.keys(this.wallet).length > 1
        ? html`
            <fieldset>
              <legend>Totals</legend>
              <p>
                Profit:
                <strong
                  class="${this.profit >= 0 ? 'positive ' : 'negative '} ${this
                    .isCalculating
                    ? 'calculating'
                    : ''}"
                  >${this.currencyFormatter.format(this.profit)}</strong
                >
                <span
                  class="small muted ${this.isCalculating ? 'calculating' : ''}"
                >
                  ${this.paid !== 0
                    ? html` (${this.numberFormatter.format(this.percentage)}%) `
                    : nothing}</span
                >
              </p>
              <p>
                Total:
                <span class="${this.isCalculating ? 'calculating' : ''}"
                  >${this.currencyFormatter.format(this.total)}</span
                >
              </p>
            </fieldset>
          `
        : nothing}
      <button class="btn btn-primary" @click=${this._doRefresh}>Refresh</button>
      <button class="btn btn-secondary" @click=${this._goBack}>Back</button>
    `;
  }
}
