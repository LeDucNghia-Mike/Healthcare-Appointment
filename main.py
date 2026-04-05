from app.create_schema import create_database, create_schema, init_database
# from app.seed_master_data import seed_all
from app.seeds.seed_total import seed_all
from app.register_connector import wait_for_debezium, register_connector


def main():
    # explanation: Bước 1 tạo database nếu chưa có.
    # create_database()
    init_database()
    # explanation: Bước 2 tạo enum + 7 bảng + index từ file SQL.
    create_schema()

    # explanation: Bước 3 seed dữ liệu nền cho 7 bảng.
    seed_all()

    # explanation: Bước 4 chờ Debezium Connect sẵn sàng.
    # wait_for_debezium()

    # explanation: Bước 5 đăng ký connector CDC.
    # register_connector()

    print("Setup completed successfully.")


if __name__ == "__main__":
    main()