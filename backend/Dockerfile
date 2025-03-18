FROM python:3.11-slim

# Cài đặt thư viện hệ thống
RUN apt-get update && apt-get install -y postgresql-client build-essential libpq-dev netcat-openbsd && apt-get clean

# Thư mục làm việc
WORKDIR /app

# Copy source code
COPY . .

# Cài requirements
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy script init khởi động
COPY ./init.sh /app/init.sh
RUN chmod +x /app/init.sh


# Command mặc định: chạy init.sh
CMD ["./init.sh"]