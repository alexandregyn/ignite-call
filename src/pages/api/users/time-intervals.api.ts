import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma';
import { setCookie } from 'nookies';
import { getServerSession } from 'next-auth';
import { buidNextAuthOptions } from '../auth/[...nextauth].api';
import { z } from 'zod';

const timeIntervalsBodySchema = z.object({
  intervals: z.array(z.object({
    weekDay: z.number().min(0).max(6), 
    startTimeInMinutes: z.number(),  
    endTimeInMinutes: z.number(),  
  }))
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
 
  const session = await getServerSession(req, res, buidNextAuthOptions(req, res));

  if (!session) {
    return res.status(401).end();
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body);

  await Promise.all(intervals.map(interval => {
    return prisma.userTimeInterval.create({
      data: {
        week_day: interval.weekDay,
        time_start_in_minutes: interval.startTimeInMinutes,
        time_end_in_minutes: interval.endTimeInMinutes,
        user_id: session?.user?.id
      }
    })
  }))

  // await prisma.userTimeInterval.createMany({});

  return res.status(201).end();
}
