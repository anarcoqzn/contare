export function createIncome(title, description, value, date, periodicity, callback) {
    fetch('http://localhost:8080/contare/user/incomes', {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title, description, value, receivedOn: date, periodicity
        })
    }).then(callback)
}

export function getIncomes() {
    return fetch('http://localhost:8080/contare/user/incomes', {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.token
        }
    }).then(resp => resp.json())
}