function Timer(resolutionMillis) {

  const queue = [];
  let handle = false;
  var self = {}
  let running = false;
  function at(when, callback) {
    when = typeof when == "number" ? when : when.getTime();
    queue.push([when, callback]);
    if (!running) {
      start();
    }
  }


  function harvest() {
    let when, callback;
    const now = Date.now();
    //console.log('harvest', now);
    while(queue.length && queue[0][0] <= now) {
      [when, callback] = queue.shift() //pull an overdue pair off the head of the queue
      //console.log(when, 'was overdue')
      callback();
    }
    if (queue.length === 0) {
      stop();
    }
  }
  
  function flush() {
    //queue.splice(0); //empty the queue. or, we could do 
    queue = [];
    stop();
  }

  function start() {
    clearInterval(handle);
    running = true;
    handle = setInterval(harvest, resolutionMillis);
    harvest();
  }

  function stop() {
    console.log('STOP')
    running = false;
    clearInterval(handle);
  }

    
  return {
    at,
    flush,
    queue //for debugging... normally hide this.
  }
}
export default Timer;