
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ai-resume-7b9s.onrender.com"
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Fallback allow in dev
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.get("/", (req, res) => {
    res.send("AI Resume Backend Running");
});



module.exports = app