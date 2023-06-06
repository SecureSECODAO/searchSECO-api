import { Router } from "express";
import * as controller from "../controllers/monetization";
import { celebrate, Joi } from "celebrate";

export const api = Router();

api.post(
    "/cost",
    celebrate({
        body: Joi.object().keys({
            url: Joi.string().uri().required(),
            branch: Joi.string().default("master"),
            token: Joi.string().required(),
        }),
    }),
    controller.cost
);

api.post(
    "/startSession",
    celebrate({
        body: Joi.object().keys({
            hashes: Joi.array().items(Joi.string()).required(),
        }),
    }),
    controller.startSession
);

api.get(
    "/getData",
    celebrate({
        query: Joi.object().keys({
            sessId: Joi.string().required(),
            secret: Joi.string().required(),
        }),
    }),
    controller.getData
);
