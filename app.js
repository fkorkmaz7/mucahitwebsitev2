const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const {
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    firestore,
} = require("./firebaseConfig");
const authRouter = require("./auth");
const {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
} = require("firebase/firestore");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");

app.use("/", authRouter);

app.get("/getdata", async (req, res) => {
    const colref = collection(firestore, "videos");
    getDocs(colref).then((data) => {
        let videos = [];

        data.docs.forEach((doc) => {
            videos.push({ ...doc.data(), id: doc.id });
        });

        res.status(200).json(videos);
    });
});

app.get("/admin", async (req, res) => {
    const videosSnapshot = await getDocs(collection(firestore, "videos"));
    let videos = videosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    videos.sort((a, b) => a.order - b.order); // Order'a göre sıralama
    res.render("admin", { successMessage: null, errorMessage: null, videos });
});

app.post("/upload", upload.single("video"), async (req, res) => {
    const { title, desc, category, order } = req.body;
    const file = req.file;
    if (!file) {
        return res.render("admin", {
            successMessage: null,
            errorMessage: "No file uploaded.",
        });
    }

    try {
        const storageRef = ref(storage, `videos/${file.originalname}`);
        await uploadBytes(storageRef, file.buffer);
        const fileURL = await getDownloadURL(storageRef);

        await addDoc(collection(firestore, "videos"), {
            title,
            desc,
            category,
            order: parseInt(order), // Order değerini sayıya çevirme
            videoURL: fileURL,
            createdAt: new Date(),
        });

        res.redirect("/admin");
    } catch (error) {
        console.error("Error uploading file:", error);
        res.render("admin", {
            successMessage: null,
            errorMessage: "Error uploading file",
        });
    }
});

app.post("/delete/:id", async (req, res) => {
    const videoId = req.params.id;

    try {
        await deleteDoc(doc(firestore, "videos", videoId));
        res.redirect("/admin");
    } catch (error) {
        console.error("Error deleting video:", error);
        const videosSnapshot = await getDocs(collection(firestore, "videos"));
        let videos = videosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        videos.sort((a, b) => a.order - b.order); // Order'a göre sıralama
        res.render("admin", {
            successMessage: null,
            errorMessage: "Error deleting video",
            videos,
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 5000");
});
