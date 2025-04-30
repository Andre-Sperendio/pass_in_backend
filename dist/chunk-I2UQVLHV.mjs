import {
  generateSlug
} from "./chunk-QJO26ERM.mjs";
import {
  isLateByDatetime
} from "./chunk-VPFMAY64.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    schema: {
      summary: "Create an Event",
      tags: ["events"],
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
        startDate: z.string().date(),
        startTime: z.string().time()
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    const isDuplicateSlug = await prisma.event.findUnique({
      where: {
        slug: generateSlug(data.title)
      }
    });
    if (isDuplicateSlug) {
      throw new BadRequest("J\xE1 existe um evento com este t\xEDtulo!");
    }
    if (isLateByDatetime(data.startDate, data.startTime)) {
      throw new BadRequest("N\xE3o pode criar um evento com data de in\xEDcio antes da data atual!");
    }
    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug: generateSlug(data.title),
        startDate: data.startDate,
        startTime: data.startTime
      }
    });
    return reply.status(201).send({
      eventId: event.id
    });
  });
}

export {
  createEvent
};
