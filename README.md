# -浏览器下载油猴插件（tampermonkey），把代码贴进去，刷新问卷网页
在此处修改为问卷网址![image](https://github.com/user-attachments/assets/3bac5b0b-b61a-465d-8024-32c1053aa0a4)            
快速版卡住换慢速版，慢速版长时间不在前台会被限制速度，过半小时点一下网站空白处就行


其他题型，如下设置：
// 定义回答列表
    let answerList = [  
        {id: 1, type: '单选', ratio: [10, 20, 20, 30, 20]},
        {id: 2, type: '多选', ratio: [10, 30, 60]},
        {id: 3, type: '量表', ratio: [20, 20, 20, 20, 20]},
        {id: 4, type: '矩阵量表', ratio: [[20, 20, 20, 20, 20], [10, 20, 40, 20, 10]]},
        {id: 5, type: '下拉', ratio: [50, 50]},  
        {id: 6, type: '填空', ratio: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
