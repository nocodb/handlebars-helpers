import * as year from 'year';
import * as helperDate from 'helper-date';

const helpers: Record<string, Function> = {};

/**
 * Get the current year.
 *
 * ```handlebars
 * {{year}}
 * <!-- 2017 -->
 * ```
 * @exposes year as year
 * @api public
 */

helpers.year = year;

/**
 * Use [moment][] as a helper. See [helper-date][] for more details.
 *
 * @exposes helper-date as moment
 * @api public
 */

helpers.moment = helpers.date = helperDate;

export default helpers;
