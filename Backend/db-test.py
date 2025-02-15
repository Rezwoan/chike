from flask import Flask
from extensions import db
from sqlalchemy import inspect, text  # Import text
from models import User, Referral  # Import your models
from app import app  # Replace with your actual app import

def check_database():
    inspector = inspect(db.engine)

    print("\n📌 **Checking Tables in Database:**\n")
    tables = inspector.get_table_names()
    if not tables:
        print("❌ No tables found in the database.")
        return
    
    for table in tables:
        print(f"✅ Table: {table}")
        columns = inspector.get_columns(table)
        print("   Columns:")
        for col in columns:
            print(f"     - {col['name']} ({col['type']})")

        print("\n   🔍 Fetching First 5 Rows:\n")
        try:
            result = db.session.execute(text(f"SELECT * FROM {table} LIMIT 5")).fetchall()
            if result:
                for row in result:
                    print("   ", row)
            else:
                print("   ⚠️ No data found in this table.")
        except Exception as e:
            print(f"   ❌ Error fetching data: {e}")

        print("\n" + "-"*50)

if __name__ == "__main__":
    with app.app_context():  # ✅ Ensure app context
        check_database()
