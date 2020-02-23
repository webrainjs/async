"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getMarkerClass = getMarkerClass;
exports.gmapPointsToRect = gmapPointsToRect;
exports.GMapController = void 0;

var _log = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/math/log2"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

/// <reference types="@types/googlemaps" />
var Marker;

function getMarkerClass() {
  if (!Marker) {
    var _temp;

    Marker = (_temp =
    /*#__PURE__*/
    function (_google$maps$OverlayV) {
      (0, _inherits2.default)(Marker, _google$maps$OverlayV);

      function Marker(_ref) {
        var _this;

        var map = (0, _map.default)(_ref),
            container = _ref.container;
        (0, _classCallCheck2.default)(this, Marker);
        _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Marker).call(this));
        _this.deltaX = 0;
        _this.deltaY = 0;

        _this.setMap(map);

        _this.container = container;
        return _this;
      }

      (0, _createClass2.default)(Marker, [{
        key: "updatePosition",
        value: function updatePosition() {
          if (this.position) {
            var projection = this.getProjection();

            if (projection) {
              var point = projection.fromLatLngToContainerPixel(this.position);

              if (point) {
                this.container.style.left = point.x + this.deltaX + "px";
                this.container.style.top = point.y + this.deltaY + "px";
              }
            }
          }
        }
      }, {
        key: "draw",
        value: function draw() {
          var _console, _context;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          (_console = console).log.apply(_console, (0, _concat.default)(_context = ['draw']).call(_context, args));

          this.updatePosition();
        } // public onAdd(): void {
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

      }]);
      return Marker;
    }(google.maps.OverlayView), _temp);
  }

  return Marker;
}

function gmapPointsToRect() {
  for (var _len2 = arguments.length, points = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    points[_key2] = arguments[_key2];
  }

  if (!points) {
    return null;
  }

  var minLat;
  var maxLat;
  var minLng;
  var maxLng;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    if (minLat == null || point.lat() < minLat) {
      minLat = point.lat();
    }

    if (minLng == null || point.lng() < minLng) {
      minLng = point.lng();
    }

    if (maxLat == null || point.lat() > maxLat) {
      maxLat = point.lat();
    }

    if (maxLng == null || point.lng() > maxLng) {
      maxLng = point.lng();
    }
  }

  if (minLat == null || maxLat == null || minLng == null || maxLng == null) {
    return null;
  }

  return new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng));
}

var GMapController =
/*#__PURE__*/
function () {
  function GMapController(_ref2) {
    var map = (0, _map.default)(_ref2),
        zoomMin = _ref2.zoomMin,
        zoomMax = _ref2.zoomMax,
        viewArea = _ref2.viewArea,
        padding = _ref2.padding;
    (0, _classCallCheck2.default)(this, GMapController);
    this.map = map;
    this.zoomMin = zoomMin;
    this.zoomMax = zoomMax;
    this.viewArea = viewArea;
    this.padding = padding;
  }

  (0, _createClass2.default)(GMapController, [{
    key: "fromLatLngToPoint",
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
    value: function fromLatLngToPoint(latLng) {
      // const pointSW = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(-90, -180))
      // const pointNE = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(90, 180))
      // const baseWidth = pointNE.x - pointSW.x
      // const baseHeight = pointSW.y - pointNE.y
      var pointCenter = (0, _map.default)(this).getProjection().fromLatLngToPoint((0, _map.default)(this).getCenter());
      var zoom = Math.pow(2, (0, _map.default)(this).getZoom());
      var point = (0, _map.default)(this).getProjection().fromLatLngToPoint(latLng);
      var mapArea = this.mapArea;
      return new google.maps.Point((point.x - pointCenter.x) * zoom + pointCenter.x + (mapArea.width - 256) / 2, (point.y - pointCenter.y) * zoom + pointCenter.y + (mapArea.height - 256) / 2);
    }
  }, {
    key: "fromPointToLatLng",
    value: function fromPointToLatLng(point) {
      // const pointSW = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(-90, -180))
      // const pointNE = this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(90, 180))
      // const baseWidth = pointNE.x - pointSW.x
      // const baseHeight = pointSW.y - pointNE.y
      var pointCenter = (0, _map.default)(this).getProjection().fromLatLngToPoint((0, _map.default)(this).getCenter());
      var zoom = Math.pow(2, (0, _map.default)(this).getZoom());
      var mapArea = this.mapArea;
      return (0, _map.default)(this).getProjection().fromPointToLatLng(new google.maps.Point((point.x - (mapArea.width - 256) / 2 - pointCenter.x) / zoom + pointCenter.x, (point.y - (mapArea.height - 256) / 2 - pointCenter.y) / zoom + pointCenter.y), true);
    }
  }, {
    key: "getZoomToFitRect",
    value: function getZoomToFitRect(rect) {
      var pointNE = this.fromLatLngToPoint(rect.getNorthEast());
      var pointSW = this.fromLatLngToPoint(rect.getSouthWest());
      var width = pointNE.x - pointSW.x;
      var height = pointSW.y - pointNE.y;
      var zoom = (0, _map.default)(this).getZoom();
      var viewArea = this.viewArea || this.mapArea;
      var deltaZoom = (0, _log.default)(Math.min((viewArea.width - (this.padding || 0) * 2) / width, (viewArea.height - (this.padding || 0) * 2) / height));
      return Math.min(Math.max(Math.floor(zoom + deltaZoom), this.zoomMin || GMapController.ZOOM_MIN), this.zoomMax || GMapController.ZOOM_MAX);
    }
  }, {
    key: "getMapPosition",
    value: function getMapPosition(viewAreaPosition) {
      if (!this.viewArea) {
        return viewAreaPosition;
      }

      var mapArea = this.mapArea;
      var viewAreaCenterX = this.viewArea.x + this.viewArea.width / 2;
      var viewAreaCenterY = this.viewArea.y + this.viewArea.height / 2;
      var mapAreaCenterX = this.mapArea.x + this.mapArea.width / 2;
      var mapAreaCenterY = this.mapArea.y + this.mapArea.height / 2;
      var point = this.fromLatLngToPoint(viewAreaPosition);
      var position = this.fromPointToLatLng(new google.maps.Point(point.x + mapAreaCenterX - viewAreaCenterX, point.y + mapAreaCenterY - viewAreaCenterY));
      return position;
    }
  }, {
    key: "fitRect",
    value: function fitRect(rectOrPoint) {
      var zoom = rectOrPoint instanceof google.maps.LatLngBounds ? this.getZoomToFitRect(rectOrPoint) : this.zoomMax || GMapController.ZOOM_MAX;
      (0, _map.default)(this).setZoom(zoom);
      var position = this.getMapPosition(rectOrPoint instanceof google.maps.LatLngBounds ? rectOrPoint.getCenter() : rectOrPoint);
      (0, _map.default)(this).setCenter(position);
    } // public fitToMarkers() {
    // 	const rect = this.getMarkersRect()
    // 	if (rect == null) {
    // 		return
    // 	}
    // 	this.fitRect(rect)
    // }

  }, {
    key: "mapArea",
    get: function get() {
      var div = (0, _map.default)(this).getDiv();
      return {
        x: 0,
        y: 0,
        width: div.clientWidth,
        height: div.clientHeight
      };
    }
  }]);
  return GMapController;
}(); // export function toGMapPoint(this point: GeoPoint?): google.maps.LatLng? {
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


exports.GMapController = GMapController;
GMapController.ZOOM_MIN = 3;
GMapController.ZOOM_MAX = 21;