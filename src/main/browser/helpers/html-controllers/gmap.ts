/// <reference types="@types/googlemaps" />

let Marker

export function getMarkerClass() {
	if (!Marker) {
		Marker = class extends google.maps.OverlayView {
			public container: HTMLElement
			public map: google.maps.Map
			public position: google.maps.LatLng
			public deltaX: number = 0
			public deltaY: number = 0

			constructor({
				map,
				container,
			}: {
				map: google.maps.Map,
				container: HTMLElement,
			}) {
				super()
				this.setMap(map)
				this.container = container
			}

			public updatePosition() {
				if (this.position) {
					const projection = this.getProjection()
					if (projection) {
						const point = projection.fromLatLngToContainerPixel(this.position)
						if (point) {
							this.container.style.left = `${point.x + this.deltaX}px`
							this.container.style.top = `${point.y + this.deltaY}px`
						}
					}
				}
			}

			public draw(...args) {
				// console.debug('draw', ...args)
				this.updatePosition()
			}

			// public onAdd(): void {
			// 	let markers = (this.map as any).markers
			// 	if (!markers) {
			// 		(this.map as any).markers = markers = [this]
			// 	} else {
			// 		markers.push(this)
			// 	}
			// }
			//
			// public onRemove(): void {
			// 	const markers = (this.map as any).markers
			// 	if (markers) {
			// 		const index = markers.indexOf(this)
			// 		markers[index] = markers[markers.length - 1]
			// 		markers.length--
			// 	}
			// }
		}
	}

	return Marker
}

export function gmapPointsToRect(...points: google.maps.LatLng[]): google.maps.LatLngBounds {
	if (!points) {
		return null
	}
	
	let minLat: number
	let maxLat: number
	let minLng: number
	let maxLng: number
	for (let i = 0; i < points.length; i++) {
		const point = points[i]
		if (minLat == null || point.lat() < minLat) {
			minLat = point.lat()
		}
		
		if (minLng == null || point.lng() < minLng) {
			minLng = point.lng()
		}
		
		if (maxLat == null || point.lat() > maxLat) {
			maxLat = point.lat()
		}
		
		if (maxLng == null || point.lng() > maxLng) {
			maxLng = point.lng()
		}
	}
	
	if (minLat == null || maxLat == null || minLng == null || maxLng == null) {
		return null
	}
	
	return new google.maps.LatLngBounds(
		new google.maps.LatLng(minLat, minLng),
		new google.maps.LatLng(maxLat, maxLng),
	)
}

export interface Rect {
	x: number
	y: number
	width: number
	height: number
}

export class GMapController {
	public map: google.maps.Map
	public zoomMin?: number
	public zoomMax?: number
	public viewArea?: Rect
	public padding?: number

	public static ZOOM_MIN: number = 3
	public static ZOOM_MAX: number = 21

	constructor({
		map,
		zoomMin,
		zoomMax,
		viewArea,
		padding,
	}: {
		map: google.maps.Map,
		zoomMin?: number,
		zoomMax?: number,
		viewArea?: Rect,
		padding?: number,
	}) {
		this.map = map
		this.zoomMin = zoomMin
		this.zoomMax = zoomMax
		this.viewArea = viewArea
		this.padding = padding
	}

	public get mapArea(): Rect {
		const div = this.map.getDiv()
		return {
			x: 0,
			y: 0,
			width: div.clientWidth,
			height: div.clientHeight,
		}
	}

	// public getMarkersRect(): google.maps.LatLngBounds {
	// 	const markers = (this.map as any).markers
	// 	if (!markers) {
	// 		return
	// 	}
	//
	// 	const rect = gmapPointsToRect(...markers.map(o => o.position))
	// 	if (!rect) {
	// 		return
	// 	}
	//
	// 	return rect
	// }

	public fromLatLngToPoint(latLng: google.maps.LatLng): google.maps.Point {
		// const pointSW = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(-90, -180))
		// const pointNE = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(90, 180))
		// const baseWidth = pointNE.x - pointSW.x
		// const baseHeight = pointSW.y - pointNE.y
		const pointCenter = this.map.getProjection().fromLatLngToPoint(this.map.getCenter())
		const zoom = Math.pow(2, this.map.getZoom())
		const point = this.map.getProjection().fromLatLngToPoint(latLng)
		const {mapArea} = this
		return new google.maps.Point(
			((point.x - pointCenter.x) * zoom + pointCenter.x) + (mapArea.width - 256) / 2,
			((point.y - pointCenter.y) * zoom + pointCenter.y) + (mapArea.height - 256) / 2,
		)
	}

	public fromPointToLatLng(point: google.maps.Point): google.maps.LatLng {
		// const pointSW = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(-90, -180))
		// const pointNE = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(90, 180))
		// const baseWidth = pointNE.x - pointSW.x
		// const baseHeight = pointSW.y - pointNE.y
		const pointCenter = this.map.getProjection().fromLatLngToPoint(this.map.getCenter())
		const zoom = Math.pow(2, this.map.getZoom())
		const {mapArea} = this
		return this.map.getProjection().fromPointToLatLng(new google.maps.Point(
			((point.x - (mapArea.width - 256) / 2) - pointCenter.x) / zoom + pointCenter.x,
			((point.y - (mapArea.height - 256) / 2) - pointCenter.y) / zoom + pointCenter.y,
		), true)
	}

	public getZoomToFitRect(rect: google.maps.LatLngBounds): number {
		const pointNE = this.fromLatLngToPoint(rect.getNorthEast())
		const pointSW = this.fromLatLngToPoint(rect.getSouthWest())
		const width = pointNE.x - pointSW.x
		const height = pointSW.y - pointNE.y

		const zoom = this.map.getZoom()
		const viewArea = this.viewArea || this.mapArea
		const deltaZoom = Math.log2(Math.min(
			(viewArea.width - (this.padding || 0) * 2) / width,
			(viewArea.height - (this.padding || 0) * 2) / height,
		))

		return Math.min(
			Math.max(
				Math.floor(zoom + deltaZoom),
				this.zoomMin || GMapController.ZOOM_MIN,
			),
			this.zoomMax || GMapController.ZOOM_MAX,
		)
	}

	public getMapPosition(viewAreaPosition: google.maps.LatLng) {
		if (!this.viewArea) {
			return viewAreaPosition
		}

		const {mapArea} = this

		const viewAreaCenterX = this.viewArea.x + this.viewArea.width / 2
		const viewAreaCenterY = this.viewArea.y + this.viewArea.height / 2
		const mapAreaCenterX = this.mapArea.x + this.mapArea.width / 2
		const mapAreaCenterY = this.mapArea.y + this.mapArea.height / 2

		const point = this.fromLatLngToPoint(viewAreaPosition)
		const position = this.fromPointToLatLng(new google.maps.Point(
			point.x + mapAreaCenterX - viewAreaCenterX,
			point.y + mapAreaCenterY - viewAreaCenterY,
		))

		return position
	}

	public fitRect(rectOrPoint: google.maps.LatLngBounds | google.maps.LatLng) {
		const zoom = rectOrPoint instanceof google.maps.LatLngBounds
			? this.getZoomToFitRect(rectOrPoint)
			: this.zoomMax || GMapController.ZOOM_MAX

		this.map.setZoom(zoom)

		const position = this.getMapPosition(
			rectOrPoint instanceof google.maps.LatLngBounds
				? rectOrPoint.getCenter()
				: rectOrPoint,
		)

		this.map.setCenter(position)
	}

	// public fitToMarkers() {
	// 	const rect = this.getMarkersRect()
	// 	if (rect == null) {
	// 		return
	// 	}
	// 	this.fitRect(rect)
	// }
}

// export function toGMapPoint(this point: GeoPoint?): google.maps.LatLng? {
// 	return new google.maps.LatLng(point.Value.Lat, point.Value.Lng);
// 	// TODO: Warning!!!, inline IF is not supported ?
// 	point.HasValue;
// 	(<google.maps.LatLng?>(null));
// }

// export function ToGMapRect(this rect: GeoRect?): google.maps.LatLngBounds? {
// 	return new google.maps.LatLngBounds(rect.Value.LeftTop.Lat, rect.Value.LeftTop.Lng, rect.Value.WidthLng,
// 	rect.Value.HeightLat);
// 	// TODO: Warning!!!, inline IF is not supported ?
// 	rect.HasValue;
// 	(<google.maps.LatLngBounds?>(null));
// }

// export function SetPosition(this map: GMapControl, position: google.maps.LatLng, relativeViewPort: GRect) {
// 	let point = map.FromLatLngToLocal(position);
// 	let centerRelativeViewPort = relativeViewPort.GetCenter();
// 	let centerViewPort = new GPoint((<number>((map.ActualWidth / 2))), (<number>((map.ActualHeight / 2))));
// 	let newPoint = new GPoint((point.X
// 					+ (centerRelativeViewPort.X - centerViewPort.X)), (point.Y
// 					+ (centerRelativeViewPort.Y - centerViewPort.Y)));
// 	let newPosition = map.FromLocalToLatLng((<number>(((point.X - centerRelativeViewPort.X)
// 					+ centerViewPort.X))), (<number>(((point.Y - centerRelativeViewPort.Y)
// 					+ centerViewPort.Y))));
// 	map.Position = newPosition;
// }
//
// export function SetZoomToFitRect(this map: GMapControl, rect: google.maps.LatLngBounds,
// relativeViewPort: GRect): boolean {
// 	let zoomMaxToFitRect: number = map.GetzoomMaxToFitRect(rect, relativeViewPort.Width, relativeViewPort.Height);
// 	if ((zoomMaxToFitRect <= 0)) {
// 		return false;
// 	}
//
// 	if ((zoomMaxToFitRect > map.zoomMax)) {
// 		zoomMaxToFitRect = map.zoomMax;
// 	}
//
// 	if ((map.Zoom != zoomMaxToFitRect)) {
// 		map.Zoom = zoomMaxToFitRect;
// 	}
//
// 	let center: google.maps.LatLng = new google.maps.LatLng((rect.Lat
// 					- (rect.HeightLat / 2)), (rect.Lng
// 					+ (rect.WidthLng / 2)));
// 	map.SetPosition(center, relativeViewPort);
// 	return true;
// }
//
// export function GetCenter(this rect: GRect): GPoint {
// 	return new GPoint(((rect.Right + rect.Left)
// 					/ 2), ((rect.Bottom + rect.Top)
// 					/ 2));
// }
//
// export function ToRect(this rect: GRect): Rect {
// 	return new Rect(rect.X, rect.Y, rect.Width, rect.Height);
// }
//
// export function ToGRect(this rect: Rect): GRect {
// 	return new GRect((<number>(Math.Round(rect.X))), (<number>(Math.Round(rect.Y))),
// 	(<number>(Math.Round(rect.Width))), (<number>(Math.Round(rect.Height))));
// }
//
// export function ZoomRelative(this map: GMapControl, newZoom: number, relativePoint: GPoint) {
// 	if ((newZoom > map.zoomMax)) {
// 		newZoom = map.zoomMax;
// 	}
//
// 	if ((newZoom < map.zoomMin)) {
// 		newZoom = map.zoomMin;
// 	}
//
// 	if ((map.Zoom == newZoom)) {
// 		return;
// 	}
//
// 	let relativePosition = map.FromLocalToLatLng((<number>(relativePoint.X)), (<number>(relativePoint.Y)));
// 	map.Zoom = newZoom;
// 	let newPosition = map.FromLocalToLatLng((<number>(relativePoint.X)), (<number>(relativePoint.Y)));
// 	map.Position = new google.maps.LatLng(((map.Position.Lat - newPosition.Lat)
// 					+ relativePosition.Lat), ((map.Position.Lng - newPosition.Lng)
// 					+ relativePosition.Lng));
// }
