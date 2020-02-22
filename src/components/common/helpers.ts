export function timeToString(time) {
	if (time == null) {
		return '--:--:--'
	}
	let negative
	if (time < 0) {
		negative = true
		time = -time
	}
	time = (time / 1000) | 0
	const sec = time % 60
	time = (time / 60) | 0
	const min = time % 60
	time = (time / 60) | 0
	const hour = time

	return (negative ? '-' : '') + `${
		hour
	}:${
		min.toString().padStart(2, '0')
	}:${
		sec.toString().padStart(2, '0')
	}`
}

export function dateTimeToString(date: Date) {
	if (!date) {
		return '--/--/---- --:--:-- --'
	}

	return [
		((date.getMonth() + 1) + '').padStart(2, '0'), '/',
		(date.getDay() + '').padStart(2, '0'), '/',
		date.getFullYear(), ' ',
		(((date.getHours() + 11) % 12 + 1) + '').padStart(2, '0'), ':',
		(date.getMinutes() + '').padStart(2, '0'), ':',
		(date.getSeconds() + '').padStart(2, '0'), ' ',
		date.getHours() > 12 ? 'PM' : 'AM',
	].join('')
}

export function timeOfDayToString(date: Date) {
	if (!date) {
		return '--:--:-- --'
	}

	return [
		(((date.getHours() + 11) % 12 + 1) + '').padStart(2, '0'), ':',
		(date.getMinutes() + '').padStart(2, '0'), ':',
		(date.getSeconds() + '').padStart(2, '0'), ' ',
		date.getHours() > 12 ? 'PM' : 'AM',
	].join('')
}

export function dateToString(date: Date) {
	if (!date) {
		return '--/--/----'
	}

	return [
		((date.getMonth() + 1) + '').padStart(2, '0'), '/',
		(date.getDay() + '').padStart(2, '0'), '/',
		date.getFullYear(), ' ',
	].join('')
}

export function getElapsedTime(date, now?: number) {
	if (!date) {
		return null
	}

	return (now || Date.now()) - date.getTime()
}

// Experimental, not worked yet
const contextPropName = 'afd7447c140f4e38bd2fb6e853784f5f'
export function runInContext<T>(win, func: (...args: any[]) => T, ...args): T {
	win[contextPropName] = {
		func,
		args,
	}
	const result = win.eval(`(function() {
		try {
			return { result: window['${contextPropName}'].func.apply(null, window['${contextPropName}'].args)
		}
		} catch (error) {
			return { error }
		}
	})()`)
	if (result.error) {
		throw result.error
	}
	return result.result
}

export function toValuesIterable(object, defaultValues = []) {
	if (object
		&& typeof object === 'object'
		&& typeof object.values === 'function'
	) {
		return object.values() || defaultValues
	}

	return object || defaultValues
}

export function toValuesArray(object, defaultValues = []) {
	return Array.from(toValuesIterable(object, defaultValues))
}
