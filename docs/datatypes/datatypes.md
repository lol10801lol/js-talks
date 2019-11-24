# JS - Типы данных

## Основы
Всего - 7 типов данных

( ---примитивы--- )
* number
* string
* boolean
* null
* undefined
* Symbol (ES6)

( --- составной ---)
* object

> Стоит упомянуть `BigInt`([link](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/BigInt))  - до сих пор не в спецификации ECMAScript, но уже в Stage 3 (предпоследняя) и поддерживается в Chrome, Mozilla, Opera, Node.js > 10.4.0


Тип переменной можно определить с помощью оператора typeof

```javascript
typeof 148 === "number"
typeof "148" === "string"
typeof true === "boolean"
typeof undefined === "undefined"
typeof { hello: "world" } === "object"

// BUT
typeof null === "object" // lol, because it's JS

// Build-in "Natives"
typeof [1, 2, 3] === "object"
typeof new Number() === "object"
typeof new Date() === "object" 
typeof /.*/ === "object"

// BUT
typeof function() {console.log('hi!')} === "function" // lol, why not
```

`typeof` можно применять к **необъявленным** переменным:
```javascript

console.log(typeof undefinedVal); // undefined
console.log(undefinedVal); // ReferenceError: undefinedVal is not defined
```

Любимое число - `NaN` - Not a Number

```javascript
var b = parseInt('sdf');
console.log(b); // NaN
console.log(typeof b); // number
```

Так что это скорее не "не число", а "значение, при приведении которого к number возникла ошибка"

Чуть менее любимое число - `Infinity` и `-Infinity`

```javascript
var c = Number.MAX_VALUE;
c += c;
console.log(c); // Infinity
console.log(c / Infinity); // 0
```

Зато никакого overflow

Да еще и один полезный юзкейс - при поиске максимума/минимума

```javascript

var arr = [5, 15, 23, 0, -1];

let max = -Infinity;

for (let i = 0; i < arr.length; i++) {
  if (arr[i] > max) {
    max = arr[i];
  }
}
console.log(max);
```

И еще одно "зато" - можно делить на 0 без ошибок!

```javascript
console.log(5 / 0); // Infinity
console.log(-5 / 0); // -Infinity
```

## Object

> An Object is logically a collection of properties.

Включая функции, и все built-in нейтивы String, Number, Boolean, Date, RegExp, Error etc

### Object usage

С объектом, как и с любой другой переменной можно делать разные вещи - обращаться
к её значению, менять значение/ссылку, передавать как аргумент в функции и т.п.

**Обращение к свойствам объекта** может быть выполнено двумя способами:

```javascript

var obj = {
  a: 5,
}

console.log(obj.a);

console.log(obj["a"]);

var variable = "a";
console.log(obj[variable]);


obj.b = function() { console.log ("Hello") }
obj["b"] = function() { console.log ("Hello") }

variable = "b";
obj[variable] = function() { console.log ("Hello") }

```

**Обычно** используется первый способ, второй удобен когда:

1. Имя свойства содержит символы типа `-`, `+` и т.д.
2. Имя свойства сохранено в переменной


```javascript

var obj = {}
obj["content-length"] = 5;

var variable = "content-length";
console.log(obj[variable]);

```

### Boxing

```javascript
typeof 'str' // "string" primitive string! not an object!
typeof new String('str'); // "object" !
'str'.toUpperCase(); // "STR". // Automatically boxed to String and `toUpperCase()` method called
new String('str').toUpperCase() // "STR"

new Boolean(false);

new Number(55);
new Number("55");

// no need to use explicit boxing usually, it can even hurt you
var someBool = new Boolean(false);
if (someBool) {
    console.log("someBool is true"); // gotcha. someBool is an object and object is always truthy
} else {
    console.log("someBool is false");
}

// prints: "someBool is true"
```
Вывод: почти никогда нет смысла явно врапать в объект, ЖС сам скастит, если надо, например, вызвать метод прототипа

В то же время есть смысл использовать конструкторы Нейтивов для `Error` и `Date`, т.к. по-другому вы не создадите такой объект: 
```javascript
// Makes sense to use Native cuonstructors for Error and Date:
var err = new Error('error message');
var date = (new Date()).getTime();
```


# Coercion <3

Конвертирование данных из одного типа в другой
Явное и неявное

"Явность" на самом деле зависит от понимания

Очевидно явный каст:
```javascript
var someNum = 42;
// cast
var someStr = String(someNum);
// create instance of String "class" and coercion
var someStrObj = new String(someNum);

typeof someStr; // string
typeof someStrObj; // object

var someNumCaster = Number(someStr);
var someNumParsed = parseInt(someStr);
```

Чуть менее явный:
```javascript
var foo = 42;
var fooAsStr = foo + ""; // second arg is string -> fooAsStr 100% string
var fooAlsoAsStr = fooAsStr.toString(); // also kinda obvious

var barAsNum = +fooAsStr; // unary operator "+" means "cast to number"

console.log(foo + +fooAsStr); // наркомания же какая то, ну

!foo; // false
```

Неявный, т.к. нет никаких операций (хотя тоже достаточно очевидно, что кастится)
```javascript
var a = "hey there";
if (a) console.log(a); // also for (; ; ); do .. while() and while() .. do; and ternary operator

var b = "42";
var c = 42;
b == c; //true. note "==", not "==="


console.log(!a); // false

```

## Truthy and falsy

Неявный каст происходит к булеану внутри булевых контекстов

* if (arg)
* do {} while()
* while() {}
* a ? a : b
* for (let i = 0; i < 10; i++)
* !a
* ||
* &&

Truthy - значения очевдино конвертятся в таких контекстах в true, 
Falsy - в false

Truthy - всё, что не falsy

Falsy:

<details>
<summary>Очевидные falsy:</summary>

* false
* undefined
* null
* NaN

</details>

<details>
<summary>Неочевидные:</summary>

* ""
* 0

</details>

Почему важно знать
любой if() или другой будевый контекст
или `|| &&` операция конвертит в булеан

При этом при конвертировании, конечно же, не изменяется оригинальное значение, а возвращается новое

```javascript
function foo(input) {
    console.log(input || "defaultValue");
}

// any of "falsy" values will be ignored. If we need empty string or 0, we have a problem
foo("hello world");
foo(5);
foo(0); // oopsie
foo(""); // oopsie
foo(false); // oopsie
```

То же самое с if и чем угодно

Насчет `||` и `&&` важно помнить, что это чудо конвертит в булеан при выборе операнда, но итоговое значение равно
значению операнда:
```javascript
var a = 'some string';
var b = a || 'default';
var c = false || 'default';
var d = a && 'default';
```

`&&` usecase
```javascript

var aObj = {
  nestedObj: {
    foo: function() { console.log("Hello world!") }
  }
}

aObj && aObj.nestedObj && aObj.nestedObj.foo();
```


## "==" vs "==="
На целый урок отдельный наберется.

Основная идея:
"==" приводит типы, в то время как "===" нет

"=="
Сначала меняет тип одного или обоих операндов, а затем сравнивает как "===" 

Под копотом оба алгоритма добиваются сравнения **примитивов** (или возвращают false раньше)

Когда это может быть полезно
```javascript

null == undefined; // true
function asdf(a) {
    if (a == null); // the same as if (a === null || a === unefined)
}


var arr = [{
     id: 4,
     otherProp: "bla", 
     valueOf: function() {return this.id}
     }
];
var iNeedId = 4;

arr.find(obj => obj == iNeedId); // will find id
// from other side... it is almost like arr.find(obj => obj.id === iNeedId);

```
ну... и всё...

Когда это может вас поймать:
```javascript

var a = "42"; // truthy
var b = true; // truthy
var c = false; // falsy

a == b; // false

// ok a == b is false, then a == c is true?
a == c; // false. wtf?


new String('f') == new String('f'); // F

```

"==" оператор **кастит булеан в намбер**, а не наоборот
```javascript
"1" == true;
1 == true;

0 == false;
"0" == false;
```

При сравнении стринги и намбера, "==" оператор **кастит стринг в намбер**

Если один из операндов - объект, к нему применяется `valueOf`, а если `valueOf()` возвращает **не-примитив**, то применяется `toString()`
```javascript
var mySuperObjectOvd = {
    valueOf: function() {
        console.log('valueOf!');
        return this;
    },
    toString: function() {
        console.log('toString!');
        return "somestring"
    }
}

mySuperObjectOvd == "somestring";
//valueOf!
//toString!
//true
```


Два объекта всегда будут не равны друг другу, если это не один и тот же объект (Референс на один и тот же объект) (для `===` действует то же правило)
```javascript
var someObj = {a: 5}; // undefined
someObj == someObj; //true
var someObj2 = {a: 5}; //undefined
someObj == someObj2; //false

var theSameObj = someObj;
someObj == theSameObj; // true
```

# Передача значения по ссылке и по значению

Примитивы передаются по значению, объекты - по ссылке

```javascript

function bar(inputarg) {
  inputarg.morebar = 15;
}

var a = {bar: 10}
bar(a);
console.log(a); // {bar: 10, morebar: 15}
```

`const` при объявлении объекта не иммутит **весь** объект, а лишь ссылку на этот объект (в переменную `a` нельзя будет записать ссылку на другой объект)

Проперти объекта менять по-прежнему можно.
Чтобы совсем заморозить объект, можно использовать
```javascript

function barf(inputarg) {
    inputarg.morebar = 15;
}

const aff = {bar: 10}

Object.freeze(aff);

barf(aff);
console.log(aff); // {bar: 10}

```

# Node global objects 

У ноды есть свои глобальные объекты, типо windows в браузерах и все такое. Эти объекты принадлежат ноде, а не V8, так что процесса в браузере не будет.

## console

В ноде есть класс `Console`, функционал которого похож на такой же в браузере. Конструктор позволяет определить 2 потока для записи данных: output для `.log()` и error, для варнингов и ошибок. Если стрим для ошибок и варнингов не определен - все будет уходить в output.

В общем виде глобальный объект `console` это экземпляр класса `new Console(process.stdout, process. stderr)`.

Набор методов: 

* для вывода сообщений - `.log()`, `.info()`, `.warn()`, `.error()`, `.trace()`.
* для замера времени - `.time(label)`, `.timeEnd(label)`. Лейбл уникальный для каждого замера, вызов окончания выведет результат в ms в консоль.
* для assertion test - `.assert(value[, message][, ...])`. В отличии от браузеров кинет `AssertionError` и закончит выполнение.

## process

Предоставляет информацию и контролирует текущий процесс Node.js. Как глобальный объект, он всегда доступен приложениям Node.js без необходимости вызова require().
Сам по себе процесс - экземпляр EventEmitter, так что он может бросать несколько ивентов. Все сигнальные ивенты, такие как `SIGINT`, `SIGTERM` и прочие. Удобно работать с ними когда необходимо обеспечить gracefull shutdown. Еще есть `disconnect`, `beforeExit` и `exit`. Первый управление дочерними процессами, второй генерируется когда в евентлупе больше нет задач, а третий можно вызвать через `process.exit()` либо он сгенерируется когда лупа пустая. 

Процесс хранит в себе `argc` и `argv`, где как и в других языках первый - количество переданных аргументов, второй - массив строк. На нулевом индексе - путь до ноды, на первом - путь до выполняемого файла, остальные - переданные аргументы.

Процесс имеет доступ к переменным среды. `process.env`. Их можно назначить из кода, но эффект будет только внутри процесса. Любое присваивание неявно конвертирует значение в строку.

```
process.env.test = null;
console.log(process.env.test); // 'null'
process.env.test = undefined;
console.log(process.env.test); // 'undefined'
```

И еще много проперти которые есть, но нужны в каких-то специальных кейсах.

## dash variables
Удобно, когда организовываешь работу с локальными файлами.
`__dirname` - имя каталога, в котором в данный момент находится выполняющийся скрипт.
```
node ~/project/test/example.js

example.js:

console.log(__dirname); // ~/project/test/
```
`__filename` - разрешенный путь до файла.
```
node ~/project/test/example.js

example.js:

console.log(__filename); // ~/project/test/example.js
```
## global
В отличии от бразуеров, в ноде объявление глобальных переменных, например через var, будет замкнуто на область конкретного модуля. Для того, чтобы создать и использовать глобальную, для всего процесса, переменную, мы делаем `global.varName = any` и можем обращаться к ней либо как к полю объекта global, либо только по ее имени.

## Buffer
Буфер - большая тема для обсуждения, но если коротко обозревать что он из себя представляет.

## etc
Еще, глобальными объектами будет считать ключи экспорта-импорта, такие как `module`, `require`, `exports`. О них в другой раз. И таймеры, `setTimeout`, `setInterval`, которые не отличаются от таймаутов в браузере.



# Задание

Написать скрипт, который будет иметь функцию которая парсит входные аргументы и формурует из них объект, 
в котором ключ объекта - имя входного аргумента, а значение по ключу - значение входного аргумента

Пример
```
node index.js property1 value1 property2 value2
```

Должен составить объект
```json
{
  "property1": "value1",
  "property2": "value2"
}
```

Сложность 0:
Не учитывать типы данных - просто взять и составить объект из входных данных

Сложность 1:

До запуска скрипта в нем же можно указать, какие ожидаются имена аргументов и значения по умолчанию, если аргумент не задан

Пример:

```javascript
const argTypes = {
    property1: 1,
    property2: "hello",
    property3: false,
}
```


Сложность 2:

До запуска скрипта в нем же можно указать, какой ожидается тип данных у какого аргумента, прямо в самом index.js
И функция будет Кастить входные аргументы в соответствии с этим объектом

Пример:
```javascript
const argTypes = {
    property1: {
      type: "number",
      default: 1,
    },
    property2: {
      type: "string",
      default: "hello",
    },
    property3: {
      type: "boolean",
      default: false,
    },
    property4: {
      type: "object",
      default: { hello: "world" }
    }
}
```


## Tips

скрипт, чтобы вывести первый не-дефолтный входной аргумент в ноде (`process.argv` - массив):

```javascript
// index.js
console.log(process.argv[2]);
```

Запуск:

```
node index.js hello
```


форматирование из примитива в примитив другого типа:
```javascript
const num = Number("420"); // String() Number() Boolean()
```


форматирование из строки в JSON и обратно:
```javascript
var str = '{"hello": "world"}';
console.log(JSON.parse(str).hello);
console.log(JSON.stringify(JSON.parse(str)));
```

доступ к свойствам объекта с помощью переменных
```javascript

const propertyName = "hello";

var a = {
  [propertyName]: "world"
}

console.log(a[propertyName]);

var b = {};
b[propertyName] = "world";
```

цикл по массиву:

```javascript
var array = [1, 2, 3];

for (var i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```