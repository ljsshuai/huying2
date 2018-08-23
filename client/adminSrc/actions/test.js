export function test(state = { abc: 1111 }, action) {

    switch (action.type) {
        case 'logon':
            return 'suer'
        case 'logout':
            return 'outuser';
        default:
            return state;
    }

}