FROM python:3.11-slim

RUN apt-get update && apt-get install -y postgresql-client build-essential libpq-dev netcat-openbsd && apt-get clean

WORKDIR /app

COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY ./init.sh /app/init.sh
RUN chmod +x /app/init.sh

CMD ["./init.sh"]