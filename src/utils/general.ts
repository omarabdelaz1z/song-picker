export const stringToTimestamp = (time: string) => {
	if (!time) return undefined;

	return time
		.split(":")
		.map((period) => Number(period))
		.reduce((accumulator, period) => 60 * accumulator + period, 0);
};