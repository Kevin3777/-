// ==UserScript==
// @name         问卷星（慢速版）
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

(function() {
    'use strict';

    // 初始化
    window.localStorage.clear();
    window.sessionStorage.clear();
    clearCookies();

    const url = 'https://www.wjx.cn/vm/YDfQzYX.aspx';

    // 自动重定向
    if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1) {
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });

    // 检测页面是否未响应的定时器
    let refreshTimeout = setTimeout(() => {
        window.location.reload(); // 刷新页面
    }, 30000); // 30秒

    // 重置定时器的函数
    function resetTimeout() {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
            window.location.reload();
        }, 10000);
    }

    // 获取题目元素列表
    let questionList = document.getElementsByClassName('field ui-field-contain');
    let clickList = [];
    for (let i = 0; i < questionList.length; i++) {
        clickList.push(questionList[i].children[1]);
    }

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
    ];

    // 问卷答题逻辑
    function processQuestions(index) {
        resetTimeout(); // 每次处理新问题时重置定时器
        if (index >= clickList.length) {
            submitForm(); // 全部问题处理完成后提交表单
            return;
        }

        let id = answerList[index].id;

        // 检查是否要跳过该题目
        if (id === 13 || id === 23 || id === 26) {
            // 继续下一个问题
            processQuestions(index + 1);
        } else {
            let type = answerList[index].type;
            handleQuestion(type, index)
                .then(() => {
                    // 确认问题已处理后继续处理下一个问题
                    setTimeout(() => processQuestions(index + 1), 100);
                })
                .catch(error => {
                    console.error(`处理问题时出错: ${error}`);
                    setTimeout(() => processQuestions(index), 1000); // 处理失败时重试
                });
        }
    }

    function handleQuestion(type, index) {
        return new Promise((resolve, reject) => {
            try {
                switch (type) {
                    case '单选': {
                        clickList[index].children[single(answerList[index].ratio)].click();
                        break;
                    }
                    case '多选': {
                        for (let j = 0; j < 3; j++) {
                            clickList[index].children[multi(answerList[index].ratio)].click();
                        }
                        break;
                    }
                    case '下拉': {
                        clickList[index].children[0].children[0].value = String(1 + single(answerList[index].ratio));
                        break;
                    }
                    case '量表': {
                        clickList[index].children[0].children[1].children[single(answerList[index].ratio)].click();
                        break;
                    }
                    case '矩阵量表': {
                        for (let j = 0; j < answerList[index].ratio.length; j++) {
                            clickList[index].children[0].children[1].children[(j + 1) * 2].children[1 + single(answerList[index].ratio[j])].click();
                        }
                        break;
                    }
                    case '填空': {
                        clickList[index].children[0].value = answerList[index].content[single(answerList[index].ratio)];
                        break;
                    }
                    default: {
                        break;
                    }
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    // 开始处理问题
    processQuestions(0);

    // 提交并滑动验证
    function submitForm() {
        setTimeout(() => {
            document.getElementById('ctlNext').click();
            setTimeout(() => {
                document.getElementById('SM_BTN_1').click();
                setTimeout(() => {
                    slidingSlider();
                }, 3000);
            }, 1000);
        }, 1000);
    }

    function slidingSlider() {
        const slider = document.querySelector("#nc_1_n1z");
        if (!slider) {
            submitForm(); // 如果找不到滑块，重试提交
            return;
        }

        const startX = slider.getBoundingClientRect().left + window.pageXOffset;
        const startY = slider.getBoundingClientRect().top + window.pageYOffset;
        const endX = startX + 270;
        const endY = startY;
        const options = {bubbles: true, cancelable: true};
        slider.dispatchEvent(new MouseEvent('mousedown', options));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: startX, clientY: startY})));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: endX, clientY: endY})));
        slider.dispatchEvent(new MouseEvent('mouseup', options));

        setTimeout(() => {
            let refreshButton = document.getElementById('nc_1_refresh1');
            if (refreshButton) {
                refreshButton.click();
                setTimeout(() => {
                    slidingSlider();
                }, 1000);
            } else {
                submitForm(); // 成功滑动后尝试再次提交
            }
        }, 1000);
    }

    // 辅助函数
    function getRandom() {
        return Math.floor(Math.random() * 100) + 1;
    }

    function isInRange(ratio) {
        let random = getRandom();
        let total = 0;
        for (let i = 0; i < ratio.length; i++) {
            total += ratio[i];
            if (random <= total) {
                return i;
            }
        }
        return ratio.length - 1;
    }

    function single(ratio) {
        return isInRange(ratio);
    }

    function multi(ratio) {
        return isInRange(ratio);
    }

    function clearCookies() {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf('=');
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }

})();
