function formatDate(date) {
    const moment = new Date(date);
    return moment.toLocaleDateString() + ' à ' + moment.toLocaleTimeString();
}