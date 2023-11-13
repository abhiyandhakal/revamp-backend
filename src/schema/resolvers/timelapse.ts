import { eq } from "drizzle-orm";
import db from "../../db";
import { pauseTime, resumeTime, timeLapse } from "../../db/schema/time-lapse";
import { Timelapse } from "../../generated/graphql";

export async function getTimelapse(timelapseId: string | number): Promise<Timelapse> {
	const timelapseArr = await db
		.select()
		.from(timeLapse)
		.where(eq(timeLapse.timelapseId, +timelapseId));

	const timelapse = timelapseArr[0];

	// get duration from timestamp (days, hours, minutes, seconds)
	const duration = timelapse.duration?.getTime() || 0;

	const days = Math.floor(duration / (1000 * 60 * 60 * 24));
	const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((duration % (1000 * 60)) / 1000);

	const pauseTimes = await db
		.select()
		.from(pauseTime)
		.where(eq(pauseTime.timeLapseId, timelapse.timelapseId));
	const resumeTimes = await db
		.select()
		.from(resumeTime)
		.where(eq(resumeTime.timeLapseId, timelapse.timelapseId));

	return {
		...timelapse,
		timelapseId: timelapse.timelapseId.toString(),
		duration: duration === 0 ? null : { days, hours, minutes, seconds },
		pausetimes: pauseTimes.map(pausetime => ({
			pausetimeId: pausetime.pauseTimeId.toString(),
			pauseTime: pausetime.pauseTime,
		})),
		resumetimes: resumeTimes.map(resumetime => ({
			resumetimeId: resumetime.resumeTimeId.toString(),
			resumeTime: resumetime.resumeTime,
		})),
	};
}
