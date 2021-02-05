import getResScale from './getResScale';

function assignImgInfo ( len, arr ) {
    if ( !len ) return;

    var scale = getResScale();

    arr[0].x = 0;
    arr[0].y = 0;
    if ( len == 1 ) {
        arr[0].width = 680*scale;
        arr[0].height = 900*scale;
    }
    if ( len == 2 ) {
        arr[1].x = 0;
        arr[1].y = 408*scale;
        for ( var i = 0; i < len; i++ ) {
            arr[i].width = 680*scale;
            arr[i].height = 400*scale;
        };
    }
    if ( len == 3 ) {
        for ( var i = 1; i < 3; i++ ) {
            arr[i].y = 528*scale;
            arr[i].width = 336*scale;
            arr[i].height = 336*scale;
        }
        arr[1].x = 0;
        arr[2].x = 344*scale;
        arr[0].width = 680*scale;
        arr[0].height = 520*scale; 
    };
    if ( len == 4 ) {
        arr[0].width = 680*scale;
        arr[0].height = 520*scale;
        for ( var i = 1; i < 4; i++ ) {
            arr[i].y = 528*scale;
            arr[i].x = (i-1)*230*scale;
            arr[i].width = 220*scale;
            arr[i].height = 220*scale;
        }
    };
    if ( len == 5 ) {
        arr[0].width = 450*scale;
        arr[0].height = 450*scale;
        for ( var i = 1; i < 3; i++ ) {
            arr[i].x = 460*scale;
            arr[i].y = (i-1)*230*scale;
            arr[i].width = 220*scale;
            arr[i].height = 220*scale;
        }
        for ( var i = 3; i < 5; i++ ) {
            arr[i].y = 460*scale;
            arr[i].x = (i-3)*344*scale;
            arr[i].width = 336*scale;
            arr[i].height = 336*scale;
        }
    };
    if ( len == 6 ) {
        arr[0].width = 450*scale;
        arr[0].height = 450*scale;
        for ( var i = 1; i < 3; i++ ) {
            arr[i].x = 460*scale;
            arr[i].y = (i-1)*230*scale;
        }
        for ( var i = 3; i < 6; i++) {
            arr[i].y = 460*scale;
            arr[i].x = (i-3)*230*scale;
        }
        for ( var i = 1; i < 6; i++ ) {
            arr[i].width = 220*scale;
            arr[i].height = 220*scale;
        };
    };
    if ( len == 7 ) {
        arr[0].width = 613*scale;
        arr[0].height = 470*scale;
        for ( var i = 1; i < 7; i++ ) {
            if ( i < 4 ) {
                arr[i].y = 476*scale;
                arr[i].x = (i-1)*207*scale;
            }
            else {
                arr[i].y = 683*scale;
                arr[i].x = (i-4)*207*scale;
            }
        }
        for ( var i = 1; i < 7; i++ ) {
            arr[i].width = 199*scale;
            arr[i].height = 199*scale;
        };
    };
    if ( len == 8 ) {
        arr[1].x = 344*scale;
        arr[1].y = 0;
        for ( var i = 2; i < 8; i++ ) {
            if ( i < 5 ) {
                arr[i].y = 344*scale;
                arr[i].x = (i-2)*228*scale;
            }
            else {
                arr[i].y = 572*scale;
                arr[i].x = (i-5)*228*scale;
            }
        }
        for ( var i = 0; i < 3; i++ ) {
            arr[i].width = 336*scale;
            arr[i].height = 336*scale;
        };
        for ( var i = 2; i < 8; i++ ) {
            arr[i].width = 220*scale;
            arr[i].height = 220*scale;  
        };
    };
    if ( len == 9 ) {
        for ( var i = 0; i < 9; i++ ) {
            if ( i < 3 ) {
                arr[i].y = 0;
                arr[i].x = i*230*scale;
            } 
            if ( i > 2 && i < 6 ) {
                arr[i].y = 230*scale;
                arr[i].x = (i-3)*230*scale;
            }
            if ( i > 5 && i < 9 ) {
                arr[i].y = 460*scale
                arr[i].x = (i-6)*230*scale;
            }
        }
        for( var i = 0; i < len; i++ ) {
            arr[i].width = 220*scale;
            arr[i].height = 220*scale;
        };
    };
}

export default assignImgInfo;
