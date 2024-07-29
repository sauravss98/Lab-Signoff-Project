import redis

def check_redis():
    try:
        r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        response = r.ping()
        if response:
            print("Redis is running.")
        else:
            print("Redis is not running.")
    except redis.ConnectionError:
        print("Could not connect to Redis.")

if __name__ == "__main__":
    check_redis()