var outImg = 'https://dzpublic.eyexpo.net.cn/static/b/h5/images/test77.jpg';
var n = 23;
var con = 100 / (n - 1);
var mouseMoveOldX = 0;
var delta = 0;
var multiple = 1;

$('#thumbnail').css(
    {
        'height': $(document).height(),
        'background-size': `${(n + 1) * 100}% 100%`,
        'background-image': `url(${outImg})`
    }
)

// 手机触屏滑动事件
$(document).on('touchmove', '#container', function (e) {
    mouseMoving(event)
})

/**
 * 图片放大逻辑-双击（3层）
 * 当前不支持指定点放大
 */
$(document).on('dblclick', '#container', function (e) {
    if (multiple == 1) {
        multiple = 2;
    } else if (multiple == 2) {
        multiple = 3;
    } else {
        multiple = 1;
    }

    $('#thumbnail').css(
        {
            'background-size': `${(n + 1) * 100 * multiple}% ${100 * multiple}%`
        }
    )
})

function mouseMoving(evt, gammaPageX = 0) {
    var pageX;
    if (typeof evt.touches == "undefined") {
        // pc
        pageX = evt.pageX;
    } else {
        // 移动端
        pageX = evt.touches[0].pageX;
    }
    pageX = gammaPageX > 0 ? gammaPageX : simpleFloat(pageX);
    console.log('move', mouseMoveOldX, 'to', pageX)
    if ((pageX + 10) < mouseMoveOldX) { // left
        delta = simpleFloat(delta - con)
        console.log('left', delta)
        if (delta < 0) {
            delta = 0;
        }
    } else if ((pageX - 10) > mouseMoveOldX) { // right
        delta = simpleFloat(delta + con)
        console.log('right', delta)
        if (delta > 100) {
            delta = 100;
        }
    } else {
        return false;
    }
    // evt.target.style.backgroundPosition = `${delta}% center`;
    $('#thumbnail').css(
        {
            'background-position': `${delta}% center`
        }
    )
    mouseMoveOldX = pageX;
}

// 获取手机陀螺仪
var gamma, oldGamma, width;
var gammaLimit = 0.5;
var updateGravity = function(event) {
    // console.log("alpha:",event.alpha); // X
    // console.log("beta:",event.beta); // Y
    // console.log("gamma:",event.gamma); // Z
    gamma = simpleFloat(event.gamma);
    var deltaGamma = simpleFloat(gamma - oldGamma);
    oldGamma = gamma;
    console.log('gamma', gamma, oldGamma, deltaGamma)
    if ((deltaGamma < gammaLimit && deltaGamma > gammaLimit)) {
        return false;
    }
    width = $(document).width();
    mouseMoving(event, simpleFloat((gamma + 90) * width / 180));
};

// 监听 window 的 deviceorientation 事件
window.addEventListener('deviceorientation', updateGravity, false);

/**
 * 简单的3位小数
 * @param float
 * @param floatN
 * @returns {number}
 */
function simpleFloat(float = 0, floatN = 3) {
    var floatNNumber = Math.pow(10, floatN);
    return Math.round(float * floatNNumber) / floatNNumber;
}
