import { css } from 'lit-element';

export default css`
  :host {
    display: flex;
  }
  label {
    display: inline-block;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    flex-grow: 0;
    display: inline-block;
    width: 15px;
  }
  input {
    width: 50%;
    border: 1px solid var(--primary, #0063b1);
    background: white;
    font-size: 1rem;
    padding: 5px 10px;
    text-align: right;
  }
`;
