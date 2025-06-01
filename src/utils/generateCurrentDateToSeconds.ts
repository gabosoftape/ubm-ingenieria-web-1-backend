export function generateCurrentDateToSeconds() {
    // Crear una instancia de la fecha actual
    const now = new Date();

    // Crear un objeto de Intl.DateTimeFormat para la zona horaria de Bogotá
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const bogotaTimeString = new Intl.DateTimeFormat('en-US', options).format(now);

    // Dividir la cadena formateada en partes de fecha y hora
    const [date, time] = bogotaTimeString.split(', ');
    const [month, day, year] = date.split('/');
    const [hour, minute, second] = time.split(':');

    // Crear un objeto Date en la zona horaria de Bogotá
    const bogotaDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}-05:00`);

    // Convertir la fecha a segundos desde el epoch
    return Math.floor(bogotaDate.getTime() / 1000) as number;
}