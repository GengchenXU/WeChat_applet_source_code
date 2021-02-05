export default {
    user ( state = '', action ) {
        switch ( action.type ) {
            case 'GET_USER_INFO':
              return action.text
            default:
              return state
        }
    },
    about ( state = '', action ) {
      switch ( action.type ) {
        case 'GET_ABOUT':
          return action.text
        default: 
          return state
      }
    },
    date_range ( state = {
      start: '', // 标准格式日期如:2017-07-04
      end: ''
    }, action ) {
      switch ( action.type ) {
        case 'INIT_DATE_RANGE':
          return action.date 
        default:
          return state
      }
    },
    date ( state = {
      pre: '', // 标准格式日期
      pre_month: '',
      pre_date: '',

      current: '', // 标准格式日期
      current_month: '',
      current_date: '',
      current_day: '',
      
      next: 0 // 标准格式日期
    }, action ) {
      switch ( action.type ) {
        case 'CHANGE_DATE':
          return action.date
        default:
          return state
      }
    },
    top_photo ( state = {}, action ) {
        switch ( action.type ) {
            case 'SHOW_SELECT_DAY_TOP_PHOTO':
              return action.top_photo 
            case 'SHOW_CURRENT_TOP_PHOTO':
              return action.top_photo
            case 'SHOW_PRE_TOP_PHOTO':
              return action.top_photo
            case 'SHOW_NEXT_TOP_PHOTO': 
              return action.top_photo
            default:
              return state
        }
    },
    photos ( state = [], action ) {
        switch ( action.type ) {
            case 'SHOW_SELECT_DAY_PHOTOS':
              return action.photos
            case 'SHOW_CURRENT_PHOTOS':
              return action.photos
            case 'SHOW_PRE_PHOTOS':
              return action.photos
            case 'SHOW_NEXT_PHOTOS':
              return action.photos
            default: 
              return state
        }
    },
    work ( state = {
      is_hide_footer: true,
      is_hide_work: true
    }, action ) {
        switch ( action.type ) {
            case 'GET_WORK':
              return action.work
            default: 
              return state
        }
    },
    load_state ( state = {
      hide_loading: false,
      is_finish: false,
      has_no_data: false,
      tips: '暂无数据'
    }, action ) {
      switch ( action.type ) {
        case 'IS_LOADING':
          return action.load_state
        case 'IS_FINISH':
          return action.load_state
        default: 
          return state
      }
    },
    score_panel ( state = {
      score: 0,
      pos: 0,
      is_hide_score_panel: true,
      works_id: '',
      animationData: {}
    }, action ) {
      switch ( action.type ) {
        case 'CHANGE_SCORE_STATE':
          return action.score_panel 
        default: 
          return state
      }
    },
    slider ( state = {
      is_hide_loading: false,
      is_hide_slider_wrap: true,
      is_hide_slider: true,
    }, action ) {
      switch ( action.type ) {
        case 'CHANGE_SLIDER':
          return action.slider
        default:
          return state
      }
    },
    dialog ( state = true, action ) {
      switch ( action.type ) {
        case 'SHOW_DIALOG':
          return action.dialog
        default:
          return state;
      }
    }
}