var MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID,

  /**
   * Функция получает анкету по id
   * @param {String} url - строка подключения к БД
   * @param {Object} formId - идентификатор заказа
   * @param {Function} callback - в параметре заказы с учётом фильтра
   */
  getClientByOrderId = function (url, formId, callback) {
    MongoClient.connect(url, function (err, db) {
      if (formId) {
        var collection = db.collection('forms');
        collection.find({_id: {
          $in: [ObjectID(formId)]
        }}).toArray(function (err, data) {
          db.close();
          callback(data[0]);
        });
      } else {
        callback({});
      }
    });
  };

module.exports = getClientByOrderId;

