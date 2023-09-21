# Easy Notes

Test-Anwendung für den Kurs M210 - Anwendungen in Public Cloud.

## Tests with Curl

### Add Note

curl -X POST http://127.0.0.1:3000/add -d "title=test2&description=test2description" -s -o /dev/null -w '%{http_code}\n'

### Get first UUID

uuid=$(curl -s http://127.0.0.1:3000/ | grep -oP '(?<=<button type="button" value=")[^"]+' | head -n 1)

### Delete UUID

curl -X DELETE http://127.0.0.1:3000/delete -d "uuid=$uuid" -s
