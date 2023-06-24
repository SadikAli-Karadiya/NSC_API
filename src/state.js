let currentDB = null;

function getCurrentDB() {
  return currentDB;
}

function updateCurrentDB(db) {
  currentDB = db;
}

module.exports = {
  getCurrentDB,
  updateCurrentDB,
};