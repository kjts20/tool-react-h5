const isDebug = true;
export const Assert = {
    isTrue(expression, message, ...args) {
        if (!expression) {
            if (isDebug) {
                console.error(message, ...args);
            }
            throw new Error(message);
        }
    },
    isFalse(expression, message, ...args) {
        return this.isTrue(!expression, message, ...args);
    }
};
