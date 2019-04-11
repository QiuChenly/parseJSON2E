//作者
var author = "QiuChenly";
//代码发布日期
var build_date = "2019年1月25日";
//优化算法版本
var codeVersion = "1.3";
//算法版本特性
var newFeature = "1.3 2019年4月12日" +
    "[修复] 某些特殊JSON中key中包含斜线加减乘除等特殊字符的全部修改为'_'." +
    "[修复] 某些特殊JSON中存在空对象'{}'导致自动创建无成员数据类型的问题." +
    "[修复] 某些特殊JSON中存在对象实际引用地址不正确的问题." +
    "[改进] 代码格式tab缩进问题的修正." +
    "[改进] 算法优化." +


    "1.2 2019年1月25日" +
    "[新增] 支持一键生成JSON方法读取函数." +
    "";

var BaseSpace = "    ";
var BaseInfoW = ".版本 2\n";
var BaseAdditionSymbols = "与";
var newClass = [];
var BaseFunctionHead =
    '.版本 2\n' +
    '\n' +
    '.子程序 {FunctionName}, {ClassName}, 公开, //本方法使用秋城落叶一键JSON2E工具[' + codeVersion + ']版算法自动生成.\n' +
    '.参数 QueryText, 文本型\n' +
    '.局部变量 json, 类_JSON_, , , //类_JSON_ 使用该模块进行JSON解析\n';
var codeSection =
    "json.解析文本 (QueryText, , )\n";
var end = "返回 (ret)";
var iteratorCount = 0;

/**
 * 处理json 自动生成为易语言数据类型信息
 * @param str json
 * @param defaultName 默认的顶级易语言数据类型名称
 * @return 返回完整的 json2e 数据类型描述信息
 */
function parseJSON(str, defaultName) {
    newClass.push(getAll(str, defaultName));
    for (var a = newClass.length; a--; a > 0) {
        BaseInfoW += newClass[a];
    }
    return BaseInfoW;
}

/**
 * 新建一个易源码中的局部变量
 * @param name 变量名称
 * @param type 变量类型
 * @param commit 备注
 */
function addRegionVariable(name, type, commit) {
    var variable = '.局部变量 ' + name + ', ' + type + ', , , ' + commit + '\n';
    if (BaseFunctionHead.indexOf(variable) === -1)
        BaseFunctionHead += variable;
}

/**
 * 处理json 自动生成为易语言读取JSON方法
 * @param str json
 * @param functionName 默认的易语言方法名称
 * @param className 默认的顶级易语言数据类型名称
 * @param defaultChar 无需理会本参数
 * @return 返回完整的 json2e 方法描述信息
 */
function parseJSON2Function(str, functionName, className, defaultChar) {
    BaseFunctionHead = BaseFunctionHead
        .replace("{FunctionName}", functionName)
        .replace("{ClassName}", className);
    addRegionVariable('ret', className, "//本值用于返回该对象 ---- 自动生成");
    getClassReadCode(str, "ret", false, defaultChar);
    return BaseFunctionHead + codeSection + end;
}

/**
 * 加入tab制表符(4个标准空格)
 */
function addTabs() {
    //开始处理tab
    var count = iteratorCount;
    if (count < 0)
        count = 0;
    for (var i = 0; i < count; i++) {
        codeSection += BaseSpace;
    }
}

/**
 * 转换为易语言方法主程序段,递归算法
 * @param str json源文件
 * @param objName 默认的易语言参数名称
 * @param isLoop 是否是计次循环内
 * @param jsonRealLinkName 实际的JSON文件绝对路径,用于修复fixSignal函数造成的函数名错误问题
 */
function getClassReadCode(str, objName, isLoop, jsonRealLinkName) {
    var variable = "a";
    for (var sec1 in str) {
        //if (sec1 === "wemedia")//调试锚点 Release去掉
        //    console.log("");
        if (str.hasOwnProperty(sec1)) {
            var valueType = getObjTypeName(str[sec1]);
            //console.log(sec1);
            //addTabs();
            var newClsName = objName + (iteratorCount > 0 ? "[" + variable + "]" : '') + "." + fixSignal(sec1);
            /*
             var jsonClsName = newClsName.substring(4, newClsName.length);
            */
            if (jsonRealLinkName.indexOf('[' + variable + ']') !== -1) {
                var tempArr = jsonRealLinkName.split("[" + variable + "]");
                jsonRealLinkName = "";
                for (var i = 0; i < tempArr.length; i++) {
                    jsonRealLinkName += tempArr[i] + (i === tempArr.length - 1 ? '' : '[" ＋ 到文本 (' + variable + ' － 1) ＋ "]');
                }
            }
            if (isObj(valueType)) {
                getClassReadCode(str[sec1], newClsName, false, jsonRealLinkName + sec1 + ".");
            } else if (isObjArr(valueType)) {
                for (var i = 0; i < iteratorCount; i++) {
                    variable += "1";
                }
                addRegionVariable(variable, '整数型', '//临时循环计数变量 ---- 自动生成');
                var isBaseTypeArr = checkAllType(str[sec1]);
                //如果是动态数组,则此处需要进行处理
                codeSection += '重定义数组 (' + newClsName + ', 假, json.取子项目数 (\"' + jsonRealLinkName + sec1 + '\", , ))\n';
                addTabs();
                codeSection += ".计次循环首 (json.取子项目数(\"" + jsonRealLinkName + sec1 + "\", ,), " + variable + ")\n";
                iteratorCount += 1;
                if (isBaseTypeArr) {
                    addTabs();
                    addNew(null, true, newClsName, jsonRealLinkName + sec1 + '[" ＋ 到文本 (' + variable + ' － 1) ＋ "]', variable, valueType);
                } else {
                    //todo 此处固定为0  有优化问题
                    getClassReadCode(str[sec1][0], newClsName, true, jsonRealLinkName + sec1 + '[' + variable + ']');
                }
                iteratorCount -= 1;
                if (variable.length > 1) {
                    variable = variable.substring(0, variable.length - 1);
                }
                if (iteratorCount < 0) iteratorCount = 0;
                addTabs();
                codeSection += ".计次循环尾 ()\n";
            } else {
                addTabs();
                addNew(sec1, isLoop, objName, jsonRealLinkName + sec1, variable, valueType);
            }
        }
    }
}

/**
 * 加入一行新的取项目值代码
 * @param obj 对象名称
 * @param isLoop 是否为计次循环首中的代码
 * @param objName 对象子名称
 * @param jsonObjName json中实际的对象访问地址
 * @param variable 计次变量名称
 * @param valueType json中预读取的值的类型
 */
function addNew(obj, isLoop, objName, jsonObjName, variable, valueType) {
    var code = "";
    if (isLoop) {
        ((obj == null) ? obj = '' : obj = '.' + obj);
        code = objName + '[' + variable + ']' + obj + ' ＝ json.取项目值 ("' + jsonObjName + '", , , , )';
    } else
        code = objName + '.' + obj + ' ＝ json.取项目值 ("' + jsonObjName + '", , , , )';
    codeSection += convertOtherType(valueType, code);
}

/**
 * 将代码表达式转换为标准易语言代码类型
 * @param key 对象值类型
 * @param expression 易语言源码表达式
 */
function convertOtherType(key, expression) {
    var newText = "";
    var arr = expression.split(" ＝ ");
    switch (getE_TypeName(key)) {
        case '文本型':
            newText = expression;
            break;
        case '整数型':
            newText = arr[0] + ' = 到整数(' + arr[1] + ')';
            break;
        case '逻辑型':
            newText = arr[0] + ' = 选择(' + arr[1] + ' = "true", 真, 假)';
            break;
    }
    return newText + "\n";
}

/**
 * 检查对象是否为空对象
 * @param obj 对象体
 * @returns {boolean} 返回true表示为空
 */
function isNullObj(obj) {
    var i = 0;
    for (var element in obj) {
        i++;
        if (i > 0) return false
    }
    return true
}

/**
 * 将特殊符号修复为'_'以支持易语言IDE
 * @param element 字符串对象
 * @returns {void | string} 返回修正过的字符串
 */
function fixSignal(element) {
    return element.replace(/[\\\/+]/g, function (e) {
        var t = {
            "\\": "-",
            "/": "_",
            "+": "_"
        };
        return t[e]
    })
}

/**
 * 生成单独的完整数据类型
 * @param tests 测试的完整 json 对象
 * @param className 默认生成的易语言顶级数据类型名称
 * @return 返回一个完整的数据类型数据
 */
function getAll(tests, className) {
    className = fixSignal(className);
    var BaseInfo = '.数据类型 ' + className + ', 公开, 以下对象内自动设置的基本类型值不为标准值,仅作参考,请自行判断取用\n';
    for (var theObjName in tests) {
        if (tests.hasOwnProperty(theObjName)) {
            var valueType = getObjTypeName(tests[theObjName]);
            //console.log(a + "|" + valueType);
            var newClsName = className + BaseAdditionSymbols + theObjName;
            if (isObj(valueType)) {
                //单独对象的处理
                if (isNullObj(tests[theObjName])) { //此处处理异常空对象意外
                    //其他基本类型处理
                    BaseInfo += getChild(theObjName, getE_TypeName(valueType), false, -1, "注意:该字段在JSON中为空对象,无法自动解析,已作文本型处理");
                } else { //不是空对象继续处理
                    BaseInfo += getChild(theObjName, newClsName);
                    newClass.push(getAll(tests[theObjName], newClsName))
                }
            } else if (isObjArr(valueType)) {
                //对象数组的递归处理
                //有时候数组会为[]这种形式，此时无法确定具体的类型,默认设为基本数据类型 文本型 数组
                var isBaseTypeArr = checkAllType(tests[theObjName]);
                var arrSize = tests[theObjName].length;
                if (isBaseTypeArr) {
                    newClsName = getE_TypeName(getObjTypeName(tests[theObjName][0]));
                } else {
                    newClass.push(getAll(tests[theObjName][0], newClsName))
                }
                BaseInfo += getChild(theObjName, newClsName, true, arrSize, ((arrSize <= 0) ? " 注意,此为空数组,请检查实际类型,自动类型仅供参考" : ""));
            } else {
                //其他基本类型处理
                BaseInfo += getChild(theObjName, getE_TypeName(valueType));
            }
        }
    }
    return BaseInfo;
}

/**
 * 用于修复数组生成bug,有时候 json 对象中数组内只有基本数据类型,所以需要处理一下 fix 一个已知bug
 * @param obj 输入数组
 * @return boolean true or false
 */
function checkAllType(obj) {
    if (obj.length <= 0) return true;
    var hasSame = false;
    var theFirstType = null;
    for (var a in obj) {
        if (theFirstType == null) {
            theFirstType = getObjTypeName(obj[a]);
            if (isObj(theFirstType)) break;
        } else {
            hasSame = theFirstType === getObjTypeName(obj[a]);
            if (hasSame) break
        }
    }
    return hasSame;
}

/**
 * 转换为易语言中的类型名称
 * @param tp JavaScript对象实际类型,请使用 @getObjTypeName 来获取实际类型。注意 若输入为空则使用默认文本型。
 * @returns {string} 返回易语言中实际类型
 */
function getE_TypeName(tp) {
    var str = "";
    //console.log(tp);
    switch (tp) {
        case "[object String]":
        case "[object Null]":
            str = "文本型";
            break;
        case "[object Number]":
            str = "整数型";
            break;
        case "[object Boolean]":
            str = "逻辑型";
            break;
        default:
            str = "文本型";
            break;
    }
    return str;
}

/**
 * 检查是否为json对象而非基本数据类型
 * @param obj 输入的对象名称，请使用 @getObjTypeName 方法获取对象的类型
 * @returns {boolean}
 */
function isObj(obj) {
    return obj === "[object Object]";
}

/**
 * 检查是否为json数组对象
 * @param obj 输入的对象名称，请使用 @getObjTypeName 方法获取对象的类型
 * @returns {boolean}
 */
function isObjArr(obj) {
    return obj === "[object Array]";
}

/**
 * 获得对象的实际类型，如 ["123":"123"] 则返回[object Array]，若为 “123” 则返回 [object String]
 * @param obj 输入的对象名称，请使用 @getObjTypeName 方法获取对象的类型
 * @returns {string} 返回
 */
function getObjTypeName(obj) {
    return Object.prototype.toString.call(obj);
}

/**
 * 插入一个易语言成员字段
 * @param name 成员名称
 * @param type 成员数据类型,请使用@getE_TypeName 方法获取易语言实际数据类型,或者可以直接输入已生成的自定义数据类型名称.
 * @param isArr 该成员是否为数组
 * @param arrSize 数组大小.如果是 0 则自动变为1.
 * @param moreInfo 该成员的附加备注信息
 * @returns {string} 返回组装好的字段
 */
function getChild(name, type, isArr, arrSize, moreInfo) {
    //修复不允许输入的特殊字符导致的编译错误问题
    name = fixSignal(name);
    type = fixSignal(type);
    if (moreInfo === undefined) moreInfo = "";
    if (arrSize === 0) arrSize = 1;
    var arr = "";
    if (isArr) arr = ', "' + arrSize + '"';
    return BaseSpace + ".成员 " + name + ", " + type + ", " + arr + ", " + (isArr ? '该对象为 数组对象 ' : ', 该对象为 基本对象 ') + moreInfo + "\n"
}