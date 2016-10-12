var MongoClient = require('mongodb').MongoClient,

  /**
   * Функция получения списка анкет
   * @param {String} url - строка подключения к БД
   * @param {function} callback - в параметре возвращаем данные о клиентах
   */
  getClients = function (url, callback) {
    MongoClient.connect(url, function (err, db) {
      var collection = db.collection('forms');
      collection.find({}).toArray(function (err, data) {
        db.close();
        callback(data);
      });
    });
  };

module.exports = getClients;
