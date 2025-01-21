import random
import string

def generate_token(length=16):
    characters = string.ascii_letters + string.digits
    token = ''.join(random.choices(characters, k=length))
    return token

# Example usage
if __name__ == "__main__":
    print("Generated Token:", generate_token())
