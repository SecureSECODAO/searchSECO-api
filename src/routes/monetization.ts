/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Router } from "express";
import * as controller from "../controllers/monetization";
import { celebrate, Joi } from "celebrate";

export const api = Router();

api.post(
    "/cost",
    celebrate({
        body: Joi.object().keys({
            url: Joi.string().uri().required(),
            branch: Joi.string().default("main"),
            token: Joi.string().optional(),
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
