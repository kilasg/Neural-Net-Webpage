// Utility functions

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(date);
};

export const calculateSum = (numbers) => {
    return numbers.reduce((acc, num) => acc + num, 0);
};

export const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};