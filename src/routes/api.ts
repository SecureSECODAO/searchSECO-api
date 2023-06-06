import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import { api as monetizationApi } from "./monetization";
import { api as rewardingApi } from "./rewarding";
import * as controller from "../controllers/api";

export const api = Router();

api.post(
    "/fetch",
    celebrate({
        body: Joi.object()
            .keys({
                url: Joi.string().required(),
                branch: Joi.string().default("master"),
                token: Joi.string().required(),
                address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/), //.required()
            })
            .unknown()
            .required(),
    }),
    controller.fetch
);

api.post(
    "/check",
    celebrate({
        body: Joi.object()
            .keys({
                hashes: Joi.array()
                    .items(Joi.string().regex(/^[a-fA-F0-9]{32}$/i))
                    .required(),
                address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/), //.required()
            })
            .unknown()
            .required(),
    }),
    controller.check
);

api.use("/monetization", monetizationApi);
api.use("/rewarding", rewardingApi);
