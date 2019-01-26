# parseJSON2E
这是一个将JSON数据类型一键转换为易语言自定义数据类型的算法实现<br>
喜欢的给个star吧!欢迎贡献你的创意code!<br>

# 已完成进度:

1.转换JSON为易语言数据类型

2.生成一键读取JSON数据方法(一次编译通过!)

# 特性:
1. 支持json内对象嵌套数组嵌套对象再嵌套数组,自动递归生成嵌套计次循环代码:<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/dualIterator.png)
2. 自动计算动态更改计次循环 'i' 的变量名称.![](https://github.com/QiuChenly/parseJSON2E/blob/master/react.png)
3. 配合配对的生成JSON数据类型方法可以实现懒人式数据读写<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/onekey1.png)<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/onekey2.png)

# 使用方法
#### 
1. 复制JS代码.<br>
   文件:![](https://github.com/QiuChenly/parseJSON2E/blob/master/Eval.js.png)
2. 粘贴到易语言常量.<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/QQ20190126-122727.png)
3. 编写类似如下JS方法.<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/ide_code.png)
4. 易语言中设置执行对应的js方法即可.<br>![](https://github.com/QiuChenly/parseJSON2E/blob/master/idea_code.png)
````
   方法调用说明(<>符号作为本文强调,调用时请删除<>符号.):
   //生成易语言读取JSON的方法
   parseJSON2Function(<你的JSON数据原文本>, '<生成的易语言方法名称>', '<要返回的易语言数据类型名>')
   
   //生成易语言数据类型
   parseJSON(<你的JSON数据原文本>, '<要生成的易语言数据类型名>')
````
# 功能预览
## 自动生成的易语言数据信息
#### 图 1-1 
![](https://github.com/QiuChenly/parseJSON2E/blob/master/WX20190126-010005.png)

## 自动生成的易语言方法
#### 图 1-2 
![](https://github.com/QiuChenly/parseJSON2E/blob/master/WX20190126-010221.png)

## 自动生成的易语言自定义数据类型 1
#### 图 1-3 
![](https://github.com/QiuChenly/parseJSON2E/blob/master/WX20190126-010247.png)

## 自动生成的易语言自定义数据类型与工具解析出来的信息对比
#### 图 1-4 
![](https://github.com/QiuChenly/parseJSON2E/blob/master/WX20190126-010330.png)