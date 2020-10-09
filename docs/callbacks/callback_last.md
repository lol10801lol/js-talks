# Callback-last, error-first

Одна из самых популярных "договоренностей" о том, как создавать асинхронные функции.
Концепция заключается в том, что callback всегда передается последним аргументом в асинхронную
функцию, а при этом возможная ошибка - первым аргументом коллбека. Так написаны почти
все API Node.js. [Больше об этом - в доке Node.js](https://nodejs.org/api/errors.html#errors_error_first_callbacks)

Если ошибки нет, то первым аргументом принято использовать `null` 

Пример: функции модуля fs для работы с файлами

[filename](callback_last.js ':include :type=code :fragment=fs-simple')

Таким образом, мы не забываем об ошибке, и так нам легче проверять, случилась ли она

[filename](callback_last.js ':include :type=code :fragment=fs-error-handling')

Важно понимать, что callback-функции будут вызваны **только когда коллстек пустой** (см. лекцию [how Node.js works](../eventloop/eventloop.md))

С этим нужно быть аккуратным, потому что, например, предыдущий пример не заработает так, как вроде бы
ожидается

[filename](callback_last.js ':include :type=code :fragment=async-try-catch-bad')

`try-catch` блок **ловит ошибки только в пределах своего коллстека**. (мы сейчас **не** говорим об async/await, там этот механизм работает по-другому)

Это значит, что если у вас есть асинхронные функции, то и работать вы с ними должны
асинхронно - передавать коллбеки, а не ловить все в try/catch.

[filename](callback_last.js ':include :type=code :fragment=async-error-handling-almost-good')

Выглядит красиво. Что мы потеряли? Ключевое слово `return`! **Никогда** не забывайте
выходить из callback-функций, чтобы выполнение функции завершилось. JS запускает функции
run-to-completion! 

Правильным будет использование `return`.

[filename](callback_last.js ':include :type=code :fragment=async-error-handling-good')

Отсюда следует **очень** важный вывод - никто не застрахован от того,
как, когда и сколько раз будет вызван его коллбек!

Мы можем лишь **доверять** функции, в которую мы передаём коллбек, но
не можем быть уверены, что она всегда сработает правильно.

Конечно, уровень доверия выше к каким то библиотекам (Node.js API, например),
а к каким-то - ниже (какие-то рандомные библиотеки из npm).

Часто это называют *инверсией управления* - Inversion of control, IoC, когда
какой-то другой код (не программист) управляет выполнением кода, написанного 
программистом.

Можно придумывать кучи вариантов о том, что коллбеки будут вызваны неправильно,
но смысл, думаю, понятен: как только мы передаем callback в асинхронную функцию,
она может быть вызвана 0, 1 или более раз, и на это мы повлиять не сможем.

Для того, чтобы быть 100% уверенным, можно извращаться.

Например, добавить счетчик "вызовов".

Возьмем "плохую" функцию и попробуем сделать так, чтобы коллбек вызывался только один раз

[filename](callback_last.js ':include :type=code :fragment=counter')

Но такое придется добавлять к каждому коллбеку, что, конечно,
сииильно усложнит нам работу.

А что, если нужно будет вызвать 2 раза?

Изменим код, и заставим функцию читать любой файл:

[filename](callback_last.js ':include :type=code :fragment=counter-twice')

Ужас...