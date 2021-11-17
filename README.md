<p align="center">
  <a href="https://adshares.net/">
    <img src="https://adshares.net/logos/ads.svg" alt="Adshares" width=72 height=72>
  </a>
  <h3 align="center"><small>ADS JS Library</small></h3>
  <p align="center">
    <a href="https://github.com/adshares/ads-js/issues/new?template=bug_report.md&labels=Bug">Report bug</a>
    ·
    <a href="https://github.com/adshares/ads-js/issues/new?template=feature_request.md&labels=New%20Feature">Request feature</a>
    ·
    <a href="https://github.com/adshares/ads/wiki">Wiki</a>
  </p>
</p>

<br>

ADS JS Library is an **JavaScript ES2015** library for the [ADS](https://github.com/adshares/ads) blockchain.

## Install

```bash
npm install @adshares/ads

yarn add @adshares/ads
```

## Usage

```js
import Ads from '@adshares/ads';

const valid = Ads.validateAddress('0000-00000000-313E')
const parts = Ads.splitAddress('foo_address')

const secretKey = '9F7D754820842E3D141FA7BCF6A3BA731EFE77914AC67E00D1D223E7ADB6FA48'
const signature = Ads.Crypto.sign(secretKey, '74657374')

const data = '0301000000000001000000A1679B5B010000'
const command = Ads.Tx.decodeCommand(data)
```

### Contributing

Please follow our [Contributing Guidelines](docs/CONTRIBUTING.md)

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/adshares/ads-js/tags). 

## Authors

- **[Maciej Pilarczyk](https://github.com/m-pilarczyk)** - _programmer_

See also the list of [contributors](https://github.com/adshares/ads-js/contributors) who participated in this project.

### License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## More info

- [ADS Blockchain Wiki](https://github.com/adshares/ads/wiki)
- [ADS Wallet Connector](https://github.com/adshares/ads-js-connector)
- [ADS JS Client](https://github.com/adshares/ads-js-client)
