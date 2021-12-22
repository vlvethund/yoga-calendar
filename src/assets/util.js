class Util {
    static keyDownEventHandler(event, func) {
        if (event.key === 'Escape') {
            func()
        }
    }
}

export default Util;
