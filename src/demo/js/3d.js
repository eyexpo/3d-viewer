$(document).ready(function () {
    var n = 23;
    var speed = 5; // ?px => 切一张图

    var currentN = 1;
    var toN = n;

    function switchImgSmooth() {
        if (toN < 1 || toN > n) {
            return false;
        }
        if (currentN < toN) {
            // right direction
            currentN++;
            if (currentN > toN) {
                return false;
            }
        } else if (currentN > toN) {
            // left direction
            currentN--;
            if (currentN < 1) {
                return false;
            }
        } else {
            return false;
        }
        $('#img img').attr('data-n', currentN)
        $('#img img').attr('src', './img/asset-3d3/' + currentN + '.jpg')
    }

    var addition = 0, remainder = 0, direction;

    function switchImg(xphase) {
        addition = isNaN(addition) ? 0 : addition;
        remainder = isNaN(remainder) ? 0 : remainder;
        if (xphase > 0) {
            // 右滑
            direction = 'r';
        } else if (xphase < 0) {
            // 左滑
            direction = 'l';
        } else {
            // 无滑动
            direction = 'n';
        }
        xphaseNew = Math.abs(xphase) + addition;

        currentN = $('#img img').attr('data-n');
        xphase = Math.floor(xphaseNew / speed);
        remainder = xphaseNew % speed;
        addition = +remainder;

        console.log('direction:' + direction, 'xphase:' + xphase, 'total:' + n, 'speed:' + speed, 'current:' + currentN, 'addition:' + addition, 'remainder:' + remainder);

        if (direction == 'r') {
            toN = currentN + xphase;
            if (toN > n) {
                toN = n;
            }
        } else if (direction == 'l') {
            toN = currentN - xphase;
            if (toN <= 1) {
                toN = 1;
            }
        } else {
            // 无滑动
            toN = currentN;
        }
        switchImgSmooth();
        return false;
    }

    //定义变量，用于记录坐标和角度
    var startx, starty, movex, movey, endx, endy, nx, ny, angle;

    function touchs(event) {
        //阻止浏览器默认滚动事件
        // event.preventDefault(); // 会影响页面点击事件
        //获取开始的位置数组的第一个触摸位置
        var touch;
        if (typeof event.touches == "undefined") {
            // pc
            touch = event;
        } else {
            // 移动端
            touch = event.touches[0];
        }
        //通过if语句判断event.type执行了哪个触摸事件
        if (event.type == "touchstart") {
            console.log('开始');
            //获取第一个坐标的X轴
            startx = Math.floor(touch.pageX);
            //获取第一个坐标的y轴
            starty = Math.floor(touch.pageY);
            // console.log('xstart', startx, 'ystart', starty)
            //触摸中的坐标获取
        } else if (event.type == "touchmove") {
            console.log('滑动中');
            var lastMovex = isNaN(movex) ? startx : movex;
            var lastMovey = isNaN(movey) ? starty : movey;
            movex = Math.floor(touch.pageX);
            movey = Math.floor(touch.pageY);
            // TODO 图片切换
            switchImg(movex - lastMovex);
            //当手指离开屏幕或系统取消触摸事件的时候
        } else if (event.type == "touchend" || event.type == "touchcancel") {
            //获取最后的坐标位置
            endx = Math.floor(event.changedTouches[0].pageX);
            endy = Math.floor(event.changedTouches[0].pageY);
            console.log('结束');
            //获取开始位置和离开位置的距离
            nx = endx - startx;
            ny = endy - starty;
            //通过坐标计算角度公式 Math.atan2(y,x)*180/Math.PI
            angle = Math.atan2(ny, nx) * 180 / Math.PI;
            if (Math.abs(nx) < speed) {
                console.log('滑动距离太小');
                return false;
            }
            //通过滑动的角度判断触摸的方向
            if (angle < 45 && angle >= -45) {
                console.log('右滑动' + nx);
                return false;
            } else if (angle < 135 && angle >= 45) {
                console.log('下滑动');
                return false;
            } else if ((angle <= 180 && angle >= 135) || (angle >= -180 && angle < -135)) {
                console.log('左滑动' + nx);
                return false;
            } else if (angle <= -45 && angle >= -135) {
                console.log('上滑动');
                return false;
            }
        } else if (event.type == "mousemove") {
            console.log('PC滑动中');
            var lastMovex = isNaN(movex) ? startx : movex;
            movex = Math.floor(touch.pageX);
            switchImg(movex - lastMovex);
        }
    }

    $(document).on('mousemove', '#img img', function (event) {
        touchs(event);
    })

    //添加触摸事件的监听，并直行自定义触摸函数
    var body = document.getElementsByTagName("body")[0];
    body.addEventListener('touchstart', touchs, false);
    body.addEventListener('touchmove', touchs, false);
    body.addEventListener('touchend', touchs, false);


    // 获取手机陀螺仪
    var gamma, oldGamma, width;
    var updateGravity = function (event) {
        // console.log("alpha:",event.alpha); // X
        // console.log("beta:",event.beta); // Y
        // console.log("gamma:",event.gamma); // Z
        gamma = simpleFloat(event.gamma) + 90; // gamma取值范围-90~90 换算成0~180方便换算
        var deltaGamma = simpleFloat(gamma - oldGamma);
        console.log('gamma', gamma, oldGamma, deltaGamma);
        oldGamma = gamma;
        width = $(document).width();
        switchImg(simpleFloat(deltaGamma * width / 180));
    };

    // 监听 window 的 deviceorientation 事件
    window.addEventListener('deviceorientation', updateGravity, false);

    /**
     * 简单的3位小数
     * @param float
     * @param floatN
     * @returns {number}
     */
    function simpleFloat(float = 0, floatN = 0) {
        if (floatN <= 0) {
            return Math.round(float);
        }
        var floatNNumber = Math.pow(10, floatN);
        return Math.round(float * floatNNumber) / floatNNumber;
    }

    // 优化获取陀螺仪支持
    const agentInfo = window.navigator.userAgent.toLowerCase();
    if (agentInfo.indexOf('mobile') > -1 && agentInfo.indexOf('applewebkit') > -1 &&
        agentInfo.indexOf('linux') === -1 && agentInfo.indexOf('android') === -1 && agentInfo.indexOf('chrome') === -1
    ) { // ios 移动设备内，非android、chrome
        console.log(DeviceMotionEvent)
        if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
            // (optional) Do something before API request prompt.
            DeviceMotionEvent.requestPermission()
                .then(response => { // 'granted' or 'denied'
                    // (optional) Do something after API prompt dismissed.
                    console.log('用户操作' + response)
                })
                .catch(error => {
                    // alert('request device motion error=' + error);
                    console.log('request device motion error=' + error);

                    const theBody = document.getElementsByTagName("body").item(0);
                    var authCover = "<div id='gyroAuthCover' style='background-color: #00000059;position: fixed;left: 0;top: 0;z-index: 999; width: 100%;height: 100%;    display: flex;    flex-direction: column;align-items: center;justify-content: center'>" +
                        "<img style='width: 17.857rem; height: auto' src='https://dzpublic.eyexpo.net.cn/static/dianzhen/h5/images/gyroAuthCover.png' onclick='gyroPermisson()'>" +
                        "<div style='width: 10rem;height: 2.58rem;line-height: 2.58rem;text-align: center;border-radius: 1.79rem; background-color: #f98126; color: white;    position: relative;top: -4.7rem;pointer-events: none'>" +
                        "点击获取最佳体验" +
                        "</div>" +
                        "</div>";
                    theBody.insertAdjacentHTML('beforeend', authCover);
                });
        }
    }

    $(document).on('click', '#gyroAuthCover img', function () {
        gyroPermisson();
    })

    function gyroPermisson() {
        DeviceMotionEvent.requestPermission()
            .then(response => { // 'granted' or 'denied'
                // (optional) Do something after API prompt dismissed.
                // if ( response == "denied" ) {//denied
                //     alert("you denied the gyro");
                // }
                /* no need any more 2020.6.24
                var iframeAry = document.getElementsByTagName('iframe');
                for (var aElement of iframeAry) {
                    aElement.contentWindow.location.reload();
                }
                */
            })
            .catch(error => {
                console.log('request device motion error=' + error);
            });

        var gyroAuthCover = document.getElementById('gyroAuthCover');
        gyroAuthCover.remove();
    }

})
