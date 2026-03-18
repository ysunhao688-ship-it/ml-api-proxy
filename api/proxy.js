var https = require('https');

module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  var mlPath = req.query.p || '';
  if (!mlPath) {
    res.status(200).json({ status: 'ok', message: 'ML Proxy OK' });
    return;
  }

  if (mlPath.charAt(0) !== '/') mlPath = '/' + mlPath;

  var options = {
    hostname: 'api.mercadolibre.com',
    path: mlPath,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.mercadolibre.com/'
    }
  };

  var proxyReq = https.request(options, function(proxyRes) {
    var chunks = [];
    proxyRes.on('data', function(chunk) { chunks.push(chunk); });
    proxyRes.on('end', function() {
      var body = Buffer.concat(chunks).toString('utf-8');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.status(proxyRes.statusCode).send(body);
    });
  });

  proxyReq.on('error', function(e) {
    res.status(500).json({ error: e.message });
  });

  proxyReq.setTimeout(15000, function() {
    proxyReq.destroy();
    res.status(504).json({ error: 'Timeout' });
  });

  proxyReq.end();
};
