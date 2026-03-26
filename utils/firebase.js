const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBTkYy2O1sp4UTNlBpSX34gjr3y2MoIcuI",
  authDomain: "novashop-23cbd.firebaseapp.com",
  projectId: "novashop-23cbd",
  storageBucket: "novashop-23cbd.firebasestorage.app",
  messagingSenderId: "887196531693",
  appId: "1:887196531693:web:d70ce36516559e1752c5e4"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;