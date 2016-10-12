var http = require('http'),
  addForm = require('./resources/addForm'),
  getForms = require('./resources/getForms'),
  getFormById = require('./resources/getFormById'),

  /**
   * Возвращает объект с хедэрами для Allow Cross Origin
   * @param {Object} req - объект запроса
   * @returns {Object} - хедэры
   */
  getCommonHeaders = function (req) {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] ? req.headers['access-control-request-headers'] : 'x-requested-with',
      'Access-Control-Allow-Methods': req.headers['access-control-request-method'] ? req.headers['access-control-request-method'] : 'POST, GET, PUT, DELETE, OPTIONS'
    };
  };

const PORT = 8081,
  url = 'mongodb://localhost:27017/API';

/**
 * Функция предобработки всех запросов - всё запросы попадают в неё
 * в зависимости от метода и url - выполняем тот или иной запрос к БД
 * @param {Object} request - объект запроса
 * @param {Object} response - объект ответа
 */
function handleRequest (request, response) {

  // Дальше велосипед, просьба слабонервным не смотреть
  if (request.method === 'GET') {
    if (request.url === '/API/getForms') {
      getForms(url, function (res) {
        response.writeHead(200, getCommonHeaders(request));
        response.end(JSON.stringify(res));
      });
    } else if (request.url.indexOf('/API/getForm?formId=') !== -1) {
      var formId = request.url.substring('/API/getForm?formId='.length, request.url.length);
      getFormById(url, formId, function (res) {
        response.writeHead(200, getCommonHeaders(request));
        response.end(JSON.stringify(res));
      });
    } else {
      response.writeHead(404, {'content-type': 'text/html'});
      response.end();
    }
  }
  if (request.method === 'POST') {
    switch (request.url) {
      case '/API/addForm':
        request.on('data', function (chunk) {
          addForm(url, JSON.parse(chunk.toString()), function (res) {
            response.writeHead(200, getCommonHeaders(request));
            response.end(JSON.stringify(res));
          });
        });
        break;
      default:
        response.writeHead(404, {'content-type': 'text/html'});
        response.end();
    }
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(200, getCommonHeaders(request));
    response.end();
  }

  if (['PUT', 'DELETE', 'HEAD', 'TRACE'].indexOf(request.method) !== -1) {
    response.writeHead(405, {'content-type': 'text/html'});
    response.end();
  }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
  console.log('Server listening on: http://localhost:%s', PORT);
});