import express from 'express';
import healthRoute from './routers/healthRoute.js';
import authRoute from './routers/authRoute.js';
import workspaceRoute from './routers/workspaceRoute.js'
import projectRoute from './routers/projectsRoute.js'
import taskRouter from './routers/taskRoute.js'
import cors from 'cors';
const app = express();

app.use(cors({
    origin: [ 'http://localhost:5173','https://teamflow-mern-fullstack-project-fro.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.get("/", (req, res)=>{
    res.status(200).json({
        message: "api running "
    })
})

app.use("/api",healthRoute);
app.use("/auth", authRoute);
app.use("/v1", workspaceRoute);
app.use("/v1/project", projectRoute);
app.use("/v1/tasks", taskRouter);

app.use((req, res)=>{
    res.status(404).json({
        message: "api not found"
    })
})

export default app;
