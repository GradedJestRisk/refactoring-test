
const getCompany = function (transaction) {
    return transaction('company').first();
}

const updateEmployeeCount = function (transaction, number) {
    return transaction('company').update({numberOfEmployees: number});
}

module.exports = { getCompany, updateEmployeeCount };