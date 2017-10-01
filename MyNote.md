## Javascript 基本语法小note

### **比较运算符**

相等运算符==。JavaScript在设计时，有两种比较运算符：

第一种是==比较，它会自动转换数据类型再比较，很多时候，会得到非常诡异的结果；

第二种是===比较，它不会自动转换数据类型，如果数据类型不一致，返回false，如果一致，再比较。

    由于JavaScript这个设计缺陷，不要使用==比较，始终坚持使用===比较。

唯一能判断NaN的方法是通过 `isNaN()` 函数：

``` Javascript
isNaN(NaN); // true
```

### **数组**

数组是一组按顺序排列的集合，集合的每个值称为元素。JavaScript的数组可以包括任意数据类型。例如：
``` Javascript
[1, 2, 3.14, 'Hello', null, true];
```

### **对象**

JavaScript的对象是一组由键-值组成的无序集合，

JavaScript对象的键都是字符串类型，值可以是任意数据类型

例如：
```Javascript
var person = {
    name: 'Bob',
    age: 20,
    tags: ['js', 'web', 'mobile'],
    city: 'Beijing',
    hasCar: true,
    zipcode: null
};
```

### **变量**

不用`var`来定义的，会自动被识别成全局变量，从而可能导致出错，使用`strict`模式来屏蔽

### **关于Array Map Set**

#### 遍历：
``` Javascript
for (var x of a) { // 遍历Array
    alert(x);
}
for (var x of s) { // 遍历Set
    alert(x);
}
for (var x of m) { // 遍历Map
    alert(x[0] + '=' + x[1]);
}
```

#### `for in` 与 `for of`:
`for ... in`循环，它遍历的实际上是对象的属性名称。一个Array数组实际上也是一个对象，它的每个元素的索引被视为一个属性。

当我们手动给Array对象添加了额外的属性后，`for ... in`循环会遍历到额外属性：
```Javascript
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    alert(x); // '0', '1', '2', 'name'
}
```
`for ... in`循环将把`name`包括在内，但`Array`的`length`属性却不包括在内。

`for ... of`循环则完全修复了这些问题，它只循环集合本身的元素：
``` Javascript
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x of a) {
    alert(x); // 'A', 'B', 'C'
}
```

### **方法，apply 与 call**
定义方法：
``` JavaScript
// 匿名函数
getAge : function() {...}
// 或者
function getAge() {...} 
```
apply 与 call ：
用来给方法内的this指定对象，如
``` JavaScript
'use strict';
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}
var xiaoming = {
    name: '小明,
    birth: 1990,
    age: getAge
};
xiaoming.age(); //返回27，调用的时候指定了this
getAge.apply(xiaoming, []); //设定方法需要的对象
```
`apply` 与 `call` 的区别：

`apply`把参数打包成`Array`再传入，而`call`把参数直接按顺序传入，例如
```Javascript
Math.max.apply(null, [3, 4, 5]);
Math.max.call(null, 3, 4, 5);
```
对于普通函数调用，通常把第一个参数`this`绑定为`null`

## **MapReduce**
参考：
[ MapReduce: Simplified Data Processing on Large Clusters ](http://research.google.com/archive/mapreduce.html)

### `Map()`

`map()`方法定义在JavaScript的`Array`中, 调用方法如下：
```Javascript
function pow(x) {
    return x * x;
}

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
```
`map()`不会改变原来的数组，只是提供一个新的intermediate key-value

对于一些非数组类的对象，也可以通过之前学过的`apply`或者`call`方法调用`map()`：
```Javascript
var arr = Array.prototype.map.call(s, function(x) {
        return x - '0';
    });
```

### `Reduce()`
Array的reduce()把一个函数作用在这个Array上，
这个函数必须接收两个参数，第一个参数为迭代结果，第二个参数为下一个元素
reduce()把结果继续和序列的下一个元素做累积计算，其效果就是：

`[x1, x2, x3, x4].reduce(f) = f(f(f(x1, x2), x3), x4)`

比方说对一个Array求和，就可以用reduce实现：
```Javascript
var arr = [1, 3, 5, 7, 9];
arr.reduce(function (x, y) {
    return x + y;
}); // 25
```
又比如，要把[1, 3, 5, 7, 9]变换成整数13579，reduce()也能派上用场：
```JavaScript
var arr = [1, 3, 5, 7, 9];
arr.reduce(function (x, y) {
    return x * 10 + y;  //前一个参数x为迭代结果，后一个参数y代表下一个元素
}); // 13579
```

### `filter()`

`filter()`用于把`Array`的回调函数返回false的元素过滤掉，返回剩下的元素

例如，在一个数组中，删掉偶数，只保留奇数，可以这么写：
```Javascript
var arr = [1, 2, 4, 5, 6, 9, 10, 15];
var r = arr.filter(function (x) {
    return x % 2 !== 0;
});
r; // [1, 5, 9, 15]
```
注意到, `filter()`接收的回调函数，其实可以有多个参数。通常我们仅使用第一个参数，表示`Array`的某个元素。
回调函数还可以接收另外两个参数，表示元素的位置和数组本身：
```Javascript
var arr = ['A', 'B', 'C'];
var r = arr.filter(function (element, index, self) {
    console.log(element); // 依次打印'A', 'B', 'C'
    console.log(index); // 依次打印0, 1, 2
    console.log(self); // self就是变量arr
    return true;
});
```
于是可以这样利用`filter`，巧妙地去除`Array`的重复元素：
```Javascript
'use strict';
var arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry'];
r = arr.filter(function (element, index, self) {
    // 当元素第二次出现的时候（即重复），self.indexOf(element)为第一次出现的位置，不等于index
    return self.indexOf(element) === index;
});
```
### `sort()`
因为默认的回调函数是转化成字符串比较，直接调用可能会出现诡异的结果，因此根据需要对回调函数进行改写，相当于java里面的`comparator`
```JavaScript
var arr = [10, 20, 1, 2];
arr.sort(function (x, y) {
    if (x < y) {
        return -1;  //顺序，倒序返回1
    }
    if (x > y) {
        return 1;   //顺序，倒序返回-1
    }
    return 0;   //相等
}); // [1, 2, 10, 20]
```
    注意：排序会改变原有的数组！如果要备份的话要注意对象赋值是传引用的！

## **闭包**
有时候，以求和为例，如果不需要立刻求和，而是在后面的代码中，根据需要再计算怎么办？
可以不返回求和的结果，而是返回求和的函数！

我们在函数lazy_sum中又定义了函数sum，
并且，内部函数sum可以引用外部函数lazy_sum的参数和局部变量，
当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力。

```Javascript
function lazy_sum(arr) {
    var sum = function () {
        return arr.reduce(function (x, y) {
            return x + y;
        });
    }
    return sum;
}
```
当我们调用lazy_sum()时，返回的并不是求和结果，而是求和函数：

`var f = lazy_sum([1, 2, 3, 4, 5]); // function sum()`
调用函数f时，才真正计算求和的结果：

`f(); // 15`

再注意一点，当我们调用`lazy_sum()`时，每次调用都会返回一个新的函数，即使传入相同的参数：
```Javascript
var f1 = lazy_sum([1, 2, 3, 4, 5]);
var f2 = lazy_sum([1, 2, 3, 4, 5]);
f1 === f2; // false
```
另外，返回的函数并没有立刻执行，而是直到调用了f()才执行，比如：
```Javascript
function count() {
    var arr = [];
    for (var i=1; i<=3; i++) {
        arr.push(function () {
            return i * i;
        });
    }
    return arr;
}
// 每次循环产生一组函数，存在数组中了。但此时还不会调用函数体里面的运算
var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];
// 当调用数组中的每个函数时，才会执行运算。但此时已经循环完了，所有的i都为4
f1(); // 16
f2(); // 16
f3(); // 16
```
因此返回闭包时牢记的一点就是：返回函数不要引用任何循环变量，或者后续会发生变化的变量。

如果一定要引用循环变量，可以把循环变量设定为常量：
```Javascript
    for (let i=1; i<=3; i++) {
        arr.push(function () {
            return i * i;
        });
    }
```

或者是再创建一个函数，用该函数的参数绑定循环变量当前的值，
无论该循环变量后续如何更改，已绑定到函数参数的值不变：
```JavaScript
function count() {
    var arr = [];
    for (var i=1; i<=3; i++) {
        arr.push((function (n) {
            // 如果不加入这一层函数，则相当于给数组push了立即执行匿名函数的结果
            // 返回的就不再是一个等待执行的函数，失去了闭包的意义
            return function () { // 这里的函数也不能写个参数n，否则n就是外部传入参数，而非我们期望的循环变量了
                return n * n;
            }
        })(i)); //这里(i)表示匿名函数立即执行
    }
    return arr;
}
```
注意这里用了一个“创建一个匿名函数并立刻执行”的语法, 一定要记得前后的括号！！！
```JavaScript
(function (x) {
    return x * x;
})(3); // 9
```

## **Lambda函数**
Lambda函数可以看作是匿名函数的一种简写，但实际上，Lambda函数和匿名函数有个明显的区别：
Lambda函数内部的this是词法作用域，由上下文确定。
回顾前面的例子，由于JavaScript函数对`this`绑定的错误处理，下面的例子无法得到预期结果：
```JavaScript
var obj = {
    birth: 1990,
    getAge: function () {
        var b = this.birth; // 1990
        var fn = function () {
            return new Date().getFullYear() - this.birth; // this指向window或undefined
        };
        return fn();
    }
};
```
现在，Lambda函数完全修复了`this`的指向，`this`总是指向词法作用域，也就是外层调用者`obj`

同样的，`call`与`apply`用法也有所不同。由于`this`已经按照词法作用域绑定了，
用`call()`或者`apply()`调用时，无法对`this`进行绑定，即传入的第一个参数被忽略：
```JavaScript
var obj = {
    birth: 1990,
    getAge: function () {
        var b = this.birth; // 1990
        // 这里定义一个Lambda函数
        var fn = (y) => y - this.birth; // this指向obj对象
        // 这里第一个参数放null就行了，即使放入一个对象，Lambda函数内部的this也还是根据上下文而非外部传入了
        return fn(new Date().getFullYear());
    }
};
obj.getAge();
```

## Generator
通过`function*`来定义，除了`return`以外，还可以通过`yield`来返回。

要获取下一个元素，使用`next()`来得到，或者利用`for ... of`:
```JavaScript
'use strict';
function* next_id(y) {

    var x = 1;
    while (x <= y) {
        yield(x++);
    };
    return x;

}
var f = next_id(5);
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: 4, done: false}
f.next(); // {value: 5, done: true}

for (var x of next_id(5)) {
    console.log(x); // 依次输出1, 2, 3, 4, 5
}
```