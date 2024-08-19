// ==UserScript==
// @name         问卷星（快速版，如果卡住请用慢速版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  批量问卷星刷题，支持多种题型
// @author       Kevin3777
// @match        https://www.wjx.cn/*
// @icon         https://gitee.com/yuejinjianke/tuchuang/raw/master/image/image-20240212215352949.png
// @license      MIT
// @grant        none
// @homepageURL  https://github.com/users/Kevin3777/projects/1
// ==/UserScript==



// 使用localStorage对象
localStorage.clear();


(function() {
    'use strict';

    // --------------------------------初始化cookie-------------------------------------
    window.localStorage.clear()
    window.sessionStorage.clear()
    clearCookies()

    // 翻页并重定向逻辑
    const url = 'https://www.wjx.cn/vm/YDfQzYX.aspx'

    //转交到提交成功页面时跳回问卷页面
    if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1 ) {
        setTimeout(() => {
            window.location.href = url
        }, 100)
    }

    window.scrollTo({
        top: document.body.scrollHeight, left: 0, behavior: 'smooth'
    })


    // --------------------------------网页逻辑-------------------------------------
    // 获取网页基本元素
    let questionList = document.getElementsByClassName('field ui-field-contain')
    let clickList = []
    for (let i =0; i < questionList.length; i++){
        clickList.push(questionList[i].children[1])
    }



    // --------------------------------回答逻辑-------------------------------------
    // 定义回答列表
    let answerList = [
        {id: 1, type: '单选', ratio: [45, 55]},
        {id: 2, type: '单选', ratio: [12, 70,10,7,1]},
        {id: 3, type: '单选', ratio: [89, 11]},
        {id: 4, type: '单选', ratio: [1,1,17,81]},
        {id: 5, type: '单选', ratio: [12,84,3,1]},
        {id: 6, type: '多选', ratio: [12,13,13,14,11,12,12,13]},
        {id: 7, type: '单选', ratio: [82,17,1]},
        {id: 8, type: '单选', ratio: [1,81,11,7]},
        {id: 9, type: '单选', ratio: [99,1]},
        {id: 10, type: '单选', ratio: [78, 19,3]},
        {id: 11, type: '单选', ratio: [88, 11,1]},
        {id: 12, type: '单选', ratio: [9,71, 19,1]},
        {id: 13, type: 'none', ratio: [9,71, 19,1]},
        {id: 14, type: '单选', ratio: [72, 7,1]},
        {id: 15, type: '单选', ratio: [13,81,5,1]},
        {id: 16, type: '单选', ratio: [52,18,12,11,7]},
        {id: 17, type: '单选', ratio: [15,31,51,2]},
        {id: 18, type: '单选', ratio: [91, 8,1]},
        {id: 19, type: '单选', ratio: [88, 11,1]},
        {id: 20, type: '单选', ratio: [86, 13,1]},
        {id: 21, type: '多选', ratio: [26,33,12,21,8]},
        {id: 22, type: '单选', ratio: [81, 18,1]},
        {id: 23, type: 'none', ratio: [9,71, 19,1]},
        {id: 24, type: '单选', ratio: [31, 48,21]},
        {id: 25, type: '单选', ratio: [23,51 ,26]},
        {id: 26, type: 'none', ratio: [9,71, 19,1]}
    ]


    // 问卷答题逻辑
    for (let i = 0; i < clickList.length ; i++) {
        let type = answerList[i].type
        let num = 0
        switch (type) {

            case '单选': {
                clickList[i].children[single(answerList[i].ratio)].click()
                break
            }

            case '多选': {
                 for (let j = 0; j < 3; j++) {
                    clickList[i].children[multi(answerList[i].ratio)].click()
                    num++
                 }
            }

            case '下拉': {
                clickList[i].children[0].children[0].value = String(1 + single(answerList[i].ratio))
                break
            }

            case '量表': {
                clickList[i].children[0].children[1].children[single(answerList[i].ratio)].click()
                break
            }

            case '矩阵量表': {
                for (let j = 0; j < answerList[i].ratio.length; j++) {
                    clickList[i].children[0].children[1].children[(j+1)*2].children[1 + single(answerList[i].ratio[j])].click()
                }
                break
            }

            case '填空': {
                clickList[i].children[0].value = answerList[i].content[single(answerList[i].ratio)]
                break
            }
            case 'none':{
                break
            }


            default: {
                break
            }


        }
    }







    // --------------------------------问题逻辑-------------------------------------

    // 单选题逻辑
    function single(ratio) {
        // 生成一个随机数
        console.log(ratio)
        let randomNum = getRandom()
        // 遍历概率分布数组，找到符合随机数的选项索引
        return isInRange(ratio,randomNum)
      }

    // 多选题逻辑
    function multi(ratio) {
        // 生成一个随机数
        let randomNum = getRandom()
        // 遍历概率分布数组，找到符合随机数的选项索引
        return isInRange(ratio,randomNum)
    }


    // --------------------------------提交逻辑-------------------------------------
    // 提交并滑动验证
    setTimeout(() => {
        console.log('navigator:', window.navigator)
        document.getElementById('ctlNext').click()
        setTimeout(() => {
            document.getElementById('SM_BTN_1').click()
            setTimeout(() => {
                slidingSlider();
            }, 3000)
        }, 1000)
    }, 1000)

    function slidingSlider() {
        const slider = document.querySelector("#nc_1_n1z");
        const startX = slider.getBoundingClientRect().left + window.pageXOffset;
        const startY = slider.getBoundingClientRect().top + window.pageYOffset;
        const endX = startX + 270;
        const endY = startY;
        const options = {bubbles: true, cancelable: true};
        slider.dispatchEvent(new MouseEvent('mousedown', options));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: startX, clientY: startY})));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: endX, clientY: endY})));
        slider.dispatchEvent(new MouseEvent('mouseup', options));
        setTimeout(()=>{
            // 出现哎呀出错啦，点击刷新再来一次错误 需要重新点击
           var nc_1_refresh1_reject = document.getElementById('nc_1_refresh1')
           if(nc_1_refresh1_reject!=='undefined' || nc_1_refresh1_reject!==null){
               nc_1_refresh1_reject.click()
               setTimeout(()=>{
                    slidingSlider()
               },1000)
           }
           },1000)
    }



    // --------------------------------辅助函数-------------------------------------

    // 生成一个1-100之内的随机数
    function getRandom() {
        return Math.floor(Math.random() * 100) + 1
    }

    // 判断是否在概率区间内
    function isInRange(ratio,randomNum) {
        console.log("孩子你无敌了")
        console.log("ratio:", ratio)
        let sum = 0
        for (let i = 0; i < ratio.length; i++) {
          sum += ratio[i]
          if (randomNum < sum) {
            return i
          }
        }
    }

    // 把所有的cookie都变过期
    function clearCookies() {
        document.cookie.split(';').forEach(cookie => {
            const [name, ...parts] = cookie.split(/=(.*)/);
            const value = parts.join('=');
            const decodedName = decodeURIComponent(name.trim());
            const decodedValue = decodeURIComponent(value.trim());
            document.cookie = `${decodedName}=${decodedValue}; expires=Thu, 01 Jan 1949 00:00:00 UTC;`;
        });
    }


})();
