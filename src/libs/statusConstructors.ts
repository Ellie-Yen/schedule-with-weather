/**
 * used in parse/ dataReducer, indicate the fetch status and data for rendering
 */

export function initStatus(data: any): {status: 'init', data: typeof data}{
  return {
    status: 'init',
    data
  }
}

export function loadingStatus(data: any): {status: 'loading', data: typeof data}{
  return {
    status: 'loading',
    data
  }
}

export function failedStatus(data: any): {status: 'failed', data: typeof data}{
  return {
    status: 'failed',
    data
  }
}

export function successStatus(data: any): {status: 'success', data: typeof data}{
  return {
    status: 'success',
    data
  }
}