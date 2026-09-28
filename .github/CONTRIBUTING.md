# Contributing to Stingy

Thanks for taking an interest. Stingy is a small project and careful contributions are welcome.

## Ground rules

- Be kind. Assume good faith and keep discussion about the work.
- Never invent facts. If a value is unknown, show an em dash and say so. This applies to prices, addresses, links, dates and numbers.
- Never commit secrets, private keys, seed phrases or API keys.
- Do not add wallet signing or transaction sending without a prior discussion.

## Getting set up

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run build
npm run gates
```

Both must pass.

## The register

Every external fact (chain ID, RPC, contract address, social links) lives in `src/register.ts` as one record with a state of `stated`, `absent` or `unconfirmed`.

- Store a URL, never a handle. Handles are derived from the URL.
- A record that is not `stated` must not produce a link.
- Do not add a contract address until it has been officially announced.

## Colours

Colour values live only in `src/tokens.css`. They are sampled from the brand artwork. Do not add colour literals anywhere else.

## Checks

Automated checks use synthetic fixtures and never read the live register. A new check should pass whether or not a contract address exists. Keep the suite fast.

## Pull requests

1. Fork the repository and create a branch with a short, descriptive name.
2. Keep each pull request focused on one change.
3. Explain what changed and why in the description.
4. Include screenshots for visual changes, at both a phone width and a desktop width.
5. Make sure motion respects reduced-motion settings and interactive targets are at least 48 by 48 pixels.

## Reporting bugs

Open an issue with the page or component, what you expected, what happened, and your browser and screen size. Include a screenshot when it helps.

## Security

If you find a vulnerability, do not post it publicly. Contact the maintainers privately through the channel listed in the README once one exists.

## License

By contributing you agree that your work is released under the MIT license in this repository.
