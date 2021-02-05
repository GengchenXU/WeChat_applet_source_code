class Events {
    on ( event, fn, ctx ) {
        if ( typeof fn !== 'function' ) {
            console.error('fn must be a function');
            return;
        }

        this._stores = this._stores || {};
        (this._stores[event] = this._stores[event] || []).push({ cb: fn, ctx: ctx });
    }
    emit ( event ) {
        this._stores = this._stores || {};
        var store = this._stores[event];

        if ( store ) {
            store = store.slice(0)
            args = [].slice.call(arguments, 1);

            for ( var i = 0, len = store.length; i < len; i++ ) {
                store[i].apply(store[i].ctx, args);
            }
        };
    }
    off ( event, fn ) {
        this._stores = this._stores || {};

        // all
        if ( !arguments.length ) {
            this._stores = {};
            return;
        }

        var store = this._stores[event];
        if ( !store ) return;
        // remove all handlers 
        if ( arguments.length == 1 ) {
            delete this._stores[event];            
        }

        // remove specific handler
        var cb;
        for ( var i = 0, len = callbacks.length; i < len; i++  ) {
            cb = store[i].cb;
            if ( cb == fn  ) {
                store.splice(i, 1);
                break
            }
        }
        return;
    }
}
export default Events;