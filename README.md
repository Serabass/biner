# Biner

**Biner** - это моя первая попытка разработать язык.
Назвать это языком программирования пока язык не поворачивается (уж простите за тавтологию), однако фишки вроде описания структур и импортов уже реализованы.

## Для чего он нужен

**Biner** - это, в первую очередь, язык описания структур двоичных данных. На текущий момент имеет встроенные основные типы:

- int8
- int16
- int32
- float32
- float64
- некоторые строковые структуры (опишу их позже)

## Демо
Все примеры буду складывать в папке [examples](./examples)

## Где он может пригодиться

Я задумывал **Biner** как инструмент для описания и разбора двоичных блоков памяти, коими могут быть области в оперативной памяти или файлах.

Предположим, у нас есть три байта с данными о красном цвете RGB: `FF 00 00`. Мы можем описать для него простую структуру:

```go
struct rgb {
  r: int8;
  g: int8;
  b: int8;
}

```

Таким образом, каждый из полученных байт считается один за другим и пропишется в нужные поля на выходе. А на выходе мы получим JSON-объект:

```json
{
  "r": 255,
  "g": 0,
  "b": 0
}
```

## Что есть
### Вложенность структур
*описать*

### Модульность
*описать*

### Константы
*описать*

### Директивы
*описать*

### Простейшая логика при чтении данных

Возьмём вот такой пример из тестов:
```go
struct {
  color: rgb {
    when r == 0xFF {
      red = true;
    }
    when g == 0xFF {
      green = true;
    }
    when b == 0xFF {
      blue = true;
    }
  }
}
```

Ключевое слово `when` определяет, что делать если проходит условие. В данном случае мы считали структуру `rgb`, а затем обрабатываем полученные значения через блоки `when`.

Таким образом, прочитав набор байт вида `00 FF 00`, мы должны получить вот такую структуру:

```json
  {
    "r": 0,
    "g": 255,
    "b": 0,
    "green": true
  }
```
Последнее поле прописывается потому что прошло второе условие `when`. 

## Что планируется
### Generics
*описать*

### Наследование структур
*описать*

### Интерфейсы (но это не точно)

