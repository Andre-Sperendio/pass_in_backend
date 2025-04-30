import {
  validateCPF
} from "./chunk-YRGFOKQX.mjs";
import {
  isLateByDatetime
} from "./chunk-VPFMAY64.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Create a new Attendee for an Event",
      tags: ["attendees"],
      body: z.object({
        cpf: z.string().length(11),
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
    const { cpf, name, email } = request.body;
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
    if (isLateByDatetime(event.startDate, event.startTime)) {
      throw new BadRequest("O participante n\xE3o pode se registrar para um evento que j\xE1 iniciou!");
    }
    if (event?.maximumAttendees && amountOfAttendeesOnEvent >= event?.maximumAttendees) {
      throw new BadRequest("Este evento j\xE1 est\xE1 lotado!");
    }
    const isCPFValid = validateCPF(cpf);
    if (!isCPFValid) {
      throw new BadRequest("O CPF inserido \xE9 inv\xE1lido!");
    }
    const [isDuplicateCPF, isDuplicateEmail] = await Promise.all([
      prisma.attendee.findUnique({
        where: {
          eventId_cpf: {
            eventId,
            cpf
          }
        }
      }),
      prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email
          }
        }
      })
    ]);
    if (isDuplicateCPF) {
      throw new BadRequest("J\xE1 existe um participante cadastrado com este CPF!");
    }
    if (isDuplicateEmail) {
      throw new BadRequest("J\xE1 existe um participante cadastrado com este email!");
    }
    const attendee = await prisma.attendee.create({
      data: {
        cpf,
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
