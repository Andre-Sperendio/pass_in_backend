import {
  generateSlug
} from "./chunk-QJO26ERM.mjs";
import {
  isLateByDatetime
} from "./chunk-VPFMAY64.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";

// src/routes/update-event.ts
import { z } from "zod";
async function updateEvent(app) {
  app.withTypeProvider().patch("/events/:eventId", {
    schema: {
      summary: "Update an Event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4).optional(),
        details: z.string().nullable().optional(),
        maximumAttendees: z.number().int().positive().nullable().optional(),
        startDate: z.string().date().optional(),
        startTime: z.string().time().optional()
      }),
      response: {
        204: z.undefined()
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const data = request.body;
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Evento n\xE3o encontrado!");
    }
    if (data.title && data.title !== event.title) {
      const isDuplicateSlug = await prisma.event.findUnique({
        where: {
          slug: generateSlug(data.title)
        }
      });
      if (isDuplicateSlug) {
        throw new BadRequest("J\xE1 existe um evento com este t\xEDtulo!");
      }
    }
    const eventAttendees = await prisma.event.findUnique({
      select: {
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (data.maximumAttendees && eventAttendees?._count.attendees) {
      if (data.maximumAttendees < eventAttendees?._count.attendees) {
        throw new BadRequest("Este n\xFAmero m\xE1ximo de participantes \xE9 menor que o n\xFAmero de participantes cadastrados!");
      }
    }
    if (data.startDate && data.startDate !== event.startDate) {
      if (data.startTime && data.startTime !== event.startTime) {
        if (isLateByDatetime(data.startDate, data.startTime)) {
          throw new BadRequest("N\xE3o pode criar ou atualizar um evento com data de in\xEDcio antes da data atual!");
        }
      } else {
        if (isLateByDatetime(data.startDate, event.startTime)) {
          throw new BadRequest("N\xE3o pode criar ou atualizar um evento com data de in\xEDcio antes da data atual!");
        }
      }
    } else if (data.startTime && data.startTime !== event.startTime) {
      if (isLateByDatetime(event.startDate, data.startTime)) {
        throw new BadRequest("N\xE3o pode criar ou atualizar um evento com data de in\xEDcio antes da data atual!");
      }
    }
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId
      },
      data: {
        title: data.title ?? event.title,
        details: data.details ?? event.details,
        maximumAttendees: data.maximumAttendees ?? event.maximumAttendees,
        slug: data.title ? generateSlug(data.title) : event.slug,
        startDate: data.startDate ?? event.startDate,
        startTime: data.startTime ?? event.startTime
      }
    });
    return reply.status(204).send();
  });
}

export {
  updateEvent
};
