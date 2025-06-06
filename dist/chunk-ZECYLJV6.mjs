import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Create a new Attendee for an Event",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const isDuplicateEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          eventId,
          email
        }
      }
    });
    if (isDuplicateEmail) {
      throw new BadRequest("J\xE1 existe um participante cadastrado com este email!");
    }
    const [event, amountOfAttendeesOnEvent] = await Promise.all([
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        where: {
          eventId
        }
      })
    ]);
    if (event === null) {
      throw new BadRequest("Evento n\xE3o encontrado!");
    }
    if (event?.maximumAttendees && amountOfAttendeesOnEvent >= event?.maximumAttendees) {
      throw new BadRequest("Este evento j\xE1 est\xE1 lotado!");
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({
      attendeeId: attendee.id
    });
  });
}

export {
  registerForEvent
};
