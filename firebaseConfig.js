const { initializeApp } = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");
const { getFirestore, collection } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDdc5t7JE3zu51g80OZlvwFcfr1Nr-g9-g",
    authDomain: "mucahit-website.firebaseapp.com",
    projectId: "mucahit-website",
    storageBucket: "mucahit-website.appspot.com",
    messagingSenderId: "297845509085",
    appId: "1:297845509085:web:77961090b7d80e01e50434",
    measurementId: "G-60H3BREJK5",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

module.exports = {
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    firestore
};
