import os
import sys
import django
import pandas as pd
from user.models import User
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lab_sign_off.settings')
django.setup()
file_path = os.path.join(os.path.dirname(__file__), 'UserData.xlsx')
df = pd.read_excel(file_path)
for index, row in df.iterrows():
    try:
        if User.objects.filter(email=row['email']).exists():
            print(f"User {row['email']} already exists. Skipping...")
            continue
        user = User.objects.create(
            email=row['email'],
            first_name=row['first_name'],
            last_name=row['last_name'],
            user_type=row['user_type'].lower(),
            email_verified=row['email_verified'],
            username = row['email']+row['first_name'],
            is_active=row['is_active']
        )
        default_password = row['email'] + row['first_name']
        user.set_password(default_password)
        user.save()
        print(f"User {user.email} created successfully.")

    except Exception as e:
        print(f"Failed to create user {row['email']}: {str(e)}")