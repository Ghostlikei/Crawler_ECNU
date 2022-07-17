
class queue{
    constructor(){
        this.items = [];
        this.$number = 0;
        this.OVERFLOW_NUMBER = 1048575;
    }

    enqueue(element){
        if (this.$number > this.OVERFLOW_NUMBER){
            throw new RangeError("Status code 501: Queue Overflow!");
        }

        this.items.push(element);
        this.$number++;
    }

    dequeue(){
        if (this.$number === 0){
            throw new RangeError("Status code 502: Queue Underflow!");
        }
        
        this.$number--;
        return this.items.shift();
    }

    front(){
        if (this.$number === 0){
            throw new ReferenceError("Status code 503: Query undefined!");
        }
        return this.items[0];
    }

    end(){
        if (this.$number === 0){
            throw new ReferenceError("Status code 503: Query undefined!");
        }
        return this.items.slice(-1);
    }

    isEmpty(){
        return this.$number === 0;
    }

    size(){
        return this.$number;
    }

    toString(){
        let str = '';
        for (let i of this.items){
            str += this.items.indexOf(i)+ '. '+ i + '\n';
        }
        return str;
    }

}

export default queue
