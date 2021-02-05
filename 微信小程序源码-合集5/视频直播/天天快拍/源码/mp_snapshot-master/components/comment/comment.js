function renderCommentData ( arr, root_images ) {
    var comments = [];

    if ( Array.isArray(arr) ) {

        arr.forEach(function ( item ) {
            var comment = structCommentData(item, root_images );
            comments.push(comment);
        });

    };
    
    return comments;
}
function structCommentData ( item, root_images ) {
    var obj = {};
    var src = root_images + item.user.avatar;

    obj.src = src;
    obj.nickname = item.user.nickname;
    obj.date = item.create_time;
    obj.content = item.content;
    obj.works_id = +item.works_id;
    obj.id = +item.id;

    return obj;
}

export default renderCommentData;
 