const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exchangily extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const requestBody = await request('https://api.exchangily.com/publicapi/ticker');
    const { data } = requestBody;
    const markets = Object.keys(data);

    return markets.map((market) => {
      const [base, quote] = market.split('_');

      const ticker = data[market];
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Exchangily;
