function promisify ( api ) {
    return function ( options ) {
        return new Promise(function ( resolve, reject ) {
            api(Object.assign({}, options, { success: function ( res ) { resolve(res) }, fail: function ( res ) { reject(res) } }));
        });
    }
}
export default promisify;