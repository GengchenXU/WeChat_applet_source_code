import getAsynUserData from '../../util/getAsynUserData'
import getResScale from '../../util/getResScale'
import packingRequest from '../../util/packingRequest'

const app = getApp();
const root = app.host.root;
const url = root + 'v1/works/grade';

let index;
let access_token;

// 按钮滑动计算
let scale = getResScale();

let x1 = (wx.getSystemInfoSync().windowWidth-600*scale)/2 +20*scale;
let x2;

let slider_w = scale * 560;
let btn_width = scale * 50;

let min_pos = 0;
let max_pos = slider_w - btn_width;
let move_pos = 0;

function submitScore () {
    var _this = this;

    var score_panel = this.data.score_panel;
    var score = this.data.score_panel.score;
    var id = this.data.score_panel.works_id;

    // 逐渐缩小评分面板
    var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
        transformOrigin: '-60% -60%'
    });
    animation.scale(0.05).opacity(0.05).step();
    score_panel.animationData = animation.export();

    this.setData({
        score_panel: score_panel
    });

    // 提交分数
    packingRequest({
        url: url,
        method: 'post',
        header: {
            accesstoken: access_token
        },
        data: {
            score: score,
            works_id: id
        }
    }).then(res => {
        var score = res.data.data;
        _this.closeScorePanel();
        
        wx.showToast({
            title: '打分成功'
        });
  
        if ( typeof index !== 'undefined' ) {
            var works = _this.data.works;
            works[index].is_score = 1;

            _this.setData({
                works: works
            });
        }
        else {
            var item = _this.data.item;
            item.is_score = 1;

            _this.setData({
                item: item
            });
        }
        _this.getScore(score, id);

    }, err => {
        console.log(err);
        _this.closeScorePanel();
        var msg = err.data.message; 
        if ( msg ) {
            wx.showToast({
                title: msg
            });
        };
    });

}
function getScore ( score, id ) {
    var score_split = score.split('.');
    var score_integer = score_split[0];
    var score_decimal = score_split[1];

    if ( typeof index !== 'undefined' ) {
        var works = this.data.works;
        assignScore( works[index], score_integer, score_decimal );

        this.setData({
            works: works
        });
    }
    else {
        var item = this.data.item;
        assignScore( item, score_integer, score_decimal );

        this.setData({
            item: item
        });
    }
}
function assignScore ( item, score_integer, score_decimal ) {
    item.score_integer = score_integer;
    item.score_decimal = score_decimal;
    item.score_count++;
}
function closeScorePanel () {
    var score_panel = this.data.score_panel;
    score_panel.is_hide_score_panel = true;

    this.setData({
        score_panel: score_panel
    });
}
function openScorePanel ( e ) {
    var _this = this;
    var score_panel = this.data.score_panel;
    var id = e.target.id;
    var uid = e.target.dataset.uid;
    index = e.target.dataset.index;

    getAsynUserData(function ( user ) {
          if (user == ' ') {
            access_token = ' ';
            return wx.showToast({
              title: '用户未登录授权'
            });
          }
          else {
            access_token = user.access_token;
            if ( uid == user.id ) {
                return wx.showToast({
                    title: '不能给自己的作品打分'
                });
            }
            else {
                score_panel.is_hide_score_panel = false;
                score_panel.works_id = id;

                // 重置
                if ( id ) {
                    
                    var animation = wx.createAnimation({
                        duration: 0
                    });

                    animation.opacity(1).step();
                    score_panel.animationData = animation.export();

                    score_panel.score = 0;
                    score_panel.pos = 0;
                };

                _this.setData({
                    score_panel: score_panel
                });

            }
        }
    });
}
function startScore ( e ) {
    x2 = e.touches[0].clientX - x1 - move_pos;
}
function gradeScore ( e ) {
    let score_panel = this.data.score_panel;
    move_pos = e.touches[0].clientX - x1 - x2;
    
    if ( move_pos < min_pos ) {
        move_pos = 0;
    };
    if ( move_pos > max_pos ) {
        move_pos = max_pos;
    };

    score_panel.pos = move_pos;
    score_panel.score = Math.floor(100/max_pos*move_pos);

    this.setData({
        score_panel: score_panel
    });
}

export default {
    startScore: startScore,
    gradeScore: gradeScore,
    openScorePanel: openScorePanel,
    closeScorePanel: closeScorePanel,
    submitScore: submitScore,
    getScore: getScore
}