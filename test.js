import { allCountries } from 'country-telephone-data';
import fs from 'fs';
const out = allCountries.map(c => ({ name: c.name, dialCode: c.dialCode, iso2: c.iso2 }));
fs.writeFileSync('src/countryCodes.json', JSON.stringify(out, null, 2));
