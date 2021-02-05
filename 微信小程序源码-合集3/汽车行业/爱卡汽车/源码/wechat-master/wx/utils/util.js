function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//函数节流
function throttle(method,delay,duration){
    var timer=null, begin=new Date();
        
    return function(){
        var context=this, args=arguments, current=new Date();
        clearTimeout(timer);
        
        if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}

module.exports = {
  formatTime: formatTime,
  throttle:throttle
}
