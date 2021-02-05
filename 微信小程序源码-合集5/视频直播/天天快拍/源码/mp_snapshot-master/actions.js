    // 关于
   export const getAbout =  ( text ) => {
         return { type: 'GET_ABOUT',  text}
    }

    // 日期范围
    export const initDateRange = ( date ) => {
        return { type: 'INIT_DATE_RANGE', date }
    }

    // 日期
    export const changeDate = ( date ) => {
        return { type: 'CHANGE_DATE', date }
    }

    // 快拍第一
    export const getSelectDayTopPhoto  = ( top_photo ) => {
        return { type: 'SHOW_SELECT_TOP_PHOTO', top_photo  }
    }
    export const getCurrentTopPhoto = ( top_photo ) => {
        return { type: 'SHOW_CURRENT_TOP_PHOTO', top_photo }
    }
    export const getPreTopPhoto = ( top_photo ) => {
        return { type: 'SHOW_PRE_TOP_PHOTO', top_photo  }
    }
    export const getNextTopPhoto =  ( top_photo ) => {
        return { type: 'SHOW_NEXT_TOP_PHOTO', top_photo }
    }

    // 投稿
    export const  getSelectDayPhotos =  ( photos ) => {
        return { type: 'SHOW_SELECT_DAY_PHOTOS', photos }
    }
    export const getCurrentPhotos = ( photos ) => {
        return { type: 'SHOW_CURRENT_PHOTOS', photos }
    }
    export const getPrePhotos = ( photos ) => {
        return { type: 'SHOW_PRE_PHOTOS', photos }
    }
    export const getNextPhotos  = ( photos )  => {
        return { type: 'SHOW_NEXT_PHOTOS', photos}
    }

    // 作品
   export const getWork  = ( work ) => {
        return { type: 'GET_WORK', work }
    }

    // 加载更多
    export const showLoadingState = ( load_state ) => {
        return { type: 'IS_LOADING', load_state }
    }
    export const showFinishState = ( load_state ) => {
        return { type: 'IS_FINISH', load_state }
    }

    // 打分面板
    export const changeScoreState = ( score_panel ) => {
        return { type: 'CHANGE_SCORE_STATE', score_panel }
    }

    // 查看大图
    export const changeSlider = ( slider ) => {
        return { type: 'CHANGE_SLIDER', slider }
    }