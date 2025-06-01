export function generateCurrentDateInSeconds() {
    const bogotaTime = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
    const actualTime = new Date(bogotaTime);
    return Math.floor(actualTime.getTime() / 1000);
}