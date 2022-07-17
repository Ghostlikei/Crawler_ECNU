import queue from '../src/_setup/simpleQueue.js';
function testq(){
    let q = new queue();
    q.enqueue("a");
    console.log(q);
    q.dequeue();
    q.dequeue();
}

testq();