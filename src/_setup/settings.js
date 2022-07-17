export const MAX_CAPACITY = 1048575;

export default class UnderflowError extends Error{
    constructor(statusText){
        super(`Error code: 501, ` + statusText);
        this.name = 'UnderflowError';
    }
}

export default class OverflowError extends Error{
    constructor(statusText){
        super(`Error code: 502, ` + statusText);
        this.name = 'UnderflowError';
    }
}