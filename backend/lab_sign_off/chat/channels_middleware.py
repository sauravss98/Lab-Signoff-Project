from channels.middleware.base import BaseMiddleware
from django.contrib.auth import get_user_model

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query parameters
        token = scope['query_string'].decode().split('=')[-1]
        
        # Authenticate token
        User = get_user_model()
        try:
            user = User.objects.get(auth_token=token)  # Adjust according to your model
            scope['user'] = user
        except User.DoesNotExist:
            scope['user'] = AnonymousUser()
        
        await super().__call__(scope, receive, send)