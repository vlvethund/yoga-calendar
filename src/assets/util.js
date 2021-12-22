import _ from 'lodash'

class Util {
    static keyDownEventHandler(event, func) {
        if (event.key === 'Escape') {
            func()
        }
    }

    static shuffleArray(array) {
        const newArray = _.clone(array)
        const length = newArray.length;

        for (let i = 0; i < length; i++) {
            Math.floor(Math.random() * length)
            const randomIndex = Math.floor(Math.random() * length);
            const valueOfRandomIndex = newArray[randomIndex];
            const valueOfIIndex = newArray[i];

            newArray[i] = valueOfRandomIndex;
            newArray[randomIndex] = valueOfIIndex;
        }
        return newArray;
    }
}

export default Util;
