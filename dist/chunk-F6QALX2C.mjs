import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/delete-event.ts
import { z } from "zod";
async function deleteEvent(app) {
  app.withTypeProvider().delete("/events/:eventId", {
    schema: {
      summary: "Delete an Event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        204: z.undefined()
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Evento n\xE3o encontrado!");
    }
    await prisma.event.delete({
      where: {
        id: eventId
      }
    });
    return reply.status(204).send();
  });
}

export {
  deleteEvent
};
