export const dateToInt = (date: Date) =>
    `${date.getFullYear()}` +
    `${pad(date.getMonth())}` +
    `${pad(date.getDate())}`;

const pad = (n:Number) => {
    let numberString = n.toString();
    return numberString.length >= 2 ? n : new Array(2 - numberString.length + 1).join("0") + n;
}