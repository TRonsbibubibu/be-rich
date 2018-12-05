const chalk = require('chalk');
const inquirer = require('inquirer');

function day(deposit, annualRate) {
    return (deposit * annualRate) / 365;
}

(async () => {
    const name = await questionName();
    const age = await questionAge();
    const deposit = await questionDeposit();
    const annualRate = await questionRate();
    const timeUnit = await questionTimeUnit();
    const time = await questionTime(age, timeUnit);
    const savingPerMonth = await questionSavingPerMonth();

    let money = deposit;
    for (let i = 1; i <= time; i++) {
        money += day(deposit, annualRate);
        if (i % 30 === 0) {
            money += savingPerMonth;
        }
    }

    const finalAge = age + Math.round(time / 365);
    console.log(chalk.red(name), 'will be financial freedom with', chalk.red(money.toFixed(2)), 'in your', chalk.red(finalAge),'old')
})();

async function questionName() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            message: '👨 who are you？',
        }])
        .then(answer => answer.action)
}

async function questionAge() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            message: '🕘 how old are you？',
            validate: input =>
                parseInt(input) <= 100 ? true : `You're here to be funny!`,
            filter: input => parseInt(input),
            transformer: input => parseFloat(Math.abs(input)) || 0,
        }])
        .then(answer => answer.action)
}

async function questionDeposit() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            message: '💰 How much do you have in savings?',
            filter: input => parseFloat(input),
            transformer: input => parseFloat(input) || 0,
            validate: input => input >= 0 ? true : "It can\'t be negative",
        }])
        .then(answer => {
            const deposit = answer.action;
            if (deposit === 0) {
                console.log('so poor! fish!');
            }
            return deposit;
        })
}

async function questionRate() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            message: '💸 annual rate of return?',
            transformer: input => (parseFloat(input) || 0) + chalk.red('%'),
            validate: input => input >= 0 ? true : "It can\'t be negative",
            filter: input => parseFloat(input)
        }])
        .then(answer => answer.action)
}

async function questionTimeUnit() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'list',
            message: `⏳ choose a time unit`,
            choices: [
                {name: 'Day', value: 'Day'},
                {name: 'Month', value: 'Month'},
                {name: 'Year', value: 'Year'}
            ],
        }])
        .then(answer => answer.action)
}

async function questionTime(age, unit = 'Day') {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            message: '⏳ How long before financial freedom?',
            suffix: ` (${chalk.red(unit)})`,
            transformer: input => parseInt(input) || 0,
            filter: input => parseInt(input),
            validate: input => {
                if ((age * 365 + getDay(unit, input)) > 36500) {
                    return 'You may not live that long';
                }
                return true;
            }
        }])
        .then(answer => getDay(unit, answer.action));
}

async function questionSavingPerMonth() {
    return inquirer
        .prompt([{
            name: 'action',
            type: 'input',
            transformer: input => parseFloat(input) || 0,
            filter: input => parseFloat(input),
            message: '🏦 How much will you saving per month?'
        }])
        .then(answer => answer.action)
}

function getDay(unit, time) {
    switch (unit) {
        case 'Day':
            return time;
        case 'Month':
            return time * 30;
        case 'Year':
            return time * 365;
    }
}