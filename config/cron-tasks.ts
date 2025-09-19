import { syncCafes } from "../jobs/syncCafes";

const OnceRuleName = 'ONCE';
const DailyRule = '15 2 * * *';
const TestRule = '30 11 * * *';

function getRule(confName: string) {
    let rule = process.env[confName];
    console.log(`using ${confName} = ${rule}`);

    switch (rule) {
        case 'DAILY':
            rule = DailyRule;
            break;
        case 'TEST':
            rule = TestRule;
            break;
        case OnceRuleName:
            return new Date(Date.now() + 10000);
        default:
            break;
    }
    return rule;
}

export default {
    syncCafes: {
        task: syncCafes,
        options: {
            rule: getRule('SYNC_CAFES_CRON'),
        },
    }
}