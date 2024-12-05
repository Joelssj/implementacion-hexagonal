import { Signale } from "signale";
import express from "express";
import taskRouter from "./Task/infraestructure/Routes/TaskRoutes"
import diaryRoures from "./Diary/infraestructure/routes/DiaryRoutes";
import streakRouter from "./Streak/infraestructure/routes/RouteStreak";
import 'dotenv/config';
import cors from 'cors';

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());


app.use("/api/v1/task", taskRouter);
app.use("/api/v1/diary", diaryRoures);
app.use("/api/v1/streak", streakRouter);

const port = 3003;
const host = '0.0.0.0';

app.listen(port, host, () => {
  signale.success("Server online in port 3003");
});

