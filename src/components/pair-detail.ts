import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { global as EventBus } from '../utils/EventBus';
import tradepairs from '../utils/tradepairs';
import fieldset from '../styles/fieldset';
import hr from '../styles/hr';
import p from '../styles/p';
import language from '../utils/language';
import small from '../styles/small';
import muted from '../styles/muted';
import positive from '../styles/positive';
import negative from '../styles/negative';
import calculating from '../styles/calculating';

@customElement('pair-detail')
export class Main extends LitElement {
  @property()
  pair: any;
  @property()
  name: string;
  priceOfOne: number;
  priceOfWallet: number;
  profit: number;
  percentage: number;
  currencyFormatter: any;
  numberFormatter: any;
  isCalculating: boolean;

  constructor() {
    super();
    this.name = '';
    this.priceOfOne = 0;
    this.priceOfWallet = 0;
    this.profit = 0;
    this.percentage = 0;
    this.currencyFormatter = new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'EUR',
    });
    this.numberFormatter = new Intl.NumberFormat(language, {
      maximumSignificantDigits: 3,
    });
    this.isCalculating = true;
    this._listen();
  }

  _listen() {
    EventBus.on(
      'refresh',
      (event: any, data: any) => {
        this._check(this.name, data);
      },
      this
    );
  }

  attributeChangedCallback(name: any, oldval: any, newval: any) {
    if (name === 'name') {
      this._check(newval);
    }
    super.attributeChangedCallback(name, oldval, newval);
  }

  async _check(value = this.name, data = {}) {
    let url = '';
    tradepairs.forEach((tradepair: any) => {
      if (tradepair.name === value) {
        url = tradepair.brokerUrl;
      }
    });
    if (url) {
      this.isCalculating = true;
      const response = await fetch(url);
      const json = await response.json();
      if (json.error.length === 0) {
        const keys = Object.keys(json.result);
        const result = json.result[keys[0]];
        const bids = result.b;
        this.priceOfOne = Number(bids[0]);
        let pricePaid = 0;
        if (this.pair.at) {
          const pricePaidForOne = Number(this.pair.at);
          const difference = this.priceOfOne - pricePaidForOne;
          this.profit = difference * this.pair.amount;
          pricePaid = this.pair.amount * this.pair.at;
          this.priceOfWallet = this.pair.amount * this.priceOfOne;
          this.percentage = (this.profit / pricePaid) * 100;
        } else {
          const pricePaidForOne = this.pair.for / this.pair.amount;
          const difference = this.priceOfOne - pricePaidForOne;
          this.profit = difference * this.pair.amount;
          pricePaid = Number(this.pair.for);
          this.priceOfWallet = Number(this.pair.for) + Number(this.profit);
          this.percentage = (this.profit / pricePaid) * 100;
        }
        this.requestUpdate();
        EventBus.emit(
          'calculation',
          {
            value,
            profit: this.profit,
            paid: pricePaid,
          },
          data
        );
        this.isCalculating = false;
      }
    } else {
      EventBus.emit(
        'calculation',
        {
          value,
          paid: this.pair?.amount || 0,
          fiat: true,
        },
        data
      );
    }
  }

  static get styles() {
    return [fieldset, p, hr, small, muted, positive, negative, calculating];
  }

  render() {
    return html`<div class="card">
      <fieldset>
        <legend>${this.name}</legend>
        <p>
          Amount of ${this.name}:
          ${this.numberFormatter.format(this.pair.amount)}
        </p>
        ${this.pair.for || this.pair.at
          ? html`
              <p>
                Current price of 1 ${this.name}:
                <strong
                  >${this.currencyFormatter.format(this.priceOfOne)}</strong
                >
              </p>
              <p>
                Current price of this wallet:
                ${this.pair.for != 0
                  ? html`
                      <strong
                        >${this.currencyFormatter.format(
                          this.priceOfWallet
                        )}</strong
                      >
                    `
                  : html`
                      <strong
                        class="${this.priceOfWallet >= 0
                          ? 'positive '
                          : 'negative '} ${this.isCalculating
                          ? 'calculating'
                          : ''}"
                        >${this.currencyFormatter.format(
                          this.priceOfWallet
                        )}</strong
                      >
                    `}
              </p>
              ${this.pair.for != 0
                ? html`
                    <hr />
                    <p>
                      Current profit:
                      <strong
                        class="${this.profit >= 0
                          ? 'positive '
                          : 'negative '} ${this.isCalculating
                          ? 'calculating'
                          : ''}"
                        >${this.currencyFormatter.format(this.profit)}</strong
                      >
                      <span
                        class="small muted ${this.isCalculating
                          ? 'calculating'
                          : ''}"
                        >(${this.numberFormatter.format(
                          this.percentage
                        )}%)</span
                      >
                    </p>
                  `
                : nothing}
            `
          : nothing}
      </fieldset>
    </div>`;
  }
}
