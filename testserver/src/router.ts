import { PROJECT_DIR } from './index';
import express from "express"
import {WebpackStatsInfo} from "./assetsmanagement/WebpackStatsInfo";
import cors from 'cors'

export class Router {
    
    static setRoutes(app: express.Application) {
        app.use('/public', express.static(`${PROJECT_DIR}/public`))

        const apiRouter = express.Router({mergeParams: true})

        app.use('/api', apiRouter)

        app.get("*", (req, res) => {
            res.render(`${PROJECT_DIR}/public/index`, {
                pathToCssIndex: WebpackStatsInfo.pathToCssIndex,
                pathToJsIndex: WebpackStatsInfo.pathToJsIndex,
            })
        })
    }

}

