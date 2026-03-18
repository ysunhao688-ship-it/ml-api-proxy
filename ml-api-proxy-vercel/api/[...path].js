var https = require('https');
var url = require('url');

module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  var pathSegments = req.query.path;
  if (!pathSegments || pathSegments.length === 0) {
    res.status(200).json({ status: 'ok', message: 'ML API Proxy running' });
    return;
  }

  var mlPath = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);

  var queryParams = Object.assign({}, req.query);
  delete queryParams.path;
  var qs = Object.keys(queryParams).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]);
  }).join('&');

  var targetPath = mlPath + (qs ? '?' + qs : '');

  var options = {
    hostname: 'api.mercadolibre.com',
    path: targetPath,
    method: req.method || 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Referer': 'https://www.mercadolibre.com/',
      'Origin': 'https://www.mercadolibre.com'
    }
  };

  var proxyReq = https.request(options, function(proxyRes) {
    var chunks = [];
    proxyRes.on('data', function(chunk) { chunks.push(chunk); });
    proxyRes.on('end', function() {
      var body = Buffer.concat(chunks).toString('utf-8');
      res.status(proxyRes.statusCode);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.send(body);
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
