// A fixed login for the whole site. This only keeps casual visitors out: anyone who opens the
// browser's developer tools can read these values, so never reuse a real password here.
export const USERNAME = 'nymbl'
export const PASSWORD = 'nymbl'

export function credentialsMatch(username: string, password: string): boolean {
  return username.trim() === USERNAME && password === PASSWORD
}

export const SESSION_KEY = 'data-detective-signed-in-v1'
