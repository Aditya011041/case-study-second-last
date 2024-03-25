import datetime

def calculate_leave_days(start_date, end_date):
    total_days = (end_date - start_date).days + 1
    # Exclude Saturdays and Sundays
    leave_days = sum(1 for day in range(total_days) if (start_date + datetime.timedelta(days=day)).weekday() < 5)
    return leave_days

# Test cases
# Assuming start date is Monday (March 25, 2024) and end date is Friday (March 29, 2024)
start_date = datetime.date(2024, 3, 25)
end_date = datetime.date(2024, 3, 29)
leave_days = calculate_leave_days(start_date, end_date)
print("Leave Days (excluding Saturdays and Sundays):", leave_days)

# Assuming start date is Saturday (March 30, 2024) and end date is Wednesday (April 3, 2024)
start_date = datetime.date(2024, 3, 30)
end_date = datetime.date(2024, 4, 3)
leave_days = calculate_leave_days(start_date, end_date)
print("Leave Days (excluding Saturdays and Sundays):", leave_days)

# Assuming start date is Sunday (March 31, 2024) and end date is Thursday (April 4, 2024)
start_date = datetime.date(2024, 3, 31)
end_date = datetime.date(2024, 4, 4)
leave_days = calculate_leave_days(start_date, end_date)
print("Leave Days (excluding Saturdays and Sundays):", leave_days)
