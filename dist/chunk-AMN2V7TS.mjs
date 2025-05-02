import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-all-events.ts
import { z } from "zod";
async function getAllEvents(app) {
  app.withTypeProvider().get("/events", {
    schema: {
      summary: "Get all Events",
      tags: ["events"],
      querystring: z.object({
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
        200: z.object({
          events: z.array(
            z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
              startDate: z.string().date(),
              startTime: z.string().time()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { query, pageIndex } = request.query;
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        startDate: true,
        startTime: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: query ? {
        slug: {
          contains: query
        }
      } : {},
      take: 8,
      skip: pageIndex * 8,
      orderBy: {
        slug: "asc"
      }
    });
    return reply.send({
      events: events.map((event) => {
        return {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
          startDate: event.startDate,
          startTime: event.startTime
        };
      })
    });
  });
}

export {
  getAllEvents
};
