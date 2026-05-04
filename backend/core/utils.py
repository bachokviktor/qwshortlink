import secrets


def get_random_string():
    """
    Generates a short random string.
    """
    char_pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    rstring = "".join(secrets.choice(char_pool) for _ in range(6))

    return rstring
