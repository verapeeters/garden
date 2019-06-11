import {weekNumberReducer} from "../reducers/weekNumberReducer";

import * as ACTIONCONSTANTS from '../constants/actionConstants';



describe('ACTIONCONSTANTS.WEEK_NUMBER_INCREMENT', () => {
    test('simple', () => {
        const originalState = {weekNumber:10};
        const expectedState = {weekNumber:11};
        expect(weekNumberReducer(originalState, {type: ACTIONCONSTANTS.WEEK_NUMBER_INCREMENT})).toEqual(expectedState);
    });
    test('overflow', () => {
        const originalState = {weekNumber:52};
        const expectedState = {weekNumber:1};
        expect(weekNumberReducer(originalState, {type: ACTIONCONSTANTS.WEEK_NUMBER_INCREMENT})).toEqual(expectedState);
    });
});
