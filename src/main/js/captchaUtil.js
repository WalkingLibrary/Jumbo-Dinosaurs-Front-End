let captchaCode;
grecaptcha.ready(
    function getCaptchaCode()
    {
        grecaptcha.execute('6LfOEJYUAAAAABCgQ7XysiWy9SpLd_4FyuX2SErc',
            {
                action: 'captcha'
            })
            .then(function (token)
            {
                captchaCode = token;
                return captchaCode;
            });
    });

