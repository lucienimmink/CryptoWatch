import { LitElement, customElement, html } from 'lit-element';
import { router, navigator } from 'lit-element-router';
import { global as EventBus } from './utils/EventBus';

import routes from './routes';
import main from './styles/main';

import './components/appMain';
import './components/input';
import './components/details';
import { get } from 'idb-keyval';

@customElement('crypto-watch')
@router
@navigator
export class CryptoWatch extends LitElement {
  route: string;
  params: any;
  query: any;
  static get styles() {
    return [main];
  }
  static get properties() {
    return {
      route: { type: String },
      params: { type: Object },
      query: { type: Object },
    };
  }

  static get routes() {
    return routes;
  }
  constructor() {
    super();
    this.route = '';
    this.params = {};
    this.query = {};
    this._listen();
    this._validateWallet();
  }

  _listen() {
    EventBus.on(
      'check',
      () => {
        this.navigate(`/details`);
      },
      this
    );
  }

  async _validateWallet() {
    const wallet = await get('wallet');
    if (wallet) {
      this.navigate('/details');
    }
  }
  navigate(href: any) {
    throw new Error(`Method not implemented. ${href}`);
  }

  async router(route: string, params: any, query: unknown) {
    this.route = route;
    this.params = params;
    this.query = query;
    window.scrollTo(0, 0);
  }
  render() {
    return html`
      <main>
        <app-main active-route="${this.route}">
          <div route="input">
            <input-nav></input-nav>
          </div>
          <div route="details">
            <details-nav></details-nav>
          </div>
        </app-main>
      </main>
    `;
  }
}
