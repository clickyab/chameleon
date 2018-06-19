function debounce(fn: () => void, wait: number, immediate: boolean = false): any {
    let timeout;
    return function () {
        let context = this,
            args = arguments;

        let later = () => {
            timeout = null;
            if (!immediate) fn.apply(context, args);
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(context, args);
    };
}


export default debounce;
