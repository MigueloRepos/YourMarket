const https = require('https');
https.get('https://restcountries.com/v3.1/all?fields=name,cca2,idd', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const countries = JSON.parse(data).map(c => {
      const code = c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : '');
      return {
        name: c.name.common,
        code: c.cca2,
        dialCode: code
      };
    }).filter(c => c.dialCode && c.dialCode !== 'undefined' && c.dialCode !== '').sort((a,b) => a.name.localeCompare(b.name));
    console.log(JSON.stringify(countries, null, 2));
  });
});
