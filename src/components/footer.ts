import { register } from "../register";
import { renderSocialGithub, renderSocialX } from "./social";

export function renderFooter(): string {
  const rpcHost = register.rpcUrl.state === "stated" ? new URL(register.rpcUrl.value!).host : "—";
  return `
    <footer class="site-footer">
      <div class="footer-top">
        <a class="brand brand--footer" href="#top" aria-label="Stingy home">
          <span class="brand-word">STINGY</span>
        </a>
        <div class="social-row" aria-label="Social links">
          ${renderSocialX(register.socialX)}
          ${renderSocialGithub(register.socialGithub)}
        </div>
      </div>
      <p class="footer-note">Stingy is experimental software on Robinhood Chain. Trades, once sent, are final — use it at your own risk.</p>
      <div class="footer-meta">
        <span>Chain data via ${rpcHost}</span>
        <span>TVL via DefiLlama</span>
        <span>Token prices via CoinGecko</span>
      </div>
      <div class="footer-bottom">
        <span>© <span id="footer-year"></span> Stingy</span>
        <a href="#about">About</a>
      </div>
    </footer>
  `;
}
