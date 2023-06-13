/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
        }),
    }),
    controller.reward
);

api.get(
    "/miningData",
    celebrate({
        query: Joi.object().keys({
            address: Joi.string()
                .pattern(/^0x[a-fA-F0-9]{40}$/)
                .required(),
        }),
    }),
    controller.miningData
);
