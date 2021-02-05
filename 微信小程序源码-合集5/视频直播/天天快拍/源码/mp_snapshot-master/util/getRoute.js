function getRoute ( obj ) {
    var route_arr = obj.__route__.split('/');
    var len = route_arr.length;
    var route_name = route_arr[len-1];
    return route_name;
}
module.exports = getRoute;