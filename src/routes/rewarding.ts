import { Router } from "express";
import * as controller from "../controllers/rewarding";
import { celebrate, Joi } from "celebrate";

export const api = Router();

api.post(
    "/reward",
    celebrate({
        body: Joi.object().keys({
            address: Joi.string()
                .pattern(/^0x[a-fA-F0-9]{40}$/)
                .required(),
            hashes: Joi.array().items(Joi.string()).required(),
        }),
    }),
    controller.reward
);