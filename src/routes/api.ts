/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * � Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
                branch: Joi.string(),
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
