var MongoClient = require('mongodb').MongoClient,

  /**
   * Функция добавления анкеты в базу
   * @param {String} url - строка подключения к БД
   * @param {Object} data - данные
   * @param {function} callback - возвращаем результат сохранения
   */
  addClient = function (url, data, callback) {
    MongoClient.connect(url, function (err, db) {
      var collection = db.collection('forms');
      collection.insertOne(data, function (err, res) {
        db.close();
        callback(res);
      });
    });
  };

module.exports = addClient;
