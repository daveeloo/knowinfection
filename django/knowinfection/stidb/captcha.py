import hashlib
import random
import time
import urllib

def validate_captcha(captchaKey, captchaValue):
    url = 'http://www.opencaptcha.com/validate.php?img=%s.jpgx&ans=%s' % (captchaKey, captchaValue)
    return urllib.urlopen(url).read() == 'pass'

def generate_captcha_url(captchaKey):
    return "http://www.opencaptcha.com/img/%s.jpgx" % captchaKey

def generate_captcha_key():
    return urllib.quote(hashlib.sha1("%dknowinfection%f" % (time.time(), random.random())).hexdigest())

