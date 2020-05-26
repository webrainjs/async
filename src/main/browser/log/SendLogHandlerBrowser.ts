/* tslint:disable:no-var-requires */
import {ISendLogMessage, SendLogHandler} from '../../common/log/SendLogHandler'

function sendXhr(
	logUrl: string,
	message: ISendLogMessage,
	selfError?: (...messagesOrErrors) => void,
): Promise<{
	statusCode: number,
}> {
	return new Promise((resolve, reject) => {
		// construct an HTTP request
		const xhr = new XMLHttpRequest()
		xhr.onerror = (...args) => {
			selfError(...args)
		}
		xhr.open('POST', logUrl, true)
		xhr.timeout = 20000
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
		xhr.setRequestHeader('X-HASH', message.Hash)
		xhr.setRequestHeader('X-TOKEN', message.Token)
		// xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate')
		// xhr.setRequestHeader('Content-Encoding', 'gzip')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4)
			{
				resolve({
					statusCode: xhr.status,
				})
			}
		}
		xhr.send(JSON.stringify(message))
	})
}

function sendFetch(
	logUrl: string,
	message: ISendLogMessage,
): Promise<{
	statusCode: number,
}> {
	return fetch(logUrl, {
		method: 'POST',
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'X-HASH': message.Hash,
			'X-TOKEN': message.Token,
		},
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // no-referrer, *client
		body: JSON.stringify(message), // body data type must match "Content-Type" header
	})
	.then(response => ({
		statusCode: response.status,
	}))
}

export class SendLogHandlerBrowser extends SendLogHandler {
	protected sendLog(...args): Promise<{
		statusCode: number,
	}> {
		// tslint:disable-next-line:no-all-duplicated-branches
		return typeof XMLHttpRequest !== 'undefined'
			? (sendFetch as any)(...args)
			: (sendFetch as any)(...args)
	}
}
