# Домашнее задание Node.js

## Описание

1. **Запуск**
    npm i
    npm start
2. **Адрес**
    localhost: 8000
3. **Additional feature**
    Сервер принимает get и post запросы
    Фильтр предусмотрен для любого верхнеуровнего ключа массива объектов events
    Для валидации предусмотрен отдельный файл констант /Task4/constant.js, в котором для каждого ключа находятся default-values, при отсутствии введенного              значения в константах валидация не проходит. Если же для введенного ключа нет соответвий в константах, фильтрация не проходит и выводится весь список          событий. В данный момент добавлены соответствия для ключей type и size
    Предусмотрена паггинация для GET и POST запросов, за нее отвечают следующие параметры: pageNumb (номер страницы, начинается с 0), maxEntities (лимит                запрашиваемых сущностей для страницы). Предусмотрена валидация значений
4. **Test**
    {
        *GET*: [
        "localhost:8000/status",
        "localhost:8000/api/events",
        "localhost:8000/api/events?type=info",
        "localhost:8000/api/events?type=info:fdf", //*test filterParamValid*
        "localhost:8000/api/events?size=m:l"
        "localhost:8000/api/events?size=m:l&pageNumb=1&maxEntities=2"
        "http://localhost:8000/api/events?&pageNumb=1&maxEntities=cdscd", //*test pagin valid*
        ],
        *POST*: [
            "localhost:8000/status",
            "localhost:8000/api/events",
            "localhost:8000/api/events" {
                "type": "info"
            },
            //*test filterParamValid()
            "localhost:8000/api/events" {
                "type": "info:fdf"
            },
            "localhost:8000/api/events" {
                "size": "m:l",
                "pageNumb": 1,
                "maxEntities" 2
            },
            //*test pagin valid*
            "http://localhost:8000/api/events" {
                "pageNumb": 1,
                "maxEntities": "cdscd"
            }
        ]
    }
    

