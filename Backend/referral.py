from models import db, User

import random
import string

def generate_referral_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def increment_referrals_count(referrer_id):
    referrer = User.query.filter_by(id=referrer_id).first()
    if referrer:
        referrer.referrals_count += 1
        db.session.commit()
    