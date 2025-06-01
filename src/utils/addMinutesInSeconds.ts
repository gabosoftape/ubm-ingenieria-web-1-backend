export function addMinutesInSeconds(currentTimeInSeconds: number, minutesToAdd: number) {
    const secondsToAdd = minutesToAdd * 60;
    return currentTimeInSeconds + secondsToAdd as number;
}