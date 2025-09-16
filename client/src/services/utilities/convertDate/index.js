
function toDate(isoDate) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    const formatted = new Date(isoDate).toLocaleString('en-US', options);

    return formatted
}

function toDateNoTime(isoDate) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const formatted = new Date(isoDate).toLocaleString('en-US', options);

    return formatted
}

function isMoreThanOneYearAhead(dateString) {
    if (typeof dateString !== 'string') return false;

    const inputDate = new Date(dateString);
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return inputDate > oneYearLater;
}

export {
    toDate,
    toDateNoTime,
    isMoreThanOneYearAhead
};