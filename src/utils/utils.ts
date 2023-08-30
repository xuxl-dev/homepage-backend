export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Note that this will capture the stack trace of the caller
 * @param action 
 * @param ms 
 * @returns 
 */
export function timeout<T>(action: Promise<T>, ms: number): Promise<T> {
  const stackTrace = new Error().stack;  // This is used for better debugging
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms at \n ${stackTrace}`))
    }, ms)
    action.then((result) => {
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function timeoutWith<T>(action: Promise<T>, ms: number, defaultValue: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(defaultValue)
    }, ms)
    action.then((result) => {
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function backOff<T>(actionFactory:() => Promise<T>, ms: number, maxRetries: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const retry = () => {
      const action = actionFactory()
      action.then((result) => {
        resolve(result)
      }).catch((err) => {
        if (retries < maxRetries) {
          retries++;
          setTimeout(() => {
            retry()
          }, ms *= 2) // exponential backoff
        } else {
          reject(err)
        }
      })
    }
    retry()
  })
}

export function NOT_IMPLEMENTED() {
  throw new Error('Not implemented')
}