import { css } from 'lit-element';

export default css`
  .btn {
    cursor: pointer;
    display: inline-flex;
    overflow: hidden;
    max-width: 374px;
    box-sizing: border-box;
    transition: all 0.1s ease-in-out;
    line-height: 1;
    font-family: inherit;
    align-items: center;
    white-space: nowrap;
    justify-content: center;
    text-decoration: none;
    font-size: 14px;
    min-width: 32px;
    padding: 0 8px;
    height: 32px;
    border: 2px solid transparent;
    border-radius: 2px;
    color: #262626;
    fill: #262626;
    background: #e5e5e5;
  }
  .btn-primary {
    color: #ffffff;
    fill: #ffffff;
    background: var(--primary, #0063b1);
  }
`;
