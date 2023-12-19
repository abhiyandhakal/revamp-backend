import db from "../db";
import { Goal } from "../generated/graphql";
import { checkIfToday } from "../lib/check-date";
import { getGoalsFunc } from "../schema/resolvers/goal";
import { user } from "../db/schema/user";
import { eq } from "drizzle-orm";

const yesterdayStatusChoices = [
	"just like",
	"just as bad as",
	"as good as",
	"far more better than",
	"slightly better than",
	"worse than",
	"slightly worse than",
];

function dailyGreetings(firstName: string) {
	const greetings = [
		`Greetings , ${firstName} here, ready to share insights.`,
		`Warm salutations! ${firstName} checking in for another entry.`,
		`Hi there! It's ${firstName}, penning down the day's experiences.`,
		`Hello!  ${firstName} here, ready to unfold today's narrative.`,
		`Hi! It's ${firstName}, bringing you into the world within these pages.`,
		`Howdy! It's me ${firstName} again!`,
		`Hello there, It's me ${firstName} again.`,
	];
	return getRandom(greetings);
}

function setYesterdayStatus(
	tasksCompletedToday: number,
	totalTasksToday: number,
	tasksCompletedYesterday: number,
	yesterdaytotalTasks: number,
) {
	const percentCompletedToday = (tasksCompletedToday / totalTasksToday) * 100;
	const percentCompletedYesterday = (tasksCompletedYesterday / yesterdaytotalTasks) * 100;

	let statusIndex = 0;

	if (
		percentCompletedYesterday > percentCompletedToday &&
		percentCompletedYesterday >= 80 &&
		percentCompletedToday >= 80
	) {
		statusIndex = 2; // "as good as"
	} else if (
		(percentCompletedYesterday < percentCompletedToday &&
			percentCompletedToday - percentCompletedYesterday >= 5 &&
			percentCompletedToday - percentCompletedYesterday <= 8) ||
		(percentCompletedToday < percentCompletedYesterday &&
			percentCompletedYesterday - percentCompletedToday >= 5 &&
			percentCompletedYesterday - percentCompletedToday <= 8)
	) {
		if (percentCompletedYesterday > percentCompletedToday) {
			statusIndex = 6; // "slightly worse than"
		} else {
			statusIndex = 4; // "slightly better than"
		}
	} else if (
		Math.abs(percentCompletedYesterday - percentCompletedToday) < 5 &&
		Math.abs(percentCompletedYesterday - percentCompletedToday) > 0
	) {
		statusIndex = 0; // "just like"
	} else if (percentCompletedYesterday - percentCompletedToday > 8) {
		statusIndex = 5; // "worse than"
	} else if (percentCompletedYesterday < 50 && percentCompletedToday < 50) {
		statusIndex = 1; // "just as bad as"
	} else if (percentCompletedYesterday < 50 && percentCompletedToday > 60) {
		statusIndex = 3; // "far more better than"
	} else if (percentCompletedYesterday > 60 && percentCompletedToday < 50) {
		statusIndex = 5; // "worse than"
	}

	const comparisionWithYesterdayStatus = yesterdayStatusChoices[statusIndex];

	//returns comparision between yesterday and today's status.
	return comparisionWithYesterdayStatus;
}

function setTodayStatus(tasksCompletedToday: number, totalTasksToday: number) {
	const percentCompleted = (tasksCompletedToday / totalTasksToday) * 100;
	let statusIndex = 0;

	const statusChoices = [
		"very poor",
		"poor",
		"just okay",
		"satisfactory",
		"very good",
		"excellent",
		"outstanding",
	];

	if (percentCompleted < 20) {
		statusIndex = 0; // very poor
	} else if (percentCompleted < 40) {
		statusIndex = 1; // poor
	} else if (percentCompleted < 60) {
		statusIndex = 2; // just okay
	} else if (percentCompleted < 80) {
		statusIndex = 3; // satisfactory
	} else if (percentCompleted < 90) {
		statusIndex = 4; // very good
	} else if (percentCompleted < 100) {
		statusIndex = 5; // excellent
	} else {
		statusIndex = 6; // outstanding
	}

	const todayStatus = statusChoices[statusIndex];

	//returns today's status on the basis of tasks completed.
	return todayStatus;
}

export async function dailyJournal(
	userId: string,
	tasksCompletedYesterday: number,
	yesterdaytotalTasks: number,
) {
	const goals: Goal[] = await getGoalsFunc(userId);
	const userArr = await db
		.select({ firstName: user.firstName })
		.from(user)
		.where(eq(user.userId, userId));

	if (!userArr[0]) throw new Error("User not found");

	const firstName = userArr[0].firstName;

	const totalTasksToday: number = goals
		.map(singleGoal => {
			return singleGoal.tasks.filter(singleTask => checkIfToday(singleTask.updatedAt)).length;
		})
		.reduce((acc, curr) => acc + curr, 0);

	const tasksCompletedToday: number = goals
		.map(singleGoal => {
			return singleGoal.tasks.filter(
				singleTask => checkIfToday(singleTask.updatedAt) && singleTask.isDone,
			).length;
		})
		.reduce((acc, curr) => acc + curr, 0);

	const overallPercentCompleted: number = 19.2;
	const greetings = dailyGreetings(firstName);
	const todayStatus: string = setTodayStatus(tasksCompletedToday, totalTasksToday);
	const comparisionWithYesterdayStatus: string = setYesterdayStatus(
		tasksCompletedToday,
		totalTasksToday,
		tasksCompletedYesterday,
		yesterdaytotalTasks,
	);

	//@ts-expect-error ts bahulayo string | undefined error.
	const goalWithTaskList: { goal: string; tasks: { task: string; workedOn: boolean }[] }[] = goals
		.map(singleGoal => {
			const tasks = singleGoal.tasks
				.map(singleTask => {
					if (checkIfToday(singleTask.updatedAt)) {
						const title: string = singleTask.title;
						return { task: title, workedOn: singleTask.isDone };
					}

					let isTodoEdited = false;
					let isMilestoneCreated = false;

					singleTask.todos?.forEach(todo => {
						if (checkIfToday(todo?.updatedAt)) {
							isTodoEdited = true;
						}
					});

					singleTask.milestones?.forEach(milestone => {
						if (checkIfToday(milestone?.createdAt)) {
							isMilestoneCreated = true;
						}
					});

					if (isTodoEdited || isMilestoneCreated) {
						return {
							task: singleTask.title,
							workedOn: singleTask.isDone || isTodoEdited || isMilestoneCreated,
						};
					}
				})
				.filter(task => task != undefined);

			if (tasks.length > 0) {
				return { goal: singleGoal.title, tasks };
			}
		})
		.filter(goalWithTask => goalWithTask != undefined);

	//completed TaskList with Assosciated Goals
	const goalWithCompletedTaskList = goalWithTaskList
		.map(goalWithTask => {
			return {
				goal: goalWithTask.goal,
				tasks: goalWithTask.tasks.filter(task => task.workedOn === true),
			};
		})
		.filter(goalWithTask => goalWithTask.tasks.length > 0);

	const goalWithTaskString: string = generateTaskAndGoalInfo(goalWithTaskList);
	const completedTasks: string = generateTaskAndGoalInfo(goalWithCompletedTaskList);

	let concludingParagraph: string = "";

	if (
		comparisionWithYesterdayStatus === "worse than" ||
		comparisionWithYesterdayStatus === "slightly worse than"
	) {
		concludingParagraph = `But it was ${comparisionWithYesterdayStatus} than yesterday.`;
	} else if (yesterdayStatusChoices.includes(comparisionWithYesterdayStatus)) {
		concludingParagraph = `And it was ${comparisionWithYesterdayStatus} than yesterday.`;
	}
	const dailyJournal = `
		${greetings}

		Today, I had planned to do the taks with title ${goalWithTaskString}. I completed ${completedTasks}. Overall, I managed to achieve ${overallPercentCompleted}% of my goal. My performance today was ${todayStatus} in general.

		${concludingParagraph}
	`;

	return dailyJournal;
}

function generateTaskAndGoalInfo(
	goalWithTaskList: {
		goal: string;
		tasks: {
			task: string;
			workedOn: boolean;
		}[];
	}[],
) {
	let goalWithTaskString: string = "";
	goalWithTaskList.forEach((goalWithTask, index) => {
		let tasksString: string = "";

		goalWithTask.tasks.forEach((task, index) => {
			if (index === goalWithTask.tasks.length - 1 && goalWithTask.tasks.length > 1) {
				tasksString += ` and ${task}`;
				return;
			}

			if (index === 0) {
				tasksString += task;
				return;
			}

			tasksString += `, ${task}`;
		});

		if (index === goalWithTaskList.length && goalWithTaskList.length > 1) {
			goalWithTaskString += ` and ${tasksString} with goal ${goalWithTask.goal}`;

			return;
		}

		if (index === 0) {
			goalWithTaskString += `${tasksString} with goal ${goalWithTask.goal}`;

			return;
		}

		goalWithTaskString += `, ${tasksString} with goal ${goalWithTask.goal}`;
	});
	return goalWithTaskString;
}

function getRandom(array: string[]) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}
