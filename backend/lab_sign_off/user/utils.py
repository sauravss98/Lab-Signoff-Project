import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def generate_random_numbers():
    """
    A function to generate random 6 digit number
    """
    # Generate 6 random numbers between 0 and 9
    return random.randint(000000, 999999)

def generate_otp():
    """
    A function to generate random 6 digit number
    """    
    random_numbers = generate_random_numbers()
    return random_numbers

def send_new_user_created_mail(email):
    """
    Function to send the otp mail
    """
    subject = "New user Created"
    from_email = 'sauravsuresh171@gmail.com'
    to_email =[email]
    html_message = render_to_string('lab_sign_off/new_user_email.html', {})
    plain_message = strip_tags(html_message)

    send_mail(
            subject,
            plain_message,
            from_email,
            to_email,
            fail_silently=False,  # Set it to True to suppress exceptions
            auth_user=None,
            auth_password=None,
            connection=None,
            html_message=html_message,
        )